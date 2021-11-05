const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    user: {
        type: String,
        lowercase: true,
        required: true
    },
    pass: {
        type: String,
        default: 'admin123',
        required: true
    },
    lastmodifiedby: {
        type: String,
        lowercase: true
    }
}, { timestamps: true});
const ConfigUser = mongoose.model('ConfigUser', userSchema);
module.exports = ConfigUser;