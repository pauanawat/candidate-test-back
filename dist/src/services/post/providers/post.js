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
exports.getFeedList = exports.deletePost = exports.getPostList = exports.getPost = exports.getAllPosts = exports.updatePost = exports.createPost = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPost = (createOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.post.create(createOption);
});
exports.createPost = createPost;
const updatePost = (updateOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.post.update(updateOption);
});
exports.updatePost = updatePost;
const getAllPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.post.findMany();
});
exports.getAllPosts = getAllPosts;
const getPost = (whereOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.post.findUnique(whereOption);
});
exports.getPost = getPost;
// get by filter
const getPostList = (whereOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.post.findMany(whereOption);
});
exports.getPostList = getPostList;
const deletePost = (whereOption) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.post.delete(whereOption);
});
exports.deletePost = deletePost;
const getFeedList = (FeedFindManyArgs) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.post.findMany(FeedFindManyArgs);
});
exports.getFeedList = getFeedList;
//# sourceMappingURL=post.js.map