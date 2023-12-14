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
exports.deleteUser = exports.getUserList = exports.getUser = exports.getAllUsers = exports.updateCompany = exports.updateGeo = exports.updateAddress = exports.getAddressByUserId = exports.updateUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (createOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.create(createOption);
});
exports.createUser = createUser;
const updateUser = (updateOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.update(updateOption);
});
exports.updateUser = updateUser;
const getAddressByUserId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.address.findUnique({ where: { userId: id } });
});
exports.getAddressByUserId = getAddressByUserId;
const updateAddress = (updateOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.address.update(updateOption);
});
exports.updateAddress = updateAddress;
const updateGeo = (updateOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.geo.update(updateOption);
});
exports.updateGeo = updateGeo;
const updateCompany = (updateOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.company.update(updateOption);
});
exports.updateCompany = updateCompany;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany({
        include: {
            address: {
                include: {
                    geo: true,
                }
            },
            company: true,
            posts: true
        },
    });
    // TODO delete column address id, geo id
    return users;
});
exports.getAllUsers = getAllUsers;
const getUser = (whereOption) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique(whereOption);
    // TODO delete column address id, geo id
    return user;
});
exports.getUser = getUser;
// get by filter
const getUserList = (whereOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.findMany(whereOption);
});
exports.getUserList = getUserList;
const deleteUser = (whereOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.user.delete(whereOption);
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=user.js.map