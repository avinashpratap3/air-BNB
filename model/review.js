const mongoose=require("mongoose");


const review=new mongoose.Schema({
    comment:{
        type:String,

    },
    rating:{
        type:Number,
        require:true,
        min:1,
        max:5,

    },
    createdat:{
        type:Date,
        default:Date.now(),
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",

    }
});


const reviews=mongoose.model("reviews",review);
module.exports=reviews;