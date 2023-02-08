const { DEBUG_MODE } = require('../config');
const { ValidationError } = require('joi');
const CustomeErrorHandler = require('../service/CustomeErrorHandler');

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let data = {
        msg: 'Internal server error',
        ...(DEBUG_MODE === 'true' && {originalError: err.message})
    }

    if(err instanceof ValidationError) {
        statusCode = 422;
        data = {
            msg: err.message
        }
    }

    if(err instanceof CustomeErrorHandler) {
        statusCode = err.status;
        data = {
            msg: err.message
        }
    }

    res.status(statusCode).json(data);
    
}

module.exports = errorHandler;