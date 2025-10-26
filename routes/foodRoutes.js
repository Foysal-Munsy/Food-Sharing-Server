// routes/foodRoutes.js
import express from "express";
import { verifyFirebaseToken } from "../middleware/auth.js";
import {
  addFood,
  getAvailableFoods,
  getFeaturedFoods,
  getMyFoods,
  requestFood,
  getRequestedFoods,
  getFoodDetails,
  getFoodForUpdate,
  updateFood,
  deleteFood,
} from "../controllers/foodController.js";

const router = express.Router();

router.post("/add-food", addFood);
router.get("/available-foods", getAvailableFoods);
router.get("/featured-foods", getFeaturedFoods);
router.get("/my-foods", verifyFirebaseToken, getMyFoods);
router.patch("/request/:id", verifyFirebaseToken, requestFood);
router.get("/requested-foods", verifyFirebaseToken, getRequestedFoods);
router.get("/details/:id", getFoodDetails);
router.get("/update/:id", getFoodForUpdate);
router.put("/update/:id", updateFood);
router.delete("/foods/:id", deleteFood);

export default router;
