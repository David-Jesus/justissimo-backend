import { DomainError } from "../errors";

class EmptyStringError extends DomainError {
    constructor (field: string) {
        super(`Informe uma string válida (campo: ${field}).`)
    }
}

export class NonEmptyString {
    private readonly _value: string

    constructor (value: string) {
        this._value = value

        Object.freeze(this)
    }

    public static create(identifier: string, value: string): NonEmptyString {
        if (value == "" || value == undefined || value == null) {
            throw new EmptyStringError(identifier);
        }

        return new NonEmptyString(value);
    }

    public get value () {
        return this._value
    }
}