
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';
import MapComponent from '@/components/MapComponent';
import ParkingBookingForm from '@/components/ParkingBookingForm';
import ParkingHistory from '@/components/ParkingHistory';
import SavedParkings from '@/components/SavedParkings';
import { useParking } from '@/contexts/ParkingContext';

const Index = () => {
  const isMobile = useIsMobile();
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { currentLocation } = useParking();

  const handleMapClick = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    console.log('Map clicked at:', location);
  };

  useEffect(() => {
    // This would normally trigger a map update with the new location
    console.log('Location changed to:', currentLocation);
  }, [currentLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-16 relative overflow-hidden">
        {/* Map Component takes full screen */}
        <div className="absolute inset-0 z-0">
          <MapComponent onMapClick={handleMapClick} />
        </div>
        
        {/* Booking form overlay */}
        <div className={`
          relative z-10 h-full
          ${isMobile ? 'px-4 pt-4 pb-6' : 'p-6'}
          flex flex-col
        `}>
          <div className="flex items-center justify-between mb-4">
            {!isMobile && (
              <div className="flex gap-2">
                <ParkingHistory />
                <SavedParkings />
              </div>
            )}
            
            <div className="ml-auto">
              {/* We could add map controls here */}
            </div>
          </div>
          
          <div className="mt-auto">
            <div className={`
              max-w-md w-full mx-auto
              ${isMobile ? 'rounded-t-2xl' : 'rounded-2xl'}
              overflow-hidden shadow-xl bg-white
            `}>
              <ParkingBookingForm selectedLocation={selectedLocation} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
