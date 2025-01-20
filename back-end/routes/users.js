import express from 'express';
import db from '../db/connection.js';
import {ObjectId} from "mongodb";

const router = express.Router()


// Get all users
router.get("/", async (req, res) => {
    let collection = await db.collection("users");
    let results = await collection.find({}).toArray();
    res.send(results).status(200)
})

// get single user by name
router.get("/:name", async (req, res) => {
    let collection = await db.collection("users");
    let query = {name: req.params.name}; // Query by name
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

// create new user
router.post("/", async (req, res) => {
    try {
        let newDocument = {
            name: req.body.name,
            pin: req.body.pin,
            entries: req.body.entries,
        }
        let collection = await db.collection("users");
        let result = await collection.insertOne(newDocument);
        res.send(result).status(204)
    } catch (err) {
        console.error("❌" + err)
        res.status(500).send("Error adding user")
    }
})

// update user profile by id
router.patch("/edit/:name", async (req, res) => {
    try {
        const query = {name: req.params.name};
        const updates = {
            $set: {
                name: req.body.name,
                pin: req.body.pin,
                entries: req.body.entries,
            }
        }
        let collection = await db.collection("users");
        let result = await collection.updateOne(query, updates);
        res.send(result).status(200)
    } catch (err) {
        console.error("❌" + err)
        res.status(500).send("Error updating user")
    }
})


// Update user times by id (corrected)
router.patch("/add/:id", async (req, res) => {
        try {
            const userId = req.params.id;
            const newEntries = req.body.entries; // Array of new time entries

            // 1. Fetch User Data
            const collection = await db.collection("users");
            const user = await collection.findOne({_id: new ObjectId(userId)}); // Assuming your id's are ObjectIDs

            if (!user) {
                return res.status(404).send("User not found");
            }

            // 2. Append New Entries
            //const updatedEntries = user.entries.concat(newEntries); // Option 1

            // 3. Update in MongoDB
            const result = await collection.updateOne(
                {_id: new ObjectId(userId)}, // changed to id
                {$push: {entries: {$each: newEntries}}} // Option 2
            );

            if (result.modifiedCount === 0) {
                return res.status(500).send("Failed to update entries");
            }

            res.status(200).send({message: "Entries updated successfully"});
        } catch (err) {
            console.error("❌", err);
            res.status(500).send("Error updating entries");
        }
    }
)


router.delete("/:id", async (req, res) => {
    try {
        const query = {id: req.params.id};
        const collection = await db.collection("users");
        let result = await collection.deleteOne(query);

        res.send(result).status(200)
    } catch (err) {
        console.error(err)
        res.status(500).send("Error deleting user")
    }
})

export default router;