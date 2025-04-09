
import React, { useState } from 'react';
import { CircleParking, Shield, Zap, Calendar, Clock, Car, Bike, FileText, Star, Heart } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParking } from '@/contexts/ParkingContext';
import { useUser } from '@/contexts/UserContext';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ParkingReceipt from './ParkingReceipt';
import SignInForm from './SignInForm';
import { useToast } from '@/hooks/use-toast';

const ParkingHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [currentRating, setCurrentRating] = useState(5);
  const { bookingHistory, saveParking, isSaved, rateParking } = useParking();
  const { isAuthenticated, signIn, user, updateUser } = useUser();
  const { toast } = useToast();

  const handleSignInSuccess = () => {
    // Sign in the user with default data
    signIn({
      id: '1',
      name: 'John Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      rating: 4.9,
      bookingCount: bookingHistory.length,
      memberSince: 'April 2025'
    });
    
    setShowSignInDialog(false);
    toast({
      title: "Signed in successfully",
      description: "You can now view your booking history"
    });
  };

  const handleViewReceipt = (booking: any) => {
    setSelectedBooking(booking);
    setShowReceiptDialog(true);
  };

  const handleRateParking = (booking: any) => {
    setSelectedBooking(booking);
    setCurrentRating(5);
    setShowRatingDialog(true);
  };

  const submitRating = () => {
    if (selectedBooking) {
      rateParking(selectedBooking.parkingId, currentRating);
      setShowRatingDialog(false);
      toast({
        title: "Rating submitted",
        description: `You rated ${selectedBooking.parkingName} with ${currentRating} stars.`
      });
    }
  };

  const handleSaveParking = (booking: any) => {
    if (!isSaved(booking.parkingId)) {
      const parkingToSave = {
        id: booking.parkingId,
        name: booking.parkingName,
        address: booking.parkingAddress,
        distance: "From your history",
        rating: 4.5,
        pricePerHour: booking.totalPrice / booking.duration,
        pricePerHourBike: (booking.totalPrice / booking.duration) * 0.6, // 40% discount for bikes
        availableSpotsCar: 5,
        availableSpotsMotorbike: 3,
        features: booking.features
      };
      
      saveParking(parkingToSave);
      toast({
        title: "Parking saved",
        description: `${booking.parkingName} has been saved to your list.`
      });
    } else {
      toast({
        title: "Already saved",
        description: `${booking.parkingName} is already in your saved list.`
      });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-50 text-blue-600';
      case 'ongoing':
        return 'bg-green-50 text-green-600';
      case 'completed':
        return 'bg-gray-50 text-gray-600';
      case 'cancelled':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const filterBookings = (status: string) => {
    return bookingHistory.filter(booking => booking.status === status);
  };

  const handleOpenClick = () => {
    if (!isAuthenticated) {
      setShowSignInDialog(true);
      return;
    }
    
    // Update user booking count before opening
    if (user) {
      updateUser({
        ...user,
        bookingCount: bookingHistory.length
      });
    }
    
    setIsOpen(true);
  };

  const renderRatingStars = () => {
    return (
      <div className="flex items-center justify-center gap-2 py-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setCurrentRating(star)}
            className="focus:outline-none"
          >
            <Star
              className={`h-8 w-8 ${
                star <= currentRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={handleOpenClick}>
            <Clock className="h-4 w-4" />
            <span>Parking History</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Your Parking History</SheetTitle>
            <SheetDescription>
              View your upcoming, ongoing, and past parking bookings
            </SheetDescription>
          </SheetHeader>
          
          <Tabs 
            defaultValue="upcoming" 
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full mt-2"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            {['upcoming', 'ongoing', 'completed'].map((status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {filterBookings(status).length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                      <Calendar className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium">No {status} bookings</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      You don't have any {status} parking bookings
                    </p>
                  </div>
                ) : (
                  filterBookings(status).map((booking) => (
                    <div
                      key={booking.id}
                      className="p-3 border rounded-lg hover:bg-accent/20 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{booking.parkingName}</p>
                          <p className="text-xs text-muted-foreground">{booking.parkingAddress}</p>
                        </div>
                        <Badge className={`${getStatusColor(booking.status)}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{booking.time} ({booking.duration}h)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs mb-2">
                        {booking.vehicleType === 'car' ? (
                          <Car className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Bike className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span>
                          {booking.vehicleType.charAt(0).toUpperCase() + booking.vehicleType.slice(1)}: {booking.vehicleNumber}
                        </span>
                        {booking.vehicleType === 'bike' && status !== 'completed' && (
                          <span className="text-green-600 text-xs">40% discount applied</span>
                        )}
                      </div>
                      
                      {booking.features && renderFeatureBadges(booking.features)}
                      
                      <div className="flex justify-between items-center mt-2 pt-2 border-t">
                        <div className="font-medium">${booking.totalPrice.toFixed(2)}</div>
                        <div className="flex gap-1">
                          {status === 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs flex items-center gap-1"
                              onClick={() => handleRateParking(booking)}
                            >
                              <Star className="h-3 w-3" />
                              Rate
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs flex items-center gap-1"
                            onClick={() => handleSaveParking(booking)}
                          >
                            <Heart className="h-3 w-3" />
                            Save
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs flex items-center gap-1"
                            onClick={() => handleViewReceipt(booking)}
                          >
                            <FileText className="h-3 w-3" />
                            Receipt
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
          
          <SheetFooter className="pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-md">
          {selectedBooking && (
            <ParkingReceipt 
              booking={selectedBooking}
              onClose={() => setShowReceiptDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Sign In Dialog */}
      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-md">
          <SignInForm 
            onSuccess={handleSignInSuccess}
            onCancel={() => setShowSignInDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Rate Your Parking Experience</DialogTitle>
          <DialogDescription>
            How was your experience at {selectedBooking?.parkingName}?
          </DialogDescription>
          {renderRatingStars()}
          <div className="flex justify-end gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowRatingDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={submitRating}>
              Submit Rating
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParkingHistory;
