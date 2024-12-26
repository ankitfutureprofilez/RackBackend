const express = require('express');
const router = express.Router();
const { getPlaceDetails, searchPlaces } = require('../controller/placeController');

// Initialize the router

// Define the route
router.get('/get-place-details/:placeId', getPlaceDetails);

router.get('/get-place', searchPlaces);


module.exports = router;
