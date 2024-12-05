import { SlotStatus, TimeSlot } from './types';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { app } from '../firebase';

const db = getFirestore(app);

// Generate dates for next 7 days
const generateDates = (): string[] => {
  const dates = [];
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dayName = daysOfWeek[date.getDay()];
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const dateStr = `${dayName}, ${
      monthNames[date.getMonth()]
    } ${date.getDate()}`;
    dates.push(dateStr);
  }

  return dates;
};

export const dates = generateDates();

export const timeRanges = [
  { label: '6:00 AM-12:00 PM', start: 6, end: 12 },
  { label: '12:00 PM-5:00 PM', start: 12, end: 17 },
  { label: '5:00 PM-10:00 PM', start: 17, end: 22 },
];

// Generate base time slots
const generateBaseTimeSlots = (selectedDate: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const currentDate = new Date();

  // Safely parse the date
  let selected: Date;
  try {
    if (selectedDate.includes(',')) {
      // Handle format like "Friday, December 5"
      const [dayName, monthAndDay] = selectedDate.split(', ');
      const [monthName, dayStr] = monthAndDay.split(' ');
      selected = new Date(
        currentDate.getFullYear(),
        monthNames.indexOf(monthName),
        parseInt(dayStr)
      );
    } else {
      // Handle other formats
      selected = new Date(selectedDate);
    }
    selected.setHours(0, 0, 0, 0);
  } catch (error) {
    console.error('Date parsing error:', error);
    selected = new Date();
    selected.setHours(0, 0, 0, 0);
  }

  // Current date for comparison
  const today = new Date();
  const currentHour = today.getHours();
  const currentMinute = today.getMinutes();

  // Set today to start of day for comparison
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Check if selected date is before today
  if (selected < todayStart) {
    // Past date - all slots unavailable
    for (let hour = 6; hour < 22; hour++) {
      const timeString = `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
      slots.push({
        time: timeString,
        status: 'Unavailable',
        bookedBy: null,
      });
    }
    return slots;
  }

  // Check if selected date is today
  const isToday = selected.toDateString() === todayStart.toDateString();

  for (let hour = 6; hour < 22; hour++) {
    const timeString = `${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
    let status = 'Available';

    if (isToday && hour <= currentHour) {
      status = 'Unavailable';
    }

    slots.push({
      time: timeString,
      status: status as SlotStatus,
      bookedBy: null,
    });
  }

  return slots;
};
// Get bookings for a specific date and update slot status
export const getTimeSlotsWithBookings = async (
  date: string
): Promise<TimeSlot[]> => {
  const slots = generateBaseTimeSlots(date);

  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('date', '==', date));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      const booking = doc.data();
      const slotIndex = slots.findIndex((slot) => slot.time === booking.time);
      if (slotIndex !== -1) {
        slots[slotIndex].status = 'Booked';
        slots[slotIndex].bookedBy = booking.name;
      }
    });

    return slots;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return slots;
  }
};

// Define monthNames at the module level for use in generateBaseTimeSlots
const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const allTimeSlots = generateBaseTimeSlots(new Date().toDateString());
