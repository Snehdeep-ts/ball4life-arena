import { TimeSlot } from './types';

export const dates = [
  'Friday, November 29',
  'Saturday, November 30',
  'Sunday, December 1',
];

export const timeRanges = [
  { label: '6:00 AM-12:00 PM', start: 6, end: 12 },
  { label: '12:00 PM-5:00 PM', start: 12, end: 17 },
  { label: '5:00 PM-10:00 PM', start: 17, end: 22 },
];

// Generate all possible time slots for the day
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 6; hour < 22; hour++) {
    // Randomly assign status for demonstration
    const status = Math.random() > 0.3 ? 'Available' : 'Booked';
    const timeString = `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
    slots.push({
      time: timeString,
      status,
    });
  }
  return slots;
};

export const allTimeSlots = generateTimeSlots();
