/*!
=========================================================
* Copyright Codetruck Software (https://codetruck.io)
* Coded by Codetruck Software
=========================================================
* The above copyright informs you that all code is under
  copyright and all the intelectual property rights are owned by Codetruck Software.
*/

require('dotenv').config();

module.exports = {
	smtpConf: {
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: process.env.SMTP_SSL,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASSWORD,
		},
	},
};