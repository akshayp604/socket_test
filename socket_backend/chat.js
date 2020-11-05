var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
const rn = require('random-number');
var express = require('express')
// var fileUpload = require('express-fileupload')
var urlencodedParser = bodyParser.urlencoded({
	extended: false
});
app.use(bodyParser.json({
	limit: '100mb'
}));
app.use(bodyParser.urlencoded({
	limit: '100mb',
	extended: true
}));
server.listen(3001, function() {
	console.log('running on port no : 3001');
});
app.all('/*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Key, Authorization");
	res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PATCH");
	next()
});
//////////////////// CHAT MODELS start ///////////////////////

var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var env = 'dev'
var config = require('./config.json')[env]
var sequelize = new Sequelize(config.database, config.user, config.password, {
	logging: console.log,
	dialect: 'mysql',
	define: {
		timestamps: false
	}
})
const models = require('./models/models.js');




io.on('connection', function(socket) {
	console.log('socket connected');
	socket.on('room join', function(room) {
		models.Chat_room.findOne({
			where: {
				[Op.or]: [{
					[Op.and]: [{
						'sender_id': room.receiver_id
					}, {
						'receiver_id': room.sender_id
					}]
				}, {
					[Op.and]: [{
						'sender_id': room.sender_id
					}, {
						'receiver_id': room.receiver_id
					}]
				}]
			}
		}).then(check=> {
			if (check) {
				if (socket.rooms[check.room_id]) {
					console.log('check yes')
				} else {
					console.log('check no')
					socket.join(check.room_id);
				}

				io.to(check.room_id).emit('room join', {
					'message': 'You successfully connected to room ',
					'room_id': check.room_id,
					// 'Online':'Online'
				});
                // socket.broadcast.emit('user connected', 'A new user connected id ');
            } else {
            	var options = {
            		min: 10000000000,
            		max: 100000000000,
            		integer: true
            	}
            	var id = rn(options)
            	models.Chat_room.create({
            		sender_id: room.sender_id,
            		receiver_id: room.receiver_id,
            		room_id: id
            	}).then(data=> {
            		console.log('new room created')
            		if (socket.rooms[id]) {
            			console.log('data yes')
            		} else {
            			console.log('data no')
            			socket.join(id);
            		}
            		io.to(id).emit('room join', {
            			message: 'You successfully connected to room ',
            			'room_id': id,
            			// 'Online':'Online'
            		});
            	}).catch(err => {
            		console.log(err);
            		
            	});
            }
        }).catch(err => {
        	console.log(err);
        	
        });
    })

	socket.on('room leave', (msg) => {
		console.log('room leave', msg.room_id);
		socket.leave(msg.room_id, () => {
			io.to(msg.room_id).emit('room leave', {
				status: true,
				room_id: msg.room_id,
				sender_id: msg.sender_id,
				'Online':'Offline'
			});
		});
	})

	socket.on('typeIn', (msg) => {
		console.log('typeIn', msg.room_id);
		io.to(msg.room_id).emit('typeIn', {
			status: true,
			room_id: msg.room_id,
			sender_id: msg.sender_id
		});
	})
	socket.on('typeOut', (msg) => {
		console.log('typeOut', msg.room_id);
		io.to(msg.room_id).emit('typeOut', {
			status: true,
			room_id: msg.room_id,
			sender_id: msg.sender_id
		});
	})
	socket.on('chat message', function(params, callback) {
		console.log("paramsparamsparamsparams",params)
		models.Chat_room.findOne({
			where: {
				[Op.or]: [{
					sender_id: params.sender_id,
					receiver_id: params.receiver_id
				}, {
					sender_id: params.receiver_id,
					receiver_id: params.sender_id
				}]
			}
		}).then(check=>{
			if (params.message) {
				var date = new Date();
				models.Chat.create({
					sender_id: params.sender_id,
					receiver_id: params.receiver_id,
					message: params.message,
					attachment_type: 'text',
					room_id: check.room_id,
					date: date
				}).then(result =>{
					models.Chat_room.update({
						last_message: params.message
					}, {
						where: {
							room_id: check.room_id
						}
					}).then(update =>{
						console.log(update)
						models.Chat.findOne({
							where: {
								id: result.id
							},
						}).then(chat_detail=>{
							models.Chat.findAll({
								where:{
									room_id: check.room_id
								}
							}).then(getChat=>{
								io.to(check.room_id).emit('chat message', getChat)
								// io.to(data.room_id).emit('get_messages', getChat)
							},err=>{
								console.log(err)
							})

						},err=>{
							console.log(err)
						})
					},err=>{
						console.log(err)
					})
				},err=>{
					console.log(err)
				})
			}
		},err=>{
			console.log(err)
		})
	})

	socket.on('get_messages', (msg) => {
		console.log('in get message')
		models.Chat_room.findOne({
			where: {
				[Op.or]: [{
					sender_id: msg.sender_id,
					receiver_id: msg.receiver_id
				}, {
					sender_id: msg.receiver_id,
					receiver_id: msg.sender_id
				}]
			}
		}).then(data=>{
			console.log('Got the rooom ID',data.room_id)
			if(data){
				models.Chat.findAll({
					where:{
						room_id: data.room_id
					}
				}).then(getChat=>{
					io.to(data.room_id).emit('get_messages', getChat)
				},err=>{
					console.log(err)
				})
			}
		},err=>{
			console.log(err)
		})
	})
	var imagepath = "/E:/Akshay/soket_test/images"
	socket.on('upload_files', (msg) => {
		console.log('im in the upload_files so upload images plzz')
		var filename = Date.now() + '-' + Date.now() +msg.file_name;
		let sampleimage = msg.file_name;
		msg.file_name = filename;
		console.log(filename)
		sampleimage.mv('/E:/Akshay/soket_test/images' + filename, function(err) {
			if (err) {
				return res.status(500).send(err)
				console.log(err)
			}else{
				console.log('im in the upload_files is success')
			}
		})
	})

	socket.on('online', (msg) =>{
		console.log('Yes this one is emmited',msg)
		models.User.update({
			online_status: '1',
		},
		{
			where:{
				id: msg.id
			}
		}).then(data=>{
			models.Chat_room.findOne({
				where: {
					[Op.or]: [{
						sender_id: msg.id,
						receiver_id: msg.id
					}, {
						sender_id: msg.id,
						receiver_id: msg.id
					}]
				}
			}).then(datanew=>{
				console.log('my new data cghat room id t duns', datanew)
				io.to(datanew.room_id).emit('online', {
			// 			ttlData:ttlData,
			'message': 'Heyyyaaaa Im nw online did you know that',
			'sddd': 1,
		});
			},err=>{
				console.log(err)
			})
			// models.User.findAll().then(ttlData =>{
			// 	io.to(msg.id).emit('online', {
			// 			ttlData:ttlData,
			// 			'message': 'Heyyyaaaa Im nw online did you know that',
			// 			'sddd': 1,
			// 		});

			// })
			// console.log(data)
		},err=>{
			console.log(err)
		})
	})
	socket.on('offline', (msg) =>{
		// console.log(msg.id,  ' is offine')
		models.User.update({
			online_status: '0',
		},
		{
			where:{
				id: msg.id
			}
		}).then(data=>{
			var user_id = 1
			io.to(msg.id).emit('offline', 0)
		},err=>{
			console.log(err)
		})
	})
})


