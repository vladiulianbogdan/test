/*!
=========================================================
* Copyright Codetruck Software (https://codetruck.io)
* Coded by Codetruck Software
=========================================================
* The above copyright informs you that all code is under
  copyright and all the intelectual property rights are owned by Codetruck Software.
*/

module.exports = (sequelize, DataTypes) => {
	const Qweqeq = sequelize.define("Qweqeq", {
		name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		prenume: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		test: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	});

	return Qweqeq;
};
