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
      pricePerHourBike: 7.5,
      availableSpotsCar: 10,
      availableSpotsMotorbike: 5,
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
          pricePerHourBike: 7.5,
          description: 'Standard parking spot',
          availableSpotsCar: 7,
          availableSpotsMotorbike: 3
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 18.0,
          pricePerHourBike: 10.8,
          description: 'Protected from weather',
          availableSpotsCar: 2,
          availableSpotsMotorbike: 1,
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
          pricePerHourBike: 15.0,
          description: 'Premium service with attendant',
          availableSpotsCar: 1,
          availableSpotsMotorbike: 1,
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
      pricePerHourBike: 8.4,
      availableSpotsCar: 6,
      availableSpotsMotorbike: 2,
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
          pricePerHourBike: 8.4,
          description: 'Standard parking spot',
          availableSpotsCar: 4,
          availableSpotsMotorbike: 2
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 20.0,
          pricePerHourBike: 12.0,
          description: 'Protected from weather',
          availableSpotsCar: 2,
          availableSpotsMotorbike: 0,
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
      pricePerHourBike: 9.0,
      availableSpotsCar: 9,
      availableSpotsMotorbike: 3,
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
          pricePerHourBike: 9.0,
          description: 'Standard parking spot',
          availableSpotsCar: 6,
          availableSpotsMotorbike: 2
        },
        {
          id: 'valet',
          name: 'Valet',
          pricePerHour: 26.0,
          pricePerHourBike: 15.6,
          description: 'Premium service with attendant',
          availableSpotsCar: 3,
          availableSpotsMotorbike: 1,
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
      pricePerHourBike: 6.6,
      availableSpotsCar: 15,
      availableSpotsMotorbike: 5,
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
          pricePerHourBike: 6.6,
          description: 'Standard parking spot',
          availableSpotsCar: 12,
          availableSpotsMotorbike: 3
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 16.0,
          pricePerHourBike: 9.6,
          description: 'Protected from weather',
          availableSpotsCar: 3,
          availableSpotsMotorbike: 2,
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
      pricePerHourBike: 5.7,
      availableSpotsCar: 5,
      availableSpotsMotorbike: 2,
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
          pricePerHourBike: 5.7,
          description: 'Standard parking spot',
          availableSpotsCar: 5,
          availableSpotsMotorbike: 2
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
      pricePerHourBike: 6.0,
      availableSpotsCar: 8,
      availableSpotsMotorbike: 2,
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
          pricePerHourBike: 6.0,
          description: 'Standard parking spot',
          availableSpotsCar: 6,
          availableSpotsMotorbike: 1
        },
        {
          id: 'valet',
          name: 'Valet',
          pricePerHour: 18.0,
          pricePerHourBike: 10.8,
          description: 'Premium service with attendant',
          availableSpotsCar: 2,
          availableSpotsMotorbike: 1,
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
      pricePerHourBike: 10.8,
      availableSpotsCar: 3,
      availableSpotsMotorbike: 2,
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
          pricePerHourBike: 10.8,
          description: 'Protected from weather',
          availableSpotsCar: 1,
          availableSpotsMotorbike: 2,
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
          pricePerHourBike: 18.0,
          description: 'Premium service with attendant',
          availableSpotsCar: 2,
          availableSpotsMotorbike: 0,
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
      pricePerHourBike: 9.0,
      availableSpotsCar: 6,
      availableSpotsMotorbike: 2,
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
          pricePerHourBike: 9.0,
          description: 'Standard parking spot',
          availableSpotsCar: 4,
          availableSpotsMotorbike: 1
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 22.0,
          pricePerHourBike: 13.2,
          description: 'Protected from weather',
          availableSpotsCar: 2,
          availableSpotsMotorbike: 1,
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
      pricePerHourBike: 7.2,
      availableSpotsCar: 4,
      availableSpotsMotorbike: 2,
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
          pricePerHourBike: 7.2,
          description: 'Standard parking spot',
          availableSpotsCar: 3,
          availableSpotsMotorbike: 1
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 18.0,
          pricePerHourBike: 10.8,
          description: 'Protected from weather',
          availableSpotsCar: 1,
          availableSpotsMotorbike: 1,
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
      pricePerHourBike: 8.4,
      availableSpotsCar: 12,
      availableSpotsMotorbike: 3,
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
          pricePerHourBike: 8.4,
          description: 'Standard parking spot',
          availableSpotsCar: 8,
          availableSpotsMotorbike: 2
        },
        {
          id: 'valet',
          name: 'Valet',
          pricePerHour: 24.0,
          pricePerHourBike: 14.4,
          description: 'Premium service with attendant',
          availableSpotsCar: 4,
          availableSpotsMotorbike: 1,
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
      pricePerHourBike: 6.0,
      availableSpotsCar: 9,
      availableSpotsMotorbike: 3,
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
          pricePerHourBike: 6.0,
          description: 'Standard parking spot',
          availableSpotsCar: 9,
          availableSpotsMotorbike: 3
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
      pricePerHourBike: 4.8,
      availableSpotsCar: 15,
      availableSpotsMotorbike: 3,
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
          pricePerHourBike: 4.8,
          description: 'Standard parking spot',
          availableSpotsCar: 12,
          availableSpotsMotorbike: 3
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 12.0,
          pricePerHourBike: 7.2,
          description: 'Protected from weather',
          availableSpotsCar: 3,
          availableSpotsMotorbike: 0,
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
      pricePerHourBike: 5.4,
      availableSpotsCar: 17,
      availableSpotsMotorbike: 3,
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
          pricePerHourBike: 5.4,
          description: 'Standard parking spot',
          availableSpotsCar: 17,
          availableSpotsMotorbike: 3
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
      pricePerHourBike: 7.8,
      availableSpotsCar: 8,
      availableSpotsMotorbike: 2,
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
          pricePerHourBike: 7.8,
          description: 'Standard parking spot',
          availableSpotsCar: 5,
          availableSpotsMotorbike: 2
        },
        {
          id: 'covered',
          name: 'Covered',
          pricePerHour: 19.0,
          pricePerHourBike: 11.4,
          description: 'Protected from weather',
          availableSpotsCar: 3,
          availableSpotsMotorbike: 0,
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

// Add more cities
parkingLocations['San Diego'] = [
  {
    id: 1101,
    name: 'Balboa Park Parking',
    address: '1549 El Prado, San Diego',
    distance: '0.5 miles',
    rating: 4.3,
    pricePerHour: 8.0,
    pricePerHourBike: 4.8,
    availableSpotsCar: 14,
    availableSpotsMotorbike: 8,
    features: {
      surveillance: true,
      evCharging: true,
      covered: false
    },
    options: [
      {
        id: 'regular',
        name: 'Regular',
        pricePerHour: 8.0,
        pricePerHourBike: 4.8,
        description: 'Standard parking spot',
        availableSpotsCar: 10,
        availableSpotsMotorbike: 6
      },
      {
        id: 'covered',
        name: 'Covered',
        pricePerHour: 12.0,
        pricePerHourBike: 7.2,
        description: 'Protected from weather',
        availableSpotsCar: 4,
        availableSpotsMotorbike: 2,
        features: {
          surveillance: true,
          evCharging: true,
          covered: true
        }
      }
    ]
  }
];

parkingLocations['Atlanta'] = [
  {
    id: 1201,
    name: 'Piedmont Park Garage',
    address: '400 Park Dr NE, Atlanta',
    distance: '0.3 miles',
    rating: 4.2,
    pricePerHour: 7.0,
    pricePerHourBike: 4.2,
    availableSpotsCar: 12,
    availableSpotsMotorbike: 6,
    features: {
      surveillance: true,
      evCharging: false,
      covered: true
    },
    options: [
      {
        id: 'regular',
        name: 'Regular',
        pricePerHour: 7.0,
        pricePerHourBike: 4.2,
        description: 'Standard parking spot',
        availableSpotsCar: 8,
        availableSpotsMotorbike: 4
      },
      {
        id: 'valet',
        name: 'Valet',
        pricePerHour: 15.0,
        pricePerHourBike: 9.0,
        description: 'Premium service with attendant',
        availableSpotsCar: 4,
        availableSpotsMotorbike: 2,
        features: {
          surveillance: true,
          evCharging: false,
          covered: true
        }
      }
    ]
  }
];

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
  isValidLocation: (location: string) => boolean;
  updateAvailableSpots: (parkingId: number, vehicleType: string, option: string, decrease: boolean) => void;
  rateParking: (parkingId: number, rating: number) => void;
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
  addBooking: () => {},
  isValidLocation: () => true,
  updateAvailableSpots: () => {},
  rateParking: () => {}
});

