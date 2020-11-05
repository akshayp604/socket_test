var Sequelize = require('sequelize')
var env = 'dev'
var config = require('../config.json')[env]
const Op = Sequelize.Op;
var url = require('url');
var env = "dev";
var password = config.password ? config.password : null;
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


exports.User = sequelize.define('users', {

  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  online_status: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.STRING
  },
  updatedAt: {
    type: Sequelize.STRING
  }
})

exports.Chat = sequelize.define('chats', {
  sender_id: {
    type: Sequelize.STRING
  },
  receiver_id: {
    type: Sequelize.STRING
  },
  msg: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
});

exports.Chat_room = sequelize.define('chat_room', {
  sender_id: {
    type: Sequelize.STRING
  },
  receiver_id: {
    type: Sequelize.STRING,
  },
  room_id: {
    type: Sequelize.STRING
  },
  last_message: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
})

exports.Chat = sequelize.define('chat', {
  sender_id: {
    type: Sequelize.INTEGER
  },
  receiver_id: {
    type: Sequelize.INTEGER,
  },
  room_id: {
    type: Sequelize.STRING
  },
  message: {
    type: Sequelize.STRING
  },
  date: {
    type: Sequelize.DATE
  },
  attachment_type: {
    type: Sequelize.STRING
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
})