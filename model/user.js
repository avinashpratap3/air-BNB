const { string } = require("joi");
const mongoose=require("mongoose");
const passport=require("passport-local-mongoose");


const userschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
   
});


userschema.plugin(passport);
module.exports=mongoose.model("user",userschema);