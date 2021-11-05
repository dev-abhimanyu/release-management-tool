const mongoose = require('mongoose');
const statusSchema = mongoose.Schema({
    status: {
        type: String,
        uppercase: true,
        required: true
    },
    isCompleteState: {
        type: Boolean,
        default: false
    }
}, { timestamps: true});
const StatusConfig = mongoose.model('StatusConfig', statusSchema);
module.exports = StatusConfig;