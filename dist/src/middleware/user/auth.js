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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const const_1 = require("../../const");
const user_1 = require("../../services/user/providers/user");
const ErrorHandler = __importStar(require("../../utils/error_handler"));
const http_errors_1 = require("../../utils/http_errors");
const token_1 = require("../../services/user/providers/token");
function default_1(req, res, next) {
    const authHeader = req.get('Authorization');
    let token = '';
    if (!authHeader) {
        console.warn('unauthorize');
        ErrorHandler.unauthorizedError();
    }
    else {
        token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    }
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, const_1.PROCESS_ENV.JWT_SECRET);
        CheckUserStatus(decodedToken, token, req, res, next);
    }
    catch (err) {
        console.error(err.message || 'no message');
        ErrorHandler.clientError(new http_errors_1.HTTP401Error('unauthorized'), res, next);
    }
}
exports.default = default_1;
function CheckUserStatus(decodedToken, token, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userToken = yield (0, token_1.getToken)(parseInt(decodedToken.token));
            if (!userToken || userToken.status === const_1.TOKEN_STATUS.EXPIRED)
                throw new http_errors_1.HTTP401Error();
            (0, user_1.getUser)({ where: { id: parseInt(decodedToken.id) } })
                .then((user) => {
                if (!user) {
                    throw new http_errors_1.HTTP401Error();
                }
                else {
                    ;
                    req.user = user;
                    req.token = token;
                }
                next();
            })
                .catch((err) => {
                ErrorHandler.clientError(err, res, next);
            });
        }
        catch (err) {
            ErrorHandler.clientError(err, res, next);
        }
    });
}
const loggingToken = () => {
};
exports.loggingToken = loggingToken;
//# sourceMappingURL=auth.js.map