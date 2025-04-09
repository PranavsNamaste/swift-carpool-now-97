
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Phone, KeyRound } from 'lucide-react';

interface SignInFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// Demo credentials that will work
const DEMO_USERS = [
  { phone: '1234567890', otp: '123456' },
  { phone: '9876543210', otp: '654321' },
];

const SignInForm = ({ onSuccess, onCancel }: SignInFormProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const isValidPhone = DEMO_USERS.some(user => user.phone === phone);
      
      if (isValidPhone) {
        setStep('otp');
        toast({
          title: "OTP sent",
          description: `An OTP has been sent to ${phone}`,
        });
      } else {
        toast({
          title: "Invalid phone number",
          description: "This phone number is not recognized",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const user = DEMO_USERS.find(user => user.phone === phone && user.otp === otp);
      
      if (user) {
        toast({
          title: "Login successful",
          description: "You have been signed in successfully",
        });
        onSuccess();
      } else {
        toast({
          title: "Invalid OTP",
          description: "The OTP entered is incorrect",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">Sign In</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {step === 'phone' 
            ? 'Enter your phone number to continue' 
            : `Enter the OTP sent to ${phone}`}
        </p>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Demo numbers: 1234567890, 9876543210
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send OTP"}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div>
            <Label htmlFor="otp">One-Time Password</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="pl-10"
                placeholder="Enter OTP"
                required
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Demo OTPs: 123456 (for 1234567890), 654321 (for 9876543210)
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1" 
              onClick={() => setStep('phone')}
            >
              Back
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SignInForm;
