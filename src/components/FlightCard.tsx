import type { Flight } from '../types';
import { Plane, Clock, Users } from 'lucide-react';

interface FlightCardProps {
  flight: Flight;
}

export default function FlightCard({ flight }: FlightCardProps) {
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCabinClass = (cabinClass: string): string => {
    return cabinClass
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getAvailabilityColor = (availability: number): string => {
    if (availability >= 7) return 'text-green-600 bg-green-50';
    if (availability >= 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCabinClassColor = (cabinClass: string): string => {
    switch (cabinClass) {
      case 'first':
        return 'bg-purple-100 text-purple-800';
      case 'business':
        return 'bg-blue-100 text-blue-800';
      case 'premium_economy':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="glass rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            {flight.airline.code}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{flight.airline.name}</h3>
            <p className="text-sm text-gray-600">{flight.flightNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {flight.milesRequired.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">miles</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-900">{flight.departureTime}</div>
          <div className="text-sm text-gray-600">
            {flight.origin.code} - {flight.origin.city}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center px-4">
          <div className="text-sm text-gray-600 mb-1">{formatDuration(flight.duration)}</div>
          <div className="w-full relative">
            <div className="h-0.5 bg-gray-300 w-full"></div>
            <Plane className="w-5 h-5 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
          </div>
        </div>

        <div className="flex-1 text-right">
          <div className="text-2xl font-bold text-gray-900">{flight.arrivalTime}</div>
          <div className="text-sm text-gray-600">
            {flight.destination.code} - {flight.destination.city}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCabinClassColor(flight.cabinClass)}`}>
            {formatCabinClass(flight.cabinClass)}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            {new Date(flight.date).toLocaleDateString('en-GB', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(flight.availability)}`}>
            <Users className="w-3 h-3" />
            {flight.availability} seat{flight.availability !== 1 ? 's' : ''}
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}