export const useParking = () => useContext(ParkingContext);

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<string>('New York');
  const [savedParkings, setSavedParkings] = useState<any[]>([]);
  const [bookingHistory, setBookingHistory] = useState<any[]>([]);
  const [parkingData, setParkingData] = useState<typeof parkingLocations>(JSON.parse(JSON.stringify(parkingLocations)));

  // Sample completed bookings for demonstration
  const sampleCompletedBookings = [
    {
      id: 'ORD-1234567',
      orderId: 'ORD-1234567',
      parkingId: 101,
      parkingName: 'Central Park Garage',
      parkingAddress: '123 Central Park West, New York',
      parkingType: 'Regular',
      vehicleType: 'car',
      vehicleNumber: 'NYC-4321',
      date: '2025-03-25',
      time: '10:30 AM',
      duration: 2,
      totalPrice: 25.0,
      status: 'completed',
      timestamp: new Date('2025-03-25T10:30:00').getTime(),
      features: {
        surveillance: true,
        evCharging: true,
        covered: true
      }
    },
    {
      id: 'ORD-2345678',
      orderId: 'ORD-2345678',
      parkingId: 201,
      parkingName: 'Millennium Park Garage',
      parkingAddress: '123 Michigan Ave, Chicago',
      parkingType: 'Covered',
      vehicleType: 'bike',
      vehicleNumber: 'CHI-7890',
      date: '2025-03-28',
      time: '2:15 PM',
      duration: 3,
      totalPrice: 21.6,
      status: 'completed',
      timestamp: new Date('2025-03-28T14:15:00').getTime(),
      features: {
        surveillance: true,
        evCharging: true,
        covered: true
      }
    },
    {
      id: 'ORD-3456789',
      orderId: 'ORD-3456789',
      parkingId: 301,
      parkingName: 'Hollywood Boulevard Parking',
      parkingAddress: '123 Hollywood Blvd, Los Angeles',
      parkingType: 'Valet',
      vehicleType: 'car',
      vehicleNumber: 'LA-9876',
      date: '2025-04-01',
      time: '9:00 AM',
      duration: 4,
      totalPrice: 72.0,
      status: 'completed',
      timestamp: new Date('2025-04-01T09:00:00').getTime(),
      features: {
        surveillance: true,
        evCharging: false,
        covered: false
      }
    }
  ];

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
        const parsedBookings = JSON.parse(storedBookings);
        // Add the sample completed bookings only if they don't already exist
        if (!parsedBookings.some((b: any) => b.id === sampleCompletedBookings[0].id)) {
          setBookingHistory([...parsedBookings, ...sampleCompletedBookings]);
        } else {
          setBookingHistory(parsedBookings);
        }
      } catch (error) {
        console.error('Error parsing booking history:', error);
        // If there's an error, just set the sample completed bookings
        setBookingHistory(sampleCompletedBookings);
      }
    } else {
      // If no stored bookings, initialize with the sample completed bookings
      setBookingHistory(sampleCompletedBookings);
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
    return parkingData[currentLocation as keyof typeof parkingData] || [];
  };

  const isValidLocation = (location: string) => {
    return Object.keys(parkingData).some(
      city => city.toLowerCase() === location.toLowerCase()
    );
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
    // Add the booking to history
    setBookingHistory(prev => [...prev, booking]);
    
    // Update available spots
    updateAvailableSpots(
      booking.parkingId, 
      booking.vehicleType, 
      booking.parkingType.toLowerCase(), 
      true
    );
  };

  const updateAvailableSpots = (parkingId: number, vehicleType: string, option: string, decrease: boolean) => {
    // Create a deep copy of the parking data
    const updatedParkingData = JSON.parse(JSON.stringify(parkingData));
    
    // Find the parking location with this ID
    for (const city in updatedParkingData) {
      const parkingIndex = updatedParkingData[city].findIndex((p: any) => p.id === parkingId);
      
      if (parkingIndex !== -1) {
        const parking = updatedParkingData[city][parkingIndex];
        
        // Update the main parking counts
        if (vehicleType === 'car') {
          if (decrease) {
            parking.availableSpotsCar = Math.max(0, parking.availableSpotsCar - 1);
          } else {
            parking.availableSpotsCar += 1;
          }
        } else {
          if (decrease) {
            parking.availableSpotsMotorbike = Math.max(0, parking.availableSpotsMotorbike - 1);
          } else {
            parking.availableSpotsMotorbike += 1;
          }
        }
        
        // Update the specific option counts
        const optionKey = option === 'regular' ? 'regular' : option === 'covered' ? 'covered' : 'valet';
        const optionIndex = parking.options.findIndex((o: any) => o.id === optionKey);
        
        if (optionIndex !== -1) {
          if (vehicleType === 'car') {
            if (decrease) {
              parking.options[optionIndex].availableSpotsCar = Math.max(0, parking.options[optionIndex].availableSpotsCar - 1);
            } else {
              parking.options[optionIndex].availableSpotsCar += 1;
            }
          } else {
            if (decrease) {
              parking.options[optionIndex].availableSpotsMotorbike = Math.max(0, parking.options[optionIndex].availableSpotsMotorbike - 1);
            } else {
              parking.options[optionIndex].availableSpotsMotorbike += 1;
            }
          }
        }
        
        break;
      }
    }
    
    setParkingData(updatedParkingData);
  };
  
  const rateParking = (parkingId: number, rating: number) => {
    // In a real app, this would be sent to a server
    // For demo purposes, we'll just log it
    console.log(`Rating parking ${parkingId} with ${rating} stars`);
  };

  return (
    <ParkingContext.Provider value={{
      currentLocation,
      setCurrentLocation,
      getFilteredParkings,
      locationParkings: parkingData,
      savedParkings,
      bookingHistory,
      saveParking,
      removeParking,
      isSaved,
      addBooking,
      isValidLocation,
      updateAvailableSpots,
      rateParking
    }}>
      {children}
    </ParkingContext.Provider>
  );
};
