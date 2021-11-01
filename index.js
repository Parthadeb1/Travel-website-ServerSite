const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');
const app = express()
const port = 5000


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fump7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('relaxTravel');
        const packageCollection = database.collection('packages')
        const orderCollection = database.collection('order')
        const guidesCollection = database.collection('guides')

        //Get guide api
        app.get('/guides', async(req, res)=>{
          const cursor = guidesCollection.find({});
          const guides = await cursor.toArray();
          res.send(guides)
        })

        //get api 
        app.get('/packages', async(req, res)=>{
          const cursor = packageCollection.find({});
          const packages = await cursor.toArray();
          res.send(packages);
        });

        //get single package 
        app.get('/packages/:id', async(req, res)=>{
          const id =req.params.id;
          console.log("Get the single package",id);
          const query ={_id: ObjectId(id)};
          const package = await packageCollection.findOne(query);
          console.log(package);
          res.json(package);
        })


        //post api 
        app.post('/packages', async (req, res) =>{
          const package = req.body;
          console.log('hit the post', package);
          const result = await packageCollection.insertOne(package);
          console.log(result);

          res.json(result);
        })

        //get order api
        app.get('/myOrder', async (req,res) => {
          const email = req.body.email;
          console.log('got email', email);
          const query ={email:email};
          const order = await orderCollection.find(query);
          console.log(order);
          res.json(order);
        })

        //add order post api 
        app.post('/myOrder', async (req, res) =>{
          const order = req.body;
          console.log('hit the post', order);
          const result = await orderCollection.insertOne(order);
          console.log(result);

          res.json(result);
        })

        //delete api
        app.delete('/packages/:id', async(req, res) => {
          const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const result= await packagesCollection.deleteOne(query);
          res.json(result);
        })
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send(' this is from relax travel server.')
})

app.listen(port, () => {
  console.log('Running relax-travel server on port', port)
})