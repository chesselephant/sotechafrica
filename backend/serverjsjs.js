import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cors = require('cors');
//import cors from 'cors';
import { connectDB } from './db.js';
import dotenv from 'dotenv';
import {createAdmin} from './CreateAdmin.js'
import AdminOperator from "./routes/user.js"
import productRoutes from "./routes/product.js"

dotenv.config()

const app = express()
connectDB();
// Middleware : it runs  before you send a response to a client
//createAdmin();

app.use(cors());
app.use(express.json());
const PORT =  process.env.PORT ||5000
//app.use("/api/operator",AdminOperator)
app.use('/api/operators',AdminOperator);
app.use("/api/products", productRoutes);




app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`)


})