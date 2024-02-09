const Joi=require("joi");


module.exports.listingschema=Joi.object({
 
        title: Joi.string().required().allow(),
        description: Joi.string().required(),
        location:Joi.string().required(),
        country: Joi.string().required(),
        price:Joi.number().required(),
        image:Joi.string().allow("",null),
    
});

module.exports.reviewschema=Joi.object({
    
        rating:Joi.number().required(),
        comment:Joi.string().required(),
    
});