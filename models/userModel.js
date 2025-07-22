import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";

const userSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    phoneNumber: { 
      type: String, 
      required: true 
    },
    dateOfBirth: { 
      type: String, 
      required: true 
    },
    gender: { 
      type: String, 
      enum: ['Male', 'Female', 'Other'], 
      required: true 
    },
    address: {
      street: { 
        type: String, 
        required: true 
      },
      city: { 
        type: String, 
        required: true 
      },
      state: { 
        type: String, 
        required: true 
      },
      zipCode: { 
        type: String, 
        required: true 
      },
    },
    plan: { 
      type: String, 
      required: true, 
      enum: ['Monthly', 'Quarterly', 'Annually'] 
    },
    status: { 
      type: String, 
      default: 'pending', 
      enum: ['pending', 'active', 'expired'] 
    },
    subscriptionExpiry: { 
      type: Date, 
      default: function() {
        return this.accountType === 'admin' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }, 
      index: { expireAfterSeconds: 0 } 
    },
    accountType: { 
      type: String, 
      required: true, 
      enum: ['admin', 'member'] 
    },
    password: { 
      type: String 
    },
    paymentRef: { 
      type: String 
    },
  },
  { 
    timestamps: true 
  }
);

userSchema.methods.genAuthToken = function () {
  return jwt.sign(
    { id: this._id, accountType: this.accountType },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: "6h" }
  );
};

// Joi schema for validation with conditional password
const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    dateOfBirth: Joi.string().required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    address: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
    }).required(),
    plan: Joi.string().valid('Monthly', 'Quarterly', 'Annually').required(),
    status: Joi.string().valid('pending', 'active', 'expired').default('active'),
    subscriptionExpiry: Joi.date().allow(null),
    accountType: Joi.string().valid('admin', 'member').required(),
    password: Joi.when('accountType', {
      is: 'admin',
      then: Joi.string().required().min(8).messages({
        "any.required": "Password is required for admin accounts."
      }),
      otherwise: Joi.forbidden()
    }),
    paymentRef: Joi.string(),
  });

  return schema.validate(user);
};

const User = mongoose.model('User', userSchema);

export { User, validateUser };
