const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const passport = require('passport');
var User = require('../models').User;
var Chat = require('../models').Chat;
var ChatLine = require('../models').ChatLine;
const { Op } = require("sequelize")
const ensureAuthenticated = require("./auth")
const path = require('path')

// router.get('/create',async(req,res) => {
//     res.render('')
// });

router.get('/',ensureAuthenticated, async (req,res) => {
    curr_user_id = req.user.id;
    user_chats = await ChatLine.findAll({
        where: {
            user_id: {
                [Op.eq] : curr_user_id
            }
        },
        group: 'chat_id'
    });
    open_chat = user_chats[0].dataValues;
    chat_messages = await ChatLine.findAll({
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



module.exports = router;