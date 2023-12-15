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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController = __importStar(require("./controllers"));
const basicAuth_1 = __importDefault(require("../../middleware/external_service/basicAuth"));
const auth_1 = __importDefault(require("../../middleware/user/auth"));
const router = (0, express_1.Router)();
router.post('/login', basicAuth_1.default, UserController.login);
router.get('/users/all', basicAuth_1.default, UserController.getAllUser);
router.get('/users/:id', auth_1.default, UserController.getUserById);
// filter wite req.query ex. /users?email=A&name=B
router.get('/users', auth_1.default, UserController.getUsers);
router.post('/users', auth_1.default, UserController.createUser);
router.put('/users/:id', auth_1.default, UserController.updateUser);
router.patch('/users/:id', auth_1.default, UserController.patchUser);
router.delete('/users/:id', auth_1.default, UserController.deleteUser);
exports.default = router;
//# sourceMappingURL=routes.js.map