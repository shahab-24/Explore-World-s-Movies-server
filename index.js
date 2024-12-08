const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 3000;

// Middleware==================
app.use(express.json());
app.use(cors());

// MongoDB URI & Client Setup==================
const uri = `mongodb+srv://${process.env.DB_MOVIE_USERS}:${process.env.DB_PASS}@cluster0.3jtn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Run the MongoDB connection and define routes==================
async function run() {
  try {
    // MongoDB collections
    const movieCollection = client.db("AllmoviesDB").collection("movies");
    const userCollection = client.db("MovieUsersDB").collection("users");
    const favouriteMovieCollection = client.db("FavouriteMovieUsersDB").collection("favouriteMovies");

    app.get("/", (req, res) => {
      res.send("Hello");
    });

    // Movies related APIs=============================
    // Get all movies (6 top-rated)
    app.get("/movies", async (req, res) => {
      const result = await movieCollection.find().sort({ rating: -1 }).limit(6).toArray();
      res.send(result);
    });

    // Get all movies
    app.get("/allMovies", async (req, res) => {
      const result = await movieCollection.find().toArray();
	  console.log(result)
      res.send(result);
    });

    // Get movie details by ID
    app.get("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const newMovie = { _id: new ObjectId(id) };
      const result = await movieCollection.findOne(newMovie);
      res.send(result);
    });

    // Favourite Movies API===========================================
    // Get favourite movies by user's email
    app.get("/favouriteMovies/:email", async (req, res) => {
      const email = req.params.email;
      const result = await favouriteMovieCollection.find({ email }).toArray();
      res.send(result);
    });

    // Delete favourite movie by ID
    app.delete("/favouriteMovies/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await favouriteMovieCollection.deleteOne(query);
      res.send(result);
    });

    // Add a movie to the database
    app.post("/movies", async (req, res) => {
      const movies = req.body;
      const result = await movieCollection.insertOne(movies);
      res.send(result);
    });

    // Update movie details by ID
    app.put("/updateMovie/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedMovie = req.body;
      const result = await movieCollection.updateOne(query, { $set: updatedMovie }, options);
      res.send(result);
    });

    // Add a favourite movie
    app.post("/favouriteMovies", async (req, res) => {
      const favouriteMovies = req.body;
      const result = await favouriteMovieCollection.insertOne(favouriteMovies);
      res.send(result);
    });

    // Delete a movie by ID
    app.delete("/movies/:id", async (req, res) => {
      const id = req.params.id;
      const newMovie = { _id: new ObjectId(id) };
      const result = await movieCollection.deleteOne(newMovie);
      res.send(result);
    });

    // Users related API===========================
    // Get all users
    app.get("/users", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });

    // Add a new user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
  } finally {
    // No need to close client connection here
  }
}

run().catch(console.dir);

// Default route to test server
app.get("/", (req, res) => {
  res.send("Movie server is running");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
