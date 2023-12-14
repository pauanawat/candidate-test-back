"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAll = exports.serverError = exports.clientError = exports.checkReqType = exports.badRequestError = exports.forbiddenError = exports.unauthorizedError = exports.notFoundError = void 0;
const client_1 = require("@prisma/client");
const http_errors_1 = require("../utils/http_errors");
const notFoundError = () => {
    throw new http_errors_1.HTTP404Error('route not found.');
};
exports.notFoundError = notFoundError;
const unauthorizedError = () => {
    throw new http_errors_1.HTTP401Error('unauthorized.');
};
exports.unauthorizedError = unauthorizedError;
const forbiddenError = () => {
    throw new http_errors_1.HTTP403Error('forbidden');
};
exports.forbiddenError = forbiddenError;
const badRequestError = (message) => {
    throw new http_errors_1.HTTP404Error(message || 'bad request');
};
exports.badRequestError = badRequestError;
const checkReqType = (err, res, next) => {
    if ((err === null || err === void 0 ? void 0 : err.message) === 'Request was not a UserRequest') {
        console.warn(err);
        res.status(401).send('unauthorized');
    }
    else {
        next(err);
    }
};
exports.checkReqType = checkReqType;
const clientError = (err, res, next) => {
    if (err instanceof http_errors_1.HTTPClientError) {
        console.warn(err);
        res.status(err.statusCode).send(err.message);
    }
    else {
        next(err);
    }
};
exports.clientError = clientError;
const serverError = (err, res, next) => {
    console.error(err);
    if (process.env.NODE_ENV === 'production') {
        res.status(500).send('Internal Server Error');
    }
    else {
        res.status(500).send(err.stack);
    }
};
exports.serverError = serverError;
const handleAll = (err, res, next) => {
    // logger.error(err)
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        let message = (err === null || err === void 0 ? void 0 : err.message) || '';
        (0, exports.clientError)(new http_errors_1.HTTP400Error(message), res, next);
    }
    else if (err instanceof http_errors_1.HTTPClientError) {
        // console.warn(err)
        res.status(err.statusCode).send(err.message);
    }
    else {
        // console.log(err)
        res.status(500).json((err === null || err === void 0 ? void 0 : err.message) || err);
    }
};
exports.handleAll = handleAll;
//# sourceMappingURL=error_handler.js.map