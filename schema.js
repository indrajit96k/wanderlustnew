const Joi=require("joi");
const listingschema=Joi.object({
    
    title:Joi.string().required(),
    description:Joi.string().required(),
    location:Joi.string().required(),
    country:Joi.string().required(),
    price:Joi.number().required().min(0),
    image: Joi.object({
        filename: Joi.string().allow("", null).optional(),
        url: Joi.string().uri().allow("", null).optional()
    }).optional()


    
})
const reviewschema=Joi.object({
    rating:Joi.number().min(1).max(5).required(),
    comment:Joi.string().required(),
    
})
module.exports = {
    listingschema,
    reviewschema
};
