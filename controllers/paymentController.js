import https from "https";
import { config } from "dotenv";
import { User, validateUser } from "../models/userModel.js";
import { welcomeMail } from "../services/emailService.js";
import AppError from "../utils/appError.js";

config();

const PAYSTACK_SK = process.env.PAYSTACK_SK;

export const verifyTransaction = (req, res) => {
	const { reference } = req.body;

	if (!reference) {
		return res.status(400).json({ error: "Payment reference is required." });
	}

	const options = {
		hostname: "api.paystack.co",
		path: `/transaction/verify/${reference}`,
		method: "GET",
		headers: {
			Authorization: `Bearer ${PAYSTACK_SK}`,
		},
	};

	const request = https.request(options, (response) => {
		let data = "";

		response.on("data", (chunk) => {
			data += chunk;
		});

		response.on("end", () => {
			const parsedData = JSON.parse(data);

			if (response.statusCode === 200 && parsedData.data.status === "success") {
				res.status(200).json({ message: "Payment verified successfully.", data: parsedData.data });
			} else {
				res.status(response.statusCode).json({ error: parsedData.message });
			}
		});
	});

	request.on("error", (err) => {
		res
			.status(500)
			.json({ error: "An error occurred while verifying the transaction.", details: err.message });
	});

	request.end();
};

//save user information after successful subscription
export const saveUserData = async (req, res) => {
	if (!req.body) {
		return res.status(400).json({ error: "User data is required." });
	}

	try {
		// Validate user data
		const { error } = validateUser(req.body);
		if (error) {
			console.log(error.details[0].message, req.body);
			return res.status(400).json({ error: error.details[0].message });
		}

		// Calculate expiration date
		const { plan, email } = req.body;
		const interval = plan === "monthly" ? 30 : plan === "quarterly" ? 120 : plan === "annually" ? 365 : 30;

		if (!interval || typeof interval !== "number" || interval <= 0) {
			throw new AppError("Invalid interval. Must be a positive number.", 400);
		}

		const expirationDate = new Date();
		expirationDate.setDate(expirationDate.getDate() + interval);

		// Save user data to MongoDB
		const newUser = new User({ ...req.body, subscriptionExpiry: expirationDate });
		await newUser.save();

		// Send welcome email
		await welcomeMail(email, plan, newUser._id, expirationDate);
		// await alertAdmin(email, firstName, lastName);

		res.status(201).json({
			message: "User data saved successfully.",
			user: newUser,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).json({
			error: "An error occurred while saving user data.",
			details: err.message,
		});
	}
};
