import express from "express";
import User from "../models/user.js";
import passport from "passport";
import wrapAsync from "../utils/wrapAsync.js";


const router = express.Router();


router.get("/signup", (req, res) => {
    res.render("users/signup");
});

router.post("/signup", wrapAsync (async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
    
        req.flash("success", "Welcome to Wandelust!");
        res.redirect("/listings");
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/listings");
  }
);

export default router;