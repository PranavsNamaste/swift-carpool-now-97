import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Star, Clock, Car, MapPin, Shield, User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useParking } from '@/contexts/ParkingContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import EditProfileForm from '@/components/EditProfileForm';
import ParkingReceipt from '@/components/ParkingReceipt';
import SignInForm from '@/components/SignInForm';
import { useToast } from '@/hooks/use-toast';
import { getInitials } from '@/utils/helpers';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signIn, updateUser, signOut } = useUser();
  const { bookingHistory } = useParking();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { toast } = useToast();
  
  // Sync booking count with actual booking history
  useEffect(() => {
    if (isAuthenticated && user && user.bookingCount !== bookingHistory.length) {
      updateUser({
        ...user,
        bookingCount: bookingHistory.length
      });
    }
  }, [isAuthenticated, user, bookingHistory.length, updateUser]);

  const handleSignInSuccess = () => {
    signIn({
      id: '1',
      name: 'John Doe',
      phone: '1234567890',
      email: 'john.doe@example.com',
      rating: 4.9,
      bookingCount: bookingHistory.length, // Set initial booking count from history
      memberSince: 'April 2025'
    });
    
    setShowSignInDialog(false);
    toast({
      title: "Signed in successfully",
      description: "Welcome back!"
    });
  };

  const handleSaveProfile = (updatedUser: any) => {
    // Keep the booking count synced with actual history
    const userWithCorrectCount = {
      ...updatedUser,
      bookingCount: bookingHistory.length
    };
    
    updateUser(userWithCorrectCount);
    setShowEditDialog(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully"
    });
  };

  const handleViewReceipt = (booking: any) => {
    setSelectedBooking(booking);
    setShowReceiptDialog(true);
  };

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
    navigate('/');
  };

  // Sort bookings by timestamp (newest first)
  const recentBookings = [...bookingHistory]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="sticky top-0 z-10 bg-background border-b flex items-center h-16 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold text-lg ml-2">Profile</h1>
        </header>
        
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Sign in to your account</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Sign in to view your profile, booking history, and saved parkings.
            </p>
          </div>
          
          <Button onClick={() => setShowSignInDialog(true)}>
            Sign In
          </Button>
          
          {/* Sign In Dialog */}
          <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
            <DialogContent className="sm:max-w-md">
              <SignInForm 
                onSuccess={handleSignInSuccess}
                onCancel={() => setShowSignInDialog(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b flex items-center h-16 px-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-lg ml-2">Profile</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto"
          onClick={() => setShowEditDialog(true)}
        >
          <Edit className="h-5 w-5" />
        </Button>
      </header>
      
      <main className="container max-w-md mx-auto px-4 py-6">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-primary text-white text-xl">
              {getInitials(user?.name || '')}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">Rider since {user?.memberSince}</p>
          <div className="flex items-center mt-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{user?.rating}</span>
            <span className="text-xs text-muted-foreground ml-1">({user?.bookingCount} bookings)</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent Parkings
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              {recentBookings.length === 0 ? (
                <div className="py-4 text-center text-muted-foreground text-sm">
                  No parking history found
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  {recentBookings.map(booking => (
                    <div key={booking.id} className="py-2 border-b last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{booking.date}</p>
                        <p className="text-primary font-medium">${booking.totalPrice.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground text-xs">
                        <div className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <p className="truncate">{booking.parkingName}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs px-2"
                          onClick={() => handleViewReceipt(booking)}
                        >
                          Receipt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span>Personal Information</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => setShowEditDialog(true)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span>Payment Methods</span>
                  </div>
                  <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                    <span>Saved Places</span>
                  </div>
                  <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Button 
            variant="outline" 
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </main>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          {user && (
            <EditProfileForm 
              user={user}
              onSave={handleSaveProfile}
              onCancel={() => setShowEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
      
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
    </div>
  );
};

export default Profile;
