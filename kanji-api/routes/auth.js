const express = require("express");
const router = express.Router();
const bcrypt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const pool = require("../db.js");
require("dotenv").config();

//Endpoints--------------------------------------------------------------------------------------------
//POST /auth/register
router.post("/register", async (req, res) => {
    //get email and password from req and store them in variables "email" and "password"
    const {email, password} = req.body;
    
    if(!email || !password)
        return res.status(400).json({error: "Email and password required"});

    try 
    {
        //"10" is the 'salt rounds' or how many times the password is scrambled up
        const password_hash = await bcrypt.hash(password, 10);
        
        //query database (accessed through pool)
        const result = await pool.query(`
                INSERT INTO users (email, password_hash)
                VALUES ($1, $2) RETURNING id, email`,
                [email, password_hash]
            );
        const user = result.rows[0];

        //encode the user's id and email into a token, which will be read and decoded by middleware/auth.js
        //the token is then signed using JWT_SECRET
        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRES_IN}
        );
        res.status(201).json({token});
    }
    catch(e)
    {
        if (e.code === "23505")
            return res.status(409).json({error: "Email already registered"});
        res.status(500).json({error: e.message});
    }
});

//POST /auth/login
router.post("/login", async (req, res) => {
    //
});
