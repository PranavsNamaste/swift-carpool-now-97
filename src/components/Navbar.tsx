
import React from 'react';
import { Menu, User, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-primary mr-2">RideHub</h1>
        <span className="text-xs text-muted-foreground">beta</span>
      </div>

      <div className="flex items-center gap-2">
        {!isMobile && (
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="text-sm">
              <Clock className="h-4 w-4 mr-2" />
              Ride History
            </Button>
            <Button variant="ghost" size="sm" className="text-sm">
              <Star className="h-4 w-4 mr-2" />
              Rate Driver
            </Button>
          </div>
        )}
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mb-4">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center p-3 border rounded-lg mb-4 bg-accent/50">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-white">JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">4.9 ★ | 24 rides</p>
                </div>
              </div>
              
              <Button variant="ghost" className="justify-start">
                <Clock className="h-4 w-4 mr-3" />
                Your Rides
              </Button>
              <Button variant="ghost" className="justify-start">
                <User className="h-4 w-4 mr-3" />
                Profile
              </Button>
              <Button variant="ghost" className="justify-start">
                <Star className="h-4 w-4 mr-3" />
                Rate Experience
              </Button>
              <Button variant="ghost" className="justify-start text-red-500">
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
