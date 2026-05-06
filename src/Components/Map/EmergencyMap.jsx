import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
// import 'leaflet-routing-machine';
// import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const EmergencyMap = ({ lat, lng, nearbyHelp = [], incidents = [], showRouting = false }) => {
    const mapRef = useRef();
    const [position, setPosition] = useState([lat || 28.6139, lng || 77.2090]);
    const [nearestPolice, setNearestPolice] = useState(null);

    useEffect(() => {
        if (lat && lng) {
            setPosition([parseFloat(lat), parseFloat(lng)]);
        }
    }, [lat, lng]);

    useEffect(() => {
        // Find nearest police
        const policeStations = nearbyHelp.filter(help => help.type === 'police');
        if (policeStations.length > 0) {
            setNearestPolice(policeStations[0]);
        }
    }, [nearbyHelp]);

    useEffect(() => {
        if (mapRef.current && showRouting && nearestPolice && position[0] && position[1]) {
            // Clear existing routes
            mapRef.current.eachLayer(layer => {
                if (layer instanceof L.Routing.Control) {
                    mapRef.current.removeLayer(layer);
                }
            });

            // Add route to nearest police
            L.Routing.control({
                waypoints: [
                    L.latLng(position[0], position[1]),
                    L.latLng(parseFloat(nearestPolice.lat), parseFloat(nearestPolice.lon))
                ],
                routeWhileDragging: true,
                show: false,
                addWaypoints: false,
                createMarker: () => null // No additional markers
            }).addTo(mapRef.current);
        }
    }, [showRouting, nearestPolice, position]);

    const allMarkers = [
        { position, popup: 'YOUR LOCATION', color: 'red' },
        ...nearbyHelp.map((help) => ({
            position: [parseFloat(help.lat), parseFloat(help.lon)],
            popup: `${help.name || help.type}`,
            color: 'blue',
        })),
        ...incidents.map((inc) => ({
            position: [parseFloat(inc.lat), parseFloat(inc.long)],
            popup: `Incident: ${inc.status}`,
            color: 'orange',
        })),
    ];

    return (
        <div style={{ height: '500px', width: '100%', borderRadius: '8px', margin: '20px 0' }}>
            <MapContainer
                center={position}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
                whenCreated={map => { mapRef.current = map; }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {allMarkers.map((marker, index) => (
                    <Marker key={index} position={marker.position}>
                        <Popup>{marker.popup}</Popup>
                    </Marker>
                ))}

                {showRouting && nearestPolice && (
                    <Marker position={[parseFloat(nearestPolice.lat), parseFloat(nearestPolice.lon)]}>
                        <Popup>Nearest Police: {nearestPolice.name}</Popup>
                    </Marker>
                )}
            </MapContainer>
            <div style={{ textAlign: 'center', padding: '10px', fontSize: '14px', color: '#666' }}>
                {nearestPolice && `Nearest Police: ${nearestPolice.name || 'Available'}`}
                {showRouting && ' | Route to police shown'}
                {' | Click for live location'}
            </div>
        </div>
    );
};

export default EmergencyMap;

