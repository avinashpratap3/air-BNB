const listing=require("./model/listing");
const review=require("./model/review");

const { listingschema,reviewschema } =require("./schema.js");
const expresserror=require("./utils/expresserror.js");


module.exports.validatelisting=(req,res,next)=>{
    let{error}=listingschema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=> el.message).join("'");
        throw new expresserror(400,errMsg);
    }else{
        next();
    }
    
};

module.exports.validatereviews=(req,res,next) =>{
    let {error} =reviewschema.validate(req.body);
    if(error){
        let errrmsg=error.details.map((el)=> el.message).join(",");
        throw new expresserror(400,errrmsg);

    }else{
        next();
    }
};


module.exports.issignedin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        
        req.flash("error","you must be logged in first to create listings");
        return res.redirect("/signin");
    }
    next();
};



module.exports.saveredirecturl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log(res.locals.redirectUrl)
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
        let selected=await listing.findById(id);
        if(!selected.owner._id.equals(res.locals.curruser._id)){
            req.flash("error" , "you dont have permission to edit");
           return res.redirect(`/listings/${id}`);


        }
        next();
};

module.exports.isreviewauthor=async(req,res,next)=>{
    let {id,review_id}=req.params;
        let element=await review.findById(review_id);
        if(!element.author.equals(res.locals.curruser._id)){
            req.flash("error" , "you are not the author of this review");
           return res.redirect(`/listings/${id}`);


        }
        next();
}


