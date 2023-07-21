import { Router } from "express"
import { BookModel } from "../models/book.model.js"
import { validationMiddleware } from "../middleware/validation/validation.middleware.js"
import { getConnection } from "../config/db.js"

const router = Router()

export const createBook = async (req, res, next) => {

    const connection = await getConnection();


    try {
        const session = await connection.startSession();
        let createdBook
        await session.withTransaction(async () => {
            createdBook = new BookModel({ ...req.body })
            await createdBook.save();


        })
        session.endSession()
        res.status(201).send(createdBook);
    } catch (error) {
        return next(error)
    }


}

export const listBooks = async (req, res, next) => {

    try {
        const books
            = await BookModel.find();


        res.status(200).send(books)
    } catch (error) {
        return next(error)
    }

}

export const updateBook = async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body



    const connection = await getConnection()



    try {

        const session = await connection.startSession();

        let bookToUpdate

        await session.withTransaction(async () => {
            bookToUpdate = await BookModel.findByIdAndUpdate(id, { ...updates }, { returnDocument: 'after' })

        })
        session.endSession();


        res.status(200).send(bookToUpdate);
    } catch (error) {

        return next(error)
    }


}

export const deleteBook = async (req, res, next) => {
    const { id } = req.params;

    const connection = await getConnection();
    const session = await connection.startSession();

    try {
        await session.withTransaction(async () => {
            await BookModel.findByIdAndDelete(id)

        })
        session.endSession();


        res.status(204).send()
    } catch (error) {
        return next(error)
    }
}






router.route("/")
    .get(validationMiddleware("listBooksRequest", "query"), listBooks)
    .post(validationMiddleware("createBooksRequest", "body"), createBook)

router.route("/:id")
    .patch(validationMiddleware("updateBookRequest", "body"), updateBook)
    .delete(validationMiddleware("deleteBooksRequest", "params"), deleteBook)

export { router };