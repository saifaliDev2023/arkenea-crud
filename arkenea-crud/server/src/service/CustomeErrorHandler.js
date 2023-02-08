class CustomeErrorHandler extends Error {
    constructor(status, msg) {  
        super();
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CustomeErrorHandler(409, message);
    }

    static serverError(message = 'Internal server error') {
        return new CustomeErrorHandler(500, message);
    }

}

module.exports = CustomeErrorHandler;