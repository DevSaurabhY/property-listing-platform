import User from "../models/user.js";

export const showSignupForm = (req, res) => {
    res.render("users/signup");
}

export const newSignup = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
    
    req.login(registeredUser, (err) => { // Automatically login after signup

        if (err) {
            return next(err);
        }
        req.flash("success", "Welcome to Wandelust!");
        res.redirect("/listings");
        });

    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

export const showLoginForm = (req, res) => {
    res.render("users/login");
}

export const alreadyLogin = (req, res) => {
    req.flash("success", "Welcome back!");

    const redirectUrl = res.locals.redirectUrl || "/listings";

    res.redirect(redirectUrl);
  }

export const showLogoutForm = (req, res) => {
    res.render("users/logout");
} 

export const logoutUser = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err)
        }
        req.flash("success", "Logged You Out");
        res.redirect("/listings");
    });
}