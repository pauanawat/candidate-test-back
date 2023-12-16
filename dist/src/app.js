"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testScript_1 = require("../initData/testScript");
const app_1 = __importDefault(require("./config/app"));
const port = 3002;
app_1.default.get('/', (req, res) => {
    res.send('Hello World!');
});
(0, testScript_1.initData)();
app_1.default.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map