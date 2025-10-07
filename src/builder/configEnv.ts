import { log } from "console";
import type { EnvConfig } from "../model/EnvConfig.js";
import { logger } from "../utils/logger.js";

export default function configEnv<T extends Record<string, EnvConfig<any>>>(
    processEnv: NodeJS.ProcessEnv,
    schema: T
): {
    [K in keyof T]: T[K] extends EnvConfig<"number">
        ? number
        : T[K] extends EnvConfig<"boolean">
        ? boolean
        : string;
} {
    const parsedResult: {
        key: string;
        status: "success" | "warn" | "error";
        value: any;
        message?: string;
    }[] = [];

    for (const key in schema) {
        const {
            type,
            required,
            default: defaultValue,
        } = schema[key]!._getConfig();
        const rawValue = processEnv[key];

        const hasValue =
            rawValue !== undefined && rawValue !== null && rawValue !== "";
        const hasDefault = defaultValue !== undefined;

        if (!hasValue && !hasDefault) {
            if (required) {
                parsedResult.push({
                    key,
                    status: "error",
                    value: undefined,
                    message: `Missing required env variable: ${key}`,
                });
            } else {
                parsedResult.push({
                    key,
                    status: "warn",
                    value: undefined,
                    message: `Optional env variable ${key} is not set and has no default value`,
                });
            }
            continue;
        }
        if (!hasValue && hasDefault) {
            parsedResult.push({
                key,
                status: "warn",
                value: defaultValue,
                message: `Env variable ${key} is not set, using default value: ${defaultValue}`,
            });
            continue;
        }

        switch (type) {
            case "string":
                const stringValue = String(rawValue);
                parsedResult.push({
                    key,
                    status: "success",
                    value: stringValue,
                    message: `Loaded env variable ${key}: ${stringValue}`,
                });
                break;

            case "number":
                const num = Number(rawValue);
                if (isNaN(num)) {
                    parsedResult.push({
                        key,
                        status: "error",
                        value: rawValue,
                        message: `Invalid number for env variable ${key}: ${rawValue}`,
                    });
                } else {
                    parsedResult.push({
                        key,
                        status: "success",
                        value: num,
                        message: `Loaded env variable ${key}: ${num}`,
                    });
                }
                break;

            case "boolean":
                if (rawValue === "true" || rawValue === "1") {
                    parsedResult.push({
                        key,
                        status: "success",
                        value: true,
                        message: `Loaded env variable ${key}: true`,
                    });
                } else if (rawValue === "false" || rawValue === "0") {
                    parsedResult.push({
                        key,
                        status: "success",
                        value: false,
                        message: `Loaded env variable ${key}: false`,
                    });
                } else {
                    parsedResult.push({
                        key,
                        status: "error",
                        value: rawValue,
                        message: `Invalid boolean for env variable ${key}: ${rawValue}`,
                    });
                }
                break;

            default:
                parsedResult.push({
                    key,
                    status: "error",
                    value: rawValue,
                    message: `Unknown type for env variable: ${key}`,
                });
        }
    }

    const errors = parsedResult.filter((r) => r.status === "error");
    const warnings = parsedResult.filter((r) => r.status === "warn");

    if (warnings.length > 0) {
        warnings.forEach((w) => {
            logger.warn(w.message);
        });
    }

    if (errors.length > 0) {
        errors.forEach((e) => {
            logger.error(e.message);
        });
        throw new Error("Environment variable validation failed");
    }

    const result: any = {};
    parsedResult.forEach((r) => {
        result[r.key] = r.value;
    });
    logger.info("Environment variables loaded successfully");
    return result;
}
