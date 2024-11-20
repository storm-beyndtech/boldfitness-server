import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["Monthly", "Quarterly", "Annually"],
  },
  price: {
    type: Number,
    required: true,
  },
});

const utilsSchema = new mongoose.Schema({
  plans: {
    type: [planSchema],
    required: true,
    default: [
      { name: "Monthly", price: 20000 },
      { name: "Quarterly", price: 80000 },
      { name: "Annually", price: 240000 },
    ],
  },
});

export const Utils = mongoose.model("Utils", utilsSchema);
