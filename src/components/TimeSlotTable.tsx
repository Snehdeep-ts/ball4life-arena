'use client';
import { useState } from 'react';
import { TimeSlot } from '@/lib/types';
import BookingModal from './BookingModal';

interface TimeSlotTableProps {
  slots: TimeSlot[];
  selectedDate: string;
  onBookingSuccess: () => void; // Add this
}

const TimeSlotTable = ({
  slots,
  selectedDate,
  onBookingSuccess,
}: TimeSlotTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  if (slots.length === 0) {
    return (
      <div className="text-center p-4 text-gray-400">
        No time slots available for the selected range.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-800">
        <table className="w-full">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-white">
                TIME
              </th>
              <th className="p-4 text-left text-sm font-semibold text-white">
                STATUS
              </th>
              <th className="p-4 text-left text-sm font-semibold text-white">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, index) => (
              <tr
                key={index}
                className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-200"
              >
                <td className="p-4 text-white">{slot.time}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      slot.status === 'Available'
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-red-900/50 text-red-400'
                    }`}
                  >
                    {slot.status}
                  </span>
                </td>
                <td className="p-4">
                  {slot.status === 'Available' ? (
                    <button
                      onClick={() => {
                        setSelectedSlot(slot);
                        setIsModalOpen(true);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                    >
                      Book
                    </button>
                  ) : (
                    <span className="px-4 py-2 bg-red-900/50 text-red-400 rounded-md">
                      Booked
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSlot(null);
        }}
        onSuccess={onBookingSuccess} // Add this
        selectedSlot={selectedSlot}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default TimeSlotTable;
