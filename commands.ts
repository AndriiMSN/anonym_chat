export const commands = {
    START: '/start',
    SEARCH: "Искать собеседника",
    LEAVE_CHAT: "/leave"
}

export const reply_markup = {
    START_INLINE: [
        [{text: 'Создать профиль', callback_data: 'CREATE_PROFILE',}]
    ],
    START_SEX_INLINE: [
        [{text: 'Я парень', callback_data: 'SET_SEX_M',}],
        [{text: 'Я девушка', callback_data: 'SET_SEX_W',}]
    ],
    DEFAULT_KEYBOARD: [[commands.SEARCH]]
}

export const messages = {
    START: "Давайте создадим профиль",
    START_SEX: "Выберите пол",
    FIND_PARTNER: "Собеседник найден",
    ERROR: "Попробуйте еще раз, произошла ошибка... упс",
    ERROR_PROFILE: "Профиль не заполнен...",
    IN_SEARCH_CHAT:"Вы уже в очереди",
    IN_CHAT: "Вы сейчас в чате",
    LEAVE_CHAT:"Вы завершили чат",
    LEAVE_CHAT_PARTNER:"Собеседник завершил чат"
}
