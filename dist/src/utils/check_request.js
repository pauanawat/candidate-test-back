"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertUserRequest = void 0;
const http_errors_1 = require("./http_errors");
function assertUserRequest(req) {
    if ('user' in req) {
        return;
    }
    else {
        throw new http_errors_1.HTTP403Error('Request was not a UserRequest');
    }
}
exports.assertUserRequest = assertUserRequest;
//# sourceMappingURL=check_request.js.map