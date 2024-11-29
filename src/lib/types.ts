export type TimeSlot = {
  time: string;
  status: 'Available' | 'Booked';
};
export interface DateRange {
  start: string;
  end: string;
}

export interface BookingData {
  date: string;
  timeSlot: string;
  status: 'Available' | 'Booked';
}
