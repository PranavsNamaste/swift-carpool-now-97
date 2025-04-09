
import React, { useState } from 'react';
import { CircleParking, Shield, Zap, Heart, MapPin, Star } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useParking } from '@/contexts/ParkingContext';
import { useToast } from "@/hooks/use-toast";

const SavedParkings = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { savedParkings, removeParking } = useParking();
  const { toast } = useToast();

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

  const handleRemoveParking = (id: number, name: string) => {
    removeParking(id);
    toast({
      title: "Parking removed from saved list",
      description: `${name} has been removed from your saved parkings.`
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Heart className="h-4 w-4" />
          <span>Saved Parkings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Your Saved Parkings</SheetTitle>
          <SheetDescription>
            Quickly access your favorite parking locations
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-1">
          {savedParkings.length === 0 ? (
            <div className="py-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                <Heart className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No saved parkings</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Save your favorite parking spots for quick access
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {savedParkings.map((parking) => (
                <AccordionItem key={parking.id} value={parking.id.toString()}>
                  <AccordionTrigger className="py-3 px-2 hover:bg-accent rounded-md transition-all">
                    <div className="flex items-start space-x-3 w-full text-left">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <CircleParking className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{parking.name}</p>
                        <p className="text-xs text-muted-foreground">{parking.address}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-2 pb-3">
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-muted-foreground">Rating:</div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          {parking.rating}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-muted-foreground">Price:</div>
                        <div>${parking.pricePerHour.toFixed(2)}/hr</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-muted-foreground">Available:</div>
                        <div>{parking.availableSpots} spots</div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="text-muted-foreground">Features:</div>
                        <div>{renderFeatureBadges(parking.features)}</div>
                      </div>
                      
                      <div className="pt-2 flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleRemoveParking(parking.id, parking.name)}
                        >
                          Remove
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
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

export default SavedParkings;
