const Joi = require('joi')

const articleValidationMiddleware = async (req, res, next) => {
    const payLoadArticle = req.body
    try {
        await articleValidator.validateAsync(payLoadArticle)
        next()
    } catch (error) {
        console.log(error)
        return res.status(406).send(error.details[0].message)
    }
}



const articleValidator = Joi.object({
    title: Joi.string()
        .min(5)
        .max(255)
        .required(),
    shortDescription: Joi.string()
        .min(5)
        .max(255)
        .optional(),

    year: Joi.number()
        .min(1990)
        .max(2022)
        .required(),

    isbn: Joi.string()
        .min(10)
        .max(13)
        .required(),
    price: Joi.number()
        .min(0)
        .required()
})





module.exports = articleValidationMiddleware