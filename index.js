const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());


//? from mongodb
const uri =
	`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mpbdbsx.mongodb.net/?retryWrites=true&w=majority`;

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

		const userCollection = client.db("automotiveDB").collection("user");
		const productCollection = client.db("automotiveDB").collection("product");
		const cartCollection = client.db("automotiveDB").collection("cart");

		//! create
		app.post("/products", async (req, res) => {
			const newProduct = req.body;
			console.log(newProduct);
			const result = await productCollection.insertOne(newProduct);
			res.send(result);
		});
		// user relaed apis
		app.post("/users", async (req, res) => {
			const user = req.body;
			console.log(user);
			const result = await userCollection.insertOne(user);
			res.send(result);
		});
		//cart
		app.post("/cart", async(req, res) =>{
			const product = req.body;
			const result = await cartCollection.insertOne(product);
			res.send(result);
		})

		//! read
		app.get("/products", async (req, res) => {
			const cursor = productCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});
		// user relaed apis
		app.get("/users", async (req, res) => {
			const cursor = userCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});
		// cart
		app.get("/cart", async (req, res) => {
			const cursor = cartCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});

		//! update
		app.get("/products/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await productCollection.findOne(query);
			res.send(result);
		});
		app.put("/products/:id", async (req, res) => {
			const id = req.params.id;
			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };
			const updatedproduct = req.body;
			const product = {
				$set: {
					name: updatedproduct.name,
					quantity: updatedproduct.quantity,
					supplier: updatedproduct.supplier,
					taste: updatedproduct.taste,
					category: updatedproduct.category,
					details: updatedproduct.details,
					photo: updatedproduct.photo,
				},
			};
			const result = await productCollection.updateOne(filter, product);
			res.send(result);
		});

		//! delete
		// app.delete("/product/:id", async (req, res) => {
		// 	const id = req.params.id;
		// 	const query = { _id: new ObjectId(id) };
		// 	const result = await productCollection.deleteOne(query);
		// 	res.send(result);
		// });

		//cart
		app.delete("/cart/:id", async (req, res) => {
			const id = req.params.id;
			const query = { _id: new ObjectId(id) };
			const result = await cartCollection.deleteOne(query);
			res.send(result);
		});


		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);


app.get("/", (req, res) => {
	res.send("AutoBuzz server is running");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});