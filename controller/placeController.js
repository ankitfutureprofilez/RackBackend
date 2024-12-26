const axios = require('axios');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/Logger');

exports.getPlaceDetails = catchAsync(
    async (req, res) => {
        const { placeId } = req.params;
        if (!placeId) {
            return res.status(400).json({ error: 'Place ID is required' });
        }
        try {
            // Fetch Google Place details from Google API
            const API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Replace with your actual Google API key
            const placeUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${API_KEY}`;
            const placeResponse = await axios.get(placeUrl);
            if (placeResponse.data.status !== 'OK') {
                throw new Error(placeResponse.data.error_message || 'Failed to fetch place details');
            }
            // Extract place details from the Google API response
            const placeDetails = placeResponse.data.result;

            // Extract image URLs from photo references
            const photoUrls = placeDetails.photos ? placeDetails.photos.map(photo => {
                return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${API_KEY}`;
            }) : [];

            // Add photo URLs to the place details
            placeDetails.photoUrls = photoUrls;

            const response = {
                success: true,
                data: placeDetails,
            };

            return res.status(200).json(response);
        } catch (error) {
            console.error("Error:", error); // Log the error for debugging
            logger.error("Error in place controller api:", error)
            return res.status(500).json({ success: false, error: error.message });
        }
    }
);


exports.searchPlaces = catchAsync(
    async (req, res) => {
        const { query } = req.query;
        const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Replace with your actual API key
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

        try {
            const response = await axios.get(url);
            let results = response.data.results;
            // Filter results to include only those with photos
            results = results.filter(place => place.photos && place.photos.length > 0);
            if (results.length === 0) { return res.status(200).json({ status: false, query: query, data: [], totalResults: 0, message: "No places found with photos" }); }
            res.json({
                status: true,
                query: query,
                data: results,
                totalResults: results.length,
                message: "Find Place "
            });
        } catch (error) {
            res.status(500).send('An error occurred while fetching data');
        }
    }
);


