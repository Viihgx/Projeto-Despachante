import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';  // Importando o arquivo CSS
import L from 'leaflet';
import axios from 'axios';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const markersData = [
  { position: [-3.71722, -38.5434], label: 'Ponto A' },
  { position: [-3.7354512, -38.5237989], label: 'Ponto B' },
];

const ResetViewControl = ({ center, zoom }) => {
  const map = useMap();
  const handleClick = () => {
    map.setView(center, zoom);
  };

  return (
    <div
      className="leaflet-control-reset-view"
      onClick={handleClick}
    >
      Centralizar
    </div>
  );
};

const Map = ({ markers = markersData }) => {
  const [markerInfo, setMarkerInfo] = useState({});
  const mapRef = useRef();

  const fetchAddress = async (lat, lon) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          format: 'json',
          lat,
          lon,
        },
      });
      return response.data.display_name;
    } catch (error) {
      console.error("Erro ao buscar o endereço:", error);
      return "Endereço não encontrado";
    }
  };

  const handleMarkerClick = async (index, lat, lon) => {
    const address = await fetchAddress(lat, lon);
    setMarkerInfo((prev) => ({
      ...prev,
      [index]: address,
    }));
  };

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const bounds = L.latLngBounds(markers.map(marker => marker.position));
      map.fitBounds(bounds);
    }
  }, [markers]);

  return (
    <div className="map-container">
      <MapContainer
        center={[-3.71722, -38.5434]}
        zoom={13}
        className="map-container"  // Aplicando o CSS
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            eventHandlers={{
              click: () => handleMarkerClick(index, marker.position[0], marker.position[1]),
            }}
          >
            <Popup>
              {markerInfo[index] ? (
                <>
                  <p>{markerInfo[index]}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${marker.position[0]},${marker.position[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir no GPS
                  </a>
                </>
              ) : (
                "Carregando endereço..."
              )}
            </Popup>
          </Marker>
        ))}
        <ResetViewControl center={[-3.71722, -38.5434]} zoom={13} />
      </MapContainer>
    </div>
  );
};

export default Map;
