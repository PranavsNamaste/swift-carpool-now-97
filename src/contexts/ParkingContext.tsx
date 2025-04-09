
import React, { createContext, useContext, useState, useEffect } from 'react';

// Sample parking data for different locations
const parkingLocations = {
  'New York': [
    {
      id: 101,
      name: 'Central Park Garage',
      address: '123 Central Park West, New York',
      distance: '0.3 miles',
      rating: 4.7,
      pricePerHour: 12.5,
      availableSpots: 15,
      features: {
        surveillance: true,
        evCharging: true,
        covered: true
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 12.5,
          description: 'Standard parking spot',
          availableSpots: 10
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 18.0,
          description: 'Protected from weather',
          availableSpots: 3,
          features: {
            surveillance: true,
            evCharging: false,
            covered: true
          }
        },
        {
          id: 'valet',
          name: 'Valet',
          pricePerHour: 25.0,
          description: 'Premium service with attendant',
          availableSpots: 2,
          features: {
            surveillance: true,
            evCharging: true,
            covered: true
          }
        }
      ]
    },
    {
      id: 102,
      name: 'Midtown Plaza Parking',
      address: '456 Madison Ave, New York',
      distance: '0.8 miles',
      rating: 4.5,
      pricePerHour: 14.0,
      availableSpots: 8,
      features: {
        surveillance: true,
        evCharging: false,
        covered: true
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 14.0,
          description: 'Standard parking spot',
          availableSpots: 6
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 20.0,
          description: 'Protected from weather',
          availableSpots: 2,
          features: {
            surveillance: true,
            evCharging: false,
            covered: true
          }
        }
      ]
    },
    {
      id: 103,
      name: 'Downtown Secure Parking',
      address: '789 Broadway, New York',
      distance: '1.2 miles',
      rating: 4.8,
      pricePerHour: 15.0,
      availableSpots: 12,
      features: {
        surveillance: true,
        evCharging: true,
        covered: false
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 15.0,
          description: 'Standard parking spot',
          availableSpots: 8
        },
        {
          id: 'valet',
          name: 'Valet',
          pricePerHour: 26.0,
          description: 'Premium service with attendant',
          availableSpots: 4,
          features: {
            surveillance: true,
            evCharging: true,
            covered: false
          }
        }
      ]
    }
  ],
  'Chicago': [
    {
      id: 201,
      name: 'Millennium Park Garage',
      address: '123 Michigan Ave, Chicago',
      distance: '0.4 miles',
      rating: 4.6,
      pricePerHour: 11.0,
      availableSpots: 20,
      features: {
        surveillance: true,
        evCharging: true,
        covered: true
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 11.0,
          description: 'Standard parking spot',
          availableSpots: 15
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 16.0,
          description: 'Protected from weather',
          availableSpots: 5,
          features: {
            surveillance: true,
            evCharging: true,
            covered: true
          }
        }
      ]
    },
    {
      id: 202,
      name: 'The Loop Parking',
      address: '456 State St, Chicago',
      distance: '0.7 miles',
      rating: 4.3,
      pricePerHour: 9.5,
      availableSpots: 7,
      features: {
        surveillance: true,
        evCharging: false,
        covered: false
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 9.5,
          description: 'Standard parking spot',
          availableSpots: 7
        }
      ]
    }
  ],
  'Los Angeles': [
    {
      id: 301,
      name: 'Hollywood Boulevard Parking',
      address: '123 Hollywood Blvd, Los Angeles',
      distance: '0.2 miles',
      rating: 4.4,
      pricePerHour: 10.0,
      availableSpots: 10,
      features: {
        surveillance: true,
        evCharging: false,
        covered: false
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 10.0,
          description: 'Standard parking spot',
          availableSpots: 7
        },
        {
          id: 'valet',
          name: 'Valet',
          pricePerHour: 18.0,
          description: 'Premium service with attendant',
          availableSpots: 3,
          features: {
            surveillance: true,
            evCharging: false,
            covered: false
          }
        }
      ]
    },
    {
      id: 302,
      name: 'Beverly Hills Secure Parking',
      address: '456 Rodeo Dr, Los Angeles',
      distance: '1.5 miles',
      rating: 4.9,
      pricePerHour: 18.0,
      availableSpots: 5,
      features: {
        surveillance: true,
        evCharging: true,
        covered: true
      },
      options: [
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 18.0,
          description: 'Protected from weather',
          availableSpots: 3,
          features: {
            surveillance: true,
            evCharging: true,
            covered: true
          }
        },
        {
          id: 'valet',
          name: 'Valet',
          pricePerHour: 30.0,
          description: 'Premium service with attendant',
          availableSpots: 2,
          features: {
            surveillance: true,
            evCharging: true,
            covered: true
          }
        }
      ]
    }
  ],
  'San Francisco': [
    {
      id: 401,
      name: 'Union Square Garage',
      address: '123 Powell St, San Francisco',
      distance: '0.3 miles',
      rating: 4.5,
      pricePerHour: 15.0,
      availableSpots: 8,
      features: {
        surveillance: true,
        evCharging: true,
        covered: true
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 15.0,
          description: 'Standard parking spot',
          availableSpots: 5
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 22.0,
          description: 'Protected from weather',
          availableSpots: 3,
          features: {
            surveillance: true,
            evCharging: true,
            covered: true
          }
        }
      ]
    }
  ],
  'Boston': [
    {
      id: 501,
      name: 'Beacon Hill Parking',
      address: '123 Charles St, Boston',
      distance: '0.5 miles',
      rating: 4.4,
      pricePerHour: 12.0,
      availableSpots: 6,
      features: {
        surveillance: true,
        evCharging: false,
        covered: true
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 12.0,
          description: 'Standard parking spot',
          availableSpots: 4
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 18.0,
          description: 'Protected from weather',
          availableSpots: 2,
          features: {
            surveillance: true,
            evCharging: false,
            covered: true
          }
        }
      ]
    }
  ],
  'Miami': [
    {
      id: 601,
      name: 'South Beach Garage',
      address: '123 Ocean Dr, Miami',
      distance: '0.2 miles',
      rating: 4.6,
      pricePerHour: 14.0,
      availableSpots: 15,
      features: {
        surveillance: true,
        evCharging: false,
        covered: true
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 14.0,
          description: 'Standard parking spot',
          availableSpots: 10
        },
        {
          id: 'valet',
          name: 'Valet',
          pricePerHour: 24.0,
          description: 'Premium service with attendant',
          availableSpots: 5,
          features: {
            surveillance: true,
            evCharging: false,
            covered: true
          }
        }
      ]
    }
  ],
  'Seattle': [
    {
      id: 701,
      name: 'Pike Place Parking',
      address: '123 Pike St, Seattle',
      distance: '0.4 miles',
      rating: 4.3,
      pricePerHour: 10.0,
      availableSpots: 12,
      features: {
        surveillance: true,
        evCharging: true,
        covered: false
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 10.0,
          description: 'Standard parking spot',
          availableSpots: 12
        }
      ]
    }
  ],
  'Austin': [
    {
      id: 801,
      name: '6th Street Garage',
      address: '123 6th St, Austin',
      distance: '0.3 miles',
      rating: 4.2,
      pricePerHour: 8.0,
      availableSpots: 18,
      features: {
        surveillance: true,
        evCharging: false,
        covered: true
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 8.0,
          description: 'Standard parking spot',
          availableSpots: 15
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 12.0,
          description: 'Protected from weather',
          availableSpots: 3,
          features: {
            surveillance: true,
            evCharging: false,
            covered: true
          }
        }
      ]
    }
  ],
  'Denver': [
    {
      id: 901,
      name: 'Downtown Denver Parking',
      address: '123 16th St, Denver',
      distance: '0.6 miles',
      rating: 4.1,
      pricePerHour: 9.0,
      availableSpots: 20,
      features: {
        surveillance: false,
        evCharging: true,
        covered: false
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 9.0,
          description: 'Standard parking spot',
          availableSpots: 20
        }
      ]
    }
  ],
  'Washington DC': [
    {
      id: 1001,
      name: 'Capitol Hill Parking',
      address: '123 Constitution Ave, Washington DC',
      distance: '0.5 miles',
      rating: 4.5,
      pricePerHour: 13.0,
      availableSpots: 10,
      features: {
        surveillance: true,
        evCharging: true,
        covered: true
      },
      options: [
        {
          id: 'regular',
          name: 'Regular',
          pricePerHour: 13.0,
          description: 'Standard parking spot',
          availableSpots: 7
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 19.0,
          description: 'Protected from weather',
          availableSpots: 3,
          features: {
            surveillance: true,
            evCharging: true,
            covered: true
          }
        }
      ]
    }
  ]
};

