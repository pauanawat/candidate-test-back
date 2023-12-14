"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRoutes = exports.applyMiddleware = void 0;
const applyMiddleware = (middlewareWrappers, router) => {
    for (const wrapper of middlewareWrappers) {
        wrapper(router);
    }
};
exports.applyMiddleware = applyMiddleware;
const applyRoutes = (routes, app) => {
    for (const route of routes) {
        app.use(route);
    }
};
exports.applyRoutes = applyRoutes;
//# sourceMappingURL=index.js.map