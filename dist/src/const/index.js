"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROCESS_ENV = exports.TOKEN_STATUS = void 0;
exports.TOKEN_STATUS = {
    EXPIRED: 'expired',
    USED: 'used',
};
exports.PROCESS_ENV = {
    JWT_SECRET: (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : "secret_"
};
//# sourceMappingURL=index.js.map