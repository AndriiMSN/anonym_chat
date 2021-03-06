require("dotenv").config();

const {commands, reply_markup, messages} = require("./commands");

const TOKEN: string | undefined = process.env.tgToken;
// const PORT: string | 3000 = process.env.PORT || 3000;
// const DOMAIN: string | undefined = process.env.DOMAIN

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(TOKEN, {polling: true});

const mongoose = require("./db");
const Users = require("./schemas/users")
const Messages = require("./schemas/messages")

type anyObject = {
    [key: string]: any
}
type User = {
    idTG: string,
    idMongo: string
}

const menQueue: User[] = []
const womenQueue: User[] = []
const chats: {
    [key: string]: User
} = {}


bot.setMyCommands([
    ...Object.keys(commands).reduce((accum: any, item) => {
        if (/^\//.test(commands[`${item}`])) {
            const command: {
                command?: string,
                description?: string
            } = {};
            command.command = commands[`${item}`];
            command.description = commands[`${item}_DESCRIPTION`] || commands[`${item}`];
            accum.push(command);
        }
        return accum
    }, [])
])

bot.on("message", async (msg: anyObject) => {
    const {text} = msg;

    switch (text) {
        case  (commands.START): {
            if (chats[`${msg.from.id}`]) {
                return await bot
                    .sendMessage(msg.from.id, messages.IN_CHAT)
                    .catch((e: any) => {
                        console.log(e)
                    })
            }

            let user = await Users.findOne({
                id: {$eq: msg.from.id}
            }).catch(async (e: any) => {
                console.log(e)
                return await bot
                    .sendMessage(msg.from.id, messages.SERVER_ERROR)
                    .catch((e: any) => {
                        console.log(e)
                    })
            })

            if (user) {
                return await bot
                    .sendMessage(msg.from.id, messages.START_USER)
                    .catch((e: any) => {
                        console.log(e)
                    })
            } else {
                return await bot
                    .sendMessage(msg.from.id, messages.START, {
                        reply_markup: {
                            inline_keyboard: reply_markup.START_INLINE
                        }
                    }).catch((e: any) => {
                        console.log(e)
                    })
            }
        }
        case (commands.CHANGE_SEX): {
            if (chats[`${msg.from.id}`]) {
                return await bot
                    .sendMessage(msg.from.id, messages.IN_CHAT)
                    .catch((e: any) => {
                        console.log(e)
                    })
            }
            return await bot
                .sendMessage(msg.from.id, messages.START_SEX, {
                    reply_markup: {
                        inline_keyboard: reply_markup.START_SEX_INLINE
                    }
                }).catch((e: any) => {
                    console.log(e)
                })
        }
        case (commands.SEARCH_COMMAND): {
            if (chats[`${msg.from.id}`]) {
                return await bot
                    .sendMessage(msg.from.id, messages.IN_CHAT)
            }

            let user = await Users.findOne({
                id: {$eq: msg.from.id}
            }).catch(async (e: any) => {
                console.log(e)
                return await bot
                    .sendMessage(msg.from.id, messages.SERVER_ERROR)
                    .catch((e: any) => {
                        console.log(e)
                    })
            })

            if (!user || !user?.sex) {
                return await bot
                    .sendMessage(msg.from.id, messages.ERROR_PROFILE, {
                        reply_markup: {
                            inline_keyboard: reply_markup.START_INLINE
                        }
                    }).catch((e: any) => {
                        console.log(e)
                    })
            }

            const {sex} = user;
            if (
                (sex === 'M' && menQueue.find(el => el.idTG === msg.from.id)) ||
                (sex === 'W' && womenQueue.find(el => el.idTG === msg.from.id))
            ) {
                return await bot
                    .sendMessage(msg.from.id, messages.IN_SEARCH_CHAT)
                    .catch((e: any) => {
                        console.log(e)
                    })
            }

            if (sex === "M") {

                if (womenQueue.length > 0) {
                    const woman: User | undefined = womenQueue.shift();

                    if (woman) {
                        chats[`${msg.from.id}`] = woman;
                        chats[`${woman.idTG}`] = {
                            idTG: msg.from.id,
                            idMongo: user._id
                        }

                        await bot
                            .sendMessage(msg.from.id, messages.FIND_PARTNER)
                            .catch(async (e: any) => {
                                console.log(e)

                                delete chats[`${woman.idTG}`]
                                delete chats[`${msg.from.id}`]

                                return await bot
                                    .sendMessage(woman.idTG, messages.ERROR_SEND)
                                    .catch((e: any) => {
                                        console.log(e)
                                    })
                            })

                        await bot
                            .sendMessage(woman.idTG, messages.FIND_PARTNER)
                            .catch(async (e: any) => {
                                console.log(e)

                                delete chats[`${woman.idTG}`]
                                delete chats[`${msg.from.id}`]

                                return await bot
                                    .sendMessage(msg.from.id, messages.ERROR_SEND)
                                    .catch((e: any) => {
                                        console.log(e)
                                    })
                            })
                        return
                    } else {
                        return await bot
                            .sendMessage(msg.from.id, messages.ERROR)
                            .catch((e: any) => {
                                console.log(e)
                            })
                    }
                } else if (womenQueue.length === 0) {
                    menQueue.push({
                        idTG: msg.from.id,
                        idMongo: user._id
                    })
                    return bot
                        .sendMessage(msg.from.id, "???? ???????????? ?? ??????????????")
                        .catch((e: any) => {
                            console.log(e)
                        })
                }

            } else if (sex === "W") {

                if (menQueue.length > 0) {
                    const man: User | undefined = menQueue.shift();

                    if (man) {
                        chats[`${msg.from.id}`] = man;
                        chats[`${man.idTG}`] = {
                            idTG: msg.from.id,
                            idMongo: user._id
                        };

                        await bot
                            .sendMessage(msg.from.id, messages.FIND_PARTNER)
                            .catch(async (e: any) => {
                                console.log(e)

                                delete chats[`${man.idTG}`]
                                delete chats[`${msg.from.id}`]

                                return await bot
                                    .sendMessage(man.idTG, messages.ERROR_SEND)
                                    .catch((e: any) => {
                                        console.log(e)
                                    })
                            })

                        await bot
                            .sendMessage(man.idTG, messages.FIND_PARTNER)
                            .catch(async (e: any) => {
                                console.log(e)

                                delete chats[`${man.idTG}`]
                                delete chats[`${msg.from.id}`]

                                return await bot
                                    .sendMessage(msg.from.id, messages.ERROR_SEND)
                                    .catch((e: any) => {
                                        console.log(e)
                                    })
                            })

                        return

                    } else {
                        return await bot
                            .sendMessage(msg.from.id, messages.ERROR)
                            .catch((e: any) => {
                                console.log(e)
                            })
                    }
                } else if (menQueue.length === 0) {
                    womenQueue.push({
                        idTG: msg.from.id,
                        idMongo: user._id
                    })
                    return bot
                        .sendMessage(msg.from.id, "???? ???????????? ?? ??????????????")
                        .catch((e: any) => {
                            console.log(e)
                        })
                }
            } else {
                return await bot
                    .sendMessage(msg.from.id, messages.ERROR_PROFILE, {
                        reply_markup: {
                            inline_keyboard: reply_markup.START_SEX_INLINE
                        }
                    }).catch((e: any) => {
                        console.log(e)
                    })
            }
            break;
        }
        case (commands.LEAVE_CHAT): {
            if (chats[`${msg.from.id}`]) {
                const partner = chats[`${msg.from.id}`].idTG
                delete chats[partner]
                delete chats[`${msg.from.id}`]

                await bot
                    .sendMessage(msg.from.id, messages.LEAVE_CHAT)
                    .catch((e: any) => {
                        console.log(e)
                    })

                await bot
                    .sendMessage(partner, messages.LEAVE_CHAT_PARTNER)
                    .catch((e: any) => {
                        console.log(e)
                    })

                return
            }
            return await bot
                .sendMessage(msg.from.id, messages.NOT_IN_CHAT)
                .catch((e: any) => {
                    console.log(e)
                })
        }
        case (commands.GET_IN_SEARCH_ALL): {
            const inSearchString = `
            ?????? : *???????????? ?? ????????????* ${menQueue.length + womenQueue.length}. 
            *??????????????* ${womenQueue.length}. 
            *????????????* ${menQueue.length}`
            return await bot
                .sendMessage(msg.from.id, inSearchString)
                .catch((e: any) => {
                    console.log(e)
                })
        }
        case (commands.CHECK_STATUS): {
            if (chats[`${msg.from.id}`]) {
                return await bot
                    .sendMessage(msg.from.id, messages.IN_CHAT)
                    .catch((e: any) => {
                        console.log(e)
                    })
            } else {
                return await bot
                    .sendMessage(msg.from.id, messages.NOT_IN_CHAT)
                    .catch((e: any) => {
                        console.log(e)
                    })
            }
        }
        case(commands.HELP): {
            const help = Object.keys(commands).reduce((accum: string, item) => {
                if (/^\//.test(commands[`${item}`])) {
                    accum += commands[`${item}`] + ' ' + (commands[`${item}_DESCRIPTION`] || '') + '\n';
                }
                return accum
            }, '')

            return await bot
                .sendMessage(msg.from.id, help)
                .catch((e: any) => {
                    console.log(e)
                })
        }
        default: {
            if (chats[`${msg.from.id}`]) {

                const receiver = chats[`${msg.from.id}`]

                await Messages.create({
                    sender: chats[`${receiver.idTG}`].idMongo,
                    receiver: receiver.idMongo,
                    message: text
                }).catch(async (e: any) => {
                    console.log(e)
                    // delete chats[`${receiver.idTG}`]
                    // delete chats[`${msg.from.id}`]
                    //
                    // await bot.sendMessage(msg.from.id, "?????????????????? ???????????? ??????????????, ?????? ????????????????", {
                    //     reply_markup: {
                    //         keyboard: reply_markup.DEFAULT_KEYBOARD,
                    //         resize_keyboard: true
                    //     }
                    // }).catch((e: any) => {
                    //     console.log(e)
                    // })
                    // await bot.sendMessage(receiver.idTG, "?????????????????? ???????????? ??????????????, ?????? ????????????????", {
                    //     reply_markup: {
                    //         keyboard: reply_markup.DEFAULT_KEYBOARD,
                    //         resize_keyboard: true
                    //     }
                    // }).catch((e: any) => {
                    //     console.log(e)
                    // })
                })

                if (text) {
                    await bot
                        .sendMessage(receiver.idTG, text)
                        .catch(async (e: any) => {
                            console.log(e)

                            delete chats[`${receiver.idTG}`]
                            delete chats[`${msg.from.id}`]

                            await bot
                                .sendMessage(msg.from.id, messages.ERROR_SEND)
                                .catch((e: any) => {
                                    console.log(e)
                                })
                        })
                }
            }
            return
        }
    }
})


