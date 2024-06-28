const express = require('express');
const cors = require('cors');

require('dotenv').config()
const port = process.env.PORT || 5000;

const app = express();
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174' ],
    credentials: true,
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i2cqtwl.mongodb.net/?appName=Cluster0`;

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
    const jobsCollection = client.db('innovator').collection('jobs');
    const bidsCollection = client.db('innovator').collection('bids');
    app.get('/jobs', async (req, res) => {
        const jobs = await jobsCollection.find().toArray();
        res.send(jobs);
    })
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res)=>{
    res.send('Hello from independent innovation........')
})

app.listen(port, ()=> console.log('listening on port '+port));
