import express from "express";
import User from "../models/user.js";
import passport from "passport";
import wrapAsync from "../utils/wrapAsync.js";
import { saveRedirectUrl } from "../middleware.js";
import * as userController from "../controllers/users.js";

const router = express.Router();

router.route("/signup")
  .get(userController.showSignupForm)
  .post(wrapAsync (userController.newSignup));

router.route("/login")
  .get(userController.showLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    userController.alreadyLogin
  );

router.route("/logout")
  .get(userController.showLogoutForm)
  .post(userController.logoutUser);

export default router;