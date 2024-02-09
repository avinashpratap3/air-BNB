const express=require("express");
const listing=require("../model/listing.js");

const reviews=require("../model/review.js");
const expresserror=require("../utils/expresserror.js");
const wrapasync=require("../utils/wrapasync.js");
const { listingschema,reviewschema } =require("../schema.js");
const router=express.Router({mergeParams:true});
const {validatereviews, issignedin, isreviewauthor,}=require("../middleware.js");









router.post("/",issignedin,validatereviews, wrapasync(async(req,res)=>{
    let result=reviewschema.validate(req.body);
    
    if(result.error){
        throw new expresserror(400,result.error);
    }
let selected=await listing.findById(req.params.id);
let newreview=new reviews(req.body);

newreview.author=req.user._id;


selected.reviews.push(newreview);
await newreview.save();
await selected.save();


// console.log(req.body);
req.flash("success","Review Created");

res.redirect(`/listings/${selected._id}`);

}));


router.delete("/:review_id",issignedin,isreviewauthor,wrapasync(async(req,res)=>{
    let {id,review_id} =req.params;
    await listing.findByIdAndUpdate(id,{$pull: {reviews:review_id}});
    await reviews.findByIdAndDelete(review_id);
    req.flash("success","Review Deleted");

    res.redirect(`/listings/${id}`);
}));


module.exports=router;