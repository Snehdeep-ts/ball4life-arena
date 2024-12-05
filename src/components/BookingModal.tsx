'use client';
import { useState } from 'react';
import { BookingDetails, TimeSlot } from '@/lib/types';
import { db } from '@/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import UPIPaymentModal from './UPIPaymentModal';

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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );

  const handleProceedToPayment = async () => {
    if (!selectedSlot || !name || !email || !phone) return;
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

      const details = {
        date: selectedDate,
        time: selectedSlot.time,
        name,
        email,
        phone,
        amount: 1, // Set your booking amount here
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      setBookingDetails(details);
      setShowPayment(true);
    } catch (error) {
      alert('Error checking availability. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    try {
      const bookingsRef = collection(db, 'bookings');
      await addDoc(bookingsRef, {
        ...bookingDetails,
        transactionId,
        status: 'confirmed',
      });

      alert('Booking successful!');
      onSuccess();
      resetForm();
    } catch (error) {
      alert('Error saving booking. Please contact support.');
      console.error('Saving booking error:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setShowPayment(false);
    setBookingDetails(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-4">
            Book Slot for {selectedSlot?.time}
          </h3>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
            />

            <div className="text-gray-400 text-sm">Booking Fee: ₹200</div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleProceedToPayment}
              disabled={loading || !name || !email || !phone}
              className={`px-4 py-2 bg-green-600 text-white rounded-md 
                ${
                  loading || !name || !email || !phone
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-green-700'
                }`}
            >
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>

      {showPayment && bookingDetails && (
        <UPIPaymentModal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
          bookingDetails={bookingDetails}
        />
      )}
    </>
  );
};

export default BookingModal;
