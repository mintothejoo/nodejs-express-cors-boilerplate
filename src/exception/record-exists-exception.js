import util from 'util'

import {
    HTTP_BAD_REQUEST_ERROR_CODE,
    RESOURCE_ALREADY_EXISTS_ERROR
} from './../config/constants'


function RecordExistsException(data, error) {

    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.code = RESOURCE_ALREADY_EXISTS_ERROR;
    this.message = 'Record already exists';

    if(data && data.reason) {
        this.message = data.reason;
    }

    this.safe = true;
    this.status = HTTP_BAD_REQUEST_ERROR_CODE;
    this.data = data;
    this.previous = error;
}

util.inherits(RecordExistsException, Error);


export default RecordExistsException;