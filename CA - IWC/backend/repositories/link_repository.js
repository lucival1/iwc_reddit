"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var link_1 = require("../entities/link");
function getLinkRepository() {
    var connection = typeorm_1.getConnection();
    var linkRepository = connection.getRepository(link_1.Link);
    return linkRepository;
}
exports.getLinkRepository = getLinkRepository;
