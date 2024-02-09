const express=require("express");
const router=express.Router();
const wrapasync=require("../utils/wrapasync.js");
const { listingschema,reviewschema } =require("../schema.js");
const expresserror=require("../utils/expresserror.js");
const listing=require("../model/listing.js");
const {issignedin, isOwner,validatelisting}=require("../middleware.js");
const multer  = require('multer');
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });
const mbxgeocoding=require("@mapbox/mapbox-sdk/services/geocoding.js");
const maptoken=process.env.MAP_TOKEN;
const geocodingclient=mbxgeocoding({accessToken:maptoken});








router.get("/",wrapasync(async (req,res)=>{
    const alllisting =await listing.find({});
    res.render("index.ejs",{alllisting});
    }));
    
    router.get("/new", issignedin ,(req,res)=>{
       
        
        res.render("new.ejs");
    });
    
    router.get("/:id",wrapasync(async(req,res,next)=>{
        let {id}=req.params;
        
        const selected=await listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
        if(!selected) {
            req.flash("error","listing does not exist!");
            res.redirect("/listings");

        }
        console.log(selected);
        res.render("show.ejs",{selected});
    }));


    router.post("/",issignedin,upload.single("image"),validatelisting,wrapasync(async(req,res,next)=>{
       let response=await geocodingclient.forwardGeocode({
            query: 'kanpur, India',
            limit: 2
          })
            .send();
            console.log(response);
           
        
        let url=req.file.path;
        let filename=req.file.filename;
       
        
        
       
            let {title,description,image,price,location,country}=req.body;
            image={url,filename};
            console.log(image);

    
           const temp= await listing.create(
            {title,
            description,
            image,
            price,
            location,
            country,
            owner:req.user._id,
            });
            
          
           req.flash("success","New listing created:");
            res.redirect("/listings");
       
        
      
        
    }
    ));
    router.post("/",upload.single("image"),(req,res)=>{
        res.send(req.file);
    });


    
    router.get("/:id/edit",issignedin,isOwner,wrapasync(async(req,res)=>{
        let {id}=req.params;
        const selected=await listing.findById(id);
        res.render("edit.ejs",{selected});
    }));
    
    router.put("/:id",issignedin,isOwner,upload.single("image"),validatelisting,wrapasync(async(req,res)=>{

        let {id}=req.params;
        let temp=await listing.findByIdAndUpdate(id,{...req.body});
        if(typeof req.file!=="undefined"){
            let url=req.file.path;
            let filename=req.file.filename;
            temp.image={url,filename};
            await temp.save();

        }

       

        req.flash("success","Listing Updated");

        res.redirect(`/listings/${id}`)
    }));
    
    router.delete("/:id",wrapasync(async(req,res)=>{
        let {id}=req.params;
        await listing.findByIdAndDelete(id);
        req.flash("success","Listing Deleted");
        
        res.redirect("/listings");
    
    
    }));

    module.exports=router;