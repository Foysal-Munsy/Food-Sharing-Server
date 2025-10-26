// controllers/foodController.js
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

// Use Mongoose default connection
const db = mongoose.connection;
const foodCollection = db.collection("foods");

// Add Food
export const addFood = async (req, res) => {
  const result = await foodCollection.insertOne(req.body);
  res.send(result);
};

// Get Available Foods (with pagination)
export const getAvailableFoods = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 3;

  const total = await foodCollection.countDocuments({ status: "available" });
  const foods = await foodCollection
    .find({ status: "available" })
    .skip((page - 1) * size)
    .limit(size)
    .toArray();

  res.json({ total, foods });
};

// Featured Foods
export const getFeaturedFoods = async (req, res) => {
  const data = await foodCollection
    .find({ status: "available" })
    .sort({ quantity: -1 })
    .limit(6)
    .toArray();
  res.send(data);
};

// My Foods
export const getMyFoods = async (req, res) => {
  const query = { donorEmail: req.firebaseUser.email, status: "available" };
  const data = await foodCollection.find(query).toArray();
  res.send(data);
};

// Request Food
export const requestFood = async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const result = await foodCollection.updateOne(query, {
    $set: {
      status: "requested",
      requestedBy: req.firebaseUser.email,
      requestedAt: new Date(),
    },
  });
  res.send(result);
};

// Requested Foods
export const getRequestedFoods = async (req, res) => {
  const query = { requestedBy: req.firebaseUser.email, status: "requested" };
  const data = await foodCollection.find(query).toArray();
  res.send(data);
};

// Food Details
export const getFoodDetails = async (req, res) => {
  const data = await foodCollection.findOne({
    _id: new ObjectId(req.params.id),
  });
  res.send(data);
};

// Get Food for Update
export const getFoodForUpdate = async (req, res) => {
  const data = await foodCollection.findOne({
    _id: new ObjectId(req.params.id),
  });
  res.send(data);
};

// Update Food
export const updateFood = async (req, res) => {
  const filter = { _id: new ObjectId(req.params.id) };
  const updateDoc = { $set: req.body };
  const result = await foodCollection.updateOne(filter, updateDoc);
  res.send(result);
};

// Delete Food
export const deleteFood = async (req, res) => {
  const result = await foodCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  res.send(result);
};
