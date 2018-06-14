import util from 'util'

import {HTTP_NOT_FOUND_ERROR_CODE} from './../config/constants'


function NotFoundException(code, message, data, error) {

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.code = code;
    this.message = message;
    this.safe = true;
    this.status = HTTP_NOT_FOUND_ERROR_CODE;
    this.data = data;
    this.previous = error;
}

util.inherits(NotFoundException, Error);


export default NotFoundException;