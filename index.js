// ecommerceclind
// gZxsM8RItgwMWgn3

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5010;

app.use(cors());
app.use(express.json())




const uri = "mongodb+srv://ecommerceclind:gZxsM8RItgwMWgn3@cluster0.ot66xwb.mongodb.net/?retryWrites=true&w=majority";

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
        const amazonCollection = client.db("amazonDB").collection("amazon");
        const sliderCollection = client.db("sliderDB").collection("slider");
        const cardCollection = client.db("sliderDB").collection("cards");



        app.post('/amazon', async (req, res) => {
            const amazons = req.body
            console.log(amazons)
            const result = await amazonCollection.insertOne(amazons)
            res.send(result)
        })

        app.get('/amazonall', async (req, res) => {
            const amazons = await amazonCollection.find().toArray()
            res.send(amazons)
        })

        app.delete("/delete-cart/:id", async (req, res) => {
            const id = req.params.id;

            const filter = { productId: id };
            const result = await cardCollection.deleteOne(filter);

            res.send(result)
        })


        app.get('/amazon/:brands', async (req, res) => {
            const newbrands = req.params.brands;
            const result = await amazonCollection.find({ brand_name: newbrands }).toArray();
            res.send(result)
        })

        app.get('/product/:id', async (req, res) => {
            const products = req.params.id
            const findid = { _id: new ObjectId(products) }
            const result = await amazonCollection.findOne(findid)
            res.send(result)

        })

        app.get('/slider/:names', async (req, res) => {
            const newSliders = req.params.names;
            const result = await sliderCollection.find({ name: newSliders }).toArray();
            res.send(result)


        })

        app.get('/amazon/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await amazonCollection.findOne(query)
            res.send(result)
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const product = req.body
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: false };
            const updateproduct = {
                $set: product
            }
            console.log(id, product)
            const result = await amazonCollection.updateOne(filter, updateproduct, options)
            res.send(result)
        })

        app.post('/addcard', async (req, res) => {
            const card = req.body;
            const result = await cardCollection.insertOne(card)
            res.send(result)
        })

        app.get("/mycard", async (req, res) => {

            const cards = await cardCollection.find().toArray()
            res.send(cards)


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
    res.send('server is running now')
})

app.listen(port, () => {
    console.log(`my port is running ${port}`)
})