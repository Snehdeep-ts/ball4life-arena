'use client';
import { useState } from 'react';
import { TimeSlot } from '@/lib/types';
import BookingModal from './BookingModal';

interface TimeSlotTableProps {
  slots: TimeSlot[];
  selectedDate: string;
  onBookingSuccess: () => void;
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
          <thead className="bg-gray-800 hidden">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-white">
                TIME
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
                <td className="p-4 text-white">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-medium">{slot.time}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex justify-end">
                    {slot.status === 'Available' ? (
                      <button
                        onClick={() => {
                          setSelectedSlot(slot);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
                      >
                        Book Slot
                      </button>
                    ) : (
                      <span className="text-gray-400">
                        Booked by {slot.bookedBy || 'someone'}
                      </span>
                    )}
                  </div>
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
        onSuccess={onBookingSuccess}
        selectedSlot={selectedSlot}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default TimeSlotTable;
