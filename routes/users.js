/*!
=========================================================
* Copyright Codetruck Software (https://codetruck.io)
* Coded by Codetruck Software
=========================================================
* The above copyright informs you that all code is under
  copyright and all the intelectual property rights are owned by Codetruck Software.
*/

const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const { ActiveSession } = require('../models');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { secret } = require('../config/keys');
const { smtpConf } = require('../config/config');
const { reqAuth } = require('../config/safeRoutes');


// route /api/users/

router.post('/register',  async function (req, res) {
	const { name, email, password, gender, phoneNumber, city, country, userType } = req.body; 
	if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
		return res.json({ success: false, msg: "fields validations error" });
	}
	if (password.length < 8) {
		return res.json({ success: false, msg: "fields validations error" });
	}
	if (!phoneNumber.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/im)) {
		return res.json({ success: false, msg: "fields validations error" });
	}
.findOne({ email: email }).exec();
	if (user) {
		return res.json({ success: false, msg: "Email already exists" });
	} else {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(password, salt, null, async (err, hash) => {
				if (err) throw err;
				const query = {
					name: name,
					email: email,
					password: password,
					gender: gender,
					phoneNumber: phoneNumber,
					city: city,
					country: country,
					userType: userType,
				};

				query.password = hash;
				const newUser = await Users.create(query);
				return res.json({
					success: true,
					userID: newUser._id,
					msg: "The user was succesfully registered"
				});
			});
		});
	}
});

router.put('/edit', reqAuth, async function (req, res) {
	const { id, name, email, password, gender, phoneNumber, city, country, userType } = req.body; 
	if (!id) {
		return res.json({ success: false, msg: 'Required fields are empty' });
	};
	const element = await Users.findAll({where: { id: id }}).exec();
	if (element.length != 1) {
		return res.json({ success: false, msg: 'Element does not exists' });
	}
	const dataToSet = {};

	if (name != null) {
		dataToSet.name = name;
	}

	if (email != null) {
		if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
			return res.json({ success: false, msg: "fields validations error" });
		}

		dataToSet.email = email;
	}

	if (gender != null) {
		dataToSet.gender = gender;
	}

	if (phoneNumber != null) {
		if (!phoneNumber.match(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/im)) {
			return res.json({ success: false, msg: "fields validations error" });
		}

		dataToSet.phoneNumber = phoneNumber;
	}

	if (city != null) {
		dataToSet.city = city;
	}

	if (country != null) {
		dataToSet.country = country;
	}

	if (userType != null) {
		dataToSet.userType = userType;
	}

	const newvalues = {...dataToSet}; 
	const item = await Users.update(newvalues, {where: {id: id}});
	return res.json({ success: true });
});

router.delete('/delete', reqAuth, async function (req, res) {
	const { id } = req.body;

	if (!id) {
		return res.json({ success: false, msg: 'Required fields are empty' });
	}

	const item = await Users.destroy({ where: { id: id } });
	return res.json({ success: true });
});

router.post('/loginsingle',  async function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Users.if (!user) {
    return res.json({ success: false, msg: "Wrong credentials" });
  }
  bcrypt.compare(password, user.password, async function (err, isMatch) {
    if (isMatch) {
      const token = jwt.sign(user.toJSON(), secret, {
        expiresIn: 86400, // 1 week
      });
      const query = { userId: user._id, token: "JWT " + token };
      const item = await ActiveSession.deleteMany({ userId: user._id });
      const cd = await ActiveSession.create(query);
      user.password = null;
      user.__v = null;
      return res.json({
        success: true,
        token: "JWT " + token,
        user,
      });
    } else {
      return res.json({ success: false, msg: "Wrong credentials" });
    }
  });
});

router.post('/loginmulti',  async function (req, res) {
.findOne({ email: email }).exec();
  if (!user) {
    return res.json({ success: false, msg: "Wrong credentials" });
  }
  bcrypt.compare(password, user.password, async function (err, isMatch) {
    if (isMatch) {
      const token = jwt.sign(user, secret, {
        expiresIn: 86400, // 1 week
      });
      // Don't include the password in the returned user object
      const query = { userId: user._id, token: "JWT " + token };
      const cd = await ActiveSession.create(query);
      user.password = null;
      user.__v = null;
      return res.json({
        success: true,
        token: "JWT " + token,
        user,
      });
    } else {
      return res.json({ success: false, msg: "Wrong credentials" });
    }
  });
});

router.post('/checksession', reqAuth, async function (req, res) {
	return res.json({ success: true });
});

router.post('/forgotpassword',  async function (req, res) {
	const query = { _id: user[0]._id };
    const newvalues = { $set: { resetPass: true } };
    const usr = await Users.updateOne(query, newvalues);

    // send mail with defined transport object
    transporter.sendMail({
      from: '"Code Truck" <' + smtpConf.auth.user + ">", // sender address
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      // eslint-disable-next-line max-len
      html:
        '<h1>Hey,</h1><br><p>If you want to reset your password, please click on the following link:</p><p><a href="' +
        "http://localhost:3000/auth/confirm-password/" +
        user._id +
        '">"' +
        "http://localhost:3000/auth/confirm-email/" +
        user._id +
        +'"</a><br><br>If you did not ask for it, please let us know immediately at <a href="mailto:' +
        smtpConf.auth.user +
        '">' +
        smtpConf.auth.user +
        "</a></p>", // html body
    });
      return res.json({ success: true });
  }
});

router.post('/resetpassword',  async function (req, res) {
.updateOne(query, newvalues);
return res.json({ success: true });
      });
    });
  }});

module.exports = router;
