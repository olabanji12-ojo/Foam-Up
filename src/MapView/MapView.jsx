import React, { useRef, useEffect, useState } from "react";

const MapView = () => {
  const mapContainerRef = useRef();
  const geocoderContainerRef = useRef();
  const mapRef = useRef();
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // Replace with your actual Mapbox token
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    // Load Mapbox GL JS and Geocoder from CDN
    const loadScripts = async () => {
      // Load CSS
      const mapboxCSS = document.createElement('link');
      mapboxCSS.rel = 'stylesheet';
      mapboxCSS.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
      document.head.appendChild(mapboxCSS);

      const geocoderCSS = document.createElement('link');
      geocoderCSS.rel = 'stylesheet';
      geocoderCSS.href = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css';
      document.head.appendChild(geocoderCSS);

      // Load JavaScript
      const mapboxScript = document.createElement('script');
      mapboxScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
      
      const geocoderScript = document.createElement('script');
      geocoderScript.src = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.min.js';

      mapboxScript.onload = () => {
        geocoderScript.onload = () => {
          setScriptsLoaded(true);
        };
        document.head.appendChild(geocoderScript);
      };
      
      document.head.appendChild(mapboxScript);
    };

    loadScripts();
  }, []);

  useEffect(() => {
    if (!scriptsLoaded || !mapContainerRef.current || !window.mapboxgl) return;

    // Initialize the map
    window.mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const map = new window.mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', // 🎯 Updated to v12 for better labels
      center: [4.5396, 7.7914], // Osogbo, Nigeria coordinates
      zoom: 12,
      // 🗺️ ENHANCED MAP SETTINGS FOR BETTER LABELS
      maxZoom: 22, // Allow deeper zoom levels
      minZoom: 1,
      attributionControl: true,
      logoPosition: 'bottom-left'
    });

    mapRef.current = map;

    map.on('load', () => {
      // 🎮 STEP 2: ADD MAP CONTROLS
      
      // 1. Navigation Controls (Zoom + Compass + Pan)
      const navigationControl = new window.mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true
      });
      map.addControl(navigationControl, 'top-right');

      // 2. Geolocation Control (Find Me Button)
      const geolocateControl = new window.mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true,
        showUserLocation: true
      });
      map.addControl(geolocateControl, 'top-right');

      // 3. Fullscreen Control
      const fullscreenControl = new window.mapboxgl.FullscreenControl();
      map.addControl(fullscreenControl, 'top-right');

      // 4. Scale Control
      const scaleControl = new window.mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      });
      map.addControl(scaleControl, 'bottom-left');

      // 🔍 ENHANCED SEARCH FUNCTIONALITY
      const geocoder = new window.MapboxGeocoder({
        accessToken: MAPBOX_TOKEN,
        mapboxgl: window.mapboxgl,
        marker: {
          color: '#FF6B6B'
        },
        placeholder: 'Search for places, streets, addresses...',
        proximity: {
          longitude: 4.5396,
          latitude: 7.7914
        },
        // 🎯 ENHANCED SEARCH SETTINGS FOR DEEPER ADDRESSES
        countries: 'NG', // Focus on Nigeria
        types: 'country,region,postcode,district,place,locality,neighborhood,address,poi', // Include ALL types
        limit: 10, // Show more results
        language: 'en', // English results
        fuzzyMatch: true, // Allow typos
        minLength: 2, // Start searching after 2 characters
      });

      if (geocoderContainerRef.current) {
        geocoderContainerRef.current.innerHTML = '';
        geocoderContainerRef.current.appendChild(geocoder.onAdd(map));
      }

      geocoder.on('result', (event) => {
        console.log('🏃 Selected place:', event.result);
        console.log('Coordinates:', event.result.center);
        console.log('Place name:', event.result.place_name);
      });

      geocoder.on('clear', () => {
        console.log('Search cleared');
      });

      // Control event listeners
      geolocateControl.on('geolocate', async (event) => {
        const userLng = event.coords.longitude;
        const userLat = event.coords.latitude;
        
        console.log('📍 User location found (coordinates):', {
          longitude: userLng,
          latitude: userLat,
          accuracy: event.coords.accuracy + ' meters'
        });

        // 🏠 GET ACTUAL PLACE NAME FOR USER'S LOCATION
        try {
          const reverseGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLng},${userLat}.json?access_token=${MAPBOX_TOKEN}&types=address,poi,place,neighborhood,locality`;
          
          const response = await fetch(reverseGeocodeUrl);
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const locationInfo = data.features[0];
            console.log('🏠 Your actual location:', {
              placeName: locationInfo.place_name,
              neighborhood: locationInfo.context?.find(c => c.id.includes('neighborhood'))?.text || 'Unknown',
              city: locationInfo.context?.find(c => c.id.includes('place'))?.text || 'Unknown',
              state: locationInfo.context?.find(c => c.id.includes('region'))?.text || 'Unknown',
              coordinates: [userLng, userLat]
            });

            // Show user their actual location in a popup
            const userLocationPopup = new window.mapboxgl.Popup({
              closeButton: true,
              closeOnClick: false,
              anchor: 'top'
            })
            .setLngLat([userLng, userLat])
            .setHTML(`
              <div style="padding: 15px; min-width: 250px;">
                <h3 style="margin: 0 0 10px 0; color: #4CAF50;">📍 You Are Here!</h3>
                <p style="margin: 5px 0; color: #333; line-height: 1.4;">
                  <strong>${locationInfo.place_name}</strong>
                </p>
                <div style="margin: 8px 0; font-size: 12px; color: #666;">
                  Accuracy: ±${event.coords.accuracy} meters
                </div>
                <div style="margin: 8px 0; font-size: 12px; color: #999;">
                  ${userLat.toFixed(6)}, ${userLng.toFixed(6)}
                </div>
              </div>
            `)
            .addTo(map);

          } else {
            console.log('❌ Could not determine place name for your location');
          }
        } catch (error) {
          console.error('❌ Error getting place name for user location:', error);
        }
      });

      geolocateControl.on('error', (error) => {
        console.log('❌ Location error:', error.message);
        alert('Could not find your location. Please enable location services.');
      });

      // 📍 STEP 3: MARKERS & POPUPS
      
      const nigerianCities = [
        {
          name: "Osogbo",
          coordinates: [4.5396, 7.7914],
          description: "Capital of Osun State, known for the Osun-Osogbo Sacred Grove",
          color: "#FF6B6B"
        },
        {
          name: "Lagos",
          coordinates: [3.3792, 6.5244],
          description: "Nigeria's largest city and commercial hub",
          color: "#4ECDC4"
        },
        {
          name: "Abuja",
          coordinates: [7.3986, 9.0765],
          description: "Federal Capital Territory of Nigeria",
          color: "#45B7D1"
        }
      ];

      function createCustomMarker(color) {
        const markerElement = document.createElement('div');
        markerElement.className = 'custom-marker';
        markerElement.style.cssText = `
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background-color: ${color};
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          font-weight: bold;
        `;
        markerElement.innerHTML = '📍';
        return markerElement;
      }

      // Add markers for each city
      nigerianCities.forEach((city, index) => {
        const popup = new window.mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
          <div style="padding: 10px; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: ${city.color}; font-size: 18px;">
              ${city.name}
            </h3>
            <p style="margin: 0; color: #666; line-height: 1.4;">
              ${city.description}
            </p>
            <div style="margin-top: 10px; font-size: 12px; color: #999;">
              📍 ${city.coordinates[1].toFixed(4)}, ${city.coordinates[0].toFixed(4)}
            </div>
          </div>
        `);

        const marker = new window.mapboxgl.Marker({
          element: createCustomMarker(city.color),
          anchor: 'bottom'
        })
        .setLngLat(city.coordinates)
        .setPopup(popup)
        .addTo(map);

        console.log(`✅ Added marker for ${city.name} at ${city.coordinates}`);
      });

      // 🔄 REVERSE GEOCODING FUNCTION
      async function reverseGeocode(longitude, latitude) {
        try {
          console.log('🔄 Starting reverse geocoding...');
          
          const reverseGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}&types=address,poi,place`;
          
          const response = await fetch(reverseGeocodeUrl);
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            const address = data.features[0];
            console.log('📍 Reverse geocoding result:', {
              address: address.place_name,
              type: address.place_type,
              coordinates: [longitude, latitude]
            });
            
            const addressPopup = new window.mapboxgl.Popup({
              closeButton: true,
              closeOnClick: true
            })
            .setLngLat([longitude, latitude])
            .setHTML(`
              <div style="padding: 10px; max-width: 250px;">
                <h4 style="margin: 0 0 8px 0; color: #333;">📍 Location Info</h4>
                <p style="margin: 0; color: #666; line-height: 1.4;">
                  <strong>${address.place_name}</strong>
                </p>
                <div style="margin-top: 8px; font-size: 12px; color: #999;">
                  ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
                </div>
              </div>
            `)
            .addTo(map);
            
          } else {
            console.log('❌ No address found for these coordinates');
            alert('No address found for this location');
          }
        } catch (error) {
          console.error('❌ Reverse geocoding error:', error);
          alert('Could not get address for this location');
        }
      }

      // 🛣️ STEP 5: ROUTING VARIABLES
      let routeStartPoint = null;
      let routeEndPoint = null;
      let currentRoute = null;

      // Function to get directions between two points
      async function getDirections(startCoords, endCoords) {
        try {
          console.log('🛣️ Getting directions from', startCoords, 'to', endCoords);
          
          const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?steps=true&geometries=geojson&access_token=${MAPBOX_TOKEN}`;
          
          const response = await fetch(directionsUrl);
          const data = await response.json();
          
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            console.log('🎯 Route found:', {
              distance: route.distance + ' meters',
              duration: Math.round(route.duration / 60) + ' minutes',
              steps: route.legs[0].steps.length + ' steps'
            });
            
            drawRoute(route);
            showRouteInfo(route);
            
            return route;
          } else {
            console.log('❌ No route found');
            alert('No route could be found between these points');
            return null;
          }
        } catch (error) {
          console.error('❌ Directions error:', error);
          alert('Could not get directions. Please try again.');
          return null;
        }
      }

      // Function to draw route on map
      function drawRoute(route) {
        if (currentRoute && map.getLayer('route')) {
          map.removeLayer('route');
          map.removeSource('route');
        }
        
        map.addSource('route', {
          'type': 'geojson',
          'data': {
            'type': 'Feature',
            'properties': {},
            'geometry': route.geometry
          }
        });
        
        map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': 'route',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#3887be',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });
        
        currentRoute = route;
        console.log('✅ Route drawn on map');
      }

      // Function to show route information
      function showRouteInfo(route) {
        const distance = (route.distance / 1000).toFixed(1);
        const duration = Math.round(route.duration / 60);
        
        const routeInfoPopup = new window.mapboxgl.Popup({
          closeButton: true,
          closeOnClick: false,
          anchor: 'top'
        })
        .setLngLat(routeEndPoint)
        .setHTML(`
          <div style="padding: 15px; min-width: 200px;">
            <h3 style="margin: 0 0 10px 0; color: #3887be;">🛣️ Route Information</h3>
            <div style="margin: 5px 0;">
              <strong>📏 Distance:</strong> ${distance} km
            </div>
            <div style="margin: 5px 0;">
              <strong>⏱️ Time:</strong> ~${duration} minutes
            </div>
            <div style="margin: 5px 0;">
              <strong>🚗 Mode:</strong> Driving
            </div>
          </div>
        `)
        .addTo(map);
      }

      // Enhanced click handler for routing
      map.on('click', (event) => {
        const coordinates = [event.lngLat.lng, event.lngLat.lat];
        console.log('🖱️ User clicked map at:', coordinates);
        
        // ROUTING LOGIC
        if (!routeStartPoint) {
          routeStartPoint = coordinates;
          console.log('🟢 Start point set:', routeStartPoint);
          
          const startMarkerElement = document.createElement('div');
          startMarkerElement.innerHTML = '🟢';
          startMarkerElement.style.cssText = 'font-size: 20px; cursor: pointer;';
          
          new window.mapboxgl.Marker({
            element: startMarkerElement,
            anchor: 'bottom'
          })
          .setLngLat(coordinates)
          .setPopup(new window.mapboxgl.Popup().setHTML('<div><strong>📍 Start Point</strong><br/>Click another location for directions</div>'))
          .addTo(map);
          
          alert('Start point set! Click another location to get directions.');
          
        } else if (!routeEndPoint) {
          routeEndPoint = coordinates;
          console.log('🔴 End point set:', routeEndPoint);
          
          const endMarkerElement = document.createElement('div');
          endMarkerElement.innerHTML = '🔴';
          endMarkerElement.style.cssText = 'font-size: 20px; cursor: pointer;';
          
          new window.mapboxgl.Marker({
            element: endMarkerElement,
            anchor: 'bottom'
          })
          .setLngLat(coordinates)
          .setPopup(new window.mapboxgl.Popup().setHTML('<div><strong>📍 End Point</strong></div>'))
          .addTo(map);
          
          getDirections(routeStartPoint, routeEndPoint);
          
        } else {
          // Reset for new route
          if (currentRoute && map.getLayer('route')) {
            map.removeLayer('route');
            map.removeSource('route');
          }
          routeStartPoint = null;
          routeEndPoint = null;
          currentRoute = null;
          alert('Route cleared! Click to set a new start point.');
          
          // Set new start point
          routeStartPoint = coordinates;
          const startMarkerElement = document.createElement('div');
          startMarkerElement.innerHTML = '🟢';
          startMarkerElement.style.cssText = 'font-size: 20px; cursor: pointer;';
          
          new window.mapboxgl.Marker({
            element: startMarkerElement,
            anchor: 'bottom'
          })
          .setLngLat(coordinates)
          .addTo(map);
          
          alert('New start point set! Click another location for directions.');
        }
        
        // Also do reverse geocoding
        reverseGeocode(coordinates[0], coordinates[1]);
      });

      // 🔍 Enhanced forward geocoding function (accessible globally)
      window.advancedGeocode = async function(searchQuery) {
        try {
          console.log('🔍 Starting enhanced forward geocoding for:', searchQuery);
          
          // 🎯 ENHANCED SEARCH URL - includes ALL address types
          const forwardGeocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&country=NG&limit=10&types=country,region,postcode,district,place,locality,neighborhood,address,poi&fuzzyMatch=true&language=en`;
          
          const response = await fetch(forwardGeocodeUrl);
          const data = await response.json();
          
          if (data.features && data.features.length > 0) {
            console.log('🎯 Enhanced geocoding results:', data.features.map(f => ({
              name: f.place_name,
              coordinates: f.center,
              type: f.place_type,
              relevance: f.relevance,
              address: f.properties?.address || 'No specific address',
              context: f.context?.map(c => c.text).join(', ') || 'No context'
            })));
            
            const firstResult = data.features[0];
            const [lng, lat] = firstResult.center;
            
            // Fly to location with appropriate zoom based on type
            let zoomLevel = 14; // default
            if (firstResult.place_type.includes('address')) zoomLevel = 18;
            else if (firstResult.place_type.includes('poi')) zoomLevel = 17;
            else if (firstResult.place_type.includes('neighborhood')) zoomLevel = 15;
            else if (firstResult.place_type.includes('locality')) zoomLevel = 13;
            
            map.flyTo({
              center: [lng, lat],
              zoom: zoomLevel,
              duration: 2000
            });
            
            // Add detailed popup with all results
            const resultsHtml = data.features.slice(0, 5).map((feature, index) => {
              return `
                <div style="margin: 5px 0; padding: 5px; border-left: 3px solid ${index === 0 ? '#4CAF50' : '#ddd'};">
                  <strong>${feature.place_name}</strong><br/>
                  <small style="color: #666;">Type: ${feature.place_type.join(', ')}</small><br/>
                  <small style="color: #999;">Relevance: ${(feature.relevance * 100).toFixed(0)}%</small>
                </div>
              `;
            }).join('');
            
            const searchResultPopup = new window.mapboxgl.Popup({
              closeButton: true,
              closeOnClick: true,
              maxWidth: '350px'
            })
            .setLngLat([lng, lat])
            .setHTML(`
              <div style="padding: 10px;">
                <h4 style="margin: 0 0 10px 0; color: #333;">🔍 Search Results for "${searchQuery}"</h4>
                ${resultsHtml}
              </div>
            `)
            .addTo(map);
            
            return data.features;
          } else {
            console.log('❌ No results found for:', searchQuery);
            alert(`No results found for "${searchQuery}". Try:\n- Adding more context (e.g., "Victoria Island Lagos")\n- Using different spelling\n- Searching for landmarks instead`);
            return [];
          }
        } catch (error) {
          console.error('❌ Enhanced geocoding error:', error);
          alert('Search failed. Please check your internet connection and try again.');
          return [];
        }
      };
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [scriptsLoaded, MAPBOX_TOKEN]);

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN.includes('example')) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#ffe6e6', 
        border: '1px solid #ff9999',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>🗺️ Mapbox Token Required</h3>
        <p>To use this map component, you need to:</p>
        <ol>
          <li>Get a free Mapbox token from <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer">mapbox.com</a></li>
          <li>Replace the MAPBOX_TOKEN variable in the code with your actual token</li>
        </ol>
        
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f8ff', border: '1px solid #87ceeb', borderRadius: '5px' }}>
          <h4>🎓 What You'll Learn:</h4>
          <p><strong>Step 2-6 Features Included:</strong></p>
          <ul>
            <li>🎮 <strong>Map Controls:</strong> Zoom, geolocation, fullscreen, scale</li>
            <li>📍 <strong>Markers & Popups:</strong> Custom pins with info boxes</li>
            <li>🔍 <strong>Geocoding:</strong> Search places & reverse lookup addresses</li>
            <li>🛣️ <strong>Routing:</strong> Click two points to get directions</li>
            <li>🎨 <strong>Styling:</strong> Custom markers, route lines, popups</li>
          </ul>
          
          <p><strong>🏃 Expected behavior:</strong></p>
          <p>The search bar will appear inside the map. If you type "Osogbo, Nigeria", Mapbox will find it and move the map to that location. A marker will drop on the searched result. You'll also get the coordinates + place details in the console.</p>
          
          <p><strong>Try these in browser console:</strong></p>
          <code>advancedGeocode("National Theatre Lagos Nigeria")</code>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '500px', width: '100%' }}>
      <div 
        ref={mapContainerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          borderRadius: '8px',
          overflow: 'hidden'
        }} 
      />
      
      <div
        ref={geocoderContainerRef}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          width: '300px',
          maxWidth: '50%'
        }}
      />
      
      {!scriptsLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '20px',
          borderRadius: '8px',
          zIndex: 1001
        }}>
          Loading map... 🗺️
        </div>
      )}
    </div>
  );
};

export default MapView;  