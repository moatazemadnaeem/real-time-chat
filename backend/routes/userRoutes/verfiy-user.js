const express = require("express");
const { verfiyUser } = require("../../controllers/userControllers");
const router = express.Router();

router.get("/verfiy-user/:otp", verfiyUser);
module.exports = { verfiyUserRoute: router };
