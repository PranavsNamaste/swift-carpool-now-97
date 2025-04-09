
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, MapPin, Car, Bike, CircleParking, CreditCard, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { generateOrderId } from '@/utils/helpers';

interface ParkingReceiptProps {
  booking: {
    orderId: string;
    parkingName: string;
    parkingAddress: string;
    parkingType: string;
    vehicleType: 'car' | 'bike';
    vehicleNumber: string;
    date: string;
    time: string;
    duration: number;
    totalPrice: number;
  };
  onClose: () => void;
}

const ParkingReceipt = ({ booking, onClose }: ParkingReceiptProps) => {
  return (
    <Card className="w-full">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Booking Receipt</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            Order ID: {booking.orderId}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CircleParking className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">{booking.parkingName}</p>
              <p className="text-sm text-muted-foreground">{booking.parkingAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-5 w-5 flex items-center justify-center">
              {booking.vehicleType === 'car' ? 
                <Car className="h-5 w-5 text-primary" /> : 
                <Bike className="h-5 w-5 text-primary" />
              }
            </div>
            <div>
              <p className="font-medium">{booking.vehicleType === 'car' ? 'Car' : 'Bike'}</p>
              <p className="text-sm text-muted-foreground">{booking.vehicleNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{booking.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">{booking.time}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3">
              <CircleParking className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Parking Type</p>
                <p className="font-medium">{booking.parkingType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{booking.duration} hours</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Amount</span>
          </div>
          <div className="text-xl font-bold">${booking.totalPrice.toFixed(2)}</div>
        </div>

        <div className="pt-2">
          <Button className="w-full" onClick={onClose}>
            Close Receipt
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParkingReceipt;
