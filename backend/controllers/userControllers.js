const { user } = require("../models/userModel");
const { GetRandString } = require("../utils/randomString");
const { hashPass, comparePass } = require("../utils/password");
// const { SendEmail } = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const { BadReqErr } = require("../errorclasses/badReq");
const { NotAuth } = require("../errorclasses/notauth");
const { notfound } = require("../errorclasses/notfound");
module.exports = {
  signup: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const exists = await user.findOne({ email });
      if (exists) {
        throw new BadReqErr("Email is already in use");
      }
      const otp = GetRandString();
      const User = await user.create({
        name,
        email,
        otp,
        password: hashPass(password),
      });
      //This line should be checked later
      //SendEmail(User.email, User.otp);
      res.status(201).send({ name: User.name, email: User.email });
    } catch (error) {
      throw new BadReqErr(error.message);
    }
  },
  signin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const exists = await user.findOne({ email });
      if (!exists) {
        throw new notfound("Email can not be found!");
      }
      //check if he/she is valid
      if (!exists.IsValid) {
        throw new NotAuth("Please check your email to validate");
      }
      //check password
      const validate = comparePass(password, exists.password);
      if (!validate) {
        throw new BadReqErr("invalid creds ");
      }
      const token = jwt.sign(
        {
          id: exists._id,
        },
        process.env.JWT_KEY,
        { expiresIn: "1d" }
      );
      req.session = {
        jwt: token,
      };
      res.status(200).send({
        name: exists.name,
        email: exists.email,
        id: exists._id,
        token,
      });
    } catch (error) {
      throw new BadReqErr(error.message);
    }
  },
  signout: async (req, res) => {
    req.session = null;
    res.status(200).send({
      token: null,
      currentUser: null,
    });
  },
  current: async (req, res) => {
    if (req.currentUser) {
      try {
        const { name, email, _id } = await user.findById(req.currentUser.id);

        return res.status(200).send({
          name,
          email,
          id: _id,
        });
      } catch (error) {
        throw new BadReqErr(error.message);
      }
    }
    return res.send({ currentUser: null });
  },
  verfiyUser: async (req, res) => {
    const { otp } = req.params;
    try {
      const User = await user.findOne({ otp });

      if (User) {
        User.IsValid = true;
        await User.save();
        res.send("<h1>Done Verifying Please Return Back To The App.</h1>");
      } else {
        throw new notfound("can not find the user");
      }
    } catch (error) {
      throw new BadReqErr(error.message);
    }
  },
  searchUsers: async (req, res) => {
    const { email } = req.query;
    try {
      const usersFound = await user
        .find({ email: { $regex: `^${email}`, $options: "i" } })
        .limit(10);
      res.status(200).send({ usersFound });
    } catch (error) {
      throw new BadReqErr(error.message);
    }
  },
};
