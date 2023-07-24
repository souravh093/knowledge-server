const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.ukmkwhb.mongodb.net/?retryWrites=true&w=majority`;

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

    const collageCollection = client.db("knowledgeDB").collection("colleges");
    const userCollection = client.db("knowledgeDB").collection("users");
    const applyCollection = client.db("knowledgeDB").collection("applies");
    const reviewsCollection = client.db("knowledgeDB").collection("reviews");
    const researchCollection = client.db("knowledgeDB").collection("recharch");

    app.get("/collegeshome", async (req, res) => {
      const result = await collageCollection.find().limit(3).toArray();
      res.send(result);
    });

    app.get("/colleges", async (req, res) => {
      const result = await collageCollection.find().toArray();
      res.send(result);
    });

    app.get("/collegeDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const result = await collageCollection.findOne(query);
      res.send(result);
    });

    app.post("/apply", async (req, res) => {
      const data = req.body;
      const result = await applyCollection.insertOne(data);
      res.send(result);
    });

    app.get("/applied/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await applyCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const data = req.body;
      const result = await reviewsCollection.insertOne(data);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    // app.get("/searchCollege/:searchKey", async (req, res) => {
    //   const searchKey = req.params.searchKey;

    //   const result = await collageCollection
    //     .find({
    //       college_name: { $regex: searchKey, $options: "i" },
    //     })
    //     .toArray();
    //   res.send(result);
    // });

    app.get("/profile/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await applyCollection.findOne(query);
      res.send(result);
    });

    app.put("/profiles/:email", async (req, res) => {
      const email = req.params.email;
      const data = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          candidateName: data.name,
          candidateEmail: data.email,
          college_name: data.college,
          address: data.address,
        },
      };

      const result = await applyCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    app.get("/research", async (req, res) => {
      const result = await researchCollection.find().toArray();
      res.send(result);
    });

    app.get("/researches/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await researchCollection.findOne(query);
      res.send(result);
    });

    // save users
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };

      const result = await userCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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
  res.send("Server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
