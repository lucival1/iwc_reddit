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
var auth_middleware_1 = require("../middleware/auth_middleware");
var validation_middleware_1 = require("../middleware/validation_middleware");
var link_repository_1 = require("../repositories/link_repository");
var comment_repository_1 = require("../repositories/comment_repository");
var vote_repository_1 = require("../repositories/vote_repository");
function getLinkController() {
    var _this = this;
    // Prepare repositories
    var linkRepository = link_repository_1.getLinkRepository();
    var commentRepository = comment_repository_1.getCommentRepository();
    var voteRepository = vote_repository_1.getVoteRepository();
    // Create router instance so we can declare endpoints
    var router = express.Router();
    // HTTP GET http://localhost:8080/api/v1/links
    router.get("/", function (req, res) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var links;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, linkRepository.find()];
                    case 1:
                        links = _a.sent();
                        // If links exists return to client.
                        if (links) {
                            res.status(200)
                                .json(links);
                        }
                        else {
                            res.status(404)
                                .json({ message: "No links found" });
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
    });
    // HTTP GET http://localhost:8080/api/v1/links/:id
    router.get("/:id", validation_middleware_1.validateIds, function (req, res) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var linkId, link;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linkId = req.params.validId;
                        return [4 /*yield*/, linkChecker(linkId, res)];
                    case 1:
                        link = _a.sent();
                        console.log('linkId', linkId);
                        console.log('link', link);
                        // If link exists continue
                        if (link) {
                            res.status(200)
                                .json(link);
                        }
                        else {
                            res.status(404)
                                .json({ message: "Link id " + linkId + " not found" });
                        }
                        return [2 /*return*/];
                }
            });
        }); })();
    });
    // HTTP POST http://localhost:8080/api/v1/links
    router.post("/", validation_middleware_1.validateNewLink, auth_middleware_1.authMiddleware, function (req, res) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var newLink, validLink, linkData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newLink = req.body;
                        validLink = req.validNewLink;
                        if (!validLink) return [3 /*break*/, 2];
                        return [4 /*yield*/, linkRepository.save(newLink)];
                    case 1:
                        linkData = _a.sent();
                        res.status(200)
                            .json({
                            message: "Link posted",
                            data: linkData
                        })
                            .send();
                        return [3 /*break*/, 3];
                    case 2:
                        res.status(400)
                            .json({ message: "Invalid entries." });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    });
    // HTTP DELETE http://localhost:8080/api/v1/links/:id
    router.delete("/:id", validation_middleware_1.validateIds, auth_middleware_1.authMiddleware, function (req, res) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var linkId, userId, linkToRemove, deletedContent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linkId = parseInt(req.params.validId);
                        userId = req.body.user_id;
                        return [4 /*yield*/, linkChecker(linkId, res)];
                    case 1:
                        linkToRemove = _a.sent();
                        if (!(linkToRemove.user_id.user_id === userId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, linkRepository.remove(linkToRemove)];
                    case 2:
                        deletedContent = _a.sent();
                        res.status(200)
                            .json({
                            message: "Link deleted",
                            data: deletedContent
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
    // HTTP POST http://localhost:8080/api/v1/links/:id/upvote
    router.post("/:id/upvote", validation_middleware_1.validateIds, auth_middleware_1.authMiddleware, function (req, res) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var linkId, userId, linkData, voteToCast, voteData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linkId = req.params.validId;
                        userId = req.body.user_id;
                        return [4 /*yield*/, linkChecker(linkId, res)];
                    case 1:
                        linkData = _a.sent();
                        return [4 /*yield*/, voteChecker(linkData.link_id, userId, res)];
                    case 2:
                        voteToCast = _a.sent();
                        if (!voteToCast) return [3 /*break*/, 4];
                        return [4 /*yield*/, voteRepository.save(voteToCast)];
                    case 3:
                        voteData = _a.sent();
                        res.status(200)
                            .json({
                            message: "Vote casted",
                            data: voteData
                        });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); })();
    });
    // HTTP POST http://localhost:8080/api/v1/links/:id/downvote
    router.post("/:id/downvote", validation_middleware_1.validateIds, auth_middleware_1.authMiddleware, function (req, res) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var linkId, userId, linkData, voteToCast, voteData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        linkId = req.params.validId;
                        userId = req.body.user_id;
                        return [4 /*yield*/, linkChecker(linkId, res)];
                    case 1:
                        linkData = _a.sent();
                        return [4 /*yield*/, voteChecker(linkData.link_id, userId, res)];
                    case 2:
                        voteToCast = _a.sent();
                        if (!voteToCast) return [3 /*break*/, 4];
                        // Default value is true so this needs to be reset to false on downvote
                        voteToCast.value = false;
                        return [4 /*yield*/, voteRepository.save(voteToCast)];
                    case 3:
                        voteData = _a.sent();
                        res.status(200)
                            .json({
                            message: "Vote casted",
                            data: voteData
                        });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); })();
    });
    return router;
}
exports.getLinkController = getLinkController;
function linkChecker(linkId, res) {
    return __awaiter(this, void 0, void 0, function () {
        var linkRepository, linkExists;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    linkRepository = link_repository_1.getLinkRepository();
                    return [4 /*yield*/, linkRepository.findOne(linkId, { relations: ["user", "comments"] })];
                case 1:
                    linkExists = _a.sent();
                    console.log('linkExists', linkExists);
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
function voteChecker(linkId, userId, res) {
    return __awaiter(this, void 0, void 0, function () {
        var voteRepository, voteExists, newVote;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    voteRepository = vote_repository_1.getVoteRepository();
                    return [4 /*yield*/, voteRepository.findOne({ link_id: linkId, user_id: userId })];
                case 1:
                    voteExists = _a.sent();
                    // Check if user has voted the link before
                    if (voteExists) {
                        // When user has already voted
                        res.status(400)
                            .json({
                            message: "User already has casted a vote.",
                            data: voteExists
                        })
                            .send();
                    }
                    else {
                        newVote = {
                            user_id: userId,
                            link_id: linkId,
                            value: true
                        };
                        return [2 /*return*/, newVote];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
