import Listing from "../models/listing.js";

export const index = async(req, res) => {
    const lists = await Listing.find();

    res.render("listings/index", {lists});
}

export const newListingForm = (req, res) => {
    res.render("listings/new");
}

export const createNewListing = async (req, res, next) => {
    const newListing = new Listing(req.body.listing);

    newListing.owner = req.user._id;  // connect Listing to user

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
    await Listing.findByIdAndUpdate(id, {...req.body.listing});

    req.flash("success", "listing updated successfully!");

    res.redirect(`/listings/${id}`);
}

export const deleteListing = async (req, res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);

    req.flash("success", "listing deleted successfully!");

    res.redirect("/listings");
}