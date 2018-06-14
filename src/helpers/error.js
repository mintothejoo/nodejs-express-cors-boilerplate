import code from '../config/http-codes'


const error  = (error) => {

    let data = error.data ? error.data : {};

    console.log(error);

    if(error.code) {
        return code(error.code, data);
    }

    return code(error.status, data);
};

export default error;