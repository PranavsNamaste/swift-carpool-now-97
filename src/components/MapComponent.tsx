
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, CircleParking, Navigation } from 'lucide-react';
import { useParking } from '@/contexts/ParkingContext';

// This is a simplified map component without actual map integration
const MapComponent = ({ onMapClick }: { onMapClick?: (location: { lat: number; lng: number }) => void }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { getFilteredParkings } = useParking();

  // Get parkings for the current location
  const parkingSpots = getFilteredParkings();

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current || !onMapClick) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onMapClick({ lat: y, lng: x });
  };

  return (
    <div 
      ref={mapRef}
      className="w-full h-full relative bg-[#f8f9fa] rounded-lg overflow-hidden"
      onClick={handleMapClick}
    >
      {/* Simulated map grid */}
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
        {Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={i} 
            className="border border-gray-100 flex items-center justify-center text-gray-200 text-xs"
          >
            {i}
          </div>
        ))}
      </div>
      
      {/* Map loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Simulated parking spots on map */}
      {mapLoaded && parkingSpots.map(spot => (
        <div 
          key={spot.id}
          className="absolute w-6 h-6 -mt-3 -ml-3 pulse-dot"
          style={{ top: `${spot.latitude}%`, left: `${spot.longitude}%` }}
        >
          <CircleParking className="w-full h-full text-primary" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-1.5 py-0.5 rounded text-xs font-medium shadow-sm">
            ${spot.pricePerHour.toFixed(2)}
          </div>
        </div>
      ))}
      
      {/* User location marker (centered) */}
      <div className="absolute top-1/2 left-1/2 -mt-4 -ml-3 z-10">
        <div className="relative">
          <MapPin className="w-6 h-6 text-blue-600" />
          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-blue-600 rounded-full -ml-1"></div>
        </div>
      </div>
      
      {/* Navigation controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white rounded-md shadow-md">
        <button className="p-2 hover:bg-gray-100 rounded-t-md">
          <Navigation className="w-5 h-5" />
        </button>
        <div className="h-px w-full bg-gray-200"></div>
        <button className="p-2 hover:bg-gray-100 rounded-b-md">+</button>
        <button className="p-2 hover:bg-gray-100 rounded-b-md">−</button>
      </div>
    </div>
  );
};

export default MapComponent;
