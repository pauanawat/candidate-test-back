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
exports.deleteUser = exports.getUserById = exports.getUsers = exports.getAllUser = exports.patchUser = exports.updateUser = exports.createUser = exports.login = void 0;
const moment_1 = __importDefault(require("moment"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler = __importStar(require("../../utils/error_handler"));
const http_errors_1 = require("../../utils/http_errors");
const userProvider = __importStar(require("./providers/user"));
const tokenProvider = __importStar(require("./providers/token"));
const crypto = __importStar(require("../../utils/crypto"));
const const_1 = require("../../const");
const check_request_1 = require("../../utils/check_request");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestBody = req.body;
        const userOptions = {
            where: { username: requestBody.username },
        };
        let user = yield userProvider.getUser(userOptions);
        if (!user || !crypto.compare(requestBody.password, user.password))
            throw new http_errors_1.HTTP401Error();
        const tokenUpdateOptions = {
            data: { status: const_1.TOKEN_STATUS.EXPIRED },
            where: { userId: user.id },
        };
        yield tokenProvider.updateToken(tokenUpdateOptions);
        console.log("update old token");
        const tokenCreateOptions = {
            data: {
                userId: user.id,
                status: const_1.TOKEN_STATUS.USED,
                expireAt: (0, moment_1.default)().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
            },
        };
        const token = yield tokenProvider.createToken(tokenCreateOptions);
        console.log("create new token");
        let enc = {
            id: user.id.toString(),
            token: token.id.toString(),
        };
        return res.status(200).json({
            token: jsonwebtoken_1.default.sign(enc, const_1.PROCESS_ENV.JWT_SECRET, {
                expiresIn: '1d',
            }),
            userId: user.id
        });
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.login = login;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("createUser");
        (0, check_request_1.assertUserRequest)(req);
        const requestBody = req.body;
        requestBody.password = yield crypto.hash(requestBody.password);
        const options = {
            data: {
                email: requestBody.email,
                name: requestBody.name,
                phone: requestBody.phone,
                website: requestBody.website,
                username: requestBody.username,
                password: requestBody.password,
                address: {
                    create: {
                        street: requestBody.address.street,
                        suite: requestBody.address.suite,
                        city: requestBody.address.city,
                        zipcode: requestBody.address.zipcode,
                        // Add other address properties as needed
                        geo: {
                            create: {
                                lat: requestBody.address.geo.lat,
                                lng: requestBody.address.geo.lng,
                            },
                        },
                    },
                },
                company: {
                    create: {
                        name: requestBody.company.name,
                        catchPhrase: requestBody.company.catchPhrase,
                        bs: requestBody.company.bs,
                    },
                },
            },
        };
        let users = yield userProvider.createUser(options);
        delete users.password;
        yield tokenProvider.logginToken({ data: { token: req.token, action: "create user", target: "userId " + users.id } });
        return res.json({ users, message: "success" });
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.createUser = createUser;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("updateUser");
        (0, check_request_1.assertUserRequest)(req);
        let userId = parseInt(req.params.id);
        const requestBody = req.body;
        let userOptions = {
            data: {
                email: requestBody.email,
                name: requestBody.name,
                phone: requestBody.phone,
                website: requestBody.website,
            }, where: { id: userId }
        };
        const user = yield userProvider.updateUser(userOptions);
        let addressOptions = {
            data: {
                street: requestBody.address.street,
                suite: requestBody.address.suite,
                city: requestBody.address.city,
                zipcode: requestBody.address.zipcode,
            }, where: { userId: userId }
        };
        const address = yield userProvider.updateAddress(addressOptions);
        let geoOptions = {
            data: {
                lat: requestBody.address.geo.lat,
                lng: requestBody.address.geo.lng,
            }, where: { addressId: address.id }
        };
        const geo = yield userProvider.updateGeo(geoOptions);
        let companyOptions = {
            data: {
                name: requestBody.company.name,
                catchPhrase: requestBody.company.catchPhrase,
                bs: requestBody.company.bs,
            }, where: { userId: userId }
        };
        const company = yield userProvider.updateCompany(companyOptions);
        let result = user;
        result['address'] = address;
        result['address']['geo'] = geo;
        result['company'] = company;
        if ('password' in result)
            delete result.password;
        yield tokenProvider.logginToken({ data: { token: req.token, action: "put user", target: "userId " + user.id } });
        return res.status(202).json({ data: result, message: "success" });
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.updateUser = updateUser;
const patchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("patchUser");
        (0, check_request_1.assertUserRequest)(req);
        let userId = parseInt(req.params.id);
        const requestBody = req.body;
        let user;
        let address;
        let geo;
        let company;
        let userOptions = {
            data: {}, where: { id: userId }
        };
        if (requestBody.email)
            userOptions['data']['email'] = requestBody.email;
        if (requestBody.name)
            userOptions['data']['name'] = requestBody.name;
        if (requestBody.phone)
            userOptions['data']['phone'] = requestBody.phone;
        if (requestBody.website)
            userOptions['data']['website'] = requestBody.website;
        if (Object.keys(userOptions.data).length !== 0)
            user = yield userProvider.updateUser(userOptions);
        let addressOptions = {
            data: {}, where: { userId: userId }
        };
        if (requestBody.address.street)
            addressOptions['data']['street'] = requestBody.address.street;
        if (requestBody.address.suite)
            addressOptions['data']['suite'] = requestBody.address.suite;
        if (requestBody.address.city)
            addressOptions['data']['city'] = requestBody.address.city;
        if (requestBody.address.zipcode)
            addressOptions['data']['zipcode'] = requestBody.address.zipcode;
        if (Object.keys(addressOptions.data).length !== 0)
            address = yield userProvider.updateAddress(addressOptions);
        let geoOptions = {
            data: {}, where: { addressId: null }
        };
        if (requestBody.address.geo.lat)
            geoOptions['data']['lat'] = requestBody.address.geo.lat;
        if (requestBody.address.geo.lng)
            geoOptions['data']['lng'] = requestBody.address.geo.lng;
        if (Object.keys(geoOptions).length !== 0) {
            if (!address)
                address = yield userProvider.getAddressByUserId(requestBody.id);
            geoOptions.where.addressId = address.id;
            geo = yield userProvider.updateGeo(geoOptions);
        }
        let companyOptions = {
            data: {}, where: { userId: userId }
        };
        if (requestBody.company.name)
            userOptions['data']['name'] = requestBody.company.name;
        if (requestBody.company.catchPhrase)
            userOptions['data']['catchPhrase'] = requestBody.company.catchPhrase;
        if (requestBody.company.bs)
            userOptions['data']['bs'] = requestBody.company.bs;
        if (Object.keys(companyOptions).length !== 0)
            company = yield userProvider.updateCompany(companyOptions);
        let result = {};
        if (user)
            result = user;
        if (address)
            result['address'] = address;
        if (geo)
            result['address']['geo'] = geo;
        if (company)
            result['company'] = company;
        if ('password' in result)
            delete result.password;
        yield tokenProvider.logginToken({ data: { token: req.token, action: "patch user", target: "userId " + user.id } });
        return res.status(202).json({ data: result, message: "success" });
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.patchUser = patchUser;
const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userOptions = {};
        const users = yield userProvider.getUserList(userOptions)
            .then(users => users.map(user => { return { id: user.id, name: user.name }; }));
        return res.json({ users });
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.getAllUser = getAllUser;
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, check_request_1.assertUserRequest)(req);
        let queryParam = req.query;
        let userOptions = {
            where: {},
            include: {
                address: {
                    include: {
                        geo: true,
                    }
                },
                company: true,
            }
        };
        // prepare address and geo attribute
        if (queryParam.street || queryParam.suite || queryParam.city || queryParam.zipcode) {
            userOptions['where']['address'] = {};
            if (queryParam.lat || queryParam.lng)
                userOptions['where']['address']['geo'] = {};
        }
        // prepare company attribute
        if (queryParam.name || queryParam.catchPhrase || queryParam.bs) {
            userOptions['where']['company'] = {};
        }
        // map user attribute
        if (queryParam.id && typeof (queryParam.id) == "string")
            userOptions['where']['id'] = parseInt(queryParam.id);
        if (queryParam.email && typeof (queryParam.email) == "string")
            userOptions['where']['email'] = { "contains": queryParam.email };
        if (queryParam.name && typeof (queryParam.name) == "string")
            userOptions['where']['name'] = { "contains": queryParam.name };
        if (queryParam.phone && typeof (queryParam.phone) == "string")
            userOptions['where']['phone'] = { "contains": queryParam.phone };
        if (queryParam.website && typeof (queryParam.website) == "string")
            userOptions['where']['website'] = { "contains": queryParam.website };
        // map address and geo attribute
        if (queryParam.street && typeof (queryParam.street) == "string")
            userOptions['where']['address']['street'] = { "contains": queryParam.street };
        if (queryParam.suite && typeof (queryParam.suite) == "string")
            userOptions['where']['address']['suite'] = { "contains": queryParam.suite };
        if (queryParam.city && typeof (queryParam.city) == "string")
            userOptions['where']['address']['city'] = { "contains": queryParam.city };
        if (queryParam.zipcode && typeof (queryParam.zipcode) == "string")
            userOptions['where']['address']['zipcode'] = queryParam.zipcode;
        if (queryParam.lat && typeof (queryParam.lat) == "string")
            userOptions['where']['address']['geo']['lat'] = queryParam.lat;
        if (queryParam.lng && typeof (queryParam.lng) == "string")
            userOptions['where']['address']['geo']['lng'] = queryParam.lng;
        // map company attribute
        if (queryParam.companyName && typeof (queryParam.companyName) == "string")
            userOptions['where']['company']['name'] = { "contains": queryParam.companyName };
        if (queryParam.catchPhrase && typeof (queryParam.catchPhrase) == "string")
            userOptions['where']['company']['catchPhrase'] = { "contains": queryParam.catchPhrase };
        if (queryParam.bs && typeof (queryParam.bs) == "string")
            userOptions['where']['company']['bs'] = { "contains": queryParam.bs };
        userProvider.getUserList(userOptions).then((users) => __awaiter(void 0, void 0, void 0, function* () {
            let result = users.map(user => {
                delete user.password;
                return user;
            });
            yield tokenProvider.logginToken({ data: { token: req.token, action: "get users", target: "" } });
            return res.json({ result });
        }));
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.getUsers = getUsers;
const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, check_request_1.assertUserRequest)(req);
        const id = parseInt(req.params.id);
        const options = {
            where: { id },
            include: {
                address: {
                    include: {
                        geo: true,
                    }
                },
                company: true
            },
        };
        userProvider.getUser(options).then((user) => __awaiter(void 0, void 0, void 0, function* () {
            delete user.password;
            yield tokenProvider.logginToken({ data: { token: req.token, action: "get user by id", target: "userId " + id } });
            return res.json({ user: user });
        }));
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.getUserById = getUserById;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, check_request_1.assertUserRequest)(req);
        const id = parseInt(req.params.id);
        const options = {
            where: { id }
        };
        userProvider.deleteUser(options).then((users) => __awaiter(void 0, void 0, void 0, function* () {
            delete users.password;
            yield tokenProvider.logginToken({ data: { token: req.token, action: "delete user", target: "userId " + users.id } });
            return res.json({ users, message: "success" });
        }));
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=controllers.js.map