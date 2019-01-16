"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = __importStar(require("express"));
var validation_middleware_1 = require("../middleware/validation_middleware");
var auth_middleware_1 = require("../middleware/auth_middleware");
var comment_repository_1 = require("../repositories/comment_repository");
var link_repository_1 = require("../repositories/link_repository");
function getCommentController() {
    var _this = this;
    var commentRepository = comment_repository_1.getCommentRepository();
    var router = express.Router();
    // HTTP POST http://localhost:8080//api/v1/comments
    router.post("/", validation_middleware_1.validateNewComment, auth_middleware_1.authMiddleware, function (req, res) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var newComment, validComment, linkData, commentData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newComment = req.body;
                        validComment = req.validNewComment;
                        if (!validComment) return [3 /*break*/, 4];
                        return [4 /*yield*/, linkChecker(newComment.link, res)];
                    case 1:
                        linkData = _a.sent();
                        if (!linkData) return [3 /*break*/, 3];
                        return [4 /*yield*/, commentRepository.save(newComment)];
                    case 2:
                        commentData = _a.sent();
                        res.json({
                            message: "Comment created",
                            data: commentData
                        })
                            .send();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        res.status(400)
                            .json({ message: "Invalid entries." });
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); })();
    });
    // HTTP DELETE http://localhost:8080/api/v1/comments/:id
    router.delete("/:id", validation_middleware_1.validateIds, auth_middleware_1.authMiddleware, function (req, res) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var commentId, userId, commentToRemove, deletedContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        commentId = req.params.validId;
                        userId = req.body.user;
                        return [4 /*yield*/, commentChecker(commentId, res)];
                    case 1:
                        commentToRemove = _a.sent();
                        if (!(commentToRemove.user.user_id == userId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, commentRepository.remove(commentToRemove)];
                    case 2:
                        deletedContent = _a.sent();
                        res.status(200)
                            .json({
                            message: "Link deleted",
                            data: commentToRemove
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        res.status(401)
                            .json({ message: "User id " + userId + " can't delete this link" });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); })();
    });
    return router;
}
exports.getCommentController = getCommentController;
function linkChecker(linkId, res) {
    return __awaiter(this, void 0, void 0, function () {
        var linkRepository, linkExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    linkRepository = link_repository_1.getLinkRepository();
                    return [4 /*yield*/, linkRepository.findOne({ link_id: linkId })];
                case 1:
                    linkExists = _a.sent();
                    // Check if link is real
                    if (linkExists) {
                        return [2 /*return*/, linkExists];
                    }
                    else {
                        // When link not found
                        res.status(404)
                            .json({ message: "Link ID " + linkId + " not found." })
                            .send();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function commentChecker(commentId, res) {
    return __awaiter(this, void 0, void 0, function () {
        var commentRepository, commentExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commentRepository = comment_repository_1.getCommentRepository();
                    return [4 /*yield*/, commentRepository.findOne({ comment_id: commentId }, { relations: ["user"] })];
                case 1:
                    commentExists = _a.sent();
                    // Check if link is real
                    if (commentExists) {
                        return [2 /*return*/, commentExists];
                    }
                    else {
                        // When link not found
                        res.status(404)
                            .json({ message: "Comment ID " + commentId + " not found." })
                            .send();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
