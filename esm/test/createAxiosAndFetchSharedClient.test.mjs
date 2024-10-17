/* eslint-disable @typescript-eslint/no-unused-expressions */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
import axios from "axios";
import { defineRoute, defineRoutes, listRoutes } from "../src/index.mjs";
import { z } from "zod";
import { createAxiosSharedClient } from "../src/axios/index.mjs";
import { createFetchSharedClient } from "../src/fetch/index.mjs";
import { describe, it, expect } from "vitest";
describe("createAxiosSharedCaller", function () {
    it("create a caller from axios and sharedRoutes object", function () { return __awaiter(void 0, void 0, void 0, function () {
        var bookSchema, withAuthorizationSchema, routes, axiosSharedCaller, _notExecuted;
        return __generator(this, function (_a) {
            bookSchema = z.object({ title: z.string(), author: z.string() });
            withAuthorizationSchema = z.object({ authorization: z.string() });
            routes = defineRoutes({
                addBook: defineRoute({
                    method: "post",
                    url: "/books",
                    requestBodySchema: bookSchema,
                    headersSchema: withAuthorizationSchema,
                }),
                getAllBooks: defineRoute({
                    method: "get",
                    url: "/books",
                    queryParamsSchema: z.object({ max: z.number() }),
                    responses: { 200: z.array(bookSchema) },
                }),
                getByTitle: defineRoute({
                    method: "get",
                    url: "/books/:title",
                    responses: { 200: bookSchema, 404: z.object({ message: z.string() }) },
                }),
            });
            axiosSharedCaller = createAxiosSharedClient(routes, axios);
            expect(listRoutes(routes)).toEqual([
                "POST /books",
                "GET /books",
                "GET /books/:title",
            ]);
            _notExecuted = function () { return __awaiter(void 0, void 0, void 0, function () {
                var addBookResponse, getAllBooksResponse, getByTitleResponse;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, axiosSharedCaller.addBook({
                                body: { title: "lala", author: "bob" },
                                headers: { authorization: "some-token" },
                            })];
                        case 1:
                            addBookResponse = _a.sent();
                            addBookResponse.body; // type is void, as expected
                            return [4 /*yield*/, axiosSharedCaller.getAllBooks({
                                    queryParams: { max: 3 },
                                })];
                        case 2:
                            getAllBooksResponse = _a.sent();
                            getAllBooksResponse.body; // type is Book[], as expected
                            return [4 /*yield*/, axiosSharedCaller.getByTitle({
                                    urlParams: { title: "great" },
                                })];
                        case 3:
                            getByTitleResponse = _a.sent();
                            if (getByTitleResponse.status === 404) {
                                getByTitleResponse.body; // type is { message: string }, as expected
                            }
                            else {
                                getByTitleResponse.body; // type is Book, as expected
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            return [2 /*return*/];
        });
    }); });
    describe("Actually calling an endpoint", function () {
        // WARNING : This test uses an actual placeholder api (which might not always be available...)
        var todoSchema = z.object({
            userId: z.number(),
            id: z.number(),
            title: z.string(),
            completed: z.boolean(),
        });
        var routes = defineRoutes({
            getByTodoById: defineRoute({
                method: "get",
                url: "https://jsonplaceholder.typicode.com/todos/:todoId",
                queryParamsSchema: z.object({ userId: z.number(), max: z.number().optional() }),
                responses: {
                    200: todoSchema,
                    400: z.object({ message: z.string() }),
                },
            }),
            addPost: defineRoute({
                method: "post",
                url: "https://jsonplaceholder.typicode.com/posts",
                requestBodySchema: z.object({
                    title: z.string(),
                    body: z.string(),
                    userId: z.number(),
                }),
                responses: { 201: z.object({ id: z.number() }) },
            }),
            updatePostWithIncorrectReturnCode: defineRoute({
                method: "put",
                url: "https://jsonplaceholder.typicode.com/posts/:postId",
                requestBodySchema: z.object({
                    title: z.string(),
                    body: z.string(),
                    userId: z.number(),
                }),
                responses: { 208: z.object({ id: z.number() }) },
            }),
        });
        it.each([
            { name: "axios", httpClient: createAxiosSharedClient(routes, axios) },
            { name: "fetch", httpClient: createFetchSharedClient(routes, fetch) },
        ])("actually calls a placeholder endpoint, using $name", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var response, expectedResponseBody, addPostResponse;
            var httpClient = _b.httpClient, name = _b.name;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        expect(listRoutes(routes)).toEqual([
                            "GET https://jsonplaceholder.typicode.com/todos/:todoId",
                            "POST https://jsonplaceholder.typicode.com/posts",
                            "PUT https://jsonplaceholder.typicode.com/posts/:postId",
                        ]);
                        return [4 /*yield*/, httpClient.getByTodoById({
                                urlParams: { todoId: "3" },
                                queryParams: { userId: 1, max: undefined },
                            })];
                    case 1:
                        response = _c.sent();
                        expectedResponseBody = {
                            id: 3,
                            userId: 1,
                            completed: false,
                            title: "fugiat veniam minus",
                        };
                        expect(response.body).toEqual(expectedResponseBody);
                        expect(response.status).toBe(200);
                        return [4 /*yield*/, httpClient.addPost({
                                body: { title: "My great post", body: "Some content", userId: 1 },
                            })];
                    case 2:
                        addPostResponse = _c.sent();
                        expect(addPostResponse.body.id).toBeTypeOf("number");
                        expect(addPostResponse.status).toBe(201);
                        expect(addPostResponse.headers).toMatchObject({
                            "content-type": "application/json; charset=utf-8",
                        });
                        return [4 /*yield*/, expect(httpClient.addPost({ body: { wrong: "body" } })).rejects.toThrow([
                                "Shared-route schema 'requestBodySchema' was not respected in adapter '".concat(name, "'."),
                                "Route: POST https://jsonplaceholder.typicode.com/posts",
                                "Issues: title: Required | body: Required | userId: Required",
                            ].join("\n"))];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, expect(httpClient.updatePostWithIncorrectReturnCode({
                                urlParams: { postId: "1" },
                                body: { title: "My great post", body: "Some content", userId: 1 },
                            })).rejects.toThrow([
                                "Shared-route schema 'responses' was not respected in adapter '".concat(name, "'."),
                                "Received status: 200. Handled statuses: 208.",
                                "Route: PUT https://jsonplaceholder.typicode.com/posts/:postId",
                            ].join("\n"))];
                    case 4:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); }, { timeout: 3000 });
        it.each([
            {
                name: "axios",
                httpClient: createAxiosSharedClient(routes, axios, { skipInputValidation: true }),
            },
            {
                name: "fetch",
                httpClient: createFetchSharedClient(routes, fetch, { skipInputValidation: true }),
            },
        ])("can skip the validation for input params or response, for $name", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var response, addPostResponse;
            var httpClient = _b.httpClient;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, httpClient.addPost({ body: { wrong: "body" } })];
                    case 1:
                        response = _c.sent();
                        expect(response.body).toBeTruthy();
                        return [4 /*yield*/, httpClient.addPost({
                                body: { title: "My great post", body: "Some content", userId: 1 },
                            })];
                    case 2:
                        addPostResponse = _c.sent();
                        expect(addPostResponse.body.id).toBeTypeOf("number");
                        return [2 /*return*/];
                }
            });
        }); });
        var skippedStatuses = [200];
        it.each([
            {
                name: "axios",
                httpClient: createAxiosSharedClient(routes, axios, {
                    skipResponseValidationForStatuses: skippedStatuses,
                }),
            },
            {
                name: "fetch",
                httpClient: createFetchSharedClient(routes, fetch, {
                    skipResponseValidationForStatuses: skippedStatuses,
                }),
            },
        ])("can skip the response validation for some selected statuses, for $name", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
            var postId, body, response;
            var httpClient = _b.httpClient;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        postId = "1";
                        body = { title: "My great post", body: "Some content", userId: 1 };
                        return [4 /*yield*/, httpClient.updatePostWithIncorrectReturnCode({
                                urlParams: { postId: "1" },
                                body: body,
                            })];
                    case 1:
                        response = _c.sent();
                        expect(response.status).toBe(200);
                        expect(response.body).toEqual(__assign(__assign({}, body), { id: +postId }));
                        return [2 /*return*/];
                }
            });
        }); });
        describe("explicit error when calling without respecting the contract", function () {
            var todoSchema = z.object({
                userId: z.number(),
                id: z.number(),
                title: z.string(),
                completed: z.boolean(),
            });
            var routes = defineRoutes({
                getTodos: defineRoute({
                    method: "get",
                    url: "https://jsonplaceholder.typicode.com/todos",
                    queryParamsSchema: z.object({ userId: z.number(), max: z.number().optional() }),
                    responses: { 200: z.array(z.number()) }, // this is not the correct schema, we want to trigger an error on return
                }),
                addTodo: defineRoute({
                    method: "post",
                    url: "https://jsonplaceholder.typicode.com/todos",
                    requestBodySchema: todoSchema,
                    headersSchema: z.object({ authorization: z.string() }),
                }),
            });
            var httpClient = createFetchSharedClient(routes, fetch);
            it("when query params are wrong", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, expect(httpClient.getTodos({ queryParams: { userWrongKey: "yolo" } })).rejects.toThrow([
                                "Shared-route schema 'queryParamsSchema' was not respected in adapter 'fetch'.",
                                "Route: GET https://jsonplaceholder.typicode.com/todos",
                            ].join("\n"))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("when response body is wrong", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, expect(httpClient.getTodos({ queryParams: { userId: 1 } })).rejects.toThrow([
                                "Shared-route schema 'responses' was not respected in adapter 'fetch'.",
                                "Received status: 200. Handled statuses: 200.",
                                "Route: GET https://jsonplaceholder.typicode.com/todos",
                            ].join("\n"))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("when request body is wrong", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, expect(httpClient.addTodo({
                                body: { wrong: "yolo" },
                                headers: { authorization: "some-token" },
                            })).rejects.toThrow([
                                "Shared-route schema 'requestBodySchema' was not respected in adapter 'fetch'.",
                                "Route: POST https://jsonplaceholder.typicode.com/todos",
                            ].join("\n"))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("when headers are wrong", function () { return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, expect(httpClient.addTodo({
                                body: { id: 123, userId: 456, title: "some title", completed: false },
                                headers: { auth: "some-token" },
                            })).rejects.toThrow([
                                "Shared-route schema 'headersSchema' was not respected in adapter 'fetch'.",
                                "Route: POST https://jsonplaceholder.typicode.com/todos",
                            ].join("\n"))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
//# sourceMappingURL=createAxiosAndFetchSharedClient.test.mjs.map