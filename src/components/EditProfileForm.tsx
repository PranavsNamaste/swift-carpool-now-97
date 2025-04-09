
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types/user';

interface EditProfileFormProps {
  user: User;
  onSave: (user: User) => void;
  onCancel: () => void;
}

const EditProfileForm = ({ user, onSave, onCancel }: EditProfileFormProps) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [phone, setPhone] = useState(user.phone);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedUser = {
        ...user,
        name,
        email,
        avatarUrl,
        phone
      };
      
      onSave(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      setIsLoading(false);
    }, 1000);
  };

  // Function to handle avatar URL change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setAvatarUrl(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        <div className="mt-4 flex justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-primary text-white text-xl">
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div>
        <Label htmlFor="avatarUrl">Profile Picture URL</Label>
        <Input
          id="avatarUrl"
          type="text"
          value={avatarUrl}
          onChange={handleAvatarChange}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your phone number"
          required
        />
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
