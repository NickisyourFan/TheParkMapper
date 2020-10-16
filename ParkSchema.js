const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParkSchema = new Schema({
    parkName: {
        type: String
    },
    location: {
        type: Object,
    },
    userId: {
        type: String,
    },
    address: {
        type: String,
    },
    parkName: {
        type: String,
    },
    description: {
        type: String,
    }
}) 



module.exports = park = mongoose.model('park', ParkSchema)
