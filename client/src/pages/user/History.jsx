import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Car, ChevronDown, ChevronUp, Hash, CreditCard, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sessionsApi } from '../../services/api';
import BottomNav from '../../components/BottomNav';

const History = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [extendedHistory, setExtendedHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await sessionsApi.getHistory();
      const extended = data.map((record, index) => ({
        ...record,
        ticketId: record.ticketId || `TK-${record.id}`,
        vehicleName: record.vehicleName || 'Vehicle',
        entryTime: record.entryTime || '00:00',
        exitTime: record.exitTime || '00:00',
        paymentMethod: record.paymentMethod || 'UPI',
      }));
      setExtendedHistory(extended);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      setExtendedHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDownloadReceipt = (ticketId) => {
    alert(`Downloading receipt for ${ticketId}`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white pt-8 pb-4 px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1 -ml-1">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-semibold">Parking History</h1>
            <p className="text-indigo-200 text-xs">{loading ? 'Loading...' : `${extendedHistory.length} total bookings`}</p>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : extendedHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No parking history found</p>
          </div>
        ) : (
          <div className="space-y-2">
          {extendedHistory.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Main Row - Always Visible */}
              <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{record.locationName}</h4>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <MapPin size={12} />
                      <span>{record.locationAddress}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">₹{record.amount}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">
                      {record.status}
                    </span>
                  </div>
                </div>
                
                {/* Date and Vehicle Row with Toggle */}
                <button 
                  onClick={() => toggleExpand(record.id)}
                  className="w-full flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{record.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car size={12} />
                      <span>{record.vehiclePlate}</span>
                    </div>
                  </div>
                  {expandedId === record.id ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </button>
              </div>

              {/* Expanded Details */}
              {expandedId === record.id && (
                <div className="px-3 pb-3 border-t border-gray-100">
                  <p className="text-xs font-medium text-gray-500 mt-3 mb-2">Booking Details</p>
                  
                  <div className="space-y-2.5">
                    {/* Ticket ID */}
                    <div className="flex items-start gap-2">
                      <Hash size={14} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-gray-400">Ticket ID</p>
                        <p className="text-sm font-medium text-gray-900">{record.ticketId}</p>
                      </div>
                    </div>

                    {/* Vehicle */}
                    <div className="flex items-start gap-2">
                      <Car size={14} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-gray-400">Vehicle</p>
                        <p className="text-sm font-medium text-gray-900">{record.vehicleName}</p>
                        <p className="text-xs text-gray-500">{record.vehiclePlate}</p>
                      </div>
                    </div>

                    {/* Entry & Exit Time */}
                    <div className="flex items-start gap-2">
                      <Clock size={14} className="text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-[10px] text-gray-400">Entry</p>
                            <p className="text-sm font-medium text-gray-900">{record.entryTime}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400">Exit</p>
                            <p className="text-sm font-medium text-gray-900">{record.exitTime}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-start gap-2">
                      <CreditCard size={14} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-gray-400">Payment</p>
                        <p className="text-sm font-medium text-gray-900">{record.paymentMethod}</p>
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="flex items-center justify-between bg-indigo-50 rounded-lg px-3 py-2 mt-2">
                      <span className="text-xs font-medium text-indigo-600">Duration</span>
                      <span className="text-sm font-bold text-indigo-700">{record.duration}</span>
                    </div>

                    {/* Download Receipt Button */}
                    <button
                      onClick={() => handleDownloadReceipt(record.ticketId)}
                      className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors mt-2"
                    >
                      <Download size={16} />
                      Download Receipt
                    </button>
                  </div>
                </div>
              )}
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

export default History;
