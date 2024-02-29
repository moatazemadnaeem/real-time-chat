const express = require("express");
const { body } = require("express-validator");
const { validatereq } = require("../../middlewares/validateReq");
const { signin } = require("../../controllers/userControllers");
const router = express.Router();

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 255 })
      .withMessage("Password must be at least 6 chars long and 255 max"),
  ],
  validatereq,
  signin
);
module.exports = { signin: router };
