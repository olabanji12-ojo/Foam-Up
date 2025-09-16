import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../utils/environments";
import axiosClient from "../axiosConfiguration/axiosClient";

const CarWashFinderMap = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const navigate = useNavigate();
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedRadius, setSelectedRadius] = useState(10);
  const [carWashes, setCarWashes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  // Load Mapbox scripts
  useEffect(() => {
    const loadScripts = async () => {
      if (document.querySelector('link[href*="mapbox-gl.css"]')) {
        setScriptsLoaded(true);
        return;
      }

      const mapboxCSS = document.createElement("link");
      mapboxCSS.rel = "stylesheet";
      mapboxCSS.href = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css";
      document.head.appendChild(mapboxCSS);

      const mapboxScript = document.createElement("script");
      mapboxScript.src = "https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js";
      mapboxScript.onload = () => setScriptsLoaded(true);
      document.head.appendChild(mapboxScript);
    };

    loadScripts();
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!scriptsLoaded || !mapContainerRef.current || !window.mapboxgl) return;
    if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes("example")) return;

    window.mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [3.3792, 6.5244],
      zoom: 11,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addControl(new window.mapboxgl.NavigationControl(), "top-right");
      map.addControl(new window.mapboxgl.FullscreenControl(), "top-right");
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [scriptsLoaded, MAPBOX_TOKEN]);

  // GET USER'S CURRENT LOCATION
  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        setUserLocation({  
          latitude: userLat,
          longitude: userLng,
          accuracy: position.coords.accuracy,
        });

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [userLng, userLat],
            zoom: 13,
            duration: 2000,
          });
          addUserLocationMarker(userLng, userLat);
        }

        await searchNearbyCarWashes(userLat, userLng, selectedRadius);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Geolocation error:", error);
        let errorMessage = "Could not get your location. ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please enable location access and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  // FETCH NEARBY CAR WASHES FROM BACKEND
  const searchNearbyCarWashes = async (lat, lng, radius) => {
    try {
      const response = await axiosClient.get(`/carwashes/nearby/?lat=${lat}&lng=${lng}&radius=${radius}`);

      const responseData = response.data;
      let carWashData;
      
      if (responseData.success && responseData.data && Array.isArray(responseData.data.carwashes)) {
        carWashData = responseData.data.carwashes;
      } else {
        throw new Error("Invalid response format from server: expected 'data.carwashes' array");
      }

      const formattedCarWashes = carWashData.map((washWrapper, index) => {
        const wash = washWrapper.carwash;
        const distance = washWrapper.distance_km || 0;
        const isWithinRange = washWrapper.is_within_service_range || false;
        
        if (!wash) return null;

        const washId = wash._id?.toString() || wash.id?.toString() || `wash-${index}`;
        const coordinates = Array.isArray(wash.location?.coordinates) && wash.location.coordinates.length === 2
            ? wash.location.coordinates
            : [0, 0];

        const services = Array.isArray(wash.services) ? wash.services : [];
        const prices = services.map(s => s.price).filter(Boolean);
        const priceRange = prices.length
          ? `₦${Math.min(...prices).toLocaleString()} - ₦${Math.max(...prices).toLocaleString()}`
          : "Price not available";

        return {
          id: washId,
          name: wash.name || "Unknown Car Wash",
          description: wash.description || "No description available",
          address: wash.address || wash.Address || "Address not provided",
          coordinates,
          distance: distance,
          isWithinServiceRange: isWithinRange,
          rating: wash.rating || 0,
          services: services.map(s => s.name || "Unnamed Service"),
          price: priceRange,
          phone: wash.phone || "Not provided",
          openingHours: wash.open_hours
            ? Object.entries(wash.open_hours)
                .map(([day, hours]) =>
                  hours.start && hours.end
                    ? `${day}: ${hours.start} - ${hours.end}`
                    : null
                )
                .filter(Boolean)
                .join(", ")
            : "Hours not specified",
        };
      }).filter(Boolean);

      setCarWashes(formattedCarWashes);
      addCarWashMarkers(formattedCarWashes);

    } catch (err) {
      console.error("❌ Error fetching car washes:", err);
      setError(
        err.response?.data?.message?.includes("token")
          ? "Please log in to access nearby car washes."
          : `Failed to fetch nearby car washes: ${err.response?.data?.message || err.message}`
      );
      setCarWashes([]);
    }
  };

  // ADD USER LOCATION MARKER
  const addUserLocationMarker = (lng, lat) => {
    if (!mapRef.current) return;

    const userMarkerElement = document.createElement("div");
    userMarkerElement.innerHTML = "📍";
    userMarkerElement.className = "text-2xl cursor-pointer drop-shadow-lg";

    new window.mapboxgl.Marker({
      element: userMarkerElement,
      anchor: "bottom",
    })
      .setLngLat([lng, lat])
      .setPopup(
        new window.mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2 text-center">
            <h3 class="m-0 mb-2 text-blue-600 font-semibold">📍 Your Location</h3>
            <p class="m-0 text-gray-600 text-sm">
              Accuracy: ±${userLocation?.accuracy?.toFixed(0) || "Unknown"} meters
            </p>
          </div>
        `)
      )
      .addTo(mapRef.current);
  };

  // ADD CAR WASH MARKERS
  const addCarWashMarkers = (carWashList) => {
    if (!mapRef.current) return;
  
    carWashList.forEach((carWash) => {
      if (!carWash.coordinates || !Array.isArray(carWash.coordinates) || carWash.coordinates.length !== 2) return;
      const [lng, lat] = carWash.coordinates;
      if (isNaN(lng) || isNaN(lat)) return;

      const carWashMarkerElement = document.createElement("div");
      carWashMarkerElement.innerHTML = "🚗";
      carWashMarkerElement.className = "text-xl cursor-pointer bg-white border-2 border-green-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg";

      const servicesText = carWash.services.length > 0 
        ? carWash.services.join(", ") 
        : "No services listed";

      const viewProfile = () => {
        console.log("Navigating to car wash profile:", carWash.id);
        navigate(`/carwash-profile/${carWash.id}`);
      };

      const popupContent = `
        <div class="p-4 min-w-[280px] max-w-[350px]">
          <h3 class="m-0 mb-2 text-green-600 font-semibold text-lg">
            🚗 ${carWash.name}
          </h3>
          <div class="mb-2 flex items-center">
            <span class="text-red-500 font-semibold">📏 ${carWash.distance.toFixed(1)} km away</span>
          </div>
          <div class="mb-2">
            <strong>📍 Address:</strong><br/>
            <span class="text-gray-600 text-sm">${carWash.address}</span>
          </div>
          <div class="mb-2 flex items-center">
            <strong>⭐ Rating:</strong>
            <span class="ml-1 text-yellow-400">${"⭐".repeat(Math.floor(carWash.rating))} ${carWash.rating}</span>
          </div>
          <div class="mb-2">
            <strong>💰 Price Range:</strong>
            <span class="text-green-600"> ${carWash.price}</span>
          </div>
          <div class="mb-2">
            <strong>🛠️ Services:</strong><br/>
            <span class="text-gray-600 text-sm">${servicesText}</span>
          </div>
          <div class="mb-2">
            <strong>📞 Phone:</strong>
            <span class="text-blue-500"> ${carWash.phone}</span>
          </div>
          <div class="mb-3">
            <strong>🕒 Hours:</strong>
            <span class="text-gray-600 text-sm"> ${carWash.openingHours}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button onclick="window.getDirections(${lng}, ${lat})" class="px-3 py-1.5 bg-blue-500 text-white text-xs rounded border-none cursor-pointer hover:bg-blue-600 transition-colors">
              🗺️ Get Directions
            </button>
            <button onclick="window.callCarWash('${carWash.phone}')" class="px-3 py-1.5 bg-green-500 text-white text-xs rounded border-none cursor-pointer hover:bg-green-600 transition-colors">
              📞 Call Now
            </button>
            <button onclick="window.viewCarWashProfile('${carWash.id}')" class="px-3 py-1.5 bg-purple-500 text-white text-xs rounded border-none cursor-pointer hover:bg-purple-600 transition-colors">
              👀 View Profile
            </button>
          </div>
        </div>
      `;

      const marker = new window.mapboxgl.Marker({
        element: carWashMarkerElement,
        anchor: "bottom",
      })
        .setLngLat([lng, lat])
        .setPopup(new window.mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
        .addTo(mapRef.current);
    });
  
    if (carWashList.length > 0 && userLocation) {
      const bounds = new window.mapboxgl.LngLatBounds();
      bounds.extend([userLocation.longitude, userLocation.latitude]);
      carWashList.forEach(carWash => {
        if (carWash.coordinates && Array.isArray(carWash.coordinates)) {
          bounds.extend(carWash.coordinates);
        }
      });
      mapRef.current.fitBounds(bounds, { padding: 50, maxZoom: 15 });
    }
  };

  // Define global functions for button clicks
  useEffect(() => {
    window.getDirections = (lng, lat) => {
      if (userLocation) {
        const googleMapsUrl = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${lat},${lng}`;
        window.open(googleMapsUrl, "_blank");
      } else {
        alert("Please allow location access to get directions");
      }
    };

    window.callCarWash = (phoneNumber) => {
      window.location.href = `tel:${phoneNumber}`;
    };

    window.viewCarWashProfile = (carWashId) => {
      navigate(`/carwash-profile/${carWashId}`);
    };

    return () => {
      delete window.getDirections;
      delete window.callCarWash;
      delete window.viewCarWashProfile;
    };
  }, [userLocation, navigate]);

  const handleRadiusChange = async (newRadius) => {
    setSelectedRadius(newRadius);
    if (userLocation) {
      setLoading(true);
      await searchNearbyCarWashes(userLocation.latitude, userLocation.longitude, newRadius);
      setLoading(false);
    }
  };

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes("example")) {
    return (
      <div className="p-5 bg-red-100 border border-red-300 rounded-lg m-5">
        <h3 className="text-lg font-semibold mb-2">🚗 Car Wash Finder - Mapbox Token Required</h3>
        <p className="mb-3">To use this car wash finder, you need to add your Mapbox token to your environment variables.</p>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-semibold mb-2">🎯 How This Component Works:</h4>
          <ul className="list-disc list-inside text-sm">
            <li><strong>📍 Location Detection:</strong> Gets user's GPS location</li>
            <li><strong>🎚️ Radius Filter:</strong> 10km, 20km, 100km options</li>
            <li><strong>🗺️ Interactive Map:</strong> Shows user + nearby car washes</li>
            <li><strong>📏 Distance Display:</strong> Shows calculated distances</li>
            <li><strong>💬 Detailed Popups:</strong> Car wash info, ratings, services</li>
            <li><strong>🚀 Backend Integration:</strong> Connected to Go API</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full font-fredoka pt-18">
      <div className="absolute top-4 left-4 z-10 bg-white p-6 rounded-xl shadow-lg min-w-80 pt-40">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">🚗 Find Car Washes</h3>
        
        <button
          onClick={getUserLocation}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-white mb-4 transition-all duration-300 ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? "⏳ Searching..." : "📍 Find Nearby Car Washes"}
        </button>
        
        {userLocation && (
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              🎚️ Search Radius:
            </label>
            <div className="flex gap-2">
              {[10, 20, 100].map((radius) => (
                <button
                  key={radius}
                  onClick={() => handleRadiusChange(radius)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedRadius === radius
                      ? 'bg-blue-500 text-white shadow-inner'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {radius}km
                </button>
              ))}
            </div>
          </div>
        )}
        
        {carWashes.length > 0 && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium text-sm">
              ✅ Found {carWashes.length} car washes within {selectedRadius}km
            </p>
            <p className="text-green-600 text-xs mt-1">
              Click on the car icons 🚗 for details
            </p>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm mt-3">
            ❌ {error}
          </div>
        )}
      </div>

      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-xl overflow-hidden"
      />
      
      {!scriptsLoaded && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20 rounded-xl">
          <div className="text-center p-6 bg-white rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-700 font-medium">Loading Car Wash Finder...</p>
            <p className="text-slate-500 text-sm mt-1">Preparing the map for you 🗺️</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarWashFinderMap;