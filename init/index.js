const mongoose=require("mongoose");
const initdata =require("./data.js");
const listing=require("../model/listing");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


mongoose.connect(MONGO_URL).then(e=>console.log("mongoose is connected"));


const initDB =async() =>{
    await listing.deleteMany({});
   initdata.data= initdata.data.map((obj)=>({...obj,owner:"65c3f65721933cb8533ee53c"}));
    await listing.insertMany(initdata.data);
    console.log("data was intilised");

};
initDB();