import { useState, useEffect } from 'react';
import { ChevronRight, MapPin, Clock, Car, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sessionsApi } from '../../services/api';
import BottomNav from '../../components/BottomNav';

const sampleParkingHistory = [
  {
    id: 'h1',
    locationName: 'Phoenix Mall',
    locationAddress: 'Lower Parel, Mumbai',
    date: '8 Dec 2025',
    vehiclePlate: 'MH 12 AB 1234',
    duration: '4h 15m',
    amount: 180,
    status: 'completed',
  },
  {
    id: 'h2',
    locationName: 'Central Plaza',
    locationAddress: 'Andheri West, Mumbai',
    date: '5 Dec 2025',
    vehiclePlate: 'MH 14 CD 5678',
    duration: '2h 50m',
    amount: 120,
    status: 'completed',
  },
  {
    id: 'h3',
    locationName: 'City Center Mall',
    locationAddress: 'Bandra East, Mumbai',
    date: '3 Dec 2025',
    vehiclePlate: 'MH 12 AB 1234',
    duration: '4h 30m',
    amount: 200,
    status: 'completed',
  },
];

const UserHome = () => {
  const navigate = useNavigate();
  const [parkingHistory, setParkingHistory] = useState(sampleParkingHistory);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchParkingHistory();
  }, []);

  const fetchParkingHistory = async () => {
    try {
      const data = await sessionsApi.getHistory();
      if (data && data.length > 0) {
        setParkingHistory(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch parking history:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white pt-8 pb-5 px-3 rounded-b-2xl flex-shrink-0">
        <h1 className="text-lg font-semibold">Smart Parking</h1>
        <p className="text-indigo-200 text-xs">Welcome back!</p>
        
        {/* Premium Banner */}
        <div 
          className="mt-3 rounded-lg p-3 relative overflow-hidden"
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(99, 102, 241, 0.85), rgba(147, 51, 234, 0.75)), url(https://images.unsplash.com/photo-1653684444707-df711c306524?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex items-center gap-1 text-yellow-300 text-[10px] mb-0.5">
            <span>🏆</span>
            <span>#1 IN INDIA</span>
          </div>
          <h2 className="text-sm font-semibold">Premium Parking Solution</h2>
          <p className="text-indigo-200 text-[10px]">Trusted by 1M+ users nationwide</p>
          <div className="absolute right-2 bottom-0">
            <div className="text-4xl">🚗</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 -mt-3">
        {/* Scan to Park Card */}
        <button
          onClick={() => navigate('/scan')}
          className="w-full bg-white rounded-xl p-3 shadow-sm flex items-center gap-3 mb-4 hover:shadow-md transition-shadow"
        >
          <div className="w-11 h-11 bg-orange-100 rounded-lg flex items-center justify-center">
            <QrCode size={22} className="text-orange-500" />
          </div>
          <div className="flex-1 text-left">
            <h3 className="font-semibold text-gray-900 text-sm">Scan to Park</h3>
            <p className="text-xs text-gray-500">Scan QR code at parking entrance</p>
          </div>
          <ChevronRight className="text-gray-400" size={18} />
        </button>

        {/* Recent Parking */}
        <h3 className="text-gray-900 font-semibold text-sm mb-2">Recent Parking</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : parkingHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No parking history yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {parkingHistory.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-lg p-3 shadow-sm"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{record.locationName}</h4>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <MapPin size={12} />
                      <span>{record.locationAddress}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">₹{record.amount}</p>
                    <span className="text-[10px] bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full">
                      {record.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{record.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Car size={12} />
                    <span>{record.vehiclePlate}</span>
                  </div>
                  <span>{record.duration}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default UserHome;
