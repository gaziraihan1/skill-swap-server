require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASS}@cluster-1.atolsgl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-1`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
    try{
        await client.connect();
        const db = client.db('skillswap');
        const usersCollection = db.collection("users");

        app.post("/jwt", async (req, res) => {
            const user = req.body;
            if(!user.email) {
                return res.status(400).send({message: "Email is required"})
            }

            const token = jwt.sign(user, process.env.JWT_SECRET, {expiresIn: '2d'})
            res.send(token)
        });

        app.post('/users', async (req, res) => {
  const user = req.body;

  const existing = await usersCollection.findOne({ email: user.email });

  if (existing) {
    return res.send({ message: 'User already exists' });
  }

  const result = await usersCollection.insertOne(user);

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.send({ insertedId: result.insertedId, token });
});

app.get("/users/role/:email",  async (req, res) => {
      const email = req.params.email;

    //   if (req.user.email !== email) {
    //     return res.status(403).send({ message: "Forbidden: Email mismatch" });
    //   }

      const user = await usersCollection.findOne({ email });

      if (!user) return res.status(404).send({ message: "User not found" });

      res.send({ role: user.role });
    });


        await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    }
    catch{

    }
    finally{
// await client.close();
    }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});