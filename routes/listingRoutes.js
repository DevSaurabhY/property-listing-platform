import express from "express";
import Listing from "../models/listing.js";
import wrapAsync from "../utils/wrapAsync.js";
import { isLoggedIn, validateListing, isListingOwner } from "../middleware.js";
import * as listingController from "../controllers/listings.js";

const router = express.Router();

router.route("/")
    .get(wrapAsync( listingController.index))
    .post(
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createNewListing)
    );

//create new listing (render form)
router.get("/new", 
    isLoggedIn,
    listingController.newListingForm);

router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isListingOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isListingOwner,
        isListingOwner,
        wrapAsync(listingController.deleteListing)
    );

//update listing(render form)
router.get(
    "/:id/edit", 
    isLoggedIn,
    isListingOwner,
    wrapAsync(listingController.updateListingForm)
    );

export default router;
