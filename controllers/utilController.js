import { Utils } from "../models/utilModel.js";
import { contactAdmin } from "../services/emailService.js";
import AppError from "../utils/appError.js";

// Update Utils (Plans)
export const updateUtils = async (req, res, next) => {
	const { plans } = req.body;

	// Enhanced validation for plans array
	if (!Array.isArray(plans) || plans.length === 0) {
		return next(new AppError("Invalid plans data provided.", 400));
	}

	// Validate each plan has required fields and proper structure
	for (const plan of plans) {
		if (!plan.name || typeof plan.name !== "string") {
			return next(new AppError("Each plan must have a valid name.", 400));
		}

		if (typeof plan.price !== "number" || plan.price < 0) {
			return next(new AppError("Each plan must have a valid price.", 400));
		}

		// Ensure features is an array of strings
		if (!Array.isArray(plan.features)) {
			return next(new AppError("Plan features must be an array.", 400));
		}

		if (typeof plan.duration !== "number" || plan.duration < 0) {
			return next(new AppError("Each plan must have a valid Duration.", 400));
		}

		// Check each feature is a valid string
		for (const feature of plan.features) {
			if (typeof feature !== "string" || !feature.trim()) {
				return next(new AppError("Each feature must be a non-empty string.", 400));
			}
		}
	}

	try {
		// Check if Utils document exists
		let utils = await Utils.findOne();

		if (!utils) {
			// If no Utils document exists, create a new one
			utils = new Utils({ plans });
		} else {
			// Update existing Utils document with new plans data
			utils.plans = plans;
		}

		// Save the updated document
		await utils.save();

		res.status(200).send({
			message: "Plans updated successfully.",
			utils,
		});
	} catch (error) {
		// Enhanced error handling
		const errorMessage = error.message || "An error occurred while updating plans.";
		return next(new AppError(errorMessage, 500));
	}
};

export const sendContactMessage = async (req, res, next) => {
	const { fullName, email, message } = req.body;

	// Validate input
	if (!fullName || !email || !message) {
		return next(new AppError("Please provide all required fields: fullName, email, and message.", 400));
	}

	try {
		// Use the contactMail function to send an email
		await contactAdmin(fullName, email, message);

		res.status(200).send({
			message: "Your message has been sent successfully. We'll get back to you shortly.",
		});
	} catch (error) {
		next(error);
	}
};

// Get all members
export const getAllUtils = async (req, res, next) => {
	try {
		const utils = await Utils.find();
		res.send({ utils });
	} catch (err) {
		next(err);
	}
};
