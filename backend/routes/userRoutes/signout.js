const express = require("express");
const { signout } = require("../../controllers/userControllers");
const { Auth } = require("../../middlewares/auth");
const router = express.Router();

router.get("/signout", Auth, signout);
module.exports = { signout: router };
