// step-1:
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// step-7: express cors middleware
app.use(cors());
app.use(express.json());

// step-4: create mongodb atlas database account:
/*
user: mongoDB1
password: 6fqIhgnn1VEW6L5G
*/

// step-5:
const uri = "mongodb+srv://mongoDB1:6fqIhgnn1VEW6L5G@cluster0.muank.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// step-6:
async function run() {
    try {
        await client.connect();
        const database = client.db("foodMaster");
        const usersCollection = database.collection("users");
        
        // step-9: GET api
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

        // step-11:
        app.get('/users/:id', async (req, res) => {
            const userId = req.params.id;
            const query = { _id: ObjectId(userId) };
            const user = await usersCollection.findOne(query);

            // console.log('user id', userId);
            res.send(user);
        })
        
        // step-8: POST api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            // console.log('got new user', req.body);
            // console.log('added user', result);
            res.json(result);
        });

        // step-12: update api
        app.put('/users/:id', async (req, res) => {
            const userId = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(userId) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                },
            };

            const result = await usersCollection.updateOne(filter, updateDoc, options);
            
            res.json(result);
        });

        // step-10: DELETE api
        app.delete('/users/:id', async (req, res) => {
            const userId = req.params.id;
            const query = { _id: ObjectId(userId) };
            const result = await usersCollection.deleteOne(query);
            
            // console.log('deleting with id', result);
            res.json(result);
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

// step-2:
app.get('/', (req, res) => {
    res.send('This is from node js, express js, mongoDB, crud');
});

// step-3:
app.listen(port, () => {
    console.log(`This is listening from: ${port}`);
});