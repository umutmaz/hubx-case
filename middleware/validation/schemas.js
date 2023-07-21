import Joi from "joi"


const bookSchemas = {
    updateBookRequest: Joi.object().keys({

        title: Joi.string(),
        language: Joi.string(),
        publisher: Joi.string(),
        price: Joi.number(),
        isbn: Joi.number(),
        numberOfPages: Joi.number(),
        author: Joi.object({
            name: Joi.string(),
            country: Joi.string(),
            dateOfBirth: Joi.string().isoDate()
        })
    }).or("title", "language", "publisher", "price", "isbn", "numberOfPages", "author"),

    createBooksRequest: Joi.object({

        title: Joi.string().required(),
        language: Joi.string().required(),
        publisher: Joi.string().required(),
        price: Joi.number().required(),
        isbn: Joi.number().required(),
        numberOfPages: Joi.number().required(),
        author: Joi.object({
            name: Joi.string().required(),
            country: Joi.string().required(),
            dateOfBirth: Joi.string().isoDate().required()
        }).required()

    }),
    deleteBooksRequest: Joi.object({
        id: Joi.string().required()
    }),
    listBooksRequest: Joi.object({
        limit: Joi.number().optional(),
    })
}

// imported/exported to be a dependency so that it is possible to mock the existing schemas 
// in the validationMiddleware tests
// jest mock functions does only work in dependencies
export const getSchemas = () => {
    return {
        ...bookSchemas
    }
}