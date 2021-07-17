const express = require('express');
const router = express.Router();
var User = require('../models').User;
var Chat = require('../models').Chat;
var ChatLine = require('../models').ChatLine;
const { Op,QueryTypes } = require("sequelize");
const { check, validationResult } = require('express-validator');
const ensureAuthenticated = require("./auth")

router.get('/', async (req,res) => {
    const curr_user_id = 1;
    const user_chats = await ChatLine.findAll({
        where: {
            user_id: {
                [Op.eq] : curr_user_id
            },
            line_text:{
                [Op.eq] : '::'
            }
        },
        include: [
            {model: User}
        ],
    });
    let open_chat = null;
    let chat_messages = null;
    if(user_chats){
        open_chat = await Chat.findOne({
            where: {
                id: {
                    [Op.eq] : user_chats[0].dataValues.chat_id
                }
            }
        });
        chat_messages = await ChatLine.findAll({
            where:{
                chat_id:{
                    [Op.eq] : open_chat.id
                },
                line_text: {
                    [Op.ne] : '::'
                }
            },
            order: [['createdAt','DESC']],
            include: [
                {model: User}
            ]
        });
    }
    console.log(user_chats,open_chat,chat_messages);
    res.render('pages/chat',{
        chats: user_chats,
        curr_chat: open_chat,
        chat_messages: chat_messages
    });
})

router.get('/:id', async (req,res) => {
    const curr_user_id = 1;
    const user_chats = await ChatLine.findAll({
        where: {
            user_id: {
                [Op.eq] : curr_user_id
            },
            chat_id: {
                [Op.eq] : req.params.id
            },
            line_text : {
                [Op.eq] : '::'
            }
        },
        include: [
            {model: User}
        ],
    });
    const open_chat = await Chat.findAll({
        where: {
            id: {
                [Op.eq] : req.params.id
            },
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
        order: [['createdAt','DESC']],
        include: [
            {model: User}
        ],
    });
    console.log(chat_messages);
    res.render('pages/chat',{
        chats: user_chats,
        curr_chat: open_chat,
        chat_messages: chat_messages
    });
})


router.post('/:id/send',[
    check('message').not().isEmpty()
], async (req,res) => {
    const curr_user_id = 1;
    const message = req.body.message

    const chat_message = await ChatLine.create({
        user_id: curr_user_id,
        chat_id: req.params.id,
        line_text: message,
    });
    chat_message.save();


    console.log(chat_message)
    res.redirect(`/chat/${req.params.id}`);
});


router.get('/create/:user_id', async (req,res) => {
    const curr_user_id = 1;
    const user_id = req.params.user_id;
    let check = null;
    const curr_user_chats = await ChatLine.findAll({
        where: {
            user_id: {
                [Op.eq] : curr_user_id
            }
        }
    });
    const other_user_chats = await ChatLine.findAll({
        where: {
            user_id: {
                [Op.eq] : user_id
            }
        }
    });
    var if_exist = false;
    var chat_id = null;
    let m = Math.max(curr_user_chats.length, other_user_chats.length);
    for (let i = 0; i < m && !if_exist; ++i) {
        let curr_user_chat = curr_user_chats[i%curr_user_chats.length];
        let other_user_chat = other_user_chats[i%other_user_chats.length];
        if(curr_user_chat.dataValues.chat_id == other_user_chat.dataValues.chat_id){
            if_exist = true;
            chat_id = curr_user_chat.dataValues.chat_id;
        }
    }
    if(if_exist){
        res.redirect(`/chat/${chat_id}`);
    } else {
        const new_chat = await Chat.create({
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const new_chat_lines = await ChatLine.bulkcreate([
            {
                user_id: curr_user_id,
                chat_id: new_chat.id,
                line_text: '::',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                user_id: user_id,
                chat_id: new_chat.id,
                line_text: '::',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
        res.redirect(`/chat/${new_chat.id}`);
    }
});

module.exports = router;
