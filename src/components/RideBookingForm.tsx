
import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation,
  Clock,
  ArrowRight,
  Car,
  Star,
  Banknote,
  UserCircle 
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";

type RideType = 'standard' | 'premium' | 'xl';

interface RideTypeOption {
  id: RideType;
  name: string;
  description: string;
  price: number;
  eta: number;
  icon: JSX.Element;
}

const rideOptions: RideTypeOption[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Affordable rides for everyday needs',
    price: 12.50,
    eta: 3,
    icon: <Car className="h-5 w-5" />
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Luxury vehicles with top-rated drivers',
    price: 25.75,
    eta: 5,
    icon: <Car className="h-5 w-5" />
  },
  {
    id: 'xl',
    name: 'XL',
    description: 'Spacious vehicles for groups up to 6',
    price: 18.90,
    eta: 7,
    icon: <Car className="h-5 w-5" />
  }
];

const RideBookingForm = () => {
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState<RideType>('standard');
  const [bookingStep, setBookingStep] = useState<'input' | 'confirm' | 'finding' | 'details'>('input');
  const { toast } = useToast();

  const handleSearchRide = () => {
    if (!location || !destination) {
      toast({
        title: "Please enter your location and destination",
        variant: "destructive"
      });
      return;
    }
    setBookingStep('confirm');
  };

  const handleBookRide = () => {
    setBookingStep('finding');
    
    // Simulate finding a ride
    setTimeout(() => {
      setBookingStep('details');
    }, 3000);
  };

  const handleCancelRide = () => {
    setBookingStep('input');
    toast({
      title: "Ride canceled",
      description: "Your ride has been canceled."
    });
  };

  const renderBookingStep = () => {
    switch (bookingStep) {
      case 'input':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Current location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="relative">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleSearchRide}>
              Search Rides
            </Button>
          </div>
        );
        
      case 'confirm':
        return (
          <div className="space-y-4">
            <div className="bg-muted/40 p-3 rounded-lg text-sm">
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm truncate">{location || 'Current Location'}</p>
              </div>
              <div className="border-l-2 border-dashed border-muted-foreground/30 h-4 ml-2"></div>
              <div className="flex items-center">
                <Navigation className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm truncate">{destination}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Select your ride</p>
              
              <div className="grid gap-2">
                {rideOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                      selectedRide === option.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedRide(option.id)}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${
                        selectedRide === option.id ? 'bg-primary text-white' : 'bg-accent'
                      }`}>
                        {option.icon}
                      </div>
                      <div>
                        <p className="font-medium">{option.name}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${option.price.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{option.eta} min</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button className="w-full" onClick={handleBookRide}>
              Confirm Ride (${rideOptions.find(o => o.id === selectedRide)?.price.toFixed(2)})
            </Button>
          </div>
        );
        
      case 'finding':
        return (
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-medium mb-1">Looking for drivers</h3>
            <p className="text-sm text-muted-foreground mb-6">Hold tight! We're matching you with a nearby driver</p>
            <Button variant="outline" onClick={handleCancelRide}>
              Cancel
            </Button>
          </div>
        );
        
      case 'details':
        return (
          <div className="space-y-5">
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium">Your ride is confirmed!</h3>
                  <p className="text-sm text-muted-foreground">Arriving in 3 min</p>
                </div>
                <div className="bg-primary text-white py-1.5 px-3 rounded-full text-sm font-medium">
                  ${rideOptions.find(o => o.id === selectedRide)?.price.toFixed(2)}
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-3 border-2 border-white">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-secondary text-white">MD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium">Michael Driver</p>
                    <div className="flex items-center ml-2 text-xs font-medium text-yellow-500">
                      <Star className="w-3 h-3 fill-current mr-0.5" />
                      <span>4.9</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Silver Toyota Camry • ABC 1234</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <UserCircle className="h-3.5 w-3.5 mr-1.5" />
                  Contact
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  Share ETA
                </Button>
              </div>
            </div>
            
            <div className="bg-muted/40 p-3 rounded-lg text-sm">
              <div className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm truncate">{location || 'Current Location'}</p>
              </div>
              <div className="border-l-2 border-dashed border-muted-foreground/30 h-4 ml-2"></div>
              <div className="flex items-center">
                <Navigation className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm truncate">{destination}</p>
              </div>
            </div>
            
            <Button variant="destructive" className="w-full" onClick={handleCancelRide}>
              Cancel Ride
            </Button>
          </div>
        );
    }
  };

  return (
    <Card className="w-full shadow-lg border-none">
      <CardContent className="p-4">
        <Tabs defaultValue="ride" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="ride" className="flex-1">Ride</TabsTrigger>
            <TabsTrigger value="schedule" className="flex-1">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ride" className="mt-0">
            {renderBookingStep()}
          </TabsContent>
          
          <TabsContent value="schedule" className="mt-0">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Pickup location" className="pl-10" />
                </div>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Destination" className="pl-10" />
                </div>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input type="datetime-local" className="pl-10" />
                </div>
              </div>
              <Button className="w-full">Schedule Ride</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RideBookingForm;
