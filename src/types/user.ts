
export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  rating: number;
  bookingCount: number;
  memberSince: string;
}
