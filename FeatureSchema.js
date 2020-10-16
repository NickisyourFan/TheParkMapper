const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeatureSchema = new Schema({
    featureName: {
        type: String
    },
    featureDescription: {
        type: String,
    },
    featureType: {
        type: String,
    },
    resDetails: {
        type: Object
    },
    featureLocation: {
        type: Array
    },
    parkId: {
        type: String
    }
})

module.exports = feature = mongoose.model('feature', FeatureSchema)