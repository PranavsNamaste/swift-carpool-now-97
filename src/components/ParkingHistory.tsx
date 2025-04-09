
import React, { useState } from 'react';
import { 
  CircleParking, 
  Clock, 
  X,
  ChevronDown,
  Shield,
  Zap,
  Star,
  Heart
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useParking } from '@/contexts/ParkingContext';

// Sample parking history data
const initialParkingHistory = [
  {
    id: 1,
    location: "Downtown Plaza Parking",
    address: "123 Main St, Downtown",
    date: "Apr 5, 2025",
    startTime: "09:30 AM",
    endTime: "11:30 AM",
    duration: "2 hours",
    cost: 8.50,
    parkingType: "Covered",
    rated: true,
    rating: 4,
    features: {
      surveillance: true,
      evCharging: false,
      covered: true
    }
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
    parkingType: "Regular",
    rated: false,
    rating: 0,
    features: {
      surveillance: true,
      evCharging: true,
      covered: false
    }
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
    parkingType: "Valet",
    rated: false,
    rating: 0,
    features: {
      surveillance: true,
      evCharging: false,
      covered: true
    }
  }
];

// Convert history data to match our ParkingSpot interface for saving
const convertHistoryToParkingSpot = (historyItem: any) => {
  return {
    id: historyItem.id + 1000, // Avoid ID collision with real parkings
    name: historyItem.location,
    distance: "Previously visited",
    address: historyItem.address,
    rating: historyItem.rating > 0 ? historyItem.rating : 4.5,
    pricePerHour: historyItem.cost / parseInt(historyItem.duration),
    availableSpots: 15, // Default value
    features: historyItem.features,
    latitude: 50, // Default value
    longitude: 50, // Default value
    options: [
      {
        id: 'regular',
        name: 'Regular',
        description: 'Standard outdoor parking spot',
        pricePerHour: historyItem.cost / parseInt(historyItem.duration),
        availableSpots: 15,
        features: historyItem.features
      }
    ]
  };
};

const ParkingHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRating, setActiveRating] = useState<number | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [parkingHistory, setParkingHistory] = useState(initialParkingHistory);
  const { toast } = useToast();
  const { saveParking, removeParking, isSaved } = useParking();

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

  const handleRateParking = (id: number) => {
    setActiveRating(id);
  };

  const handleSubmitRating = () => {
    if (activeRating && ratingValue > 0) {
      const updatedHistory = parkingHistory.map(parking => {
        if (parking.id === activeRating) {
          return {
            ...parking,
            rated: true,
            rating: ratingValue
          };
        }
        return parking;
      });
      
      setParkingHistory(updatedHistory);
      
      toast({
        title: "Rating submitted",
        description: "Thank you for rating your parking experience!"
      });
      
      setActiveRating(null);
      setRatingValue(0);
    } else {
      toast({
        title: "Please select a rating",
        variant: "destructive"
      });
    }
  };

  const handleToggleSaveParking = (parking: any) => {
    const parkingData = convertHistoryToParkingSpot(parking);
    
    if (isSaved(parkingData.id)) {
      removeParking(parkingData.id);
      toast({
        title: "Removed from saved",
        description: `${parking.location} has been removed from your saved parkings.`
      });
    } else {
      saveParking(parkingData);
      toast({
        title: "Added to saved",
        description: `${parking.location} has been added to your saved parkings.`
      });
    }
  };

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
            {parkingHistory.map((parking) => {
              const historyParkingData = convertHistoryToParkingSpot(parking);
              const isParkingSaved = isSaved(historyParkingData.id);
              
              return (
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
                        <div className="text-muted-foreground">Features:</div>
                        <div>{renderFeatureBadges(parking.features)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-muted-foreground">Total Cost:</div>
                        <div className="font-medium">${parking.cost.toFixed(2)}</div>
                      </div>
                      
                      <div className="pt-2">
                        {parking.rated ? (
                          <div className="text-sm flex items-center justify-center text-amber-500 bg-amber-50 py-2 rounded">
                            <Star className="h-4 w-4 mr-1 fill-amber-500" />
                            Rated: {parking.rating}/5
                          </div>
                        ) : activeRating === parking.id ? (
                          <div className="space-y-2">
                            <div className="flex justify-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRatingValue(star)}
                                  className="p-1"
                                >
                                  <Star
                                    className={`h-6 w-6 ${
                                      ratingValue >= star
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => setActiveRating(null)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={handleSubmitRating}
                              >
                                Submit
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleToggleSaveParking(parking)}
                            >
                              <Heart className={`h-4 w-4 mr-1 ${isParkingSaved ? 'fill-red-500 text-red-500' : ''}`} />
                              {isParkingSaved ? 'Unsave' : 'Save'}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleRateParking(parking.id)}
                            >
                              <Star className="h-4 w-4 mr-1" /> Rate
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
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
