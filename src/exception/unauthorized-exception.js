import util from 'util'

import {HTTP_UNAUTHORIZED_REQUEST_ERROR_CODE} from './../config/constants'


function UnauthorizedException(code, message, data, error) {

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.code = code;
    this.message = 'Unauthorized Request';
    this.safe = true;
    this.status = HTTP_UNAUTHORIZED_REQUEST_ERROR_CODE;
    this.data = data;
    this.previous = error;
}

util.inherits(UnauthorizedException, Error);


export default UnauthorizedException;