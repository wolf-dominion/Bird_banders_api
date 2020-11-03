const express = require('express')
const app = express()
const cors = require('cors')
const pool = require('./db')

// middleware
app.use(express.json())
app.use(cors())

// Routes
// get all orgs
app.get('/orgs', async (req, res) => {
    try {
        const allOrgs = await pool.query("SELECT * FROM org")
        res.json(allOrgs.rows)
    } catch (err) {
        console.error(err.message)
    }
})

// get only one organization
app.get('/orgs/:id', async (req, res) => {
    console.log(req.params)
    const { id } = req.params
    try {
        const org = await pool.query("SELECT * FROM org WHERE org_id = $1", [id]) 
        // $1 is a placeholder, then the 2nd arguement is what that variable is 
        //going to be
        res.json(org.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

// create an org
app.post('/orgs', async (req, res) => {
    try {
        // await
        console.log(req.body)
        const { name } = req.body
        const newOrg = await pool.query(
            "INSERT INTO org (name) VALUES ($1) RETURNING *", // returning * lets us see the data in the json response
            [name]
        ) 
        res.json(newOrg.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

// update an organization
app.put('/orgs/:id', async (req, res) => {
    try {
        const { id } = req.params // where
        const { name } = req.body // grab the new info
        const updateOrg = await pool.query(
            "UPDATE org SET name = $1 WHERE org_id = $2", [name, id]
        )
        res.json('The organization name was updated')
    } catch (err) {
        console.error(err.message)
    }
})

// delete an org
app.delete('/orgs/:id', async (req, res) => {
    try {
        const { id } = req.params
        const deleteOrg = await pool.query(
            "DELETE FROM org WHERE org_id = $1", [id]
        )
        res.json('The organization was deleted')
    } catch (err) {
        console.error(err.message)
    }
})

// listen on a specified port
app.listen(3000, ()=> {
    console.log(`Server running on port: 3000`)
})