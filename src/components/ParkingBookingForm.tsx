
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
  Timer,
  Heart,
  Search,
  Bike,
  AlertTriangle,
  Plus,
  Minus,
  Loader
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
import { useParking } from '@/contexts/ParkingContext';
import { useUser } from '@/contexts/UserContext';
import VehicleTypeSelector, { VehicleType } from './VehicleTypeSelector';
import ParkingReceipt from './ParkingReceipt';
import SignInForm from './SignInForm';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { generateOrderId, formatDate, formatTime } from '@/utils/helpers';
import { Separator } from './ui/separator';

type ParkingType = 'regular' | 'covered' | 'valet';

const ParkingBookingForm = ({ selectedLocation }: { selectedLocation?: { lat: number; lng: number } | null }) => {
  const [location, setLocation] = useState('');
  const [selectedParking, setSelectedParking] = useState<any | null>(null);
  const [selectedOption, setSelectedOption] = useState<ParkingType>('regular');
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [bookingStep, setBookingStep] = useState<'search' | 'spots' | 'options' | 'payment' | 'confirmation'>('search');
  const [duration, setDuration] = useState(1); // hours
  const [reserveDate, setReserveDate] = useState('');
  const [reserveTime, setReserveTime] = useState('');
  const [reserveDuration, setReserveDuration] = useState(1); // hours
  const [totalPrice, setTotalPrice] = useState(0);
  const [activeTab, setActiveTab] = useState('now');
  const { toast } = useToast();
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const [locationError, setLocationError] = useState('');
  const [tabChangeConfirm, setTabChangeConfirm] = useState(false);
  const [confirmationTarget, setConfirmationTarget] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Use the parking context
  const { 
    getFilteredParkings, 
    currentLocation, 
    setCurrentLocation, 
    locationParkings,
    saveParking,
    removeParking,
    isSaved,
    addBooking,
    isValidLocation
  } = useParking();

  // Use the user context
  const { user, isAuthenticated, signIn, updateUser } = useUser();

  // Get filtered parkings based on the vehicle type
  const getNearbyParkingSpots = () => {
    const spots = getFilteredParkings();
    return spots.filter(spot => 
      vehicleType === 'car' ? spot.availableSpotsCar > 0 : spot.availableSpotsMotorbike > 0
    );
  };

  const nearbyParkingSpots = getNearbyParkingSpots();

  useEffect(() => {
    if (selectedLocation) {
      // In a real app, we would use reverse geocoding here
      setLocation('Current Location');
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (selectedParking && selectedOption) {
      let baseHours = activeTab === 'now' ? duration : reserveDuration;
      let basePricePerHour = vehicleType === 'car' 
        ? selectedParking.options.find((opt: any) => opt.id === selectedOption)?.pricePerHour || 0
        : selectedParking.options.find((opt: any) => opt.id === selectedOption)?.pricePerHourBike || 0;
      
      // Apply discount for longer durations
      let discount = 0;
      if (baseHours >= 4) {
        discount = vehicleType === 'car' ? 0.1 : 0.15; // 10% for cars, 15% for bikes
      }
      
      // Calculate price with discount
      let price = basePricePerHour * baseHours;
      price = price - (price * discount);
      
      // Add a $5 surcharge for reservations
      const surcharge = activeTab === 'later' ? 5 : 0;
      setTotalPrice(price + surcharge);
    }
  }, [selectedParking, selectedOption, duration, reserveDuration, activeTab, vehicleType]);

  const handleFindParking = () => {
    if (!location) {
      toast({
        title: "Please enter your location",
        variant: "destructive"
      });
      return;
    }
    
    // Check if the location is valid
    if (location !== 'Current Location' && !isValidLocation(location)) {
      setLocationError("Invalid city or we're not available in your region");
      return;
    }
    
    setLocationError('');
    setIsLoading(true);
    
    // Simulate loading time
    setTimeout(() => {
      // Set the current location based on input
      const locationsArray = Object.keys(locationParkings);
      const matchedLocation = locationsArray.find(loc => 
        location.toLowerCase() === loc.toLowerCase()
      ) || locationsArray[0];
      
      setCurrentLocation(matchedLocation);
      setBookingStep('spots');
      setIsLoading(false);
    }, 1500); // 1.5 seconds loading time
  };

  const handleSelectParking = (parking: any) => {
    setSelectedParking(parking);
    setBookingStep('options');
  };

  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      setShowSignInDialog(true);
      return;
    }
    
    if (!vehicleNumber) {
      toast({
        title: "Vehicle number required",
        description: "Please enter your vehicle number",
        variant: "destructive"
      });
      return;
    }
    
    setBookingStep('payment');
  };

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
      description: "You can now proceed with your booking"
    });
  };

  const handleConfirmBooking = () => {
    const now = new Date();
    const orderId = generateOrderId();
    
    const booking = {
      id: orderId,
      orderId: orderId,
      parkingId: selectedParking.id,
      parkingName: selectedParking.name,
      parkingAddress: selectedParking.address,
      parkingType: selectedParking.options.find((o: any) => o.id === selectedOption)?.name,
      vehicleType,
      vehicleNumber,
      date: activeTab === 'now' ? formatDate(now) : reserveDate,
      time: activeTab === 'now' ? formatTime(now) : reserveTime,
      duration: activeTab === 'now' ? duration : reserveDuration,
      totalPrice,
      status: activeTab === 'now' ? 'ongoing' : 'upcoming',
      timestamp: now.getTime(),
      features: selectedParking.features
    };
    
    // Add to booking history
    addBooking(booking);
    
    // Update user booking count
    if (user) {
      updateUser({
        ...user,
        bookingCount: user.bookingCount + 1
      });
    }
    
    // Set current booking for receipt
    setCurrentBooking(booking);
    
    // Show receipt
    setShowReceiptDialog(true);
    
    // Reset form
    setBookingStep('confirmation');
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
        setVehicleNumber('');
        break;
    }
  };

  const handleTabChange = (value: string) => {
    // If we are in the middle of a booking process (not search or confirmation), show confirmation
    if (bookingStep !== 'search' && bookingStep !== 'confirmation') {
      setConfirmationTarget(value);
      setTabChangeConfirm(true);
    } else {
      // Otherwise, change tab directly
      setActiveTab(value);
      setBookingStep('search');
    }
  };

  const confirmTabChange = () => {
    if (confirmationTarget) {
      setActiveTab(confirmationTarget);
      setBookingStep('search');
      setTabChangeConfirm(false);
      setConfirmationTarget('');
    }
  };

  const cancelTabChange = () => {
    setTabChangeConfirm(false);
    setConfirmationTarget('');
  };

  const handleToggleSaveParking = (parking: any, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    if (isSaved(parking.id)) {
      removeParking(parking.id);
      toast({
        title: "Removed from saved",
        description: `${parking.name} has been removed from your saved parkings.`
      });
    } else {
      saveParking(parking);
      toast({
        title: "Added to saved",
        description: `${parking.name} has been added to your saved parkings.`
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

  const renderAvailableLocations = () => {
    return (
      <div className="mt-2">
        <p className="text-xs text-muted-foreground mb-1">Available cities:</p>
        <div className="flex flex-wrap gap-1">
          {Object.keys(locationParkings).map(city => (
            <Badge 
              key={city}
              variant="outline" 
              className="text-xs cursor-pointer hover:bg-primary/10"
              onClick={() => {
                setLocation(city);
                setLocationError('');
              }}
            >
              {city}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  const renderPriceDisplay = (option: any) => {
    const currentHours = activeTab === 'now' ? duration : reserveDuration;
    const hasDiscount = currentHours >= 4;
    const carDiscount = hasDiscount ? 0.1 : 0; // 10% for cars when hours >= 4
    const bikeDiscount = hasDiscount ? 0.15 : 0; // 15% for bikes when hours >= 4
    
    const carPrice = option.pricePerHour * (1 - carDiscount);
    const bikePrice = option.pricePerHourBike * (1 - bikeDiscount);
    
    return (
      <div className="text-right">
        {vehicleType === 'car' ? (
          <>
            <div className="font-medium">
              <div className="flex items-center justify-end gap-1">
                <Car className="h-3.5 w-3.5" />
                <span>
                  {hasDiscount ? (
                    <>
                      <span className="line-through text-gray-400 mr-1">${option.pricePerHour.toFixed(2)}/hr</span>
                      ${carPrice.toFixed(2)}/hr
                    </>
                  ) : (
                    <>${option.pricePerHour.toFixed(2)}/hr</>
                  )}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Available spots: {option.availableSpotsCar}
            </p>
          </>
        ) : (
          <>
            <div className="font-medium text-green-600">
              <div className="flex items-center justify-end gap-1">
                <Bike className="h-3.5 w-3.5" />
                <span>
                  {hasDiscount ? (
                    <>
                      <span className="line-through text-gray-400 mr-1">${option.pricePerHourBike.toFixed(2)}/hr</span>
                      ${bikePrice.toFixed(2)}/hr
                    </>
                  ) : (
                    <>${option.pricePerHourBike.toFixed(2)}/hr</>
                  )}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Available spots: {option.availableSpotsMotorbike}
            </p>
          </>
        )}
      </div>
    );
  };

  const adjustDuration = (amount: number) => {
    if (activeTab === 'now') {
      const newDuration = Math.max(1, duration + amount);
      setDuration(newDuration);
    } else {
      const newDuration = Math.max(1, reserveDuration + amount);
      setReserveDuration(newDuration);
    }
  };

  const renderBookingStep = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Fetching parking spots...</p>
          <p className="text-sm text-muted-foreground mt-1">
            Looking for available parking in {location}
          </p>
        </div>
      );
    }
    
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
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setLocationError('');
                  }}
                  className="pl-10"
                />
              </div>
              {locationError && (
                <div className="text-destructive text-sm flex items-center mt-1">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {locationError}
                </div>
              )}
              {renderAvailableLocations()}
              <div>
                <Label htmlFor="duration">Duration (hours)</Label>
                <div className="relative">
                  <Timer className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    id="duration"
                    type="number" 
                    min="1"
                    value={activeTab === 'now' ? duration : reserveDuration}
                    onChange={(e) => activeTab === 'now' ? 
                      setDuration(parseInt(e.target.value)) : 
                      setReserveDuration(parseInt(e.target.value))
                    }
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
                Found {nearbyParkingSpots.length} parking spots in {currentLocation}
              </div>
            </div>
            
            <VehicleTypeSelector 
              selectedType={vehicleType} 
              onChange={setVehicleType} 
            />
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {nearbyParkingSpots.map((spot) => (
                <div 
                  key={spot.id}
                  className="p-3 border rounded-lg cursor-pointer transition-all hover:border-primary hover:bg-primary/5 relative"
                  onClick={() => handleSelectParking(spot)}
                >
                  <div className="flex justify-between mb-1">
                    <div className="font-medium">{spot.name}</div>
                    <div className="text-sm pr-8">{spot.distance}</div> {/* Added pr-8 to make room for save button */}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">{spot.address}</div>
                  {renderFeatureBadges(spot.features)}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center gap-2">
                        {vehicleType === 'car' ? (
                          <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium flex items-center">
                            <Car className="h-3 w-3 mr-1" />
                            {spot.availableSpotsCar}
                          </div>
                        ) : (
                          <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium flex items-center">
                            <Bike className="h-3 w-3 mr-1" />
                            {spot.availableSpotsMotorbike}
                          </div>
                        )}
                      </div>
                      <div className="text-yellow-500 flex items-center text-xs">
                        ★ {spot.rating}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {vehicleType === 'car' ? (
                        <div className="flex items-center gap-1">
                          <Car className="h-3.5 w-3.5" />
                          <span className="font-medium">${spot.pricePerHour.toFixed(2)}/hr</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-600">
                          <Bike className="h-3.5 w-3.5" />
                          <span className="font-medium">${spot.pricePerHourBike.toFixed(2)}/hr</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Save parking button - moved to top right */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={(e) => handleToggleSaveParking(spot, e)}
                  >
                    <Heart className={`h-5 w-5 ${isSaved(spot.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                  </Button>
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
            
            <div className="bg-muted/40 p-3 rounded-lg text-sm mb-4 relative">
              <div className="font-medium mb-1">{selectedParking?.name}</div>
              <div className="text-muted-foreground mb-1">{selectedParking?.address}</div>
              {selectedParking && renderFeatureBadges(selectedParking.features)}
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center gap-2">
                  {vehicleType === 'car' ? (
                    <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium flex items-center">
                      <Car className="h-3 w-3 mr-1" />
                      {selectedParking?.availableSpotsCar}
                    </div>
                  ) : (
                    <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium flex items-center">
                      <Bike className="h-3 w-3 mr-1" />
                      {selectedParking?.availableSpotsMotorbike}
                    </div>
                  )}
                </div>
                <div className="text-yellow-500 flex items-center text-xs">
                  ★ {selectedParking?.rating}
                </div>
              </div>
              
              {/* Save parking button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => selectedParking && handleToggleSaveParking(selectedParking)}
              >
                <Heart className={`h-5 w-5 ${selectedParking && isSaved(selectedParking.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </Button>
            </div>

            <div className="space-y-2 mb-4">
              <VehicleTypeSelector 
                selectedType={vehicleType} 
                onChange={setVehicleType} 
              />
              
              <div>
                <Label htmlFor="vehicleNumber">Vehicle Number (Required)</Label>
                <div className="relative">
                  {vehicleType === 'car' ? (
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  ) : (
                    <Bike className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  )}
                  <Input 
                    id="vehicleNumber"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="pl-10"
                    placeholder="Enter vehicle number"
                    required
                  />
                </div>
              </div>

              <div className="mt-3">
                <Label>Duration (hours)</Label>
                <div className="flex items-center mt-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => adjustDuration(-1)}
                    disabled={(activeTab === 'now' ? duration : reserveDuration) <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="mx-3 text-center min-w-[2rem]">
                    {activeTab === 'now' ? duration : reserveDuration}
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => adjustDuration(1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  
                  {(activeTab === 'now' ? duration : reserveDuration) >= 4 && (
                    <Badge className="ml-3 bg-green-100 text-green-700 hover:bg-green-200">
                      {vehicleType === 'car' ? '10%' : '15%'} off
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm font-medium">Choose parking type</p>
              
              <div className="grid gap-2">
                {selectedParking?.options.map((option: any) => (
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
                        {option.id === 'regular' ? 
                          <CircleParking className="h-5 w-5" /> : 
                          option.id === 'covered' ? 
                          <CircleParking className="h-5 w-5" /> : 
                          <Car className="h-5 w-5" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{option.name}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                        {option.features && renderFeatureBadges(option.features)}
                      </div>
                    </div>
                    {renderPriceDisplay(option)}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-2 bg-green-50 rounded-md text-sm text-green-600 flex items-center">
              {(activeTab === 'now' ? duration : reserveDuration) >= 4 ? (
                <>
                  <Timer className="h-4 w-4 mr-2" />
                  {vehicleType === 'car' ? '10%' : '15%'} discount applied for booking {activeTab === 'now' ? duration : reserveDuration} hours!
                </>
              ) : (
                <>
                  <Timer className="h-4 w-4 mr-2" />
                  Book for 4+ hours to get {vehicleType === 'car' ? '10%' : '15%'} discount!
                </>
              )}
            </div>
            
            <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
              <div className="text-sm font-medium">Total Price</div>
              <div className="text-lg font-semibold">${totalPrice.toFixed(2)}</div>
            </div>
            
            <Button className="w-full" onClick={handleProceedToPayment}>
              {isAuthenticated ? 'Proceed to Payment' : 'Sign In to Continue'}
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
            
            <div className="bg-muted/40 p-3 rounded-lg text-sm mb-4 relative">
              <div className="font-medium mb-1">{selectedParking?.name}</div>
              <div className="text-muted-foreground mb-1">
                {selectedParking?.options.find((o: any) => o.id === selectedOption)?.name} Parking
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center">
                  <Timer className="h-3 w-3 mr-1" />
                  Duration: {activeTab === 'now' ? duration : reserveDuration} hours
                </div>
                {activeTab === 'later' && (
                  <div className="text-amber-600">
                    $5 reservation fee
                  </div>
                )}
              </div>
              <div className="flex items-center text-xs mt-1">
                <div className="flex items-center mr-3">
                  {vehicleType === 'car' ? (
                    <Car className="h-3 w-3 mr-1" />
                  ) : (
                    <Bike className="h-3 w-3 mr-1" />
                  )}
                  {vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}: {vehicleNumber}
                </div>
                {(activeTab === 'now' ? duration : reserveDuration) >= 4 && (
                  <div className="text-green-600">
                    {vehicleType === 'car' ? '10%' : '15%'} discount
                  </div>
                )}
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
              <p className="text-sm text-muted-foreground mb-2">Your parking spot has been reserved</p>
              {currentBooking && (
                <div className="text-sm font-medium text-primary">
                  Order ID: {currentBooking.orderId}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowReceiptDialog(true)}
              >
                View Receipt
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
    <>
      <Card className="w-full shadow-lg border-none">
        <CardContent className="p-4">
          <Tabs 
            defaultValue="now" 
            className="w-full" 
            value={activeTab}
            onValueChange={handleTabChange}
          >
            <TabsList className="w-full mb-4">
              <TabsTrigger value="now" className="flex-1">Park Now</TabsTrigger>
              <TabsTrigger value="later" className="flex-1">Reserve</TabsTrigger>
            </TabsList>
            
            <TabsContent value="now" className="mt-0">
              {renderBookingStep()}
            </TabsContent>
            
            <TabsContent value="later" className="mt-0">
              {bookingStep === 'search' ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input 
                        placeholder="Where are you looking for parking?" 
                        className="pl-10"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setLocationError('');
                        }}
                      />
                    </div>
                    {locationError && (
                      <div className="text-destructive text-sm flex items-center mt-1">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {locationError}
                      </div>
                    )}
                    {renderAvailableLocations()}
                    
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
                      Reservations include a $5 surcharge
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
              ) : (
                renderBookingStep()
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sign In Dialog */}
      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-md">
          <SignInForm 
            onSuccess={handleSignInSuccess}
            onCancel={() => setShowSignInDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-md">
          {currentBooking && (
            <ParkingReceipt 
              booking={currentBooking}
              onClose={() => setShowReceiptDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Tab Change Confirmation Dialog */}
      <Dialog open={tabChangeConfirm} onOpenChange={setTabChangeConfirm}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4 py-2">
            <h3 className="text-lg font-semibold">Change Booking Type?</h3>
            <p className="text-sm text-muted-foreground">
              You are in the middle of a booking process. Changing tabs will reset your current progress.
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cancelTabChange}>
                Stay Here
              </Button>
              <Button variant="destructive" onClick={confirmTabChange}>
                Change Anyway
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParkingBookingForm;
