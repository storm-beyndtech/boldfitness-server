import dotenv from "dotenv";
dotenv.config();

import { emailTemplate } from "../utils/emailTemplate.js";
import { transporter } from "./emailConfig.js";

const sendMail = (mailData) => {
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailData, (err, info) => {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				console.log(info);
				resolve(info);
			}
		});
	});
};

const sendMailWithRetry = async (mailData, retries = 3) => {
	for (let i = 0; i < retries; i++) {
		try {
			return await sendMail(mailData);
		} catch (error) {
			if (i === retries - 1) throw error;
			console.log(`Retrying sendMail... Attempt ${i + 1}`);
		}
	}
};

// Welcome mail
export async function welcomeMail(userEmail, plan, userID, expirationDate) {
  try {
    let bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p>Welcome to BoldFitnessNG!</p>
        <p>We're thrilled to have you as part of our community. At BoldFitnessNG, we are dedicated to providing the best services and support to our members.</p>
        <p>Thank you for choosing the <strong>${plan}</strong> plan.</p>
        <p><strong>Your unique ID</strong>: ${userID}</p>
        <p>Your plan is active and will expire on <strong>${expirationDate}</strong>.</p>
        <p>If you have any questions or need assistance, feel free to reach out to our support team at ${process.env.SMTP_USER}.</p>
        <p>Best regards,</p>
        <p>The BoldFitnessNG Team</p>
      </td>
    `;

    let mailOptions = {
      from: `BoldFitnessNG ${process.env.SMTP_USER}`,
      to: userEmail,
      subject: "Welcome to BoldFitnessNG!",
      html: emailTemplate(bodyContent),
    };

    const result = await sendMailWithRetry(mailOptions);
    return result;
  } catch (error) {
    return { error: error.message };
  }
}


// Alert admin mail
export async function alertAdmin(userEmail, firstName, lastName) {
	try {
		let bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p>Hello Admin,</p>
        <p>A new user has registered on BoldFitnessNG.</p>
        <p>Details:</p>
        <ul>
          <li>Email: ${userEmail}</li>
          <li>Name: ${firstName} ${lastName}</li>
        </ul>
        <p>Thank you,</p>
        <p>BoldFitnessNG Team</p>
      </td>
    `;

		let mailOptions = {
			from: `BoldFitnessNG ${process.env.SMTP_USER}`,
			to: userEmail,
			subject: "New User Registration Alert",
			html: emailTemplate(bodyContent),
		};

		const result = await sendMailWithRetry(mailOptions);
		return result;
	} catch (error) {
		return { error: error.message };
	}
}

// Contact admin mail
export async function contactAdmin(userEmail, fullName, message) {
	try {
		let bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p>Hello Admin,</p>
        <p>You have received a new message from <b>${fullName}.</b></p>
        <p>${message}</p>
        <p>Sent by: ${userEmail}</p>
      </td>
    `;

		let mailOptions = {
			from: `BoldFitnessNG ${process.env.SMTP_USER}`,
			to: process.env.SMTP_USER,
			subject: "Contact Mail",
			html: emailTemplate(bodyContent),
		};

		const result = await sendMailWithRetry(mailOptions);
		return result;
	} catch (error) {
		return { error: error.message };
	}
}

// Password reset mail
export async function passwordReset(userEmail) {
	try {
		let bodyContent = `
      <td style="padding: 20px; line-height: 1.8;">
        <p>A request was sent for password reset. If this wasn't you, please contact our customer service.</p>
        <p>Click the reset link below to proceed:</p>
        <a style="display: inline-block; max-width: 200px; padding: 15px 30px; border-radius: 30px; background-color: #114000; color: #fafafa; text-decoration: none;" href="https://prowealth-inc.com/forgotPassword/newPassword">Reset Password</a>
      </td>
    `;

		let mailOptions = {
			from: `BoldFitnessNG ${process.env.SMTP_USER}`,
			to: userEmail,
			subject: "Password Reset",
			html: emailTemplate(bodyContent),
		};

		const result = await sendMailWithRetry(mailOptions);
		return result;
	} catch (error) {
		return { error: error.message };
	}
}
