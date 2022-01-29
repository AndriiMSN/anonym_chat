// @ts-ignore
const mongoose = require('mongoose');
// @ts-ignore
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: {type: Schema.Types.ObjectId, ref: 'Users'},
    receiver: {type: Schema.Types.ObjectId, ref: 'Users'},
    message: {type: String, trim: true},
}, {timestamps: true});

module.exports = mongoose.model('Message', messageSchema);
