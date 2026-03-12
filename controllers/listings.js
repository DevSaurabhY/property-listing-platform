import Listing from "../models/listing.js";
import { cloudinary } from "../cloudConfig.js";

export const index = async(req, res) => {
    const lists = await Listing.find();

    res.render("listings/index", {lists});
}

export const newListingForm = (req, res) => {
    res.render("listings/new");
}

export const createNewListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    let url = req.file.path;
    let filename = req.file.filename;

    newListing.owner = req.user._id;  // connect Listing to user
    newListing.image = {url, filename};

    await newListing.save();

    req.flash("success", "listing added successfully!")
    res.redirect("/listings");
  }

export const showListing = async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id)
        .populate("owner")
        .populate ({path: "reviews",
            populate: {path: "author"}
    });

    if (!listing) {
        req.flash("error", "listing does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show", {
        listing, 
        formatPrice: (p) => p.toLocaleString("en-IN")});
}

export const updateListingForm = async(req, res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "listing you requested for update does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit", {listing});
}

export const updateListing = async (req, res) => {

    const {id} = req.params;
    const listing = await Listing.findById(id);

    Object.assign(listing, req.body.listing);
    
    if (typeof req.file !== "undefined") {
        // A. If an OLD image exists on Cloudinary, delete it first
        if (listing.image && listing.image.filename) {
            await cloudinary.uploader.destroy(listing.image.filename);
        }

        // B. Save the NEW image details to the listing object
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

        await listing.save();

        req.flash("success", "listing updated successfully!");

        res.redirect(`/listings/${id}`);
    }

export const deleteListing = async (req, res) => {
    const {id} = req.params;

    const listing = await Listing.findById(id);

    if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
    }

    await Listing.findByIdAndDelete(id);

    req.flash("success", "listing deleted successfully!");

    res.redirect("/listings");
}