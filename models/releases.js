const mongoose = require('mongoose');
const releaseSchema = mongoose.Schema({
    releaseNumber: {
        type: String,
        uppercase: true,
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
    user: {
        type: String,
        lowercase: true,
        default: 'user'
    }
}, { timestamps: true});
const Release = mongoose.model('Release', releaseSchema);
module.exports = Release;