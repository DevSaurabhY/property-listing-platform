import express from "express";
import Listing from "../models/listing.js";
import Review from "../models/reviews.js";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, validateReview, isReviewAuthor, saveRedirectUrl } from "../middleware.js";
import * as reviewController from "../controllers/reviews.js"

const router = express.Router({mergeParams: true});

//add review
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.addNewReview));

//delete reviews route
router.delete("/:reviewId", 
    isLoggedIn,
    isReviewAuthor,
    reviewController.deleteReview);

export default router;