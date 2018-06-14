import util from 'util'

import {HTTP_BAD_REQUEST_ERROR_CODE} from './../config/constants'


function BadRequestException(code, message, data, error) {

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.code = code;
    this.message = message;
    this.safe = true;
    this.status = HTTP_BAD_REQUEST_ERROR_CODE;
    this.data = data;
    this.previous = error;
}

util.inherits(BadRequestException, Error);


export default BadRequestException;