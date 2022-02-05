export const commands = {
    CHECK_STATUS: "/check",
    CHECK_STATUS_DESCRIPTION: "Статус в чате или нет",
    LEAVE_CHAT: "/leave",
    LEAVE_CHAT_DESCRIPTION: "Завершить чат",
    SEARCH_COMMAND: "/search",
    SEARCH_COMMAND_DESCRIPTION: "Искать собеседника",
    GET_IN_SEARCH_ALL: "/get_in_search",
    GET_IN_SEARCH_ALL_DESCRIPTION: "К-во в очереди",
    CHANGE_SEX: "/change_sex",
    CHANGE_SEX_DESCRIPTION: "Сменить пол",
    HELP: "/help",
    HELP_DESCRIPTION: "Список команд",
    START: '/start',
    START_DESCRIPTION: 'start',
}

export const reply_markup = {
    START_INLINE: [
        [{text: 'Создать профиль', callback_data: 'CREATE_PROFILE',}]
    ],
    START_SEX_INLINE: [
        [{text: 'Я парень', callback_data: 'SET_SEX_M',}],
        [{text: 'Я девушка', callback_data: 'SET_SEX_W',}]
    ],
}

export const messages = {
    ERROR: `Бот: Попробуйте еще раз, произошла ошибка... упс ${commands.SEARCH_COMMAND} - ${commands.SEARCH_COMMAND_DESCRIPTION}`,
    ERROR_PROFILE: "Бот: Профиль не заполнен...",
    ERROR_SEND: `Бот : Произошла ошибка, чат завершен.  ${commands.SEARCH_COMMAND} - ${commands.SEARCH_COMMAND_DESCRIPTION}`,
    FIND_PARTNER: `Бот: Собеседник найден. ${commands.LEAVE_CHAT} - ${commands.LEAVE_CHAT_DESCRIPTION}`,
    IN_CHAT: `Бот: Вы сейчас в чате. ${commands.LEAVE_CHAT} - ${commands.LEAVE_CHAT_DESCRIPTION}`,
    IN_SEARCH_CHAT: "Бот: Вы уже в очереди",
    LEAVE_CHAT: `Бот: Вы завершили чат. ${commands.SEARCH_COMMAND} - ${commands.SEARCH_COMMAND_DESCRIPTION}`,
    LEAVE_CHAT_PARTNER: `Бот: Собеседник завершил чат. ${commands.SEARCH_COMMAND} - ${commands.SEARCH_COMMAND_DESCRIPTION}`,
    NOT_IN_CHAT: `Бот : Вы не в чате  ${commands.SEARCH_COMMAND} - ${commands.SEARCH_COMMAND_DESCRIPTION}`,
    SERVER_ERROR: "Бот : Произошла ошибка сервера, сообщите @podslushano_pokrovsk_bot",
    SEX_M: `Ваш пол - 'Мужской', введите комманду ${commands.CHANGE_SEX}, что бы сменить пол`,
    SEX_W: `Ваш пол - 'Женский', введите комманду ${commands.CHANGE_SEX}, что бы сменить пол`,
    START: "Бот: Давайте создадим профиль",
    START_SEX: "Бот: Выберите пол",
    START_USER: `Бот : Привет ${commands.HELP} - ${commands.HELP_DESCRIPTION}`,
}
