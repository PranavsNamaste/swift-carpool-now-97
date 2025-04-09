
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define types for our parking data
export interface ParkingFeatures {
  surveillance: boolean;
  evCharging: boolean;
  covered: boolean;
}

export interface ParkingOption {
  id: string;
  name: string;
  description: string;
  pricePerHour: number;
  availableSpots: number;
  features: ParkingFeatures;
}

export interface ParkingSpot {
  id: number;
  name: string;
  distance: string;
  address: string;
  rating: number;
  pricePerHour: number;
  availableSpots: number;
  features: ParkingFeatures;
  latitude: number;
  longitude: number;
  options: ParkingOption[];
}

export interface LocationParkings {
  [location: string]: ParkingSpot[];
}

// Define the context type
interface ParkingContextType {
  savedParkings: ParkingSpot[];
  saveParking: (parking: ParkingSpot) => void;
  removeParking: (parkingId: number) => void;
  isSaved: (parkingId: number) => boolean;
  locationParkings: LocationParkings;
  currentLocation: string;
  setCurrentLocation: (location: string) => void;
  getFilteredParkings: () => ParkingSpot[];
}

// Create the context
const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

// Sample parking options for all parkings
const parkingOptions: ParkingOption[] = [
  {
    id: 'regular',
    name: 'Regular',
    description: 'Standard outdoor parking spot',
    pricePerHour: 2.50,
    availableSpots: 15,
    features: {
      surveillance: true,
      evCharging: false,
      covered: false
    }
  },
  {
    id: 'covered',
    name: 'Covered',
    description: 'Sheltered parking with protection',
    pricePerHour: 4.75,
    availableSpots: 8,
    features: {
      surveillance: true,
      evCharging: false,
      covered: true
    }
  },
  {
    id: 'valet',
    name: 'Valet',
    description: 'Premium valet parking service',
    pricePerHour: 7.90,
    availableSpots: 3,
    features: {
      surveillance: true,
      evCharging: true,
      covered: true
    }
  }
];

// Create location-specific parking data
const generateLocationParkings = (): LocationParkings => {
  const cities = [
    { name: 'Patna', count: 5 },
    { name: 'Delhi', count: 7 },
    { name: 'Mumbai', count: 4 },
    { name: 'Bangalore', count: 6 },
    { name: 'Chennai', count: 3 },
    { name: 'Kolkata', count: 5 },
    { name: 'Hyderabad', count: 4 },
    { name: 'Pune', count: 3 },
    { name: 'Ahmedabad', count: 2 },
    { name: 'Jaipur', count: 3 }
  ];

  let idCounter = 1;
  const result: LocationParkings = {};

  cities.forEach(city => {
    const parkings: ParkingSpot[] = [];
    
    for (let i = 0; i < city.count; i++) {
      const parkingType = i % 3 === 0 ? 'Mall' : i % 3 === 1 ? 'City Center' : 'Downtown';
      const hasCovered = i % 2 === 0;
      const hasEV = i % 3 === 0;
      
      parkings.push({
        id: idCounter++,
        name: `${city.name} ${parkingType} Parking ${i + 1}`,
        distance: `${(Math.random() * 2 + 0.3).toFixed(1)} miles`,
        address: `${Math.floor(Math.random() * 500) + 100} ${['Main St', 'Park Ave', 'Central Rd', 'Market Lane'][i % 4]}, ${city.name}`,
        rating: Math.floor(Math.random() * 10) / 2 + 3, // Rating between 3 and 5
        pricePerHour: Math.floor(Math.random() * 700 + 200) / 100, // Price between 2.00 and 9.00
        availableSpots: Math.floor(Math.random() * 30) + 5, // 5 to 35 spots
        features: {
          surveillance: true, // All have surveillance
          evCharging: hasEV,
          covered: hasCovered
        },
        latitude: 20 + Math.random() * 60,
        longitude: 10 + Math.random() * 80,
        options: parkingOptions
      });
    }
    
    result[city.name] = parkings;
  });

  return result;
};

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedParkings, setSavedParkings] = useState<ParkingSpot[]>([]);
  const [locationParkings] = useState<LocationParkings>(generateLocationParkings());
  const [currentLocation, setCurrentLocation] = useState<string>('Delhi');

  // Load saved parkings from localStorage on component mount
  useEffect(() => {
    const storedParkings = localStorage.getItem('savedParkings');
    if (storedParkings) {
      setSavedParkings(JSON.parse(storedParkings));
    }
  }, []);

  // Save to localStorage whenever savedParkings changes
  useEffect(() => {
    localStorage.setItem('savedParkings', JSON.stringify(savedParkings));
  }, [savedParkings]);

  const saveParking = (parking: ParkingSpot) => {
    if (!isSaved(parking.id)) {
      setSavedParkings(prev => [...prev, parking]);
    }
  };

  const removeParking = (parkingId: number) => {
    setSavedParkings(prev => prev.filter(p => p.id !== parkingId));
  };

  const isSaved = (parkingId: number) => {
    return savedParkings.some(p => p.id === parkingId);
  };

  const getFilteredParkings = () => {
    return locationParkings[currentLocation] || [];
  };

  return (
    <ParkingContext.Provider 
      value={{ 
        savedParkings, 
        saveParking, 
        removeParking, 
        isSaved,
        locationParkings,
        currentLocation,
        setCurrentLocation,
        getFilteredParkings
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
