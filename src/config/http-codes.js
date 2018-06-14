import {UNEXPECTED_ERROR} from './../config/constants'


const codes = {
    500: {
        message: 'Server error',
        description: 'Please try again'
    },
    400: {
        message: 'Bad request'
    },
    404: {
        message: 'Resource not found'   
    },
    401: {
        message: 'Unauthorized request'
    },
    101: {
        message: 'Resource not found'
    },
    119: {
        message: 'Permission denied!',
        description: 'User has insufficient permissions to perform this action.'
    },
    AUTH_USER_NOT_FOUND: {
        message: 'Invalid user or credentials!',
        description: 'Please verify your credentials and try again!'
    },
    AUTH_ERROR: {
        message: 'Unexpected Error',
        description: 'there was a problem trying to sign you in, please try again in a few minutes or contact us for support.'
    },
    RESOURCE_ALREADY_EXISTS_ERROR: {
        message: 'Resource Already Exists'
    },
    MAILCHIMP_OAUTH_CODE_ERROR: {
        message: 'User has no token so a oauth code must be provided.'
    },
    EMAIL_NOT_VERIFIED :{
        message: 'Your email is not verified!',
        description: 'Please click on the link sent to your email and try again!'
    }
};

const code = (code, data) => {

    if(!data) {
        data = {}
    }

    if(codes.hasOwnProperty(code)) {
        return Object.assign({code: code}, codes[code], data);
    }

    return {
        code: UNEXPECTED_ERROR,
        message: 'Unexpected error (code: ' + code + ')',
        content: 'An unexpected error occurred, please try again in a few minutes or contact or support for help.'
    }
};

export default code;