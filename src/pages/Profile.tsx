
import React from 'react';
import { ArrowLeft, Edit, Star, Clock, Car, MapPin, Shield, User, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b flex items-center h-16 px-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-lg ml-2">Profile</h1>
        <Button variant="ghost" size="icon" className="ml-auto">
          <Edit className="h-5 w-5" />
        </Button>
      </header>
      
      <main className="container max-w-md mx-auto px-4 py-6">
        <div className="flex flex-col items-center mb-8">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary text-white text-xl">JD</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold">John Doe</h2>
          <p className="text-sm text-muted-foreground">Rider since April 2025</p>
          <div className="flex items-center mt-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">4.9</span>
            <span className="text-xs text-muted-foreground ml-1">(24 rides)</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Recent Rides
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0">
              <div className="space-y-3 text-sm">
                <div className="py-2 border-b last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">April 9, 2025</p>
                    <p className="text-primary font-medium">$15.50</p>
                  </div>
                  <div className="flex items-center text-muted-foreground text-xs">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <p className="truncate">Downtown Central → Home</p>
                  </div>
                </div>
                <div className="py-2 border-b last:border-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">April 8, 2025</p>
                    <p className="text-primary font-medium">$12.25</p>
                  </div>
                  <div className="flex items-center text-muted-foreground text-xs">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <p className="truncate">Home → Office Building</p>
                  </div>
                </div>
              </div>
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
                  <ArrowLeft className="h-4 w-4 rotate-180 text-muted-foreground" />
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
          
          <Button variant="outline" className="w-full">Sign Out</Button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
