import app from './app'
import { connectDb } from './config/db';

// server initialization

connectDb()
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
