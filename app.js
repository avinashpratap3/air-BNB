if(process.env.NODE_ENV !="production"){
    require('dotenv').config();

}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const reviewroute=require("./routes/review.js")
const flash=require("connect-flash");
const path = require("path")
const methodoverride =require("method-override");
const engine=require("ejs-mate");
const expresserror=require("./utils/expresserror.js");
const { listingschema,reviewschema } =require("./schema.js");
const wrapasync=require("./utils/wrapasync.js");
const reviews=require("./model/review.js");
const listing=require("./model/listing.js");
const listingroute=require("./routes/listing.js");
const session=require("express-session");
const mongostore = require("connect-mongo");
const passport=require("passport");
const localpassport=require("passport-local");
const user=require("./model/user.js");
const userroute=require("./routes/user.js");
const MongoStore = require('connect-mongo');



const dburl=process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));
app.engine("ejs",engine);
app.use(express.static(path.join(__dirname,"public")));


main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dburl);

}
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));


const store=MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true,
    },
};


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localpassport(user.authenticate()));


passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;

    next();

});





app.use((err,req,res,next)=>{
    let {statuscode=500,message="Something went Wrong"}=err;
    res.render("error.ejs",{err});
    
});

app.use("/listings/:id/reviews",reviewroute);


app.use("/listings",listingroute);


app.use("/",userroute);
app.use("/privacy",(req,res)=>{
    
    res.render("privacy.ejs");

});
app.use("/terms",(req,res)=>{
    
    res.render("terms.ejs");

});

app.use("/underconstruction",(req,res)=>{
    
    res.render("underconstruction.ejs");

});


app.listen(9000,()=>{
    console.log("server is listining");
});