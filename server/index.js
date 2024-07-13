const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());

// verify jwt middleware
const verityToken = (req, res, next) => {
  const token = req.cookies?.token;
  if(!token) return res.status(401).send({ message: 'Unauthorize access or Invalid token'})
  if(token){
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
      if(err) {
        return console.log(err)
      }
      console.log(decoded, 'email from token')
      req.user = decoded;
      next();
    })
  }
}

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
    // jwt(json web token) generates
    app.post('/jwt', async (req, res) => {
      const user = req.body
      console.log("Dynamic", user)
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '40d',
      })
      res.cookie('token', token, {
        httpOnly: true,
        secure:  process.env.NODE_ENV === 'production',
        sameSite:process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      }).send({ success: true })
    })
    // Clear token with logout
    app.get('/logout', (req, res) => {
      res.clearCookie('token', {
        httpOnly: true,
        secure:  process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production'? 'none' :'strict',
        maxAge:0,
      }).send({ success: true }); 
    })
    // Get all the jobs from mongodb
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
      // check if we already have the same bid for the job
      const query = {
        email: bidData.email,
        jobId: bidData.jobId,
      }
      const alreadyApplied = await bidsCollection.findOne(query)
      // console.log(alreadyApplied)
      if(alreadyApplied){
        return res
        .status(400)
        .send( 'Already applied for this job' )
      }
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
    app.get('/jobs/:email', verityToken, async (req, res)=>{
      const tokenEmail   = req.user.email
      const email = req.params.email;
      if(tokenEmail !== email){
        return res.status(403).send({ message: 'Forbidden' })  // if user trying to access other user's job or token
      }
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
    // Update status bid request
    app.patch('/bid/:id', async (req, res) =>{
      const id = req.params.id
      const status = req.body
      const query = { _id: new ObjectId(id)}
      const updateDoc = {
        $set: status,
      }
      const result = await bidsCollection.updateOne(query, updateDoc)
      res.send(result)
    })
        // Get all the jobs from mongodb
        app.get('/all-jobs', async (req, res) => {
          const size = parseInt(req.query.size)
          const page = parseInt(req.query.page) - 1
          const filter = req.query.filter
          const sort = req.query.sort
          // console.log( size, page)
          let query = {}
          if(filter) query = { category:filter}
          let options = {}
          if(sort) options = {sort: {deadline : sort === 'asc' ?  1: -1}}
          const result = await jobsCollection.find(query, options).skip(page * size).limit(size).toArray();
          res.send(result);
      })
          // Get all the jobs from mongodb
    app.get('/jobs-count', async (req, res) => {
      const filter = req.query.filter
      let query = {}
      if(filter) query = { category:filter}
      const count = await jobsCollection.countDocuments(query);
      res.send({count});
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