bot.on('callback_query', async (query: any) => {
    switch (query.data) {
        case ('CREATE_PROFILE'): {
            return await bot
                .sendMessage(query.from.id, messages.START_SEX, {
                    reply_markup: {
                        inline_keyboard: reply_markup.START_SEX_INLINE
                    }
                }).catch((e: any) => {
                    console.log(e)
                })
        }
        case ('SET_SEX_M'): {
            await Users.findOneAndUpdate({
                id: query.from.id,
            }, {
                sex: "M",
                first_name: query.from.first_name,
                last_name: query.from.last_name,
                username: query.from.username
            }, {
                new: true,
                upsert: true
            }).catch(async (e: string) => {
                return await bot
                    .sendMessage(query.from.id, messages.SERVER_ERROR, {
                        reply_markup: {
                            inline_keyboard: reply_markup.START_SEX_INLINE
                        }
                    }).catch((e: any) => {
                        console.log(e)
                    })
            })

            return await bot
                .sendMessage(query.from.id, messages.SEX_M)
                .catch((e: any) => {
                    console.log(e)
                })
        }
        case ('SET_SEX_W'): {
            await Users.findOneAndUpdate({
                id: query.from.id,
            }, {
                sex: "W",
                first_name: query.from.first_name,
                last_name: query.from.last_name,
                username: query.from.username
            }, {
                new: true,
                upsert: true
            }).catch(async () => {
                return await bot.sendMessage(query.from.id, messages.SERVER_ERROR, {
                    reply_markup: {
                        inline_keyboard: reply_markup.START_SEX_INLINE
                    }
                }).catch((e: any) => {
                    console.log(e)
                })
            })

            return await bot
                .sendMessage(query.from.id, messages.SEX_W)
                .catch((e: any) => {
                    console.log(e)
                })
        }
    }
})
