
import { format } from 'date-fns';

// Generate a random order ID
export const generateOrderId = (): string => {
  const prefix = 'PH';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
};

// Format date for display
export const formatDate = (date: Date): string => {
  return format(date, 'MMMM d, yyyy');
};

// Format time for display
export const formatTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

// Generate a random color for avatar fallback
export const getRandomColor = (): string => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
};
