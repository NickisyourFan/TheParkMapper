const express = require('express');
const router = express.Router();

const Park = require('./ParkSchema');
const Feature = require('./FeatureSchema');

//Get User Park
router.get('/GetMyPark/:userId', (req, res) => {
    Park.find({userId: req.params.userId}).then(r => res.json(r))
});

//Get Park Name
router.get('/GetParkName/:userId', (req, res) => {
    Park.find({userId: req.params.userId}).then(r => res.json({
        parkName: r[0].parkName,
        parkId: r[0]._id
    }))
})

//Get Park Features 
router.get('/GetParkFeatures/:parkId', (req, res) => {
    Feature.find({parkId: req.params.parkId}).then(r => res.json(r))
})

//Update Park Info
router.put('/saveParkInfo/:_id', (req, res) => {
    Park.findByIdAndUpdate({_id: req.params._id}, req.body).then(() => {
        Park.findById({_id: req.params._id}).then(r => res.json(r))
    })
})


//Post New Park
router.post('/NewPark', (req, res) => {
    let newPark = new Park({
        location: req.body.location,
        userId: req.body.userId,
        address: req.body.address,
        parkName: req.body.parkName,
    })
    newPark.save().then(r => res.json(r))
});

//Post New Feature
router.post('/NewFeature', (req, res) => {
    let newFeature = new Feature({
        featureName: req.body.featureName,
        featureDescription: req.body.featureDescription, 
        featureType: req.body.featureType,
        resDetails: req.body.resDetails, 
        featureLocation: req.body.featureLocation,
        parkId: req.body.parkId,
    })
    newFeature.save().then(r => res.json(r));
})

module.exports = router;