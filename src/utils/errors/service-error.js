const { StatusCodes } = require('http-status-codes');



class ServiceError extends Error {
    constructor(
        message = "Something went Wrong",
        explanation = 'Service layer error',
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
        ){
            super();
            this.name = 'ServiceError';
            this.message = message;
            this.explanation = explanation;
            this.statusCodes = statusCode;
    }
}

module.exports = ServiceError;