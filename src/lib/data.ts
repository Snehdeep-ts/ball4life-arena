import { TimeSlot } from './types';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

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

// Generate base time slots
const generateBaseTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 6; hour < 22; hour++) {
    const timeString = `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
    slots.push({
      time: timeString,
      status: 'Available',
    });
  }
  return slots;
};

// Get bookings for a specific date and update slot status
export const getTimeSlotsWithBookings = async (
  date: string
): Promise<TimeSlot[]> => {
  const slots = generateBaseTimeSlots();

  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('date', '==', date));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const booking = doc.data();
      const slotIndex = slots.findIndex((slot) => slot.time === booking.time);
      if (slotIndex !== -1) {
        slots[slotIndex].status = 'Booked';
      }
    });

    return slots;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return slots;
  }
};

export const allTimeSlots = generateBaseTimeSlots();
