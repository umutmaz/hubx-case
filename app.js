import express from "express";
import cors from "cors";
import swagger from "swagger-ui-express";
import * as fs from "fs";

import * as dotenv from "dotenv"
import { router as booksRouter } from './routes/books.route.js'
import ErrorHandler from "./middleware/error/error.middleware";

// app configuration 

dotenv.config();

const swaggerJSON = JSON.parse(fs.readFileSync('./swagger.json'));



const app = express()
app.use(cors())
app.use(express.json())

app.get("/ping", async (_, res) => {
    res.json({ message: "pong" })
})
app.use("/docs", swagger.serve, swagger.setup(swaggerJSON))
app.use("/books", booksRouter)

// should be the last one 
app.use(ErrorHandler)
export default app;