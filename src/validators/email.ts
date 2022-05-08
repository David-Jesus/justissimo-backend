import { DomainError } from "../errors";

class InvalidEmailError extends DomainError {
    constructor () {
        super("Enter valid email.")
    }
}

export class Email {
    private readonly _value: string

    constructor (email: string) {
        this._value = email
        Object.freeze(this)
    }

    public static create(email: string): Email {
        const emailReg =  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

        if (!emailReg.test(email)) {
            throw new InvalidEmailError();
        }

        return new Email(email);
    }

    public get value () {
        return this._value
    }
}