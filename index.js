const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express()

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.f7pydfc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db('bikers-station').collection('categories');
        const productCollection = client.db('bikers-station').collection('products');
        const usersCollection = client.db('bikers-station').collection('users')
        const subscribersCollection = client.db('bikers-station').collection('subscribers')
        const ordersCollection = client.db('bikers-station').collection('orders')

        app.get('/categories', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result)
        });

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id
            const query = { category_id: parseInt(id) };
            const result = await productCollection.find(query).toArray();
            res.send(result)
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        });

        app.get('users/seller/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const user = await usersCollection.findOne(query)
            res.send({ isSeller: user?.role === "Seller" })
        })

        app.post('/subscribers', async (req, res) => {
            const subscriber = req.body;
            const result = await subscribersCollection.insertOne(subscriber);
            res.send(result)
        });
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result)
        })
        app.get('/orders', async (req, res) => {
            const email = req.query.email
            const filter = { email: email }
            const result = await ordersCollection.find(filter).toArray();
            res.send(result)
        });
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir)

app.get('/', async (req, res) => {
    res.send('bikers station server is running')
})

app.listen(port, () => console.log(`server is running on ${port} `))