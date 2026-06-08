const express = require("express");
const router = express.Router();
const pool = require("../db");      //get the pool object we create in db.js containing DB info

//Endpoints--------------------------------------------------------------------------------------
//GET /kanji - fetch all saved kanji
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            //Query all kanji from the db and sort by saved date & time
            "SELECT * FROM saved_kanji ORDER BY saved_at DESC");
            //return response in json format.
            res.json(result.rows);
    }
    catch(e)
    {
        res.status(500).json({error: e.message});
    }
});

//POST /kanji - save a kanji to db
router.post("/", async (req, res) => {
    //initialize all these constants with the fields with the same name inside req's body
    const{kanji, on_readings, kun_readings, meanings, jlpt, saved_at} = req.body;
    try
    {
        //send transaction to db
        const result = await pool.query(`
            INSERT INTO saved_kanji (kanji, on_readings, kun_readings, meanings, jlpt, saved_at)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (kanji) DO NOTHING
            RETURNING *`,
            [kanji, on_readings, kun_readings, meanings, jlpt, saved_at]
        );
        res.status(201).json(result.rows[0]);
    }
    catch (e)
    {
        res.status(500).json({error: e.message});
    }
});

//DELETE /kanji/:char - remove a kanji from the db
//":char" is a placeholder where the actual kanji will go.
//so the actual endpoint request would be something like "DELETE /kanji/山"
router.delete("/:char", async (req, res) => {
    try {
        await pool.query("DELETE FROM saved_kanji WHERE kanji = $1", [req.params.char]);
        res.status(204).send();
    } 
    catch (e) 
    {
        res.status(500).json({error: e.message});
    }
});

//module.export will export the behaviour written in this script when this route is called using require()
module.exports = router;
