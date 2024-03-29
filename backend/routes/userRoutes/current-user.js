const express = require("express");
const { current } = require("../../controllers/userControllers");
const { Auth } = require("../../middlewares/auth");
const router = express.Router();

router.get("/current-user", Auth, current);
module.exports = { current: router };
