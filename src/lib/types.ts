// types.ts
export type SlotStatus = 'Unavailable' | 'Available' | 'Booked';

export interface TimeSlot {
  time: string;
  status: SlotStatus;
  bookedBy: string | null;
}
export interface DateRange {
  start: string;
  end: string;
}

export interface BookingData {
  date: string;
  timeSlot: string;
  status: 'Available' | 'Booked';
}

export interface UPIDetails {
  vpa: string;
  name: string;
  amount: number;
  transactionNote: string;
}

export interface BookingDetails {
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  timestamp: string;
  status: string;
}
