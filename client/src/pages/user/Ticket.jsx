import { useState, useEffect } from 'react';
import { Ticket as TicketIcon, MapPin, Clock, Car } from 'lucide-react';
import { sessionsApi } from '../../services/api';
import BottomNav from '../../components/BottomNav';

const Ticket = () => {
  const [activeTicket, setActiveTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveTicket();
  }, []);

  const fetchActiveTicket = async () => {
    try {
      const data = await sessionsApi.getActiveTicket();
      setActiveTicket(data);
    } catch (error) {
      console.error('Failed to fetch active ticket:', error);
      setActiveTicket(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-indigo-600 text-white pt-8 pb-4 px-4 flex-shrink-0">
          <h1 className="text-base font-semibold">Active Ticket</h1>
          <p className="text-indigo-200 text-xs">Your current parking ticket</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!activeTicket) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-indigo-600 text-white pt-8 pb-4 px-4 flex-shrink-0">
          <h1 className="text-base font-semibold">Active Ticket</h1>
          <p className="text-indigo-200 text-xs">Your current parking ticket</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <TicketIcon className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500 text-sm">No active parking ticket</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white pt-8 pb-4 px-4 flex-shrink-0">
        <h1 className="text-base font-semibold">Active Ticket</h1>
        <p className="text-indigo-200 text-xs">Your current parking ticket</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 text-white">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <TicketIcon size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold">{activeTicket.locationName}</h2>
                <div className="flex items-center gap-1 text-indigo-200 text-[10px]">
                  <MapPin size={10} />
                  <span>{activeTicket.locationAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashed separator */}
          <div className="relative py-1.5">
            <div className="absolute left-0 w-3 h-6 bg-gray-50 rounded-r-full -translate-y-1/2 top-1/2" />
            <div className="absolute right-0 w-3 h-6 bg-gray-50 rounded-l-full -translate-y-1/2 top-1/2" />
            <div className="border-t-2 border-dashed border-gray-200 mx-4" />
          </div>

          {/* Ticket Details */}
          <div className="p-3 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Car className="text-indigo-600" size={18} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500">Vehicle</p>
                <p className="font-semibold text-sm">{activeTicket.vehicleName}</p>
                <p className="text-xs text-gray-600">{activeTicket.vehiclePlate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-0.5">
                  <Clock size={10} />
                  <span>Entry Time</span>
                </div>
                <p className="font-semibold text-sm">{activeTicket.entryTime}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-0.5">
                  <MapPin size={10} />
                  <span>Spot</span>
                </div>
                <p className="font-semibold text-sm">{activeTicket.spot}</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-green-600">Status</p>
                  <p className="font-semibold text-sm text-green-700 capitalize">{activeTicket.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-green-600">Rate</p>
                  <p className="font-bold text-sm text-green-700">₹{activeTicket.estimatedCost}/hr</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center pt-2">
              <div className="bg-gray-100 p-3 rounded-lg">
                <svg width="80" height="80" viewBox="0 0 100 100" fill="currentColor" className="text-gray-800">
                  <rect x="10" y="10" width="25" height="25" />
                  <rect x="65" y="10" width="25" height="25" />
                  <rect x="10" y="65" width="25" height="25" />
                  <rect x="40" y="40" width="20" height="20" />
                  <rect x="65" y="65" width="12" height="12" />
                  <rect x="78" y="78" width="12" height="12" />
                </svg>
              </div>
            </div>

            <p className="text-center text-gray-500 text-[10px]">
              Show this QR code at exit for quick checkout
            </p>
          </div>
        </div>

        <button className="w-full mt-3 py-2.5 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors">
          Request Vehicle Retrieval
        </button>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Ticket;
