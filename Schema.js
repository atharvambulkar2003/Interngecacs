const Joi = require('joi');
module.exports.listingSchema=Joi.object({
    listings:Joi.object({
        companyName:Joi.string().required(),
        desc:Joi.string().required(),
        img:Joi.string().required(),
        role:Joi.string().required(),
        location:Joi.string().required(),
        duration:Joi.string().required(),
        stipend:Joi.number().required(),
        deadline:Joi.string().required(),
        requirements:Joi.string().required(),
        contactEmail:Joi.string().required(),
    }).required(),
});
