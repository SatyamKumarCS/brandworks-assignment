import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Car, CreditCard, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userVehicles, parkingLocations } from '../../data/dummyData';

const ParkingTicket = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { vehicleId, locationName } = location.state || {};
  
  const vehicle = userVehicles.find(v => v.id === vehicleId) || userVehicles[0];
  const parkingLocation = parkingLocations.find(l => l.name === locationName) || parkingLocations[0];
  
  const [showPayment, setShowPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [parkingStarted, setParkingStarted] = useState(false);

  const currentTime = new Date();
  const entryTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = currentTime.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleStartParking = () => {
    setParkingStarted(true);
  };

  const handleRequestRetrieval = () => {
    setShowPayment(true);
  };

  const handlePayment = () => {
    setPaymentComplete(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (paymentComplete) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center p-6">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce">
          <Check className="text-green-600" size={28} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Payment Successful!</h2>
        <p className="text-gray-500 text-center text-sm">Your vehicle will be retrieved shortly. Please wait at the pickup point.</p>
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="bg-indigo-600 text-white pt-8 pb-4 px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowPayment(false)} className="p-1 -ml-1">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-base font-semibold">Payment</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Parking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Location</span>
                <span className="font-medium">{parkingLocation.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">2h 30m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle</span>
                <span className="font-medium">{vehicle.plateNumber}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-indigo-600">₹150</span>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 text-sm mb-2">Payment Method</h3>
          <div className="space-y-2">
            {['UPI', 'Credit/Debit Card', 'Net Banking'].map((method) => (
              <button
                key={method}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CreditCard className="text-gray-600" size={18} />
                <span className="font-medium text-sm">{method}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 flex-shrink-0">
          <button
            onClick={handlePayment}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            Pay ₹150
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white pt-8 pb-4 px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1 -ml-1">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-semibold">Parking Ticket</h1>
        </div>
      </div>

      {/* Ticket */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold">{parkingLocation.name}</h2>
                <div className="flex items-center gap-1 text-indigo-200 text-[10px]">
                  <MapPin size={10} />
                  <span>{parkingLocation.address}</span>
                </div>
              </div>
              {parkingStarted && (
                <div className="bg-green-500 text-white px-2 py-0.5 rounded-full text-[10px] font-medium">
                  Active
                </div>
              )}
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
                <p className="font-semibold text-sm">{vehicle.name}</p>
                <p className="text-xs text-gray-600">{vehicle.plateNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-0.5">
                  <Clock size={10} />
                  <span>Entry Time</span>
                </div>
                <p className="font-semibold text-sm">{entryTime}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="flex items-center gap-1 text-gray-500 text-[10px] mb-0.5">
                  <MapPin size={10} />
                  <span>Spot</span>
                </div>
                <p className="font-semibold text-sm">{parkingStarted ? 'Level 2 - B34' : 'Pending'}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-[10px] text-gray-500">Date</p>
              <p className="font-semibold text-sm">{date}</p>
            </div>

            {parkingStarted && (
              <div className="bg-indigo-50 rounded-lg p-3 text-center">
                <p className="text-[10px] text-indigo-600">Estimated Cost</p>
                <p className="text-lg font-bold text-indigo-600">₹40/hr</p>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="p-3 pt-0 flex justify-center">
            <div className="bg-gray-100 p-3 rounded-lg">
              <svg width="70" height="70" viewBox="0 0 100 100" fill="currentColor" className="text-gray-800">
                <rect x="10" y="10" width="25" height="25" />
                <rect x="65" y="10" width="25" height="25" />
                <rect x="10" y="65" width="25" height="25" />
                <rect x="40" y="40" width="20" height="20" />
                <rect x="65" y="65" width="12" height="12" />
                <rect x="78" y="78" width="12" height="12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-3 flex-shrink-0">
        {!parkingStarted ? (
          <button
            onClick={handleStartParking}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            Confirm Parking
          </button>
        ) : (
          <button
            onClick={handleRequestRetrieval}
            className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors"
          >
            Request Vehicle Retrieval
          </button>
        )}
      </div>
    </div>
  );
};

export default ParkingTicket;
