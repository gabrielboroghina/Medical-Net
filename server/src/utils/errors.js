class ServerError extends Error {
    constructor(message, httpStatus) {
        super(message);
        this.name = this.constructor.name;
        this.httpStatus = httpStatus;
        Error.captureStackTrace(this, this.constructor);
    }
}

String.prototype.capitalize = function () {
    return this[0].toUpperCase() + this.slice(1);
};

class JsonError extends Error {
    constructor(errorCode, content, httpStatus) {
        super();
        this.name = this.constructor.name;
        this.content = {
            "errorCode": errorCode,
            "description": Errors[errorCode],
            ...content
        };
        this.content.description = this.content.description.capitalize();
        this.httpStatus = httpStatus;
    }
}

const Errors = {
    0: "Invalid input field",
    1: "Not authorized",
};

module.exports = {
    ServerError,
    JsonError,
    Errors
};
