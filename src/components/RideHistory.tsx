
import React from 'react';
import { MapPin, Navigation, Clock, Banknote, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const mockRides = [
  {
    id: 1,
    date: 'Today',
    time: '10:30 AM',
    from: '123 Main St',
    to: 'Work Office, Downtown',
    amount: 15.50,
    driver: {
      name: 'John Smith',
      avatar: '',
      rating: 4.8,
      car: 'Honda Civic',
    },
  },
  {
    id: 2,
    date: 'Yesterday',
    time: '6:15 PM',
    from: 'Work Office, Downtown',
    to: '123 Main St',
    amount: 16.25,
    driver: {
      name: 'Sarah Johnson',
      avatar: '',
      rating: 4.9,
      car: 'Toyota Camry',
    },
  },
  {
    id: 3,
    date: 'Apr 7, 2025',
    time: '8:45 AM',
    from: '123 Main St',
    to: 'Airport Terminal A',
    amount: 42.75,
    driver: {
      name: 'Robert Chen',
      avatar: '',
      rating: 4.7,
      car: 'Ford Explorer',
    },
  }
];

const RideHistory = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="h-10">
          <Clock className="h-4 w-4 mr-2" />
          Ride History
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Ride History</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {mockRides.map((ride) => (
            <Card key={ride.id} className="border shadow-sm">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">{ride.date}</CardTitle>
                  <p className="text-xs text-muted-foreground">{ride.time}</p>
                </div>
                <div className="font-medium text-right">
                  ${ride.amount.toFixed(2)}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="mt-2 space-y-2">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <p className="text-sm">{ride.from}</p>
                  </div>
                  <div className="flex items-start">
                    <Navigation className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                    <p className="text-sm">{ride.to}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={ride.driver.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {ride.driver.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ride.driver.name}</p>
                    <p className="text-xs text-muted-foreground">{ride.driver.car}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Book Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RideHistory;
