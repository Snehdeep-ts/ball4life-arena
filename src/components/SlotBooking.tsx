'use client';
import { useState, useMemo, useEffect } from 'react';
import TimeSlotTable from './TimeSlotTable';
import { dates, timeRanges } from '@/lib/data';
import { getTimeSlotsWithBookings } from '@/lib/data'; // Make sure this is imported
import Dropdown from './DropDown';
import { TimeSlot } from '@/lib/types';

const SlotBooking = () => {
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(
    timeRanges[0].label
  );
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const fetchSlots = async () => {
    const slots = await getTimeSlotsWithBookings(selectedDate);
    setTimeSlots(slots);
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  // Filter time slots based on selected time range
  const filteredTimeSlots = useMemo(() => {
    const selectedRange = timeRanges.find(
      (range) => range.label === selectedTimeRange
    );
    if (!selectedRange) return [];

    return timeSlots.filter((slot) => {
      const hour = parseInt(slot.time.split(':')[0]);
      const isPM = slot.time.includes('PM');
      let hourIn24 = hour;

      if (isPM && hour !== 12) hourIn24 += 12;
      if (!isPM && hour === 12) hourIn24 = 0;

      return hourIn24 >= selectedRange.start && hourIn24 < selectedRange.end;
    });
  }, [selectedTimeRange, timeSlots]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-6 shadow-xl border border-gray-800">
        <h2 className="text-2xl mb-6 font-semibold text-white">
          Check Slot Availability
        </h2>

        <Dropdown
          label="Select Date"
          value={selectedDate}
          options={dates}
          isOpen={isDateDropdownOpen}
          onToggle={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
          onSelect={(date) => {
            setSelectedDate(date);
            setIsDateDropdownOpen(false);
          }}
          onClickOutside={() => setIsDateDropdownOpen(false)}
        />

        <Dropdown
          label="Select Time Range"
          value={selectedTimeRange}
          options={timeRanges.map((range) => range.label)}
          isOpen={isTimeDropdownOpen}
          onToggle={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
          onSelect={(time) => {
            setSelectedTimeRange(time);
            setIsTimeDropdownOpen(false);
          }}
          onClickOutside={() => setIsTimeDropdownOpen(false)}
        />

        <TimeSlotTable
          slots={filteredTimeSlots}
          selectedDate={selectedDate}
          onBookingSuccess={fetchSlots} // Add this prop
        />
      </div>
    </div>
  );
};

export default SlotBooking;
