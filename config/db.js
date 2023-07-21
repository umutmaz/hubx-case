import * as mongoose from "mongoose";



let connection;

export const connectDb = () => {
    const port = process.env.MONGO_PORT || 27018
    const db_name = process.env.DB_NAME || "hubx_db"
    const url = `mongodb://localhost:${port}/${db_name}`

    connection = mongoose.connect(url).catch(console.log)
}


export const getConnection = async () => {
    const resolvedCon = await Promise.resolve(connection)
    return resolvedCon
}


