import mongoose from "mongoose";

// Define the plan schema with features
const planSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	features: {
		type: [String],
		default: [],
	},
	duration: {
		type: Number,
		required: true,
	},
});

const utilsSchema = new mongoose.Schema({
	plans: {
		type: [planSchema],
		required: true,
		default: [
			{
				name: "Monthly",
				price: 20000,
				features: [
					"Over 3 Free Training Sessions Monthly",
					"Access to Advanced Training Facilities",
					"Top-tier Fitness Supplements & Products",
					"Access to Personal Training",
					"Supportive Network of Like-Minds",
					"Friendly Environment",
				],
				duration: 30,
			},
			{
				name: "Quarterly",
				price: 80000,
				features: [
					"Over 3 Free Training Sessions Monthly",
					"Access to Advanced Training Facilities",
					"Top-tier Fitness Supplements & Products",
					"Access to Personal Training",
					"Supportive Network of Like-Minds",
					"Friendly Environment",
				],
				duration: 120,
			},
			{
				name: "Annually",
				price: 240000,
				features: [
					"Over 3 Free Training Sessions Monthly",
					"Access to Advanced Training Facilities",
					"Top-tier Fitness Supplements & Products",
					"Access to Personal Training",
					"Supportive Network of Like-Minds",
					"Friendly Environment",
				],
				duration: 365,
			},
		],
	},
});

export const Utils = mongoose.model("Utils", utilsSchema);
