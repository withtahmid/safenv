import { EnvConfig } from "../model/EnvConfig.js";

export default {
    string: () => new EnvConfig("string"),
    number: () => new EnvConfig("number"),
    boolean: () => new EnvConfig("boolean"),
};
