const express = require("express");
const cors = require("cors");

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  ChangeStream,
} = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

const admin = require("firebase-admin");

const serviceAccount = require("./admin-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// middleware/auth.js

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.firebaseUser = decodedToken; // You can access user info like uid, email, etc.
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token from catch" });
  }
};

async function run() {
  try {
    await client.connect();

    const db = client.db("Food_Sharing_DB");
    const foodCollection = db.collection("foods");
    // projects works from here
    app.post("/add-food", async (req, res) => {
      const data = req.body;
      const result = await foodCollection.insertOne(data);
      res.send(result);
    });

    app.get("/available-foods", async (req, res) => {
      const data = await foodCollection.find({ status: "available" }).toArray();
      res.send(data);
    });

    app.get("/featured-foods", async (req, res) => {
      const data = await foodCollection
        .find({ status: "available" })
        .sort({ quantity: -1 })
        .limit(6)
        .toArray();
      res.send(data);
    });

    app.get("/my-foods", verifyFirebaseToken, async (req, res) => {
      const query = { donorEmail: req.firebaseUser.email };
      const data = await foodCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/details/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = await foodCollection.findOne(query);
      res.send(data);
    });
    console.log("DB connected!");
  } finally {
  }
}

run().catch(console.dir);

// Root route

app.get("/", verifyFirebaseToken, async (req, res) => {
  console.log(req.firebaseUser);

  res.send("Server is running!");
});
// app.get("/", async (req, res) => {
//   res.send("Server is running!");
// });
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
