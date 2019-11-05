const mongoose = require('mongoose');

const orgSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true, unique: true},
    founded: {type: Number, required: true},
    revenue: String,
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orgSchema',
        required: false
    }
});

module.exports = mongoose.model('Organization', orgSchema);