// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    id: {type: String, trim: true},
    sex: {type: String, trim: true},
    age: {type: Number},
    first_name: {type: String, trim: true},
    last_name: {type: String, trim: true},
    username: {type: String, trim: true},
}, {timestamps: true});

module.exports = mongoose.model('Users', usersSchema);
