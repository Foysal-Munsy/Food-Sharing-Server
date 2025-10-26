const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
  ChangeStream,
} = require("mongodb");

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
    const db = client.db("Food_Sharing_DB");
    const foodCollection = db.collection("foods");
    // projects works from here
    app.post("/add-food", async (req, res) => {
      const data = req.body;
      const result = await foodCollection.insertOne(data);
      res.send(result);
    });

    // app.get("/available-foods", async (req, res) => {
    //   const page = parseInt(req.query.page);
    //   const size = parseInt(req.query.size);
    //   console.log("pagination", req.query);
    //   const data = await foodCollection.find({ status: "available" }).toArray();
    //   const pagination = await foodCollection
    //     .find({ status: "available" })
    //     .skip((page - 1) * size)
    //     .limit(size)
    //     .toArray();
    //   res.send(data, pagination);
    // });

    app.get("/available-foods", async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const size = parseInt(req.query.size) || 3;

      console.log("pagination", req.query);

      // Get total count
      const total = await foodCollection.countDocuments({
        status: "available",
      });

      // Get paginated results
      const foods = await foodCollection
        .find({ status: "available" })
        .skip((page - 1) * size)
        .limit(size)
        .toArray();

      // Send both total count and paginated data
      res.json({
        total,
        foods,
      });
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
      const query = { donorEmail: req.firebaseUser.email, status: "available" };
      const data = await foodCollection.find(query).toArray();
      res.send(data);
    });

    app.patch("/request/:id", verifyFirebaseToken, async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = await foodCollection.updateOne(query, {
        $set: {
          status: "requested",
          requestedBy: req.firebaseUser.email,
          requestedAt: new Date(),
        },
      });
      res.send(data);
    });

    app.get("/requested-foods", verifyFirebaseToken, async (req, res) => {
      console.log("Requested by:", req.firebaseUser.email);
      const query = {
        requestedBy: req.firebaseUser.email,
        status: "requested",
      };
      console.log("Query:", query);
      const data = await foodCollection.find(query).toArray();
      res.send(data);
    });

    app.get("/details/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = await foodCollection.findOne(query);
      res.send(data);
    });

    // UPDATE
    app.get("/update/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = await foodCollection.findOne(query);
      res.send(data);
    });
    app.put("/update/:id", async (req, res) => {
      const { id } = req.params;
      const updatedFood = req.body;

      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: updatedFood };

      const result = await foodCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.delete("/foods/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.deleteOne(query);
      res.send(result);
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
