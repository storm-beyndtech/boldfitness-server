import { Utils } from "../models/utilModel.js";
import { contactAdmin } from "../services/emailService.js";
import AppError from "../utils/appError.js";

// Update Utils (Plans)
export const updateUtils = async (req, res, next) => {
  const { plans } = req.body;

  if (!Array.isArray(plans) || plans.length === 0) {
    return next(new AppError("Invalid plans data provided.", 400));
  }

  try {
    // Check if Utils document exists
    let utils = await Utils.findOne();

    if (!utils) {
      // If no Utils document exists, create a new one
      utils = new Utils({ plans });
    } else {
      // Update existing Utils document
      utils.plans = plans;
    }

    await utils.save();

    res.status(200).send({
      message: "Plans updated successfully.",
      utils,
    });
  } catch (error) {
    next(error);
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
    await contactAdmin( fullName, email, message );

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