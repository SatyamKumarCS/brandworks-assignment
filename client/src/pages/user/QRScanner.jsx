import { useState, useEffect } from 'react';
import { X, ChevronRight, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vehiclesApi, locationsApi } from '../../services/api';

const QRScanner = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(true);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const [showVehicleSheet, setShowVehicleSheet] = useState(false);
  const [userVehicles, setUserVehicles] = useState([]);
  const [parkingLocations, setParkingLocations] = useState([]);

  useEffect(() => {
    // Fetch user vehicles and locations
    const fetchData = async () => {
      try {
        const [vehicles, locations] = await Promise.all([
          vehiclesApi.getUserVehicles(),
          locationsApi.getAll()
        ]);
        setUserVehicles(vehicles);
        setParkingLocations(locations);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    fetchData();
  }, []);

  // Simulate QR code detection
  useEffect(() => {
    if (isScanning && parkingLocations.length > 0) {
      const timer = setTimeout(() => {
        const randomLocation = parkingLocations[Math.floor(Math.random() * parkingLocations.length)];
        setDetectedLocation(randomLocation?.name || 'Parking Location');
        setIsScanning(false);
        setShowVehicleSheet(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isScanning, parkingLocations]);

  const handleVehicleSelect = (vehicleId) => {
    navigate('/parking-ticket', { state: { vehicleId, locationName: detectedLocation } });
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-8">
        <h1 className="text-white text-base font-semibold">Scan QR Code</h1>
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 flex items-center justify-center text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="relative w-48 h-48">
          {/* Scanner Frame */}
          <div className="absolute inset-0 border-2 border-indigo-500 rounded-xl">
            {/* Corner decorations */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-500 rounded-tl-lg" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-500 rounded-tr-lg" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-500 rounded-bl-lg" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-500 rounded-br-lg" />
          </div>

          {/* QR Code Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-indigo-400 opacity-50">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="3" height="3" />
                <rect x="18" y="14" width="3" height="3" />
                <rect x="14" y="18" width="3" height="3" />
                <rect x="18" y="18" width="3" height="3" />
              </svg>
            </div>
          </div>

          {/* Scanning animation */}
          {isScanning && (
            <div className="absolute inset-x-0 top-0 h-1 bg-indigo-500 animate-scan rounded" />
          )}
        </div>

        {/* Status Text */}
        <div className="mt-4 text-center">
          {isScanning ? (
            <p className="text-gray-400 text-sm">Scanning...</p>
          ) : (
            <>
              <p className="text-green-400 font-semibold text-sm">QR Code Detected!</p>
              <p className="text-gray-500 text-xs mt-1">{detectedLocation}</p>
            </>
          )}
        </div>
      </div>

      {/* Vehicle Selection Sheet */}
      {showVehicleSheet && (
        <div className="bg-white rounded-t-2xl p-4 animate-slide-up">
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />
          <h2 className="text-sm font-semibold text-gray-900 mb-0.5">Select Your Vehicle</h2>
          <p className="text-xs text-gray-500 mb-3">
            Choose which vehicle you're parking at {detectedLocation}
          </p>

          <div className="space-y-2">
            {userVehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => handleVehicleSelect(vehicle.id)}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Car className="text-indigo-600" size={20} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900 text-sm">{vehicle.name}</h3>
                  <p className="text-xs text-gray-500">{vehicle.plateNumber}</p>
                </div>
                <ChevronRight className="text-gray-400" size={18} />
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate('/register-vehicle')}
            className="w-full mt-3 py-3 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            Register New Vehicle
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
