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
var user_repository_1 = require("../repositories/user_repository");
var validation_middleware_1 = require("../middleware/validation_middleware");
var link_repository_1 = require("../repositories/link_repository");
var comment_repository_1 = require("../repositories/comment_repository");
function getUserController() {
    var _this = this;
    // Prepare repositories
    var userRepository = user_repository_1.getUserRepository();
    var linkRepository = link_repository_1.getLinkRepository();
    var commentRepository = comment_repository_1.getCommentRepository();
    // Create router instance so we can declare endpoints
    var router = express.Router();
    // HTTP POST http://localhost:8080/api/v1/users
    router.post("/", validation_middleware_1.validateNewUser, function (req, res) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var newUser, userData, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newUser = req.body;
                        return [4 /*yield*/, userRepository.findOne({ email: newUser.email })];
                    case 1:
                        userData = _a.sent();
                        if (!!userData) return [3 /*break*/, 3];
                        return [4 /*yield*/, userRepository.save(newUser)];
                    case 2:
                        user = _a.sent();
                        res.status(200)
                            .json({ userData: user })
                            .send();
                        return [3 /*break*/, 4];
                    case 3:
                        res.status(400)
                            .json({ message: "Email " + newUser.email + " already in use." })
                            .send();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); })();
    });
    // HTTP GET http://localhost:8080/api/v1/users/:id
    router.get("/:id", validation_middleware_1.validateIds, function (req, res) {
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var userId, userData, links, comments;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.validId;
                        return [4 /*yield*/, userRepository.findOne(userId)];
                    case 1:
                        userData = _a.sent();
                        if (!userData) return [3 /*break*/, 4];
                        return [4 /*yield*/, linkRepository.find({ user_id: userId })];
                    case 2:
                        links = _a.sent();
                        return [4 /*yield*/, commentRepository.find({ user_id: userId })];
                    case 3:
                        comments = _a.sent();
                        res.status(200)
                            .json({
                            userData: userData,
                            links: links,
                            comments: comments
                        });
                        return [3 /*break*/, 5];
                    case 4:
                        res.status(404)
                            .json({ message: "User id " + userId + " not found." })
                            .send();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); })();
    });
    return router;
}
exports.getUserController = getUserController;
