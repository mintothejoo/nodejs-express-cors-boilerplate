import {HTTP_RUNTIME_ERROR_CODE} from './../config/constants'


export default class RuntimeException extends Error {

    constructor(message, data, previous) {
        super((message || 'RunTime Error'), 'Runtime');

        this.safe= true;
        this.status = HTTP_RUNTIME_ERROR_CODE;
        this.data = data;
        this.previous = previous;
    }
}