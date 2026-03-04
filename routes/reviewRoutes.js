import express from "express";
import Listing from "../models/listing.js";
import Review from "../models/reviews.js";
import wrapAsync from "../utils/wrapAsync.js";
import {listingSchema,reviewSchema} from "../schema.js";
import ExpressError from "../utils/ExpressError.js";

const router = express.Router({mergeParams: true});

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//add review
router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();

    req.flash("success", "Review added successfully!");

    res.redirect(`/listings/${listing._id}`);
}));

//delete reviews route
router.delete("/:reviewId", async (req, res, next) => {
  const { id, reviewId } = req.params;

  // Remove review reference from listing
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  // Delete review document
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review deleted successfully!");

  res.redirect(`/listings/${id}`);
});

export default router;