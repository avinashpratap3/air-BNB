
const mongoose= require("mongoose");
const review=require("./review.js")

const listingschema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:{
        url:String,
        filename:String,

    },
    price:{
        type:Number,
        required:true,
    },
    location:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
    },
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"reviews",

    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    // category:{
    //     type:String,
    //     enum:["mountain","beach","forts","farm","camping",]
    // },




});



listingschema.post("findOneAndDelete" ,async(listing)=>{
    if(listing){
        await review.deleteMany({_id: {$in: listing.reviews}});
    }
});
const listing=mongoose.model("listing",listingschema);


module.exports =listing;

