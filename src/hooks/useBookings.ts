import { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

export const useBookings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSlotAvailability = async (date: string, time: string) => {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('date', '==', date),
      where('time', '==', time)
    );

    const snapshot = await getDocs(q);
    return snapshot.empty;
  };

  const createBooking = async (bookingData: {
    date: string;
    time: string;
    name: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      // Check if slot is available
      const isAvailable = await checkSlotAvailability(
        bookingData.date,
        bookingData.time
      );

      if (!isAvailable) {
        throw new Error('This slot is already booked');
      }

      // Add booking
      await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book slot');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getBookings = async (date: string) => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('date', '==', date));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bookings');
      return [];
    }
  };

  return {
    createBooking,
    getBookings,
    loading,
    error,
  };
};
