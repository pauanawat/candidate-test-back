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
exports.getFeedList = exports.deletePost = exports.getPostById = exports.getPosts = exports.patchPost = exports.updatePost = exports.createPost = void 0;
const moment_1 = __importDefault(require("moment"));
const ErrorHandler = __importStar(require("../../utils/error_handler"));
const postProvider = __importStar(require("./providers/post"));
const tokenProvider = __importStar(require("../user/providers/token"));
const check_request_1 = require("../../utils/check_request");
const createPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("createPost");
        (0, check_request_1.assertUserRequest)(req);
        const requestBody = req.body;
        const currentDate = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
        const options = {
            data: {
                userId: requestBody.userId,
                title: requestBody.title,
                body: requestBody.body,
                createAt: currentDate,
                updateAt: currentDate
            }
        };
        let posts = yield postProvider.createPost(options);
        yield tokenProvider.logginToken({ data: { token: req.token, action: "create post", target: "postId " + posts.id } });
        return res.status(201).json({ data: posts });
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.createPost = createPost;
const updatePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("updatePost");
        (0, check_request_1.assertUserRequest)(req);
        let postId = parseInt(req.params.id);
        const requestBody = req.body;
        let postOptions = {
            data: {
                userId: requestBody.userId,
                title: requestBody.title,
                body: requestBody.body
            }, where: { id: postId }
        };
        const post = yield postProvider.updatePost(postOptions);
        yield tokenProvider.logginToken({ data: { token: req.token, action: "put post", target: "postId " + post.id } });
        return res.status(200).json({ data: post });
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.updatePost = updatePost;
const patchPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("patchPost");
        (0, check_request_1.assertUserRequest)(req);
        let postId = parseInt(req.params.id);
        const requestBody = req.body;
        let post;
        let postOptions = {
            data: {}, where: { id: postId }
        };
        if (requestBody.title)
            postOptions['data']['title'] = requestBody.title;
        if (requestBody.body)
            postOptions['data']['body'] = requestBody.body;
        if (Object.keys(postOptions.data).length !== 0)
            post = yield postProvider.updatePost(postOptions);
        yield tokenProvider.logginToken({ data: { token: req.token, action: "patch post", target: "postId " + post.id } });
        return res.status(200).json({ data: post });
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.patchPost = patchPost;
const getPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, check_request_1.assertUserRequest)(req);
        let queryParam = req.query;
        let postOptions = {
            where: {},
        };
        // map post attribute
        if (queryParam.id && typeof (queryParam.id) == "string")
            postOptions['where']['id'] = parseInt(queryParam.id);
        if (queryParam.userId && typeof (queryParam.userId) == "string")
            postOptions['where']['userId'] = parseInt(queryParam.userId);
        if (queryParam.title && typeof (queryParam.title) == "string")
            postOptions['where']['title'] = { "contains": queryParam.title };
        if (queryParam.body && typeof (queryParam.body) == "string")
            postOptions['where']['body'] = { "contains": queryParam.body };
        const posts = yield postProvider.getPostList(postOptions);
        yield tokenProvider.logginToken({ data: { token: req.token, action: "get posts", target: "" } });
        return res.status(200).json({ data: posts });
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.getPosts = getPosts;
const getPostById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, check_request_1.assertUserRequest)(req);
        const id = parseInt(req.params.id);
        const options = {
            where: { id },
        };
        const post = yield postProvider.getPost(options);
        yield tokenProvider.logginToken({ data: { token: req.token, action: "get post by id", target: "postId " + id } });
        return res.status(200).json({ data: post });
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.getPostById = getPostById;
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, check_request_1.assertUserRequest)(req);
        const id = parseInt(req.params.id);
        const options = {
            where: { id }
        };
        postProvider.deletePost(options).then((posts) => __awaiter(void 0, void 0, void 0, function* () {
            yield tokenProvider.logginToken({ data: { token: req.token, action: "delete post", target: "postId " + posts.id } });
            return res.status(200).json({ data: posts });
        }));
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.deletePost = deletePost;
const getFeedList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let queryParam = req.query;
        let postOptions = {
            where: {},
            include: { author: true }
        };
        if (queryParam.userId && typeof (queryParam.userId) == "string")
            postOptions.where['userId'] = parseInt(queryParam.userId);
        const feeds = yield postProvider.getFeedList(postOptions);
        return res.status(200).json({ data: feeds });
    }
    catch (err) {
        ErrorHandler.handleAll(err, res, next);
    }
});
exports.getFeedList = getFeedList;
//# sourceMappingURL=controllers.js.map