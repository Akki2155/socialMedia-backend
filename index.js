import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import postRoutes from './routes/posts.js';
import userRoutes from "./routes/user.js";


const app=express();

app.use(bodyParser.json({ limit:"30mb", extended:true }));
app.use(bodyParser.urlencoded({ limit:"30mb", extended:true }));
app.use(cors());

app.use('/posts', postRoutes)
app.use('/user', userRoutes)


const CONNECTION_URL='mongodb+srv://Akki2155:akki3009@cluster0.hjhrres.mongodb.net/?retryWrites=true&w=majority';
const PORT= process.env.PORT || 4000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology:true }).then(()=>
    app.listen(PORT, ()=> console.log(`Server running on port : ${PORT}`))
).catch((err)=>
     console.log(err.message)
)


mongoose.set('strictQuery', false);

