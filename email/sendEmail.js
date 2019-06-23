const nodemailer = require('nodemailer');
const config = require('config');

function sendMail(email, subject, html) {

	const transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: config.get('email.email'),
			pass: config.get('email.pass')
		}
	});

	const mailOptions = {
		from: 'sebastiancahn@gmail.com',
		to: email,
		subject,
		html
	};

	return transporter.sendMail(mailOptions);
}

module.exports = sendMail;
