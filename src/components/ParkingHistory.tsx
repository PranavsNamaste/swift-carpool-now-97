
import React, { useState } from 'react';
import { CircleParking, Shield, Zap, Calendar, Clock, Car, Bike, FileText } from 'lucide-react';
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
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ParkingReceipt from './ParkingReceipt';
import SignInForm from './SignInForm';
import { useToast } from '@/hooks/use-toast';

const ParkingHistory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const { bookingHistory } = useParking();
  const { isAuthenticated, signIn } = useUser();
  const { toast } = useToast();

  const handleSignInSuccess = () => {
    // Sign in the user with default data
    signIn({
      id: '1',
      name: 'John Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      rating: 4.9,
      bookingCount: 24,
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
    setIsOpen(true);
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
    </>
  );
};

export default ParkingHistory;
