import * as mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
    name: String,
    country: String,
    dateOfBirth: Date
})

const AuthorModel = mongoose.model("Author", AuthorSchema)

export { AuthorModel, AuthorSchema }