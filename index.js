const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



//middware
app.use(cors());
app.use(express.json());

// iceServer
// r6SPVEcS42P2ypbb 

const uri = "mongodb+srv://iceServer:r6SPVEcS42P2ypbb@cluster0.cwjeixv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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

        const productCollection = client.db('iceServer').collection('product')
        const addCartCollection = client.db('iceServer').collection('addCart')
        const reviewCollection = client.db('iceServer').collection('reviews')


        //  product related api
        app.get('/product', async (req, res) => {
            const cursor = productCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.post('/product', async (req, res) => {
            const newPost = req.body;
            console.log(newPost)
            const result = await productCollection.insertOne(newPost)
            res.send(result)
        })

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })

        // addCart related api
        app.post('/addCart', async (req, res) => {
            const newUsers = req.body;
            console.log(newUsers);
            const result = await addCartCollection.insertOne(newUsers)
            res.send(result)
        })

        app.get('/addCart', async (req, res) => {
            const cursor = addCartCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/addCart/:email', async (req, res) => {
            console.log(req.params.email);
            const email = req.params.email;
            const query = { email: email }
            const result = await addCartCollection.find(query).toArray();
            res.send(result)
            console.log(result);
        })

        // reviews api

        app.post('/reviews', async (req, res) => {
            const newUsers = req.body;
            console.log(newUsers);
            const result = await reviewCollection.insertOne(newUsers)
            res.send(result)
        })

        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { productId: id }
            const result = await reviewCollection.find(query).toArray();
            res.send(result)
          })

          app.get('/reviews', async (req, res) => {
            const cursor = reviewCollection.find()
            const result = await cursor.toArray()
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



app.get('/', (req, res) => {
    res.send('IceTales server is running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})