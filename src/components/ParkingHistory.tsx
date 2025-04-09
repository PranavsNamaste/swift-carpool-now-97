
import React, { useState } from 'react';
import { 
  CircleParking, 
  Clock, 
  X,
  ChevronDown
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Sample parking history data
const parkingHistory = [
  {
    id: 1,
    location: "Downtown Plaza Parking",
    address: "123 Main St, Downtown",
    date: "Apr 5, 2025",
    startTime: "09:30 AM",
    endTime: "11:30 AM",
    duration: "2 hours",
    cost: 8.50,
    parkingType: "Covered"
  },
  {
    id: 2,
    location: "Airport Long-Term Parking",
    address: "789 Airport Way, Terminal B",
    date: "Mar 28, 2025",
    startTime: "06:15 AM",
    endTime: "11:45 PM",
    duration: "17.5 hours",
    cost: 35.00,
    parkingType: "Regular"
  },
  {
    id: 3,
    location: "Central Mall Parking",
    address: "456 Market St, Shopping District",
    date: "Mar 22, 2025",
    startTime: "02:00 PM",
    endTime: "05:45 PM",
    duration: "3.75 hours",
    cost: 11.25,
    parkingType: "Valet"
  }
];

const ParkingHistory = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Parking History</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Your Parking History</SheetTitle>
          <SheetDescription>
            Review your previous parking bookings
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-1">
          <Accordion type="single" collapsible className="w-full">
            {parkingHistory.map((parking) => (
              <AccordionItem key={parking.id} value={parking.id.toString()}>
                <AccordionTrigger className="py-3 px-2 hover:bg-accent rounded-md transition-all">
                  <div className="flex items-start space-x-3 w-full text-left">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <CircleParking className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{parking.location}</p>
                      <p className="text-xs text-muted-foreground">{parking.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${parking.cost.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{parking.duration}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-2 pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Address:</div>
                      <div>{parking.address}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Date:</div>
                      <div>{parking.date}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Time:</div>
                      <div>{parking.startTime} - {parking.endTime}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Duration:</div>
                      <div>{parking.duration}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Parking Type:</div>
                      <div>{parking.parkingType}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-muted-foreground">Total Cost:</div>
                      <div className="font-medium">${parking.cost.toFixed(2)}</div>
                    </div>
                    
                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">Book Again</Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <SheetFooter className="pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ParkingHistory;
