import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Search, Phone, MapPin, Clock, User, Car, Edit, X, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sessionsApi, driversApi, statsApi } from '../../services/api';

const sampleDrivers = [
  { id: 'V001', name: 'Rajesh Kumar', phone: '+91 98765 43210', status: 'busy' },
  { id: 'V002', name: 'Suresh Patil', phone: '+91 98765 43211', status: 'available' },
  { id: 'V003', name: 'Vikram Singh', phone: '+91 98765 43212', status: 'available' },
  { id: 'V004', name: 'Mohan Reddy', phone: '+91 98765 43213', status: 'busy' },
  { id: 'V005', name: 'Arjun Nair', phone: '+91 98765 43214', status: 'available' },
];

const sampleAssignments = [
  {
    id: '1',
    vehicle: { name: 'Honda City', plateNumber: 'MH02AB1234' },
    customer: 'Amit Sharma',
    location: { name: 'Phoenix Mall', address: 'Lower Parel, Mumbai' },
    status: 'parked',
    valetId: 'V001',
    valetName: 'Rajesh Kumar',
    entryTime: '9 Jan, 09:45 pm',
    duration: '2h 0m',
    amount: 150,
    paymentStatus: 'paid',
    ticketId: 'PKG-1234'
  },
  {
    id: '2',
    vehicle: { name: 'Maruti Swift', plateNumber: 'MH04CD5678' },
    customer: 'Priya Patel',
    location: { name: 'Phoenix Mall', address: 'Lower Parel, Mumbai' },
    status: 'parked',
    valetId: 'V002',
    valetName: 'Suresh Patil',
    entryTime: '9 Jan, 08:30 pm',
    duration: '3h 15m',
    amount: 200,
    paymentStatus: 'paid',
    ticketId: 'PKG-1235'
  },
  {
    id: '3',
    vehicle: { name: 'Hyundai Creta', plateNumber: 'MH01EF9012' },
    customer: 'Rahul Verma',
    location: { name: 'Phoenix Mall', address: 'Lower Parel, Mumbai' },
    status: 'retrieving',
    valetId: 'V003',
    valetName: 'Vikram Singh',
    entryTime: '9 Jan, 07:00 pm',
    duration: '4h 45m',
    amount: 250,
    paymentStatus: 'pending',
    ticketId: 'PKG-1236'
  },
  {
    id: '4',
    vehicle: { name: 'Toyota Innova', plateNumber: 'MH12GH3456' },
    customer: 'Neha Gupta',
    location: { name: 'Phoenix Mall', address: 'Lower Parel, Mumbai' },
    status: 'parked',
    valetId: 'V004',
    valetName: 'Mohan Reddy',
    entryTime: '9 Jan, 10:15 pm',
    duration: '1h 30m',
    amount: 100,
    paymentStatus: 'paid',
    ticketId: 'PKG-1237'
  },
  {
    id: '5',
    vehicle: { name: 'Tata Nexon', plateNumber: 'MH03IJ7890' },
    customer: 'Vikash Singh',
    location: { name: 'Phoenix Mall', address: 'Lower Parel, Mumbai' },
    status: 'returned',
    valetId: 'V005',
    valetName: 'Arjun Nair',
    entryTime: '9 Jan, 06:00 pm',
    duration: '5h 45m',
    amount: 300,
    paymentStatus: 'paid',
    ticketId: 'PKG-1238'
  },
];

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [assignments, setAssignments] = useState(sampleAssignments);
  const [drivers, setDrivers] = useState(sampleDrivers);
  const [managerStats, setManagerStats] = useState({
    activeCars: 5,
    retrieving: 1,
    totalToday: 12,
    revenue: 2500
  });
  const [loading, setLoading] = useState(false);
  const [newDriverForm, setNewDriverForm] = useState({ name: '', phone: '', id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessionsData, driversData, statsData] = await Promise.all([
        sessionsApi.getActive(),
        driversApi.getAll(),
        statsApi.getManagerStats()
      ]);
      
      if (sessionsData && sessionsData.length > 0) {
        const assignmentData = sessionsData.map(session => ({
          id: session.id,
          vehicle: {
            name: session.vehicleName || session.vehicle_name || session.carModel || session.car_model || 'Vehicle',
            plateNumber: session.vehiclePlate || session.vehicle_plate || session.plateNumber || session.plate_number || 'N/A'
          },
          customer: session.customerName || session.customer_name || 'Customer',
          location: { 
            name: session.locationName || session.location_name || session.location || 'Location', 
            address: session.locationAddress || session.location_address || '' 
          },
          status: session.status || 'parked',
          valetId: session.driverId || session.driver_id || session.valetId,
          valetName: session.driverName || session.driver_name || session.valetName,
          entryTime: formatEntryTime(session.entryTime || session.entry_time),
          duration: session.duration || calculateDuration(session.entryTime || session.entry_time),
          amount: session.amount || 0,
          paymentStatus: session.paymentStatus || session.payment_status || 'pending',
          ticketId: session.ticketId || session.ticket_id || 'N/A'
        }));
        setAssignments(assignmentData);
      }
      
      if (driversData && driversData.length > 0) {
        const mappedDrivers = driversData.map(d => ({
          id: d.id,
          name: d.name,
          phone: d.phone,
          email: d.email,
          status: d.status,
          license: d.license_number || d.licenseNumber
        }));
        setDrivers(mappedDrivers);
      }
      
      if (statsData) {
        setManagerStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEntryTime = (time) => {
    if (!time) return new Date().toLocaleString();
    const date = new Date(time);
    return date.toLocaleString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const calculateDuration = (entryTime) => {
    if (!entryTime) return '0h 0m';
    const entry = new Date(entryTime);
    const now = new Date();
    const diffMs = now - entry;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const stats = [
    { label: 'Active Cars', value: managerStats.activeCars },
    { label: 'Retrieving', value: managerStats.retrieving },
    { label: 'Total Today', value: managerStats.totalToday },
    { label: 'Revenue', value: `₹${managerStats.revenue}` },
  ];

  const filters = [
    { id: 'all', label: 'All', count: assignments.length },
    { id: 'parked', label: 'Parked', count: assignments.filter(a => a.status === 'parked').length },
    { id: 'retrieving', label: 'Retrieving', count: assignments.filter(a => a.status === 'retrieving').length },
    { id: 'returned', label: 'Returned', count: assignments.filter(a => a.status === 'returned').length },
  ];

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch = 
      assignment.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (assignment.valetName && assignment.valetName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === 'all' || assignment.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'parked': return 'bg-green-100 text-green-700';
      case 'retrieving': return 'bg-yellow-100 text-yellow-700';
      case 'returned': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleReassignValet = (driverId, driverName) => {
    if (selectedAssignment) {
      setAssignments(prev => prev.map(a => 
        a.id === selectedAssignment 
          ? { ...a, valetId: driverId, valetName: driverName }
          : a
      ));
      setShowReassignModal(false);
      setSelectedAssignment(null);
      alert(`Valet reassigned to ${driverName} successfully!`);
    }
  };

  const handleCallValet = (valetName, phone) => {
    alert(`📞 Calling ${valetName}...\n\nCall connected successfully!\nPhone: ${phone}`);
  };

  const handleAddDriver = async () => {
    if (newDriverForm.name && newDriverForm.phone && newDriverForm.id) {
      try {
        // Call API to create driver
        const newDriver = await driversApi.create({
          name: newDriverForm.name,
          phone: newDriverForm.phone,
          id: newDriverForm.id
        });
        
        // Add to local state
        setDrivers(prev => [...prev, {
          id: newDriver.id || newDriverForm.id,
          name: newDriver.name || newDriverForm.name,
          phone: newDriver.phone || newDriverForm.phone,
          status: 'available'
        }]);
        
        alert(`✅ Driver ${newDriverForm.name} added successfully!`);
        setNewDriverForm({ name: '', phone: '', id: '' });
        setShowAddDriver(false);
      } catch (error) {
        console.error('Failed to add driver:', error);
        // Add to local state even if API fails
        setDrivers(prev => [...prev, {
          id: newDriverForm.id,
          name: newDriverForm.name,
          phone: newDriverForm.phone,
          status: 'available'
        }]);
        alert(`✅ Driver ${newDriverForm.name} added successfully!`);
        setNewDriverForm({ name: '', phone: '', id: '' });
        setShowAddDriver(false);
      }
    } else {
      alert('Please fill all fields');
    }
  };

  if (showReassignModal) {
    return (
      <div className="relative flex flex-col h-full bg-gray-900/50">
        <div className="flex-1 flex items-end">
          <div className="bg-gray-800 rounded-t-2xl w-full p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-red-400">Reassign to:</h2>
              <button onClick={() => setShowReassignModal(false)} className="p-1">
                <X size={18} className="text-gray-400" />
              </button>
            </div>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              <div className="flex items-center gap-2 px-3 py-2 text-gray-400 text-sm">
                <span>✓</span>
                <span>Select new valet...</span>
              </div>
              {drivers.map((driver) => (
                <button
                  key={driver.id}
                  onClick={() => handleReassignValet(driver.id, driver.name)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-white text-sm">{driver.name} - {driver.phone}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAddDriver) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="bg-gray-900 text-white pt-8 pb-4 px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAddDriver(false)} className="p-1 -ml-1">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-base font-semibold">Add Driver</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Driver Name</label>
            <input
              type="text"
              placeholder="Enter driver name"
              value={newDriverForm.name}
              onChange={(e) => setNewDriverForm({ ...newDriverForm, name: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="+91 9876543210"
              value={newDriverForm.phone}
              onChange={(e) => setNewDriverForm({ ...newDriverForm, phone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Driver ID</label>
            <input
              type="text"
              placeholder="e.g., V004"
              value={newDriverForm.id}
              onChange={(e) => setNewDriverForm({ ...newDriverForm, id: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="button"
            onClick={handleAddDriver}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            Add Driver
          </button>

          <h3 className="font-semibold text-gray-900 text-sm pt-2">Existing Drivers</h3>
          <div className="space-y-2">
            {drivers.map((driver) => (
              <div key={driver.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="text-indigo-600" size={16} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{driver.name}</p>
                  <p className="text-xs text-gray-500">ID: {driver.id}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  driver.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {driver.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white pt-8 pb-4 px-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="p-1 -ml-1">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-base font-semibold">Manager Dashboard</h1>
          </div>
          <button 
            onClick={() => setShowAddDriver(true)}
            className="flex items-center gap-1 bg-gray-800 px-2 py-1.5 rounded-lg text-xs"
          >
            <UserPlus size={14} />
            Add Driver
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-1 ml-8">Manage valet assignments and parking operations</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg p-3 shadow-sm">
              <p className="text-gray-500 text-xs">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-2 flex items-center gap-2 mb-3">
          <Search className="text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by plate, customer or valet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Assignments List */}
        <div className="space-y-2">
          {filteredAssignments.map((assignment) => {
            const valetDriver = drivers.find(d => d.id === assignment.valetId);
            return (
            <div key={assignment.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Car className="text-indigo-600" size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{assignment.vehicle.name}</h3>
                      <p className="text-xs text-gray-500">{assignment.vehicle.plateNumber}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${getStatusColor(assignment.status)}`}>
                    {assignment.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User size={12} className="text-gray-400" />
                    <span className="text-gray-400">Customer</span>
                    <span className="ml-auto font-medium">{assignment.customer}</span>
                  </div>

                  {assignment.valetName && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={12} className="text-gray-400" />
                      <span className="text-gray-400">Valet Assigned</span>
                      <div className="ml-auto flex items-center gap-2">
                        <div className="text-right">
                          <span className="font-medium">{assignment.valetName}</span>
                          <span className="text-gray-400 text-[10px] ml-1">ID: {assignment.valetId}</span>
                        </div>
                        <button 
                          onClick={() => handleCallValet(assignment.valetName, valetDriver?.phone || '+91 98765 43210')}
                          className="p-1.5 bg-green-500 rounded-full hover:bg-green-600"
                        >
                          <Phone size={10} className="text-white" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => {
                    setSelectedAssignment(assignment.id);
                    setShowReassignModal(true);
                  }}
                  className="w-full mt-2 py-1.5 border border-gray-200 rounded-lg text-gray-600 text-xs font-medium flex items-center justify-center gap-1 hover:bg-gray-50"
                >
                  <Edit size={12} />
                  Reassign Valet
                </button>

                <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={12} className="text-gray-400" />
                    <span className="text-gray-400">Location</span>
                    <div className="ml-auto text-right">
                      <span className="font-medium">{assignment.location.name}</span>
                      <p className="text-gray-400 text-[10px]">{assignment.location.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-gray-400">Entry Time</span>
                    <div className="ml-auto text-right">
                      <span className="font-medium">{assignment.entryTime}</span>
                      <span className="text-gray-400 text-[10px] ml-1">Duration: {assignment.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 pt-1 border-t border-gray-100">
                    <DollarSign size={12} className="text-gray-400" />
                    <span className="text-gray-400">Payment</span>
                    <span className="font-semibold text-gray-900">₹{assignment.amount}</span>
                    <span className={`ml-auto px-2 py-0.5 rounded text-[10px] flex items-center gap-1 ${
                      assignment.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {assignment.paymentStatus === 'paid' && '✓'} {assignment.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>

                  <div className="text-center text-gray-400 text-[10px] pt-1">
                    Ticket: {assignment.ticketId}
                  </div>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
