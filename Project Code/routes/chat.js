const express = require('express');
const router = express.Router();
var Chat = require('../models').Chat;
var ChatLine = require('../models').ChatLine;
const { Op } = require("sequelize")
const ensureAuthenticated = require("./auth")

router.get('/',ensureAuthenticated, async (req,res) => {
    const curr_user_id = req.user.id;
    const user_chats = await ChatLine.findAll({
        where: {
            user_id: {
                [Op.eq] : curr_user_id
            }
        },
        group: 'chat_id'
    });
    const open_chat = user_chats[0].dataValues;
    const chat_messages = await ChatLine.findAll({
        where:{
            chat_id:{
                [Op.eq] : open_chat.id
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
        chat_messages: chat_messages
    });
})

router.get('/:id',ensureAuthenticated, async (req,res) => {
    const curr_user_id = req.user.id;
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
        chat_messages: chat_messages
    });
})


router.post('/:id/send',[
    check('message').not().isEmpty()
],ensureAuthenticated, async (req,res) => {
    const curr_user_id = req.user.id;
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
        user_id: req.user.id,
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
        chat_messages: chat_messages
    });
})

module.exports = router;