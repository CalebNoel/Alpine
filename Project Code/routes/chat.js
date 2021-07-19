const express = require('express');
const router = express.Router();
var Chat = require('../models').Chat;
var ChatLine = require('../models').ChatLine;
var Users = require('../models').Users;
const { Op } = require("sequelize")
const { check, validationResult } = require('express-validator');
const ensureAuthenticated = require("./auth")

router.get('/', async (req,res) => {
    const curr_user_id = req.user.id;
    res.render('pages/chat',{

        chat_messages: '',
        loggedIn: true
    });
})

//When the user clicks on a chat, this loads that selected chat into the window
router.post('/select_chat', async (req, res) =>{
  console.log('Chat select success');
  var curr_user_id = req.user.id;
  var selected_chat = req.body.submit;
  var query = await ChatLine.findAll({
    where: {
      chat_id: selected_chat
    }
  });
	res.render('pages/chat',{
		chat_messages: query,
    curr_user_id: curr_user_id,
        loggedIn: true
	});
});

//This recieves a message when the user sends one, puts in the database, and refreshes the chat
router.post('/send_message', async (req, res) =>{
  console.log('Message submitted')
  var new_message = await ChatLine.create({user_id:req.user.id, chat_id:req.body.chat_id, line_text:req.body.message});
  var query = await ChatLine.findAll({
    where: {
      chat_id: req.body.chat_id
    }
  });
  res.render('pages/chat',{
    chat_messages: query,
    loggedIn: true
  })
})

router.get('/:id', async (req,res) => {
    const curr_user_id = req.user.id;
    let user_chats = await ChatLine.findAll({
        where: {
            user_id: {
                [Op.eq] : curr_user_id
            }
        },
        group: 'chat_id'
    });
    user_chats = user_chats.map(element => element.dataValues);
    const open_chat = await Chat.findOne({
        where: {
            id: {
                [Op.eq] : req.params.id
            }
        }
    })

    let chat_messages = await ChatLine.findAll({
        where:{
            chat_id:{
                [Op.eq] : req.params.id,
            },
            line_text: {
                [Op.ne] : "::"
            }
        },
        order: [['createdAt','DESC']]
    });
    chat_messages = chat_messages.map(element => element.dataValues);

    res.render('pages/chat',{
        chats: user_chats,
        curr_chat: open_chat,
        chat_messages: chat_messages,
        loggedIn: true
    });
})


router.post('/:id/send',[
    check('message').not().isEmpty()
], async (req,res) => {
    const curr_user_id = req.user.id;
    const message = req.body.message
    let user_chats = await ChatLine.findAll({
        where: {
            user_id: {
                [Op.eq] : curr_user_id
            }
        },
        group: 'chat_id'
    });
    user_chats = user_chats.map(element => element.dataValues);

    const open_chat = await Chat.findAll({
        where: {
            id: {
                [Op.eq] : req.params.id
            }
        }
    });


    const chat_message = await ChatLine.create({
        user_id: curr_user_id,
        chat_id: req.params.id,
        line_text: message,
    });
    chat_message.save();


    let chat_messages = await ChatLine.findAll({
        where:{
            chat_id:{
                [Op.eq] : req.params.id,
            },
            line_text: {
                [Op.ne] : "::"
            }
        },
        order: [['createdAt','DESC']]
    });
    chat_messages = chat_messages.map(element => element.dataValues);
    res.render('pages/chat',{
        chats: user_chats,
        curr_chat: open_chat,
        chat_messages: chat_messages,
        loggedIn: true
    });
});


module.exports = router;
