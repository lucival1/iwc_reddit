"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var user_1 = require("./user");
var comment_1 = require("./comment");
var Link = /** @class */ (function () {
    function Link() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        __metadata("design:type", Number)
    ], Link.prototype, "link_id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return user_1.User; }, function (user) { return user.links; }),
        __metadata("design:type", user_1.User)
    ], Link.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Link.prototype, "title", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], Link.prototype, "url", void 0);
    __decorate([
        typeorm_1.OneToMany(function (type) { return comment_1.Comment; }, function (comment) { return comment.link; }, { cascade: true }),
        __metadata("design:type", Array)
    ], Link.prototype, "comments", void 0);
    Link = __decorate([
        typeorm_1.Entity()
    ], Link);
    return Link;
}());
exports.Link = Link;
