const express = require("express");
const app = express();
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 3000;



// middleweares==================
app.use(express.json())
app.use(cors())








// const uri =
//   `mongodb+srv://${process.env.DB_MOVIE_USERS}:${process.env.DB_PASS}@<cluster-url>?writeConcern=majority`;
const uri = `mongodb+srv://${process.env.DB_MOVIE_USERS}:${process.env.DB_PASS}@cluster0.3jtn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
	serverApi: {
	  version: ServerApiVersion.v1,
	  strict: true,
	  deprecationErrors: true,
	}
  });

async function run() {
  try {
    // await client.connect();

    const movieCollection = client.db("AllmoviesDB").collection('movies');
	const userCollection = client.db("MovieUsersDB").collection('users')

	app.get('/', (req,res) => {
		res.send('helllo')
	})

	// movies related API=============================

	app.get('/movies', async (req, res) => {
		
		const result = await movieCollection.find().sort({rating: -1}).limit(6).toArray()
		res.send(result);
	})
	app.get('', async (req, res) =>)
	app.post('/movies', async (req, res) => {
		const movies = req.body;
		const result = await movieCollection.insertOne(movies)
		res.send(result);
	})



	// users related API===============================
	app.get('/users', async(req,res) => {
		
		const user = await userCollection.find().toArray();
		res.send(user)
	})
	app.post('/users', async(req, res) => {
		const user = req.body;
		console.log(user)
		const result = await userCollection.insertOne(user);
		res.send(result);
})

    


    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
	res.send('movie server is running')
})

app.listen(port, () => {
	console.log(`server is running on port ${port}`)
})