"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ErrorHandler = __importStar(require("../../utils/error_handler"));
const http_errors_1 = require("../../utils/http_errors");
function default_1(req, res, next) {
    const authHeader = req.get('Authorization');
    let token = '';
    if ((authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[0]) != 'Basic') {
        console.warn('unauthorize');
        ErrorHandler.unauthorizedError();
    }
    else {
        token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    }
    authenticate(token, req, res, next);
}
exports.default = default_1;
function authenticate(base64Credentials, req, res, next) {
    const internalUsername = '4F-X68Sb4#aPpwnHhNi?5e_wC&$MP?';
    const internalPassword = 'zM[Rx[uaP9R@bgR4@Zip!6-&8i0v3N';
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    if (username == internalUsername && password == internalPassword) {
        next();
    }
    else {
        ErrorHandler.clientError(new http_errors_1.HTTP401Error('unauthorized'), res, next);
    }
}
//# sourceMappingURL=basicAuth.js.map