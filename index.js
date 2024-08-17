const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


// midleware
app.use(cors())
app.use(express.json())


// database
// console.log(process.env.DB_USER);
const uri = "mongodb+srv://Job-task:5UlgexerNLRqic5n@cluster0.yl5czei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const serviceCollection = client.db('Job_Data').collection('services')

        app.get('/services', async (req, res) => {
            // const data = req.body;
            const filter = req.query;
            // console.log(query);
            const query = {};
            const options = {
                sort: {
                    price: filter.sort === 'asc' ? 1 : -1
                }
            }
            const cursor=serviceCollection.find(query,options);
            const result = await cursor.toArray();
            res.send(result);
        })
        // total count data
        app.get('/count', async (req, res) => {
            const count = await serviceCollection.estimatedDocumentCount();
            res.send({ count: count })
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Job is running');
})

app.listen(port, () => {
    console.log(`Job server is running on port ${port}`);
})