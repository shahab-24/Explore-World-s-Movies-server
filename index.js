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