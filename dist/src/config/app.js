"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require('body-parser');
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swager_json_1 = __importDefault(require("./swager.json"));
const services_1 = __importDefault(require("../services"));
const utils_1 = require("../utils");
const error_handlers_1 = __importDefault(require("../middleware/error_handlers"));
const const_1 = require("../const");
const app = (0, express_1.default)();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
// Swagger UI
console.log("env:", const_1.PROCESS_ENV.NODE_ENV);
if (const_1.PROCESS_ENV.NODE_ENV == const_1.NODE_ENV.DEV)
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swager_json_1.default));
(0, utils_1.applyRoutes)(services_1.default, app);
(0, utils_1.applyMiddleware)(error_handlers_1.default, app);
exports.default = app;
//# sourceMappingURL=app.js.map