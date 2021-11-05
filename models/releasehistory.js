const mongoose = require('mongoose');
const releaseHistorySchema = mongoose.Schema({
    releaseNumber: {
        type: String,
        required: true
    },
    customer: {
        type: String,
        required: true
    },
    module: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    status: {
        type: String,
        uppercase: true,
        required: true
    },
    action: {
        type: String,
        uppercase: true
    },
    user: {
        type: String,
        lowercase: true,
        default: 'user'
    }
}, { timestamps: true});
const ReleaseHistory = mongoose.model('ReleaseHistory', releaseHistorySchema);
module.exports = ReleaseHistory;