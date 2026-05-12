require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = 8000;
const uri = process.env.MONGODB_SRV;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


app.use(express.json());
app.use(cors());

app.get('/', (req, res)=>{
    res.send('Hello, World!');
})

app.get('/users', (req, res)=>{
    res.send(users);
});

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`); 
}); 

const run = async () => {
    try {
        await client.connect()
        const database = client.db("Data")
        const dataCollection = database.collection("DataBase")

        app.get('/recentflows', async (req, res)=>{
            const cursor = dataCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })


        app.delete('/recentflows/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const result = await dataCollection.deleteOne(query)
            res.send(result)

        })

        app.post('/recentflows', async (req, res)=>{
            const newTask = req.body;
            const result = await dataCollection.insertOne(newTask)
            res.send(result)
            console.log(inserted)
        })

        await client.db("admin").command({ ping: 1 });
    }
    catch (error) {        
        console.error('Error connecting to MongoDB:', error);
    }
};

run().catch(console.dir);