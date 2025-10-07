import winston from "winston";
const { combine, printf, colorize, align } = winston.format;
export const logger = winston.createLogger({
    level: "silly",
    format: combine(
        colorize({ all: true }),
        align(),
        printf((info) => `[${info.level}: ${info.message}]`)
    ),
    transports: [new winston.transports.Console()],
});
