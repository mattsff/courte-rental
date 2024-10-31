export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Court {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
  isAvailable: boolean;
  description?: string;
  images?: string[];
  amenities?: string[];
  maintenanceSchedule?: MaintenanceSchedule[];
}

export interface Booking {
  id: string;
  courtId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  totalPrice: number;
}

export interface MaintenanceSchedule {
  id: string;
  courtId: string;
  startTime: string;
  endTime: string;
  description: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

export interface AuthRequest extends Express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}