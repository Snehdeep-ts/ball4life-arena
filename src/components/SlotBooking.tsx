'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { TimeSlot } from '@/lib/types'

export default function SlotBooking() {
  const [selectedDate, setSelectedDate] = useState('Friday, November 29')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('6:00-12:00 PM')
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false)

  const dateDropdownRef = useRef<HTMLDivElement>(null)
  const timeDropdownRef = useRef<HTMLDivElement>(null)

  const dates = [
    'Friday, November 29',
    'Saturday, November 30',
    'Sunday, December 1'
  ]

  const timeRanges = [
    '6:00-12:00 PM',
    '12:00-5:00 PM',
    '5:00-10:00 PM'
  ]

  const timeSlots: TimeSlot[] = [
    { time: '6:00-7:00 AM', status: 'Available' },
    { time: '7:00-8:00 AM', status: 'Available' },
    { time: '8:00-9:00 AM', status: 'Booked' },
    { time: '9:00-10:00 AM', status: 'Available' },
    { time: '10:00-11:00 AM', status: 'Available' },
    { time: '11:00-12:00 PM', status: 'Available' }
  ]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setIsDateDropdownOpen(false)
      }
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
        setIsTimeDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gray-900 rounded-lg p-6 shadow-xl border border-gray-800">
        <h2 className="text-2xl mb-6 font-semibold text-white">Check Slot Availability</h2>

        {/* Date Selection */}
        <div className="mb-6 relative" ref={dateDropdownRef}>
          <label className="block text-sm text-gray-400 mb-2">Select Date</label>
          <div 
            onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
            className="flex justify-between items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors duration-200 cursor-pointer text-white"
          >
            <span>{selectedDate}</span>
            <ChevronDown className={`w-5 h-5 transform transition-transform duration-200 ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isDateDropdownOpen && (
            <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 animate-fadeIn text-white">
              {dates.map((date, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedDate(date)
                    setIsDateDropdownOpen(false)
                  }}
                  className="p-3 hover:bg-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
                >
                  {date}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time Range Selection */}
        <div className="mb-6 relative" ref={timeDropdownRef}>
          <label className="block text-sm text-gray-400 mb-2">Select Time Range</label>
          <div 
            onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
            className="flex justify-between items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors duration-200 cursor-pointer text-white"
          >
            <span>{selectedTimeSlot}</span>
            <ChevronDown className={`w-5 h-5 transform transition-transform duration-200 ${isTimeDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
          
          {isTimeDropdownOpen && (
            <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-xl border border-gray-700 animate-fadeIn text-white">
              {timeRanges.map((time, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedTimeSlot(time)
                    setIsTimeDropdownOpen(false)
                  }}
                  className="p-3 hover:bg-gray-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
                >
                  {time}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slots Table */}
        <div className="overflow-hidden rounded-lg border border-gray-800">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="p-4 text-left text-sm font-semibold text-white">TIME</th>
                <th className="p-4 text-left text-sm font-semibold text-white">STATUS</th>
                <th className="p-4 text-left text-sm font-semibold text-white">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <td className="p-4 text-white">{slot.time}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      slot.status === 'Available' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                    }`}>
                      {slot.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {slot.status === 'Available' ? (
                      <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200">
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
      </div>
    </div>
  )
}