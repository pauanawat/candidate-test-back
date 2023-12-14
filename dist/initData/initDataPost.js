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
// Import your Prisma client
const client_1 = require("@prisma/client");
const crypto = __importStar(require("../src/utils/crypto"));
const users_json_1 = __importDefault(require("./users.json"));
const posts_json_1 = __importDefault(require("./posts.json"));
// Create an instance of the Prisma client
const prisma = new client_1.PrismaClient();
// Function to create a new user
function createUser() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Use the Prisma client to create a new user
            users_json_1.default.forEach((requestBody) => __awaiter(this, void 0, void 0, function* () {
                requestBody["password"] = yield crypto.hash("password");
                const options = {
                    data: {
                        email: requestBody.email,
                        name: requestBody.name,
                        phone: requestBody.phone,
                        website: requestBody.website,
                        username: requestBody.username,
                        password: requestBody["password"],
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
                const newUser = yield prisma.user.create(options);
            }));
        }
        catch (error) {
            console.error('Error creating user:');
        }
        finally {
            // Close the Prisma client connection
            yield prisma.$disconnect();
        }
    });
}
function createPost() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Use the Prisma client to create a new user
            posts_json_1.default.forEach((requestBody) => __awaiter(this, void 0, void 0, function* () {
                const options = {
                    data: {
                        id: requestBody.id,
                        userId: requestBody.userId,
                        title: requestBody.title,
                        body: requestBody.body
                    },
                };
                const newPost = yield prisma.post.create(options);
            }));
        }
        catch (error) {
            console.error('Error creating post:');
        }
        finally {
            // Close the Prisma client connection
            yield prisma.$disconnect();
        }
    });
}
createPost();
//# sourceMappingURL=initDataPost.js.map