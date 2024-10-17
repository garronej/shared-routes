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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var express_1 = require("../src/express");
var zod_1 = require("zod");
var createSupertestSharedClient_1 = require("../src/supertest/createSupertestSharedClient");
var supertest_1 = __importDefault(require("supertest"));
var express_2 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_3 = require("express");
var vitest_1 = require("vitest");
var zNumberFromString = zod_1.z.preprocess(function (v) {
    var n = parseInt(v);
    return isNaN(n) ? v : n;
}, zod_1.z.number());
var bookSchema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
});
var withAuthorizationSchema = zod_1.z.object({ authorization: zod_1.z.string() });
var routes = (0, src_1.defineRoutes)({
    addBook: (0, src_1.defineRoute)({
        method: "post",
        url: "/books",
        requestBodySchema: bookSchema,
        headersSchema: withAuthorizationSchema,
    }),
    getAllBooks: (0, src_1.defineRoute)({
        method: "get",
        url: "/books",
        queryParamsSchema: zod_1.z.object({
            max: zNumberFromString,
            startWith: zod_1.z.array(zod_1.z.string()),
        }),
        responses: { 200: zod_1.z.array(bookSchema) },
    }),
    getBookByTitle: (0, src_1.defineRoute)({
        method: "get",
        url: "/books/:title",
        responses: {
            200: bookSchema,
            404: zod_1.z.object({ message: zod_1.z.string() }),
        },
    }),
    getBookWithoutParams: (0, src_1.defineRoute)({
        method: "get",
        url: "/no-params",
        responses: { 200: bookSchema.optional() },
    }),
});
var fakeAuthToken = "my-token";
var createBookRouter = function () {
    var bookDB = [];
    var expressRouter = (0, express_3.Router)();
    var expressSharedRouter = (0, express_1.createExpressSharedRouter)(routes, expressRouter);
    var someMiddleware = function (_req, _res, next) {
        next();
    };
    expressSharedRouter.getAllBooks(function (_, res) {
        console.log("yeah reached ! ", bookDB);
        return res.json(bookDB);
    });
    expressSharedRouter.addBook(someMiddleware, function (req, res) {
        if (req.headers.authorization !== fakeAuthToken) {
            res.status(401);
            return res.json();
        }
        bookDB.push(req.body);
        return res.json();
    });
    expressSharedRouter.getBookByTitle(function (req, res) {
        if (req.params.title === "throw")
            throw new Error("Some unexpected error");
        var book = bookDB.find(function (b) { return b.title === req.params.title; });
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        return res.status(200).json(book);
    });
    expressSharedRouter.getBookWithoutParams(function (_, res) {
        res.status(200).json();
    });
    return expressRouter;
};
var createExempleApp = function () {
    var app = (0, express_2.default)();
    app.use(body_parser_1.default.json());
    app.use(createBookRouter());
    return app;
};
(0, vitest_1.describe)("createExpressSharedRouter and createSupertestSharedCaller", function () {
    (0, vitest_1.it)("fails to add if not authenticated", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app, supertestRequest, supertestSharedCaller, heyBook, addBookResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = createExempleApp();
                    supertestRequest = (0, supertest_1.default)(app);
                    supertestSharedCaller = (0, createSupertestSharedClient_1.createSupertestSharedClient)(routes, supertestRequest);
                    heyBook = { title: "Hey", author: "Steeve" };
                    return [4 /*yield*/, supertestSharedCaller.addBook({
                            body: heyBook,
                            headers: { authorization: "not-the-right-token" },
                        })];
                case 1:
                    addBookResponse = _a.sent();
                    (0, vitest_1.expect)((0, src_1.listRoutes)(routes)).toEqual([
                        "POST /books",
                        "GET /books",
                        "GET /books/:title",
                        "GET /no-params",
                    ]);
                    (0, vitest_1.expect)(addBookResponse.body).toEqual(""); // type is void, but express sends "";
                    (0, vitest_1.expect)(addBookResponse.status).toBe(401);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("fails explicitly when the schema is not respected", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app, supertestRequest, supertestSharedCaller, getAllBooksResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = createExempleApp();
                    supertestRequest = (0, supertest_1.default)(app);
                    supertestSharedCaller = (0, createSupertestSharedClient_1.createSupertestSharedClient)(routes, supertestRequest);
                    return [4 /*yield*/, supertestSharedCaller.getAllBooks({
                            queryParams: { max: "yolo" },
                        })];
                case 1:
                    getAllBooksResponse = _a.sent();
                    (0, vitest_1.expect)(getAllBooksResponse.body).toEqual({
                        status: 400,
                        message: "Shared-route schema 'queryParamsSchema' was not respected in adapter 'express'.\nRoute: GET /books",
                        issues: ["max : Expected number, received string", "startWith : Required"],
                    });
                    (0, vitest_1.expect)(getAllBooksResponse.status).toBe(400);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("create an express app and a supertest instance with the same sharedRoutes object", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app, supertestRequest, supertestSharedCaller, heyBook, addBookResponse, otherBook, getAllBooksResponse, fetchedBookResponse, bookNotFoundResponse, _a, body, status;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    app = createExempleApp();
                    supertestRequest = (0, supertest_1.default)(app);
                    supertestSharedCaller = (0, createSupertestSharedClient_1.createSupertestSharedClient)(routes, supertestRequest);
                    heyBook = { title: "Hey", author: "Steeve" };
                    return [4 /*yield*/, supertestSharedCaller.addBook({
                            body: heyBook,
                            headers: { authorization: fakeAuthToken },
                        })];
                case 1:
                    addBookResponse = _b.sent();
                    (0, vitest_1.expect)(addBookResponse.body).toEqual(""); // type is void, but express sends "";
                    (0, vitest_1.expect)(addBookResponse.status).toBe(200);
                    otherBook = { title: "Other book", author: "Somebody" };
                    return [4 /*yield*/, supertestSharedCaller.addBook({
                            body: otherBook,
                            headers: { authorization: fakeAuthToken },
                        })];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, supertestSharedCaller.getAllBooks({
                            queryParams: { max: 5, startWith: ["yolo"] },
                        })];
                case 3:
                    getAllBooksResponse = _b.sent();
                    expectToEqual(getAllBooksResponse.body, [heyBook, otherBook]);
                    (0, vitest_1.expect)(getAllBooksResponse.status).toBe(200);
                    return [4 /*yield*/, supertestSharedCaller.getBookByTitle({
                            urlParams: { title: "Hey" },
                        })];
                case 4:
                    fetchedBookResponse = _b.sent();
                    expectToMatch(fetchedBookResponse, {
                        status: 200,
                        body: heyBook,
                        headers: { "content-type": "application/json; charset=utf-8" },
                    });
                    return [4 /*yield*/, supertestSharedCaller.getBookByTitle({
                            urlParams: { title: "not found" },
                        })];
                case 5:
                    bookNotFoundResponse = _b.sent();
                    expectToMatch(bookNotFoundResponse, {
                        status: 404,
                        body: { message: "Book not found" },
                        headers: { "content-type": "application/json; charset=utf-8" },
                    });
                    return [4 /*yield*/, supertestSharedCaller.getBookWithoutParams()];
                case 6:
                    _a = _b.sent(), body = _a.body, status = _a.status;
                    (0, vitest_1.expect)(body).toBe(""); // express returns "" for void
                    (0, vitest_1.expect)(status).toEqual(200);
                    return [2 /*return*/];
            }
        });
    }); });
    (0, vitest_1.it)("shows when unexpected error occurs (though it does not respect schema)", function () { return __awaiter(void 0, void 0, void 0, function () {
        var app, supertestRequest, supertestSharedCaller, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app = createExempleApp();
                    supertestRequest = (0, supertest_1.default)(app);
                    supertestSharedCaller = (0, createSupertestSharedClient_1.createSupertestSharedClient)(routes, supertestRequest);
                    return [4 /*yield*/, supertestSharedCaller.getBookByTitle({
                            urlParams: { title: "throw" },
                        })];
                case 1:
                    result = _a.sent();
                    (0, vitest_1.expect)(result.status).toBe(500);
                    (0, vitest_1.expect)(result.text).toContain("Some unexpected error");
                    return [2 /*return*/];
            }
        });
    }); });
});
var expectToEqual = function (actual, expected) { return (0, vitest_1.expect)(actual).toEqual(expected); };
var expectToMatch = function (actual, expected) {
    return (0, vitest_1.expect)(actual).toMatchObject(expected);
};
// type Book = { title: string; author: string };
// const bookSchema: z.Schema<Book> = z.object({
//   title: z.string(),
//   author: z.string(),
// });
var _routes = (0, src_1.defineRoutes)({
    addBook: (0, src_1.defineRoute)({
        method: "post",
        url: "/books",
        requestBodySchema: bookSchema,
    }),
    getAllBooks: (0, src_1.defineRoute)({
        method: "get",
        url: "/books",
        queryParamsSchema: zod_1.z.object({ max: zod_1.z.number() }),
        responses: {
            200: zod_1.z.array(bookSchema),
        },
    }),
    getBookByTitle: (0, src_1.defineRoute)({
        method: "get",
        url: "/books/:title",
        headersSchema: zod_1.z.object({ authorization: zod_1.z.string() }),
        responses: {
            200: bookSchema,
            404: zod_1.z.object({ message: zod_1.z.string() }),
        },
    }),
});
//# sourceMappingURL=expressAndSupertest.test.js.map