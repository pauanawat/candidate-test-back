"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.PROCESS_ENV = exports.TOKEN_STATUS = void 0;
exports.TOKEN_STATUS = {
    EXPIRED: 'expired',
    USED: 'used',
};
exports.PROCESS_ENV = {
    JWT_SECRET: (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "secret_",
    NODE_ENV: (_b = process.env.NODE_ENV) !== null && _b !== void 0 ? _b : "dev",
    PORT: (_c = process.env.PORT) !== null && _c !== void 0 ? _c : "3001"
};
exports.NODE_ENV = {
    DEV: "dev",
    PROD: "prod"
};
//# sourceMappingURL=index.js.map