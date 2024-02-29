const express = require("express");
const { searchUsers } = require("../../controllers/userControllers");
const { Auth } = require("../../middlewares/auth");
const router = express.Router();

router.get("/search-users", Auth, searchUsers);
module.exports = { search_users: router };
