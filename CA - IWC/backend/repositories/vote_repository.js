"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var vote_1 = require("../entities/vote");
function getVoteRepository() {
    var connection = typeorm_1.getConnection();
    var voteRepository = connection.getRepository(vote_1.Vote);
    return voteRepository;
}
exports.getVoteRepository = getVoteRepository;
