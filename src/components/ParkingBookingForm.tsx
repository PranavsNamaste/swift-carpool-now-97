
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation,
  Clock,
  Calendar,
  CircleParking,
  Car,
  CreditCard,
  Shield,
  Zap,
  Timer
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type ParkingType = 'regular' | 'covered' | 'valet';

interface ParkingOption {
  id: ParkingType;
  name: string;
  description: string;
  pricePerHour: number;
  availableSpots: number;
  icon: JSX.Element;
  features?: {
    surveillance: boolean;
    evCharging: boolean;
    covered: boolean;
  };
}

interface ParkingSpot {
  id: number;
  name: string;
  distance: string;
  address: string;
  rating: number;
  pricePerHour: number;
  availableSpots: number;
  features: {
    surveillance: boolean;
    evCharging: boolean;
    covered: boolean;
  };
  options: ParkingOption[];
}

const parkingOptions: ParkingOption[] = [
  {
    id: 'regular',
    name: 'Regular',
    description: 'Standard outdoor parking spot',
    pricePerHour: 2.50,
    availableSpots: 15,
    icon: <CircleParking className="h-5 w-5" />,
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
    icon: <CircleParking className="h-5 w-5" />,
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
    icon: <Car className="h-5 w-5" />,
    features: {
      surveillance: true,
      evCharging: true,
      covered: true
    }
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
    features: {
      surveillance: true,
      evCharging: true,
      covered: false
    },
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
    features: {
      surveillance: true,
      evCharging: false,
      covered: true
    },
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
    features: {
      surveillance: false,
      evCharging: true,
      covered: false
    },
    options: parkingOptions
  }
];

const ParkingBookingForm = ({ selectedLocation }: { selectedLocation?: { lat: number; lng: number } | null }) => {
  const [location, setLocation] = useState('');
  const [selectedParking, setSelectedParking] = useState<ParkingSpot | null>(null);
  const [selectedOption, setSelectedOption] = useState<ParkingType>('regular');
  const [bookingStep, setBookingStep] = useState<'search' | 'spots' | 'options' | 'payment' | 'confirmation'>('search');
  const [duration, setDuration] = useState(1); // hours
  const [reserveDate, setReserveDate] = useState('');
  const [reserveTime, setReserveTime] = useState('');
  const [reserveDuration, setReserveDuration] = useState(1); // hours
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
        const basePrice = option.pricePerHour * duration;
        // Add a 10% surcharge for reservations
        const surcharge = bookingStep !== 'search' ? 0.1 * basePrice : 0;
        setTotalPrice(basePrice + surcharge);
      }
    }
  }, [selectedParking, selectedOption, duration, bookingStep]);

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

  const renderFeatureBadges = (features: { surveillance: boolean, evCharging: boolean, covered: boolean }) => {
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {features.surveillance && (
          <Badge variant="outline" className="text-xs flex items-center gap-1 bg-blue-50">
            <Shield className="h-3 w-3" />
            24/7
          </Badge>
        )}
        {features.evCharging && (
          <Badge variant="outline" className="text-xs flex items-center gap-1 bg-green-50">
            <Zap className="h-3 w-3" />
            EV
          </Badge>
        )}
        {features.covered && (
          <Badge variant="outline" className="text-xs flex items-center gap-1 bg-purple-50">
            <CircleParking className="h-3 w-3" />
            Covered
          </Badge>
        )}
      </div>
    );
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
              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <div className="relative">
                  <Timer className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    id="duration"
                    type="number" 
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="pl-10"
                  />
                </div>
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
                  <div className="text-sm text-muted-foreground mb-1">{spot.address}</div>
                  {renderFeatureBadges(spot.features)}
                  <div className="flex justify-between items-center mt-2">
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
              {selectedParking && renderFeatureBadges(selectedParking.features)}
              <div className="flex items-center space-x-2 mt-2">
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
                        {option.features && renderFeatureBadges(option.features)}
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
                <div className="flex items-center">
                  <Timer className="h-3 w-3 mr-1" />
                  Duration: {duration} hours
                </div>
              </div>
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
              
              <div>
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="font-medium">{duration} hours</div>
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
              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Where are you looking for parking?" 
                    className="pl-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="reserve-date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="reserve-date"
                        type="date" 
                        className="pl-10"
                        value={reserveDate}
                        onChange={(e) => setReserveDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reserve-time">Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        id="reserve-time"
                        type="time" 
                        className="pl-10"
                        value={reserveTime}
                        onChange={(e) => setReserveTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="reserve-duration">Duration (hours)</Label>
                  <div className="relative">
                    <Timer className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      id="reserve-duration"
                      type="number" 
                      min="1"
                      value={reserveDuration}
                      onChange={(e) => setReserveDuration(parseInt(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded flex items-start">
                  <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  Reservations include a 10% surcharge
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={handleFindParking}
                disabled={!location || !reserveDate || !reserveTime || reserveDuration < 1}
              >
                Find Parking Spots
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ParkingBookingForm;
