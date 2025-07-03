const axios = require("axios");

module.exports = async function getCoordinates(location) {
    try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
            params: {
                q: location,
                format: "json",
                limit: 1
            },
            headers: {
                "User-Agent": "wanderlust-app" // Required by OSM's Nominatim API
            }
        });

        if (response.data.length === 0) {
            throw new Error("Location not found");
        }

        const { lat, lon } = response.data[0];
        return {
            type: "Point",
            coordinates: [parseFloat(lon), parseFloat(lat)]
        };
    } catch (err) {
        console.error("Geocoding failed:", err);
        throw err;
    }
};
