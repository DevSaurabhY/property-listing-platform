import express from "express";
import Listing from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import {listingSchema,reviewSchema} from "../schema.js";
import ExpressError from "../utils/ExpressError.js";

const router = express.Router();

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//show all listings
router.get(
    "/", 
    wrapAsync( async(req, res) => {
    const lists = await Listing.find();

    res.render("listings/index", {lists});
}));

//create new listing (render form)
router.get("/new", (req, res) => {
    res.render("listings/new");
});

//add new listing to db
router.post(
  "/", 
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();

    req.flash("success", "listing added successfully!")
    res.redirect("/listings");
  })
);


//show listing details
router.get(
    "/:id", 
    wrapAsync( async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");

    if (!listing) {
        req.flash("error", "listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show", {
        listing, 
        formatPrice: (p) => p.toLocaleString("en-IN")});
}));

//update listing(render form)
router.get(
    "/:id/edit", 
    wrapAsync( async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "listing you requested for update does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit", {listing});
}));

//update listing
router.put(
    "/:id", 
    validateListing,
    wrapAsync( async (req, res) => {

    const {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    req.flash("success", "listing updated successfully!");

    res.redirect(`/listings/${id}`);
}));

//delete listing
router.delete(
    "/:id", 
    wrapAsync( async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "listing deleted successfully!");

    res.redirect("/listings");
}));

export default router;
