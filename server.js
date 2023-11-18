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

const test = 0;

app.use(express.static("public")) // needs public folder with index.html, main.js, main.css


app.get('/games', async(req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM games')
        res.status(200).json(result.rows)
    } catch(err){
        next(err)
    }
});

app.get('/games/:game_name', async(req, res, next) => {
    const game_name = req.params.game_name
    try {
        const result = await pool.query('SELECT * FROM quests INNER JOIN games ON quests.game_id = games.game_id WHERE games.game_name = $1', [game_name])
        res.status(200).json(result.rows)
    } catch(err){
        next(err)
    }
});

app.get('/quests/:quest_title', async(req, res, next) => {
    const quest_title = req.params.quest_title
    console.log(quest_title)
    try {
        const result = await pool.query('SELECT * FROM quests INNER JOIN quest_objectives ON quest_objectives.quest_id = quests.quest_id WHERE quests.quest_title = $1', [quest_title]);
        res.status(200).json(result.rows)
    } catch(err){
        next(err)
    }
}) 

app.get('/users', async(req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM users')
        res.status(200).json(result.rows)
    } catch(err){
        next(err)
    }
});

app.post('/quests/assigned_quests', async (req, res, next) => {
    const newAssignedQuest = req.body;
    try {
      if (!newAssignedQuest.username || !newAssignedQuest.quest_title) {
        res.status(400).json({ error: 'Invalid Request' });
      } else {
        // First pool.query to insert into assigned_quests and retrieve quest_id
        const result1 = await pool.query(
          'INSERT INTO assigned_quests(completed, user_id, quest_id) SELECT false, (SELECT user_id FROM users WHERE username = $1 LIMIT 1), (SELECT quest_id FROM quests WHERE quest_title = $2 LIMIT 1) RETURNING *',
          [newAssignedQuest.username, newAssignedQuest.quest_title]
        );
  
        const newAssignedQuestId = result1.rows[0].assigned_quest_id;
        const questId = result1.rows[0].quest_id;
        const userId = result1.rows[0].user_id;
  
        // Second pool.query to fetch quest_objective_id values based on quest_id
        const result2 = await pool.query(
          'SELECT quest_objective_id FROM quest_objectives WHERE quest_id = $1',
          [questId]
        );
  
        const questObjectiveIds = result2.rows.map(row => row.quest_objective_id);
  
        // Insert into assigned_objectives based on quest_id and assigned_quest_id
        for (const questObjectiveId of questObjectiveIds) {
          await pool.query(
            'INSERT INTO assigned_objectives(completed, assigned_quest_id, quest_objective_id) VALUES (false, $1, $2)',
            [newAssignedQuestId, questObjectiveId]
          );
        }
  
        // Third pool.query to insert into the journal table
        await pool.query(
          'INSERT INTO journal(content, user_id, assigned_quest_id) VALUES ($1, $2, $3)',
          ['', userId, newAssignedQuestId]
        );
  
        // Include the new assignment data along with the IDs in the response
        const response = {
          message: 'Assignment created successfully',
          assigned_quest_id: newAssignedQuestId,
          quest_id: questId
        };
  
        res.status(201).json(response);
      }
    } catch (err) {
      next(err);
    }
  });

app.post('/login', async (req, res) =>{
    const {username, password} = req.body
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 1){
            const user = result.rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (isPasswordValid){
                console.log('Login Successful')
                res.status(200).json({message: 'Login Successful'});
            } else {
                console.log('Authentication Failed')
                res.status(401).json({message: 'Authentication Failed'})
            }
        } else {
            console.log('User not found')
            res.status(404).json({ message: 'User not found'})
        }
    } catch (err){
        next (err)
    }
})

app.use((err,req,res,next)=>{
    console.log(err.stack);
    res.type("text/plain");
    res.status(err.status || 500);
    res.send(err.message);
})



const port = process.env.PORT;

    app.listen(port, () => {
        console.log(`listening on Port ${port}`)
    })
    

