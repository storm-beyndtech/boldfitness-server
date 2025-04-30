import { User, validateUser } from "../models/userModel.js";
import bcrypt from "bcrypt";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";

// Get a single user by ID
export const getUser = async (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, user) => {
		if (err) return res.sendStatus(403);

		try {
			const userData = await User.findById(user.id);
			if (!userData) return next(new AppError("User not found", 404));

			res.send({ user: userData });
		} catch (err) {
			next(err);
		}
	});
};

// Get all members
export const getAllMembers = async (req, res, next) => {
	try {
		const members = await User.find();
		res.send({ members });
	} catch (err) {
		next(err);
	}
};

// Get all members
export const validateNewUser = async (req, res, next) => {
  const email = req.params;

	// Check if user already exists with the same email
	let user = await User.findOne(email);

	if (user) {
			return next(new AppError("Email already registered", 400));
	}
	try {
		const members = await User.find();
		res.send({ members });
	} catch (err) {
		next(err);
	}
};

// Sign Up Logic
export const signup = async (req, res, next) => {
	const { error } = validateUser(req.body);
	if (error) return next(new AppError(error.details[0].message, 400));
	const { email, phoneNumber, password } = req.body;

	// Check if user already exists with the same email
	let user = await User.findOne(email);

	if (user) {
			return next(new AppError("Email already registered", 400));
	}

	// Hash password
	const hashedPassword = await bcrypt.hash(password, 10);
	user = new User({ ...req.body, password: hashedPassword });

	try {
		await user.save();

		// Generate JWT
		const token = user.genAuthToken();

		res.status(201).send({
			message: "User registered successfully",
			token,
		});
	} catch (err) {
		next(err);
	}
};

// Login Logic
export const login = async (req, res, next) => {
	const { email, password } = req.body;

	// Check if user exists
	const user = await User.findOne({ email });
	if (!user) return next(new AppError("Invalid email or password.", 400));

	// Compare password
	const isMatch = bcrypt.compare(password, user.password);
	if (!isMatch) return next(new AppError("Incorrect password.", 400));

	// Generate JWT
	const token = user.genAuthToken();

	res.send({ token, user });
};



// Update specific fields of a user
export const updateUser = async (req, res, next) => {
	try {
		const { id } = req.params; // Get user ID from request params
		const updates = req.body; // Get updates from request body

		// Find the user by ID and update the specified fields
		const user = await User.findByIdAndUpdate(id, updates, {
			new: true, // Return the updated document
			runValidators: true, // Validate the updates against the schema
		});

		if (!user) return next(new AppError("User not found", 404));

		res.status(200).send({
			message: "User updated successfully",
			user,
		});
	} catch (err) {
		next(err);
	}
};


// Delete a user
export const deleteUser = async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await User.findByIdAndDelete(id);

		if (!user) return next(new AppError("User not found", 404));

		res.status(200).send({ message: "User deleted successfully" });
	} catch (err) {
		next(err);
	}
};
