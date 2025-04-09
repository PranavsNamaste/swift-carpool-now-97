
import React from 'react';
import { Car, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type VehicleType = 'car' | 'bike';

interface VehicleTypeSelectorProps {
  selectedType: VehicleType;
  onChange: (type: VehicleType) => void;
  className?: string;
}

const VehicleTypeSelector = ({ selectedType, onChange, className = '' }: VehicleTypeSelectorProps) => {
  return (
    <div className={`flex gap-2 w-full mb-3 ${className}`}>
      <Button
        type="button"
        variant={selectedType === 'car' ? 'default' : 'outline'}
        className={`flex-1 flex items-center justify-center gap-2 ${selectedType === 'car' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
        onClick={() => onChange('car')}
      >
        <Car className="h-4 w-4" />
        Car
      </Button>
      <Button
        type="button"
        variant={selectedType === 'bike' ? 'default' : 'outline'}
        className={`flex-1 flex items-center justify-center gap-2 ${selectedType === 'bike' ? 'bg-green-600 hover:bg-green-700' : ''}`}
        onClick={() => onChange('bike')}
      >
        <Bike className="h-4 w-4" />
        Bike
      </Button>
    </div>
  );
};

export default VehicleTypeSelector;
