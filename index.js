import express from 'express';
import cors from 'cors';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.SECRET_NAME}:${process.env.SECRET_KEY}@cluster0.kt5fy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db('Products-list');
    const shopProducts = database.collection('products');

    // fing one product
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const product = await shopProducts.findOne({ _id: new ObjectId(id) });
      res.send(product);
    });

    // updating product
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const updatedProduct = req.body;
      const updateDoc = {
        $set: updatedProduct,
      };
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const result = await shopProducts.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // products adding
    app.post('/products', async (req, res) => {
      const product = req.body;
      const result = await shopProducts.insertOne(product);
      res.send(result);
    });

    // products getting
    app.get('/products', async (req, res) => {
      const products = await shopProducts.find().toArray();
      res.send(products);
    });

    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
