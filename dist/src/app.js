"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testScript_1 = require("../initData/testScript");
const app_1 = __importDefault(require("./config/app"));
const const_1 = require("./const");
app_1.default.get('/', (req, res) => {
    res.send('Hello World!');
});
(0, testScript_1.initData)();
app_1.default.listen(const_1.PROCESS_ENV.PORT, () => {
    return console.log(`Express is listening at port:${const_1.PROCESS_ENV.PORT}`);
});
//# sourceMappingURL=app.js.map