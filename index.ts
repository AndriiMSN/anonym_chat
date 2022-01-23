require("dotenv").config();

const {commands, reply_markup, messages} = require("./commands");

const TOKEN: string | undefined = process.env.tgToken;
const PORT: string | 3000 = process.env.PORT || 3000;
const DOMAIN: string | undefined = process.env.DOMAIN

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(TOKEN, {polling: true});

type anyObject = {
    [key: string]: any
}

const db: anyObject = {}

const menQueue: string[] = []
const womenQueue: string[] = []
const chats: {
    [key: string]: string
} = {}

bot.on("message", async (msg: anyObject) => {
    const {text} = msg;
    switch (text) {
        case  (commands.START):
            if (db[`${msg.from.id}`]) {
                return
            }
            if (chats[`${msg.from.id}`]) {
                return await bot.sendMessage(msg.from.id, messages.IN_CHAT)
            }
            try {
                return await bot.sendMessage(msg.from.id, messages.START, {
                    reply_markup: {
                        inline_keyboard: reply_markup.START_INLINE
                    }
                })
            } catch (e) {
                return await bot.sendMessage(msg.from.id, messages.ERROR)
            }
            break;
        case (commands.SEARCH):
            if (!db[`${msg.from.id}`]) {
                return await bot.sendMessage(msg.from.id, messages.ERROR_PROFILE)
            }
            if (chats[`${msg.from.id}`]) {
                return await bot.sendMessage(msg.from.id, messages.IN_CHAT)
            }
            if (menQueue.includes(msg.from.id) || womenQueue.includes(msg.from.id)) {
                return await bot.sendMessage(msg.from.id, messages.IN_SEARCH_CHAT);
            }
            try {
                const {sex} = db[`${msg.from.id}`]
                if (sex === "M") {
                    if (womenQueue.length > 0) {
                        const woman: string | undefined = womenQueue.shift();
                        if (woman) {
                            chats[`${msg.from.id}`] = woman;
                            chats[`${woman}`] = msg.from.id;
                            await bot.sendMessage(msg.from.id, messages.FIND_PARTNER);
                            await bot.sendMessage(woman, messages.FIND_PARTNER);
                            return
                        } else {
                            return await bot.sendMessage(msg.from.id, messages.ERROR, {
                                reply_markup: {
                                    keyboard: reply_markup.DEFAULT_KEYBOARD,
                                    resize_keyboard: true
                                }
                            })
                        }
                    } else if (womenQueue.length === 0) {
                        menQueue.push(msg.from.id)
                        return
                    }

                } else if (sex === "W") {
                    if (menQueue.length > 0) {
                        const man: string | undefined = menQueue.shift();
                        if (man) {
                            chats[`${msg.from.id}`] = man;
                            chats[`${man}`] = msg.from.id;
                            await bot.sendMessage(msg.from.id, messages.FIND_PARTNER);
                            await bot.sendMessage(man, messages.FIND_PARTNER);
                            return
                        } else {
                            return await bot.sendMessage(msg.from.id, messages.ERROR, {
                                reply_markup: {
                                    keyboard: reply_markup.DEFAULT_KEYBOARD,
                                    resize_keyboard: true
                                }
                            })
                        }
                    } else if (menQueue.length === 0) {
                        womenQueue.push(msg.from.id)
                        return
                    }
                } else {
                    return await bot.sendMessage(msg.from.id, messages.ERROR_PROFILE)
                }
            } catch (e) {
                return await bot.sendMessage(msg.from.id, messages.ERROR)
            }
            break;
        case (commands.LEAVE_CHAT):
            if (chats[`${msg.from.id}`]) {
                const partner = chats[`${msg.from.id}`]
                delete chats[partner]
                delete chats[`${msg.from.id}`]

                await bot.sendMessage(msg.from.id, messages.LEAVE_CHAT, {
                    keyboard: reply_markup.DEFAULT_KEYBOARD,
                    resize_keyboard: true
                })

                await bot.sendMessage(partner, messages.LEAVE_CHAT_PARTNER, {
                    keyboard: reply_markup.DEFAULT_KEYBOARD,
                    resize_keyboard: true
                })
            }
            break;
        default:
            console.log(msg)
            if (chats[`${msg.from.id}`]) {
                await bot.sendMessage(chats[`${msg.from.id}`], text)
            }
            return

    }
})


bot.on('callback_query', async (query: any) => {
    switch (query.data) {
        case ('CREATE_PROFILE'):
            try {
                return await bot.sendMessage(query.from.id, messages.START_SEX, {
                    reply_markup: {
                        inline_keyboard: reply_markup.START_SEX_INLINE
                    }
                })
            } catch (e) {
                return await bot.sendMessage(query.from.id, messages.ERROR)
            }
        case ('SET_SEX_M'):
            db[`${query.from.id}`] = {
                sex: "M"
            }
            try {
                return await bot.sendMessage(query.from.id, `Ваш пол - 'Мужской'`, {
                    reply_markup: {
                        keyboard: reply_markup.DEFAULT_KEYBOARD,
                        resize_keyboard: true
                    }
                })
            } catch (e) {
                return await bot.sendMessage(query.from.id, messages.ERROR)
            }
        case ('SET_SEX_W'):
            db[`${query.from.id}`] = {
                sex: "W"
            }
            try {
                return await bot.sendMessage(query.from.id, `Ваш пол - 'Женский'`, {
                    reply_markup: {
                        keyboard: reply_markup.DEFAULT_KEYBOARD,
                        resize_keyboard: true
                    }
                })
            } catch (e) {
                return await bot.sendMessage(query.from.id, messages.ERROR)
            }
    }

})
