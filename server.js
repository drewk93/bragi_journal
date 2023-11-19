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

// SELECT QUEST AND LIST OBJECTIVES

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
        res.status(200).json(result.rows);
    } catch(err){
        next(err)
    }
});

// Quest Assignment

app.get('/check_assignment/:user_id/:quest_title', async (req, res) => {
    const user_id = req.params.user_id;
    const quest_title = req.params.quest_title;

    try {
        // Check if the assignment exists in the database
        const result = await pool.query(
            'SELECT EXISTS (SELECT 1 FROM assigned_quests WHERE user_id = $1 AND quest_id = (SELECT quest_id FROM quests WHERE quest_title = $2))',
            [user_id, quest_title]
        );

        // Extract the assignment existence status
        const exists = result.rows[0].exists;

        if (exists) {
            // If the assignment exists, fetch the assigned_quest_id
            const result2 = await pool.query(
                'SELECT assigned_quest_id FROM assigned_quests WHERE user_id = $1 AND quest_id = (SELECT quest_id FROM quests WHERE quest_title = $2)',
                [user_id, quest_title]
            );
            const assigned_quest_id = result2.rows[0].assigned_quest_id;

            // Send the result with assigned_quest_id as a JSON response
            const response = {
                user_id: user_id,
                assigned_quest_id: assigned_quest_id,
                exists: exists
            };
            res.status(200).json(response);
        } else {
            // If the assignment doesn't exist, send a basic response with exists status
            res.status(200).json({ exists: exists });
        }
    } catch (error) {
        console.error('Error checking assignment:', error);
        res.status(500).json({ error: 'Internal Server Error' });

        // Properly log user_id and quest_title
        console.log(user_id);
        console.log(quest_title);
    }
});

// ACCEPT QUEST

app.post('/quests/assigned_quests', async (req, res, next) => {
    const newAssignedQuest = req.body;
    try {
      if (!newAssignedQuest.user_id || !newAssignedQuest.quest_title) {
        res.status(400).json({ error: 'Invalid Request' });
      } else {
        // First pool.query to insert into assigned_quests and retrieve quest_id
        const result1 = await pool.query(
            'INSERT INTO assigned_quests(completed, user_id, quest_id) SELECT false, (SELECT user_id FROM users WHERE user_id = $1 LIMIT 1), (SELECT quest_id FROM quests WHERE quest_title = $2 LIMIT 1) RETURNING *',
            [newAssignedQuest.user_id, newAssignedQuest.quest_title]
        );
  
        const newAssignedQuestId = result1.rows[0].assigned_quest_id;
        const questId = result1.rows[0].quest_id;
        const user_id = result1.rows[0].user_id;
  
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
        const result3 = await pool.query(
          'INSERT INTO journal(user_id, assigned_quest_id) VALUES ($1, $2) RETURNING *',
          [user_id, newAssignedQuestId]
        );
    
  
        // Include the new assignment data along with the IDs in the response
        const response = {
          message: 'Assignment created successfully',
          user_id: user_id,
          assigned_quest_id: newAssignedQuestId,
          quest_id: questId
        };
  
        res.status(201).json(response);
      }
    } catch (err) {
      next(err);
    }
  });

app.post('/login', async (req, res, next) =>{
    const {username, password} = req.body
    
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 1){
            const user = result.rows[0];
            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (isPasswordValid){
                console.log('Login Successful')
                res.status(200).json({ message: 'Login Successful', user_id: user.user_id });
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


app.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }
        const hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hash]
        );

        // Send a success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/journal/:user_id/:assigned_quest_id', async (req, res, next) => {
    const user_id = parseInt(req.params.user_id)
    const assigned_quest_id = parseInt(req.params.assigned_quest_id)
    console.log(user_id)
    console.log(assigned_quest_id)
    try {
        const result = await pool.query(
            'SELECT * FROM journal WHERE journal.assigned_quest_id = $1 AND journal.user_id = $2',
            [assigned_quest_id, user_id]
        )
        res.status(200).json(result.rows);
    }catch (error){
        console.error(error)
        res.status(404).json({error: 'Resource Not Found'})
    }
})

app.get('/assigned_objectives/:assigned_quest_id', async (req, res, next) => {
    const assigned_quest_id = parseInt(req.params.assigned_quest_id);

    try {
        const result = await pool.query(
            'SELECT * FROM assigned_objectives WHERE assigned_quest_id = $1',
            [assigned_quest_id]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Assigned Objectives Not Found' });
            return;
        }

        const quest_objective_id = result.rows[0].quest_objective_id;

        const result2 = await pool.query(
            `SELECT 
                quest_objectives.quest_objective_id, 
                quest_objectives.objective_title, 
                quest_objectives.objective_description, 
                quest_objectives.quest_id,
                assigned_objectives.assigned_quest_objective_id,
                assigned_objectives.completed,
                assigned_objectives.assigned_quest_id
            FROM 
                quest_objectives
            INNER JOIN 
                assigned_objectives 
            ON 
                quest_objectives.quest_objective_id = assigned_objectives.quest_objective_id
            WHERE 
                quest_objectives.quest_objective_id = $1`,
            [quest_objective_id]
        );

        res.status(200).json(result2.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/quests/assigned_quests/:assigned_quest_id', async (req, res, next) => {
    const assigned_quest_id = parseInt(req.params.assigned_quest_id);

    try {
        const result = await pool.query('DELETE FROM assigned_quests WHERE assigned_quest_id = $1 RETURNING *', [assigned_quest_id]);

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Assigned Quest Not Found' });
        } else {
            res.json({ message: 'Assigned Quest Dropped Successfully', droppedQuest: result.rows[0] });
        }
    } catch (error) {
        console.error('Error dropping quest', error);
        res.status(500).json({ message: 'Error dropping quest' });
    }
});



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
    
