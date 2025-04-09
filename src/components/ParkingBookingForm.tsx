
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation,
  Clock,
  Calendar,
  CircleParking,
  Car,
  CreditCard,
  Banknote
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

type ParkingType = 'regular' | 'covered' | 'valet';

interface ParkingOption {
  id: ParkingType;
  name: string;
  description: string;
  pricePerHour: number;
  availableSpots: number;
  icon: JSX.Element;
}

interface ParkingSpot {
  id: number;
  name: string;
  distance: string;
  address: string;
  rating: number;
  pricePerHour: number;
  availableSpots: number;
  options: ParkingOption[];
}

const parkingOptions: ParkingOption[] = [
  {
    id: 'regular',
    name: 'Regular',
    description: 'Standard outdoor parking spot',
    pricePerHour: 2.50,
    availableSpots: 15,
    icon: <CircleParking className="h-5 w-5" />
  },
  {
    id: 'covered',
    name: 'Covered',
    description: 'Sheltered parking with protection',
    pricePerHour: 4.75,
    availableSpots: 8,
    icon: <CircleParking className="h-5 w-5" />
  },
  {
    id: 'valet',
    name: 'Valet',
    description: 'Premium valet parking service',
    pricePerHour: 7.90,
    availableSpots: 3,
    icon: <Car className="h-5 w-5" />
  }
];

const nearbyParkingSpots: ParkingSpot[] = [
  {
    id: 1,
    name: "Downtown Plaza Parking",
    distance: "0.3 miles",
    address: "123 Main St, Downtown",
    rating: 4.5,
    pricePerHour: 3.50,
    availableSpots: 25,
    options: parkingOptions
  },
  {
    id: 2,
    name: "City Center Garage",
    distance: "0.7 miles",
    address: "456 Union Ave, City Center",
    rating: 4.2,
    pricePerHour: 2.75,
    availableSpots: 10,
    options: parkingOptions
  },
  {
    id: 3,
    name: "Market Street Parking",
    distance: "1.2 miles",
    address: "789 Market St, West Side",
    rating: 4.8,
    pricePerHour: 5.00,
    availableSpots: 5,
    options: parkingOptions
  }
];

