'use strict'
import express from 'express';
import postgres from 'postgres';
import pg from 'pg';
import dotenv from 'dotenv';

const app = express();
app.use(express.json())
dotenv.config()

const { Pool } = pg;

const pool = new Pool({
    // connectionString: process.env.DATABASE_URL
    connectionString: process.env.EXTERNAL_DATABASE_URL
})

app.use(express.static("public")) // needs public folder with index.html, main.js, main.css

app.get('/games', async(req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM games')
        res.status(200).json(result.rows)
    } catch(err){
        next(err)
    }
});


app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.type("text/plain");
    res.status(err.status || 500);
    res.send(err.message);
})



const port = process.env.PORT;
const start = () => {
    app.listen(port, () => {
        console.log(`listening on Port ${port}`)
    })
    }
    start();

console.log(process.env.EXTERNAL_DATABASE_URL)
