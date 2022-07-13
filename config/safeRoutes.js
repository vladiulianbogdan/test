/*!
=========================================================
* Copyright Codetruck Software (https://codetruck.io)
* Coded by Codetruck Software
=========================================================
* The above copyright informs you that all code is under
  copyright and all the intelectual property rights are owned by Codetruck Software.
*/

const Users = require('../models/users');
const ActiveSession = require('../models/activeSession');

const reqAuth = async (req, res, next) => {
  const token = String(req.headers.authorization);
  const session = await ActiveSession.find({token: token}).exec();
  if (session.length == 1) {
    req.userId = session[0].userId;
    return next();
  } else {
    return res.json({success: false, msg: 'User is not logged on'});
  }
};

module.exports = {
  reqAuth,  
};

