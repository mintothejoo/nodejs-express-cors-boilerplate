import error from './helpers/error'

const errorHandler = (err, req, res) => {

    const STATUS = err.status || 400;
    res.status(STATUS);
    res.json(error(err));
};

export default errorHandler;