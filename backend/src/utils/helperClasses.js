export class APIError extends Error {
    constructor(message="Something went wrong :(", statusCode, errors=[],stack="")
    {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.data = null;
        this.message = message;
        this.success = false;
        if(stack)
        {
            this.stack = stack;
        }
        else
        {
            Error.captureStackTrace(this,this.constructor);
        }

    }
}

export class APIResponse {  
    constructor(statusCode,data='',message="Success")
    {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode>=200 && statusCode<400 ? true : false;
    }
}