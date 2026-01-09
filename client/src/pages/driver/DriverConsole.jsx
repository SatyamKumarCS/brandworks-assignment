import { useState, useEffect } from 'react';
import { Bell, User, MapPin, Clock, Car, ChevronRight } from 'lucide-react';
import { sessionsApi } from '../../services/api';

const DriverConsole = () => {
  const [hasNewAssignment, setHasNewAssignment] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState(null);
  const [view, setView] = useState('main');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const sessions = await sessionsApi.getActive();
      
      // Find active sessions assigned to this driver (mock driver ID: 1)
      const driverSessions = sessions.filter(s => s.driverId === 1);
      
      if (driverSessions.length > 0) {
        const current = driverSessions[0];
        setCurrentAssignment({
          id: current.id,
          vehicle: {
            name: current.vehicleName || 'Vehicle',
            plateNumber: current.vehiclePlate || 'N/A'
          },
          customer: current.customerName || 'Customer',
          location: {
            name: current.locationName || 'Location',
            address: current.locationAddress || ''
          },
          status: current.status || 'parked'
        });
        
        // Check for pending assignments (status = 'pending')
        const pending = driverSessions.find(s => s.status === 'pending' || s.status === 'retrieving');
        if (pending && pending.id !== current.id) {
          setNewAssignment({
            id: pending.id,
            vehicle: {
              name: pending.vehicleName || 'Vehicle',
              plateNumber: pending.vehiclePlate || 'N/A'
            },
            customer: pending.customerName || 'Customer',
            location: {
              name: pending.locationName || 'Location',
              address: pending.locationAddress || ''
            },
            status: pending.status
          });
          setHasNewAssignment(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error);
      setCurrentAssignment({
        id: 1,
        vehicle: { name: 'Toyota Camry', plateNumber: 'MH 12 AB 1234' },
        customer: 'Rahul Sharma',
        location: { name: 'Phoenix Mall', address: 'Lower Parel, Mumbai' },
        status: 'parked'
      });
      setNewAssignment({
        id: 2,
        vehicle: { name: 'Honda City', plateNumber: 'MH 01 CD 5678' },
        customer: 'Priya Patel',
        location: { name: 'Inorbit Mall', address: 'Malad West, Mumbai' },
        status: 'retrieving'
      });
      setHasNewAssignment(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAssignment = () => {
    setHasNewAssignment(false);
    setCurrentAssignment(newAssignment);
    setView('retrieval');
  };

  const handleParkVehicle = () => {
    alert('Vehicle parked successfully! Spot: Level 2 - B34');
    if (currentAssignment) {
      setCurrentAssignment({ ...currentAssignment, status: 'parked' });
    }
  };

  const handleStartRetrieval = () => {
    alert('Retrieval started! Navigate to the parking spot.');
    setView('main');
    setHasNewAssignment(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-indigo-600 text-white pt-8 pb-4 px-4 flex-shrink-0">
          <div>
            <p className="text-indigo-200 text-xs">Driver Console</p>
            <h1 className="text-sm font-semibold">Welcome back,</h1>
            <h2 className="text-base font-bold">Rajesh Kumar</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // Retrieval View
  if (view === 'retrieval' && currentAssignment) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Header */}
        <div className="bg-indigo-600 text-white pt-8 pb-4 px-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-xs">Driver Console</p>
              <h1 className="text-sm font-semibold">Welcome back,</h1>
              <h2 className="text-base font-bold">Rajesh Kumar</h2>
            </div>
            <button className="relative p-1.5">
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* Current Assignment */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-gray-500 text-xs font-medium mb-2">Current Assignment</h3>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Car className="text-indigo-600" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{currentAssignment.vehicle.name}</h3>
                <p className="text-gray-500 text-xs">{currentAssignment.vehicle.plateNumber}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-medium">
                  Retrieve Vehicle
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <User size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-[10px]">Customer</p>
                  <p className="font-semibold text-gray-900 text-sm">{currentAssignment.customer}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-[10px]">Location</p>
                  <p className="font-semibold text-gray-900 text-sm">{currentAssignment.location.name}</p>
                  <p className="text-xs text-gray-500">{currentAssignment.location.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-[10px]">Retrieve from</p>
                  <p className="font-semibold text-gray-900 text-sm">Level 3 - A12</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-[10px]">Assigned at</p>
                  <p className="font-semibold text-gray-900 text-sm">09:59 pm</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartRetrieval}
              className="w-full mt-4 py-3 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors"
            >
              Start Retrieval
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main View
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white pt-8 pb-4 px-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-200 text-xs">Driver Console</p>
            <h1 className="text-sm font-semibold">Welcome back,</h1>
            <h2 className="text-base font-bold">Rajesh Kumar</h2>
          </div>
          <button className="relative p-1.5">
            <Bell size={20} />
            {hasNewAssignment && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
                1
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* New Assignment Alert */}
        {hasNewAssignment && newAssignment && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Bell size={14} />
              <h3 className="font-semibold text-sm">New Assignments</h3>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-3 border-l-4 border-indigo-600">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Car className="text-indigo-600" size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{newAssignment.vehicle.name}</h3>
                  <p className="text-xs text-gray-500">{newAssignment.vehicle.plateNumber}</p>
                </div>
              </div>
              <span className="inline-block mb-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-medium">
                Retrieve Vehicle
              </span>
              
              <button
                onClick={handleAcceptAssignment}
                className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1"
              >
                Accept Assignment
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Current Assignment */}
        {currentAssignment ? (
        <div>
          <h3 className="text-gray-500 text-xs font-medium mb-2">Current Assignment</h3>
          
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Car className="text-indigo-600" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{currentAssignment.vehicle.name}</h3>
                <p className="text-gray-500 text-xs">{currentAssignment.vehicle.plateNumber}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-[10px] font-medium">
                  Park Vehicle
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-gray-100">
              <div className="flex items-start gap-2">
                <User size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-[10px]">Customer</p>
                  <p className="font-semibold text-gray-900 text-sm">{currentAssignment.customer}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-[10px]">Location</p>
                  <p className="font-semibold text-gray-900 text-sm">{currentAssignment.location.name}</p>
                  <p className="text-xs text-gray-500">{currentAssignment.location.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-[10px]">Park at</p>
                  <p className="font-semibold text-gray-900 text-sm">{currentAssignment.parkingSpot || 'Level 2 - B34'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock size={14} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-[10px]">Assigned at</p>
                  <p className="font-semibold text-gray-900 text-sm">{currentAssignment.entryTime || '10:30 AM'}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleParkVehicle}
              className="w-full mt-4 py-3 bg-green-500 text-white rounded-lg font-semibold text-sm hover:bg-green-600 transition-colors"
            >
              Mark as Parked
            </button>
          </div>
        </div>
        ) : (
          <div className="text-center py-8">
            <Car className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500 text-sm">No current assignments</p>
            <p className="text-gray-400 text-xs mt-1">You'll be notified when a new assignment arrives</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverConsole;
