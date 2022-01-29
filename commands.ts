export const commands = {
    SEARCH: "Искать собеседника",
    LEAVE_CHAT: "/leave",
    GET_IN_SEARCH_ALL: "/get_in_search",
    CHANGE_SEX: "/change_sex",
    START: '/start',
    LEAVE_CHAT_DESCRIPTION: "Завершить чат",
    GET_IN_SEARCH_ALL_DESCRIPTION: "К-во в очереди",
    CHANGE_SEX_DESCRIPTION: "Сменить пол",
    LEAVE_CHAT_BUTTON: "Покинуть чат",
}

export const reply_markup = {
    START_INLINE: [
        [{text: 'Создать профиль', callback_data: 'CREATE_PROFILE',}]
    ],
    START_SEX_INLINE: [
        [{text: 'Я парень', callback_data: 'SET_SEX_M',}],
        [{text: 'Я девушка', callback_data: 'SET_SEX_W',}]
    ],
    DEFAULT_KEYBOARD: [[commands.SEARCH]],
    IN_CHAT_KEYBOARD: [[commands.LEAVE_CHAT_BUTTON]]
}

export const messages = {
    START: "Бот: Давайте создадим профиль",
    START_USER: "Бот : Привет",
    START_SEX: "Бот: Выберите пол",
    FIND_PARTNER: "Бот: Собеседник найден",
    ERROR: "Бот: Попробуйте еще раз, произошла ошибка... упс",
    ERROR_PROFILE: "Бот: Профиль не заполнен...",
    IN_SEARCH_CHAT: "Бот: Вы уже в очереди",
    IN_CHAT: "Бот: Вы сейчас в чате",
    LEAVE_CHAT: "Бот: Вы завершили чат",
    LEAVE_CHAT_PARTNER: "Бот: Собеседник завершил чат",
    NOT_IN_CHAT: "Бот : Вы не в чате"
}
