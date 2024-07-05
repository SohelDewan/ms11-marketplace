const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
        const result = await jobsCollection.find().toArray();
        res.send(result);
    })
    // Get a single job from the db using id
    app.get('/job/:id', async (req, res)=>{
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await jobsCollection.findOne(query);
      res.send(result);
    })
    // Save a bid data in mongodb
    app.post('/bid', async (req, res)=>{
      const bidData = req.body;
      const result = await bidsCollection.insertOne(bidData);
      res.send(result);
    })
    // Save a job data in mongodb
    app.post('/job', async (req, res)=>{
      const jobData = req.body;
      const result = await jobsCollection.insertOne(jobData);
      res.send(result);
    })
    // Get all jobs posted by specific user
    app.get('/jobs/:email', async (req, res)=>{
      const email = req.params.email;
      const query = { 'buyer.email': email } 
      //This is how to access nested objects in db, if db buyer email == email then my posted job
      const result = await jobsCollection.find(query).toArray();
      res.send(result);
    })
    // Delete jobs posted by specific user from db
    app.delete('/job/:id', async (req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) } // if db buyer email == email then my posted job
      const result = await jobsCollection.deleteOne(query);
      res.send(result);
    })
    
    // Update a job data in mongodb
    app.put('/job/:id', async (req, res)=>{
      const id = req.params.id;
      const jobData = req.body;
      const query = {_id: new ObjectId(id) }
      const options = {upsert: true}
      const updateDoc = {
        $set:{
          ... jobData,
        } ,
      }
      const result = await jobsCollection.updateOne(query, updateDoc, options);
      res.send(result);
    })
        // get all bids for a user by email from db
        app.get('/my-bids/:email', async (req, res) => {
          const email = req.params.email
          const query = { email }
          const result = await bidsCollection.find(query).toArray()
          res.send(result)
        })
     //Get all bid requests from db for job owner
     app.get('/bid-requests/:email',  async (req, res) => {
      const email = req.params.email
      const query = { 'buyer.email': email }
      const result = await bidsCollection.find(query).toArray()
      res.send(result)
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
