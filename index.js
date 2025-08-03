require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASS}@cluster-1.atolsgl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-1`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

var admin = require("firebase-admin");

var serviceAccount = require("./firebase-admin-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const verifyToken = async(req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  try{
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  }
  catch(error) {
    return res.status(403).send({message: "Forbidden access"})
  }
  
};

const run = async () => {
  try {
    await client.connect();
    const db = client.db("skillswap");
    const usersCollection = db.collection("users");
    const offersCollection = db.collection("offers");



    app.post("/users",  async (req, res) => {
      const user = req.body;


      const existing = await usersCollection.findOne({ email: user.email });

      if (existing) {
        return res.send({ message: "User already exists" });
      }

      const result = await usersCollection.insertOne(user);

      
      res.send({ insertedId: result.insertedId});
    });
    app.get("/users",async(req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result)
    })

app.get('/users/role/:email',verifyToken, async (req, res) => {
  const email = req.params.email;
  const user = await usersCollection.findOne({ email });

  if (!user) return res.status(404).send({ message: 'User not found' });

  res.send({ role: user.role });
});

app.get("/users/:email", async(req, res) => {
  const email = req.params.email;
  
  const user = await usersCollection.findOne({email});
  res.send(user);
})
app.put('/users/:email', async (req, res) => {
  const email = req.params.email;
  const updatedProfile = req.body;
  delete updatedProfile._id;

  const result = await usersCollection.updateOne(
    { email },
    { $set: updatedProfile },
    { upsert: true }
  );

  res.send(result);
});

app.post("/offers", async (req, res) => {
  try {
    const offer = req.body;
    const result = await offersCollection.insertOne(offer);
    res.send(result);
  } catch (error) {
    console.error("Error adding offer:", error);
    res.status(500).send({ error: "Failed to add offer" });
  }
})

app.get("/offers", async (req, res) => {
  const userEmail = req.query.userEmail; 
  try {
    const query = userEmail ? { userEmail } : {};
    const offers = await offersCollection.find(query).toArray();
    res.send(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res.status(500).send({ error: "Failed to fetch offers" });
  }
});



app.get("/offers-collection", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const search = req.query.search || '';
  const skill = req.query.skill || '';

  const query = {
    title: {$regex: search, $options: 'i'},
    ...(skill && {skill})
  }

  const total = await offersCollection.countDocuments(query);
  const result = await offersCollection.find(query).skip((page - 1) * limit).limit(limit).sort({createdAt: -1}).toArray();

  res.send({total, offers: result})
});



    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch {
  } finally {
  }
};

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
