'use client';
import { useState } from 'react';
import { TimeSlot } from '@/lib/types';
import { db } from '@/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedSlot: TimeSlot | null;
  selectedDate: string;
}

const BookingModal = ({
  isOpen,
  onClose,
  onSuccess,
  selectedSlot,
  selectedDate,
}: BookingModalProps) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!selectedSlot || !name) return;
    setLoading(true);

    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(
        bookingsRef,
        where('date', '==', selectedDate),
        where('time', '==', selectedSlot.time)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert('Sorry, this slot was just booked. Please choose another time.');
        onClose();
        return;
      }

      await addDoc(bookingsRef, {
        date: selectedDate,
        time: selectedSlot.time,
        name: name,
        timestamp: new Date().toISOString(),
      });

      alert('Booking successful!');
      onSuccess(); // Call this after successful booking
      onClose();
      setName('');
    } catch (error) {
      alert('Error creating booking. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border border-gray-800">
        <h3 className="text-lg font-medium text-white mb-4">
          Book Slot for {selectedSlot?.time}
        </h3>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white mb-4"
        />

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleBooking}
            disabled={loading || !name}
            className={`px-4 py-2 bg-green-600 text-white rounded-md 
              ${
                loading || !name
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-green-700'
              }`}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