const ParkingBookingForm = ({ selectedLocation }: { selectedLocation?: { lat: number; lng: number } | null }) => {
  const [location, setLocation] = useState('');
  const [selectedParking, setSelectedParking] = useState<ParkingSpot | null>(null);
  const [selectedOption, setSelectedOption] = useState<ParkingType>('regular');
  const [bookingStep, setBookingStep] = useState<'search' | 'spots' | 'options' | 'payment' | 'confirmation'>('search');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [duration, setDuration] = useState(1); // hours
  const [totalPrice, setTotalPrice] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedLocation) {
      // In a real app, we would use reverse geocoding here
      setLocation('Current Location');
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedParking && selectedOption) {
      const option = selectedParking.options.find(opt => opt.id === selectedOption);
      if (option) {
        setTotalPrice(option.pricePerHour * duration);
      }
    }
  }, [selectedParking, selectedOption, duration]);

  const handleFindParking = () => {
    if (!location) {
      toast({
        title: "Please enter your location",
        variant: "destructive"
      });
      return;
    }
    setBookingStep('spots');
  };

  const handleSelectParking = (parking: ParkingSpot) => {
    setSelectedParking(parking);
    setBookingStep('options');
  };

  const handleProceedToPayment = () => {
    if (!arrivalDate || !arrivalTime || !departureDate || !departureTime) {
      toast({
        title: "Please select arrival and departure times",
        variant: "destructive"
      });
      return;
    }
    setBookingStep('payment');
  };

  const handleConfirmBooking = () => {
    setBookingStep('confirmation');
    toast({
      title: "Booking confirmed!",
      description: "Your parking spot has been reserved."
    });
  };

  const handleBackStep = () => {
    switch (bookingStep) {
      case 'spots':
        setBookingStep('search');
        break;
      case 'options':
        setBookingStep('spots');
        break;
      case 'payment':
        setBookingStep('options');
        break;
      case 'confirmation':
        setBookingStep('search'); // Reset to initial state
        setSelectedParking(null);
        setLocation('');
        break;
    }
  };

  const renderBookingStep = () => {
    switch (bookingStep) {
      case 'search':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Where are you looking for parking?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleFindParking}>
              Find Parking
            </Button>
          </div>
        );
        
      case 'spots':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Button variant="ghost" size="sm" onClick={handleBackStep} className="px-2">
                <Navigation className="h-4 w-4 rotate-180 mr-1" />
                Back
              </Button>
              <div className="ml-auto text-sm font-medium">
                Found {nearbyParkingSpots.length} parking spots
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {nearbyParkingSpots.map((spot) => (
                <div 
                  key={spot.id}
                  className="p-3 border rounded-lg cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
                  onClick={() => handleSelectParking(spot)}
                >
                  <div className="flex justify-between mb-1">
                    <div className="font-medium">{spot.name}</div>
                    <div className="text-sm">{spot.distance}</div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{spot.address}</div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                        {spot.availableSpots} spots
                      </div>
                      <div className="text-yellow-500 flex items-center text-xs">
                        ★ {spot.rating}
                      </div>
                    </div>
                    <div className="font-medium">${spot.pricePerHour}/hr</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'options':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Button variant="ghost" size="sm" onClick={handleBackStep} className="px-2">
                <Navigation className="h-4 w-4 rotate-180 mr-1" />
                Back
              </Button>
              <div className="ml-auto text-sm font-medium">
                {selectedParking?.name}
              </div>
            </div>
            
            <div className="bg-muted/40 p-3 rounded-lg text-sm mb-4">
              <div className="font-medium mb-1">{selectedParking?.name}</div>
              <div className="text-muted-foreground mb-1">{selectedParking?.address}</div>
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                  {selectedParking?.availableSpots} spots
                </div>
                <div className="text-yellow-500 flex items-center text-xs">
                  ★ {selectedParking?.rating}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium">Choose parking type</p>
              
              <div className="grid gap-2">
                {selectedParking?.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                      selectedOption === option.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedOption(option.id)}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        selectedOption === option.id ? 'bg-primary text-white' : 'bg-accent'
                      }`}>
                        {option.icon}
                      </div>
                      <div>
                        <p className="font-medium">{option.name}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${option.pricePerHour.toFixed(2)}/hr</p>
                      <p className="text-xs text-muted-foreground">{option.availableSpots} available</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="arrival-date">Arrival Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="arrival-date"
                      type="date" 
                      className="pl-10"
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="arrival-time">Arrival Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="arrival-time"
                      type="time" 
                      className="pl-10"
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="departure-date">Departure Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="departure-date"
                      type="date" 
                      className="pl-10"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="departure-time">Departure Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="departure-time"
                      type="time" 
                      className="pl-10"
                      value={departureTime}
                      onChange={(e) => setDepartureTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input 
                  id="duration"
                  type="number" 
                  min="1"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
              <div className="text-sm font-medium">Total Price</div>
              <div className="text-lg font-semibold">${totalPrice.toFixed(2)}</div>
            </div>
            
            <Button className="w-full" onClick={handleProceedToPayment}>
              Proceed to Payment
            </Button>
          </div>
        );
        
      case 'payment':
        return (
          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Button variant="ghost" size="sm" onClick={handleBackStep} className="px-2">
                <Navigation className="h-4 w-4 rotate-180 mr-1" />
                Back
              </Button>
              <div className="ml-auto text-sm font-medium">
                Payment
              </div>
            </div>
            
            <div className="bg-muted/40 p-3 rounded-lg text-sm mb-4">
              <div className="font-medium mb-1">{selectedParking?.name}</div>
              <div className="text-muted-foreground mb-1">
                {selectedParking?.options.find(o => o.id === selectedOption)?.name} Parking
              </div>
              <div className="flex justify-between items-center text-xs">
                <div>Arrival: {arrivalDate} {arrivalTime}</div>
                <div>Departure: {departureDate} {departureTime}</div>
              </div>
              <div className="mt-2 text-xs">Duration: {duration} hours</div>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="card-number">Card Number</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    id="card-number"
                    placeholder="1234 5678 9012 3456" 
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry"
                    placeholder="MM/YY" 
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv"
                    placeholder="123" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="name">Cardholder Name</Label>
                <Input 
                  id="name"
                  placeholder="John Doe" 
                />
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
              <div className="text-sm font-medium">Total Price</div>
              <div className="text-lg font-semibold">${totalPrice.toFixed(2)}</div>
            </div>
            
            <Button className="w-full" onClick={handleConfirmBooking}>
              Complete Booking
            </Button>
          </div>
        );
        
      case 'confirmation':
        return (
          <div className="space-y-5 py-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-1">Booking Confirmed!</h3>
              <p className="text-sm text-muted-foreground mb-6">Your parking spot has been reserved</p>
            </div>
            
            <div className="bg-muted/40 p-4 rounded-lg space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Parking Location</div>
                <div className="font-medium">{selectedParking?.name}</div>
                <div className="text-sm">{selectedParking?.address}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-muted-foreground">Arrival</div>
                  <div className="font-medium">{arrivalDate}</div>
                  <div className="text-sm">{arrivalTime}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Departure</div>
                  <div className="font-medium">{departureDate}</div>
                  <div className="text-sm">{departureTime}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-muted-foreground">Parking Type</div>
                <div className="font-medium">
                  {selectedParking?.options.find(o => o.id === selectedOption)?.name}
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between font-medium">
                  <div>Total</div>
                  <div>${totalPrice.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                View Booking Details
              </Button>
              <Button className="w-full" onClick={() => setBookingStep('search')}>
                Book Another Spot
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full shadow-lg border-none">
      <CardContent className="p-4">
        <Tabs defaultValue="now" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="now" className="flex-1">Park Now</TabsTrigger>
            <TabsTrigger value="later" className="flex-1">Reserve</TabsTrigger>
          </TabsList>
          
          <TabsContent value="now" className="mt-0">
            {renderBookingStep()}
          </TabsContent>
          
          <TabsContent value="later" className="mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Where are you looking for parking?" className="pl-10" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input type="date" className="pl-10" />
                  </div>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input type="time" className="pl-10" />
                  </div>
                </div>
              </div>
              <Button className="w-full">Find Parking Spots</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ParkingBookingForm;
