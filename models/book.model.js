import * as mongoose from "mongoose";
import { AuthorSchema } from "./author.model.js";

const BookSchema = new mongoose.Schema({
    title: String,
    author: AuthorSchema,
    price: Number,
    isbn: Number,
    language: String,
    numberOfPages: Number,
    publisher: String
})

const BookModel = mongoose.model("Book", BookSchema)
export { BookModel }