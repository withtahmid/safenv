export type EnvType = "string" | "number" | "boolean";

export class EnvConfig<T extends EnvType> {
    constructor(
        private type: T,
        private _required: boolean = true,
        private _default?: any
    ) {}
    optional(): EnvConfig<T> {
        return new EnvConfig(this.type, false, this._default);
    }
    default(
        value: T extends "number"
            ? number
            : T extends "boolean"
            ? boolean
            : string
    ): EnvConfig<T> {
        return new EnvConfig(this.type, this._required, value);
    }

    _getConfig() {
        return {
            type: this.type,
            required: this._required,
            default: this._default,
        };
    }
}
