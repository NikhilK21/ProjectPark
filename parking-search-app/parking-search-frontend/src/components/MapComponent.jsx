import React, { useEffect, useRef, useState } from "react";

const MapComponent = ({ parkingSpots }) => {
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const [userLocation, setUserLocation] = useState(null);
    let directionsControl = null;
    let trackingControl = null;
    let activePopup = null; // To track the currently open popup

    useEffect(() => {
        if (!window.mappls || !window.mappls.Map) {
            console.warn("⏳ Waiting for MapmyIndia SDK to load...");
            return;
        }

        console.log("✅ MapmyIndia SDK Loaded");

        // Initialize the map
        mapRef.current = new window.mappls.Map("map", {
            center: { lat: 28.612964, lng: 77.229463 },
            zoom: 12,
        });

        // Get user's live location
        getUserLocation();

        mapRef.current.addListener("load", () => {
            console.log("🗺️ Map has fully loaded.");
            if (parkingSpots && parkingSpots.length > 0) {
                addMarkers();
            } else {
                console.warn("⚠️ No parking spots available.");
            }
        });

        return () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
        };
    }, [parkingSpots]);

    // Function to get user's live location
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("📍 User Location:", latitude, longitude);
                    setUserLocation({ lat: latitude, lng: longitude });

                    new window.mappls.Marker({
                        map: mapRef.current,
                        position: { lat: latitude, lng: longitude },
                        icon: "https://maps.mapmyindia.com/images/1.png",
                        popupHtml: `<b>📍 You are here</b>`,
                    });

                    mapRef.current.setCenter({ lat: latitude, lng: longitude });
                },
                (error) => {
                    console.error("❌ Error getting location:", error.message);
                }
            );
        } else {
            console.error("❌ Geolocation is not supported by this browser.");
        }
    };

    // Function to add parking spot markers
    const addMarkers = () => {
        if (!mapRef.current) {
            console.warn("⚠️ Map is not initialized yet.");
            return;
        }

        console.log("🚗 Adding parking spot markers:", parkingSpots);

        parkingSpots.forEach((spot) => {
            let lat = parseFloat(spot.latitude);
            let lng = parseFloat(spot.longitude);

            if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                console.error(`❌ Skipping invalid coordinates for ${spot.name}:`, { lat, lng });
                return;
            }

            console.log(`📍 Adding marker at: ${lat}, ${lng}`);

            const marker = new window.mappls.Marker({
                map: mapRef.current,
                position: { lat, lng },
                icon: "https://maps.mapmyindia.com/images/2.png",
                draggable: false,
                popupOptions: true,
                popupHtml: `<div style="max-width: 250px;">
                                <h3>${spot.name}</h3>
                                <p><strong>Fare:</strong> ₹${spot.fare ? spot.fare : "N/A"}</p>
                                <p><strong>Amenities:</strong> ${spot.amenities ? spot.amenities.join(", ") : "No details"}</p>
                                <button onclick="window.showRoute(${lat}, ${lng})">🛣️ Show Route</button>
                                <button onclick="window.getDirections(${lat}, ${lng})">🚗 Get Directions</button>
                            </div>`,
            });

            marker.addListener("click", () => {
                showRoute(lat, lng);
                if (activePopup) {
                    activePopup.close(); // Close previously active popup
                }
                activePopup = marker.getPopup();
            });

            markersRef.current.push(marker);
        });

        console.log("✅ Markers added.");
    };

    // Function to show route when a marker is clicked
    window.showRoute = (destLat, destLng) => {
        if (!userLocation) {
            console.error("❌ User location not available.");
            return;
        }

        console.log(`🛣️ Showing route from User (${userLocation.lat}, ${userLocation.lng}) to Parking Spot (${destLat}, ${destLng})`);

        if (!window.mappls || !window.mappls.direction) {
            console.error("❌ Mappls Directions Plugin not loaded.");
            return;
        }

        // Remove existing directions if any
        if (directionsControl) {
            directionsControl.remove();
        }

        // Show route using Directions API
        directionsControl = new window.mappls.direction({
            map: mapRef.current,
            start: `${userLocation.lat},${userLocation.lng}`,
            end: `${destLat},${destLng}`,
            resource: "route_eta",
            profile: "driving",
            fitBounds: true,
        });

        console.log("🚗 Route displayed.");
    };

    // Function to start live tracking and remove the route
    window.getDirections = (destLat, destLng) => {
        if (!userLocation) {
            alert("❌ User location not available!");
            return;
        }

        console.log(`📡 Starting live tracking from (${userLocation.lat}, ${userLocation.lng}) to (${destLat}, ${destLng})`);

        if (!window.mappls || !window.mappls.tracking) {
            console.error("❌ Mappls Tracking Plugin not loaded.");
            return;
        }

        // Remove the existing route before starting tracking
        if (directionsControl) {
            directionsControl.remove();
            directionsControl = null;
            console.log("❌ Removed previous route.");
        }

        // Close the active popup
        if (activePopup) {
            activePopup.close();
            activePopup = null;
            console.log("❌ Closed active popup.");
        }

        // Remove existing tracking if any
        if (trackingControl) {
            trackingControl.remove();
        }

        trackingControl = new window.mappls.tracking({
            map: mapRef.current,
            start: { geoposition: `${userLocation.lat},${userLocation.lng}` },
            end: { geoposition: `${destLat},${destLng}` },
            resource: "route_eta",
            profile: "driving",
            fitBounds: true,
            strokeWidth: 7,
            routeColor: "black",
            dasharray: [2, 2],
        });

        console.log("✅ Live tracking started.");
    };

    return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default MapComponent;