interface ParkingContextType {
  currentLocation: string;
  setCurrentLocation: (location: string) => void;
  getFilteredParkings: () => any[];
  locationParkings: typeof parkingLocations;
  savedParkings: any[];
  bookingHistory: any[];
  saveParking: (parking: any) => void;
  removeParking: (id: number) => void;
  isSaved: (id: number) => boolean;
  addBooking: (booking: any) => void;
}

const ParkingContext = createContext<ParkingContextType>({
  currentLocation: 'New York',
  setCurrentLocation: () => {},
  getFilteredParkings: () => [],
  locationParkings: parkingLocations,
  savedParkings: [],
  bookingHistory: [],
  saveParking: () => {},
  removeParking: () => {},
  isSaved: () => false,
  addBooking: () => {}
});

export const useParking = () => useContext(ParkingContext);

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<string>('New York');
  const [savedParkings, setSavedParkings] = useState<any[]>([]);
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);

  // Load saved parkings from localStorage on mount
  useEffect(() => {
    const storedParkings = localStorage.getItem('savedParkings');
    if (storedParkings) {
      try {
        setSavedParkings(JSON.parse(storedParkings));
      } catch (error) {
        console.error('Error parsing saved parkings:', error);
      }
    }

    const storedBookings = localStorage.getItem('bookingHistory');
    if (storedBookings) {
      try {
        setBookingHistory(JSON.parse(storedBookings));
      } catch (error) {
        console.error('Error parsing booking history:', error);
      }
    }
  }, []);

  // Save to localStorage whenever savedParkings changes
  useEffect(() => {
    localStorage.setItem('savedParkings', JSON.stringify(savedParkings));
  }, [savedParkings]);

  // Save to localStorage whenever bookingHistory changes
  useEffect(() => {
    localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory));
  }, [bookingHistory]);

  const getFilteredParkings = () => {
    return parkingLocations[currentLocation as keyof typeof parkingLocations] || [];
  };

  const saveParking = (parking: any) => {
    if (!isSaved(parking.id)) {
      setSavedParkings([...savedParkings, parking]);
    }
  };

  const removeParking = (id: number) => {
    setSavedParkings(savedParkings.filter(parking => parking.id !== id));
  };

  const isSaved = (id: number) => {
    return savedParkings.some(parking => parking.id === id);
  };

  const addBooking = (booking: any) => {
    setBookingHistory([...bookingHistory, booking]);
  };

  return (
    <ParkingContext.Provider value={{
      currentLocation,
      setCurrentLocation,
      getFilteredParkings,
      locationParkings: parkingLocations,
      savedParkings,
      bookingHistory,
      saveParking,
      removeParking,
      isSaved,
      addBooking
    }}>
      {children}
    </ParkingContext.Provider>
  );
};
