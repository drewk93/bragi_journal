'use strict'
import express from 'express';
import postgres from 'postgres';
import pg from 'pg';
import dotenv from 'dotenv';

const app = express();
app.use(express.json())
dotenv.config()

const sql = postgres(process.env.DATABASE_URL)
app.use(express.static("public")) // needs public folder with index.html, main.js, main.css

const port = process.env.PORT

const start = () => {
app.listen(port, () => {
    console.log(`listening on Port ${port}`)
})
}
start();