'use strict'

// MODULE IMPORTS
import express from 'express';
import postgres from 'postgres';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors'
import bcrypt from 'bcrypt'

// EXPRESS
const app = express();
app.use(express.json())
app.use(express.static('public'))

// CORS & DOTENV
app.use(cors())
dotenv.config()

// PG

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
    // connectionString: process.env.EXTERNAL_DATABASE_URL
})

app.use(express.static("public")) // needs public folder with index.html, main.js, main.css


  // Password Functionality
  const saltRounds = 10;
  const myPlaintextPassword = 's0/\/\P4$$w0rD';
  const someOtherPlaintextPassword = 'not_bacon';

  // Create and Store
      bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash){
          
      })

// Load and check

// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
});
bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    // result == false
});





app.get('/login', async(req,res, next) =>{

})

app.get('/games', async(req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM games')
        res.status(200).json(result.rows)
    } catch(err){
        next(err)
    }
});

app.get('/users', async(req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM users')
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
