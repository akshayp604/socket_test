const express = require('express');
const app = express();
const Sequelize = require('sequelize');
var url = require('url');
var env = "dev";
var config = require('../config.json')[env];
var password = config.password ? config.password : null;
const jwt = require('jsonwebtoken');

var sequelize = new Sequelize(
	config.database,
	config.user,

	config.password, {
	logging: console.log,
	dialect: 'mysql',
	define: {
		timestamps: false
	}
}
);

const models = require('../models/models.js');

models.User.hasMany(models.Chat_room, {
	foreignKey: 'id',
	as: 'chats_rooms'
})

exports.test = (req, res) => {
	console.log("test");
	var abcd = 'Hey Akshay'
	res.json({
		response: true,
		message: 'welcome!!',
		'test': abcd
	});
};

exports.addUser = (req, res) => {
	models.User.findAll({
        where: {
            email: req.body.email
        }
    }).then(usersData => {
        if (usersData.length > 0) {
            res.send({
                respone: false,
                message: 'User already exist'
            })
            return
        } else {
            models.User.create(req.body).then(data => {
                res.send({
                    respone: true,
                    data: data,
                    message: 'user created'
                })
            }, err => {
                res.send({
                    respone: false,
                    err: err,
                })
            })
        }
    }, err => {
        res.send({
            respone: false,
            err: err,
        })
    })
}


exports.addchat = (req, res) => {
	console.log(req.body)
	models.Chat.create(req.body).then(data => {
		res.send({
			data: data,
			message: 'Data added'
		})

	}).catch(err => {
		console.log(err);
		res.json({
			response: false,
			message: 'Something Wrong!!!.',
			data: err
		});
	});
}

exports.findRoom = (req, res) => {
	models.Chat.findAll().then(data => {
		res.send({
			data: data,
			message: 'Data added'
		})

	}).catch(err => {
		console.log(err);
		res.json({
			response: false,
			message: 'Something Wrong!!!.',
			data: err
		});
	});
}

exports.UserLogin = (req, res) => {
	var email = req.body.email,
		password = req.body.password;
	if (email && password) {
		// return false;

		models.User.findOne({
			where: {
				email: email
			},
		}).then(findUser => {
			if (findUser != null) {
				if (password == findUser.password) {
					models.User.findOne({
						where: {
							id: findUser.id
						},
						include: [{
							model: models.Chat_room,
							as: 'chats_rooms'
						}]
					})
						.then(userDetails => {
							var users = {
								email: userDetails.dataValues.email,
								id: userDetails.dataValues.id,
							}
							console.log(users)
							jwt.sign(users, 'secretOrKey', { expiresIn: 24 * 60 * 60 * 1000 }, (err, token) => {
								res.json({
									response: true,
									message: 'Login Successfully!!',
									data: userDetails,
									token: token
								});

							})
						}).catch(err => {
							res.json({
								response: false,
								message: 'User Not Found!!'
							});
						});
				} else {
					res.json({
						response: false,
						message: 'Please Enter Correct Password!!'
					});
				}
			} else {
				res.json({
					response: false,
					message: 'This Email is Not Registered!!'
				});
			}
		}).catch(err => {
			res.json({
				response: false,
				message: 'Something Wrong!!',
				data: err
			});
		});
	} else {
		res.json({
			response: false,
			message: 'Data missing!!'
		});
	}
};

exports.UserList = (req, res) => {
	models.User.findAll().then(data => {
		res.send({
			response: true,
			message: 'Featched',
			data: data
		});
	}).catch(err => {
		console.log(err);
		res.send({
			response: false,
			message: 'Something Wrong!!!.',
			data: err
		});
	});
}

exports.findOneUser = (req, res) => {
	models.User.findOne({
		where: {
			id: req.params.id
		},
		include: [{
			model: models.Chat_room,
			as: 'chats_rooms'
		}]
	}).then(data => {
		res.send({
			response: true,
			message: 'Featched',
			data: data
		});
	}).catch(err => {
		console.log(err);
		res.send({
			response: false,
			message: 'Something Wrong!!!.',
			data: err
		});
	});
}