import { useMemo } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Flight } from '../types';
import { useState } from 'react';

interface CalendarViewProps {
  flights: Flight[];
  onDateSelect: (date: Date) => void;
}

export default function CalendarView({ flights, onDateSelect }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Group flights by date and find best deal for each date
  const flightsByDate = useMemo(() => {
    const dateMap = new Map<string, { minMiles: number; count: number; bestFlight: Flight }>();

    flights.forEach((flight) => {
      const dateKey = flight.date;
      const existing = dateMap.get(dateKey);

      if (!existing || flight.milesRequired < existing.minMiles) {
        dateMap.set(dateKey, {
          minMiles: flight.milesRequired,
          count: (existing?.count || 0) + 1,
          bestFlight: flight,
        });
      } else {
        dateMap.set(dateKey, {
          ...existing,
          count: existing.count + 1,
        });
      }
    });

    return dateMap;
  }, [flights]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad the start of the month
  const startDay = monthStart.getDay();
  const paddingDays = Array(startDay).fill(null);

  const getMilesColor = (miles: number): string => {
    if (miles < 50000) return 'bg-green-100 border-green-500 text-green-800';
    if (miles < 100000) return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    if (miles < 200000) return 'bg-orange-100 border-orange-500 text-orange-800';
    return 'bg-red-100 border-red-500 text-red-800';
  };

  return (
    <div className="glass rounded-xl p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {paddingDays.map((_, idx) => (
          <div key={`padding-${idx}`} className="aspect-square" />
        ))}
        {daysInMonth.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const flightData = flightsByDate.get(dateKey);
          const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

          return (
            <button
              key={dateKey}
              onClick={() => flightData && onDateSelect(day)}
              disabled={!flightData}
              className={`aspect-square p-2 rounded-lg border-2 transition-all ${
                flightData
                  ? `${getMilesColor(flightData.minMiles)} hover:scale-105 cursor-pointer shadow-sm hover:shadow-md`
                  : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
              } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className="flex flex-col h-full justify-between">
                <div className={`text-sm font-semibold ${isToday ? 'text-blue-600' : ''}`}>
                  {format(day, 'd')}
                </div>
                {flightData && (
                  <div className="text-xs">
                    <div className="font-bold">{(flightData.minMiles / 1000).toFixed(0)}k</div>
                    <div className="text-[10px] opacity-75">{flightData.count} flights</div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
          <span className="text-gray-600">&lt; 50k miles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
          <span className="text-gray-600">50k - 100k miles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border-2 border-orange-500 rounded"></div>
          <span className="text-gray-600">100k - 200k miles</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
          <span className="text-gray-600">&gt; 200k miles</span>
        </div>
      </div>
    </div>
  );
}
