const express=require("express");
const router =express.Router();
const user=require("../model/user.js");
const wrapasync=require("../utils/wrapasync.js")
const passport=require("passport");
const {saveredirecturl,issignedin} = require("../middleware.js");


router.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});


router.get("/signup",(req,res)=>{
    const query=req.body;
    console.log(query);
    res.send("wait")
});


router.post("/signup",wrapasync(async(req,res)=>{
    try{


        let {username,email,password}=req.body;
    const newuser=new user({username,email});
    const registereduser=await user.register(newuser,password);
    req.login(registereduser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to aviBNB");
    res.redirect("/listings");
    });
    // console.log(registereduser);
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }




}));
router.get("/signin",(req,res)=>{
    res.render("signin.ejs");
});

router.post("/signin", saveredirecturl ,passport.authenticate("local",{failureRedirect: "/signin", failureFlash: true }) ,async(req,res)=>{
    req.flash("sucess","Welcome Back!");
    // console.log(res.locals.redirectUrl);
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

});
router.get("/signout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);

        }
        req.flash("success","signed out successfull");
        res.redirect("/listings");
        
    }
    );
});


module.exports=router;