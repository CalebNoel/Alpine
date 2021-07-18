const express = require('express');
const router = express.Router();
var Chat = require('../models').Chat;
var ChatLine = require('../models').ChatLine;
var Users = require('../models').Users;
const { Op } = require("sequelize")
const { check, validationResult } = require('express-validator');
const ensureAuthenticated = require("./auth")

router.get('/', async (req,res) => {
    const curr_user_id = 1;

    const user_chats = await ChatLine.findAll({
        where: {
            user_id: {
                [Op.eq] : curr_user_id
            }
        },
        group: 'chat_id'
    });
    const open_chat = await Chat.findAll({
        where: {
            id: {
                [Op.eq] : req.params.id
            }
        }
    })
    const chat_messages = await ChatLine.findAll({
        where:{
            chat_id:{
                [Op.eq] : open_chat.id
            },
            line_text: {
                [Op.ne] : '::'
            }
        },
        order: [['createdAt','DESC']]
    });
    console.log(user_chats,open_chat,chat_messages);
    res.render('pages/chat',{
        chats: user_chats,
        curr_chat: open_chat,
        chat_messages: chat_messages,
        loggedIn: true
    });
})

router.post('/select_chat', async (req, res) =>{
  console.log('Chat select success');
  var selected_chat = req.body.submit;
  var query = await ChatLine.findAll({
    where: {
      chat_id: selected_chat
    }
  });
	res.render('pages/chat',{
		chat_messages: query,
        loggedIn: true
	});
});

router.get('/:id', async (req,res) => {
    const curr_user_id = 1;
    const user_chats = await ChatLine.findAll({
        where: {
            user_id: {
                [Op.eq] : curr_user_id
            }
        },
        group: 'chat_id'
    });
    const open_chat = await Chat.findAll({
        where: {
            id: {
                [Op.eq] : req.params.id
            }
        }
    })

    const chat_messages = await ChatLine.findAll({
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
    const curr_user_id = 1;
    const message = req.body.message
    const user_chats = await ChatLine.findAll({
        where: {
            user_id: {
                [Op.eq] : curr_user_id
            }
        },
        group: 'chat_id'
    });
    const open_chat = await Chat.findAll({
        where: {
            id: {
                [Op.eq] : req.params.id
            }
        }
    });


    const chat_message = await ChatLine.create({
        user_id: 1,
        chat_id: req.params.id,
        line_text: message,
    });
    chat_message.save();


    const chat_messages = await ChatLine.findAll({
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
    res.render('pages/chat',{
        chats: user_chats,
        curr_chat: open_chat,
        chat_messages: chat_messages,
        loggedIn: true
    });
})


module.exports = router;
