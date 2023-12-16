"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initData = void 0;
const initDataUser_1 = require("../initData/initDataUser");
const initDataPost_1 = require("../initData/initDataPost");
const initData = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, initDataUser_1.createUser)();
    yield (0, initDataPost_1.createPost)();
});
exports.initData = initData;
//# sourceMappingURL=testScript.js.map