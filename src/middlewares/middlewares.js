const ErrorResponse = require("../classes/error-response");
const Token = require("../dataBase/models/Token.model");

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const syncHandler = (fn) => (req, res, next) => {
    try {
        fn(req, res, next);
    } catch (error) {
        next(error);
    }
};

const notFound = (req, _res, next) => {
    next(new ErrorResponse(`Not found - ${req.originalUrl}`, 404));
};

const errorHandler = (err, _req, res, _next) => {
    console.log('Ошибка', {
        message: err.message,
        stack: err.stack,
    });
    res.status(err.code || 500).json({
        message: err.message
    });
};

const requireToken = async (req, res, next) => {
    const token = req.header('x-access-token')
    if(!token) {
        throw new ErrorResponse("Token not sent", 400) 
    }

    const tokenFromDB = await Token.findOne({where: {value: token}})

    if(!tokenFromDB) {
        throw new ErrorResponse("Wrong token", 401) 
    }

    req.userId = tokenFromDB.userId
    
    next()
}
module.exports = {
    asyncHandler,
    syncHandler,
    notFound,
    errorHandler,
    requireToken
};