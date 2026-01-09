// User's Vehicles
export const userVehicles = [
  { id: '1', name: 'Toyota Camry', plateNumber: 'MH 12 AB 1234', type: 'car' },
  { id: '2', name: 'Honda Civic', plateNumber: 'MH 14 CD 5678', type: 'car' },
];

// Recent Parking History
export const recentParkingHistory = [
  {
    id: '1',
    locationName: 'Phoenix Mall',
    locationAddress: 'Lower Parel, Mumbai',
    date: '8 Dec 2025',
    vehiclePlate: 'MH 12 AB 1234',
    duration: '4h 15m',
    amount: 180,
    status: 'completed',
  },
  {
    id: '2',
    locationName: 'Central Plaza',
    locationAddress: 'Andheri West, Mumbai',
    date: '5 Dec 2025',
    vehiclePlate: 'MH 14 CD 5678',
    duration: '2h 50m',
    amount: 120,
    status: 'completed',
  },
  {
    id: '3',
    locationName: 'City Center Mall',
    locationAddress: 'Bandra East, Mumbai',
    date: '3 Dec 2025',
    vehiclePlate: 'MH 12 AB 1234',
    duration: '4h 30m',
    amount: 200,
    status: 'completed',
  },
];

// Parking Locations
export const parkingLocations = [
  { id: '1', name: 'Phoenix Mall', address: 'Lower Parel', city: 'Mumbai' },
  { id: '2', name: 'Central Plaza', address: 'Andheri West', city: 'Mumbai' },
  { id: '3', name: 'Inorbit Mall', address: 'Malad West', city: 'Mumbai' },
  { id: '4', name: 'City Center Mall', address: 'Bandra East', city: 'Mumbai' },
];

// Manager Stats
export const managerStats = {
  activeCars: 3,
  retrieving: 1,
  totalToday: 5,
  revenue: 825,
};

// Valet Assignments for Manager
export const valetAssignments = [
  {
    id: '1',
    vehicle: { id: '1', name: 'Honda City', plateNumber: 'MH02AB1234', type: 'car' },
    customer: 'Amit Sharma',
    location: { id: '1', name: 'Phoenix Mall', address: 'Lower Parel', city: 'Mumbai' },
    parkingSpot: 'Level 2 - B34',
    entryTime: '5 Jan, 08:04 pm',
    duration: '2h 0m',
    valetId: 'V001',
    valetName: 'Rajesh Kumar',
    status: 'parked',
    assignmentType: 'park',
    paymentStatus: 'pending',
  },
  {
    id: '2',
    vehicle: { id: '2', name: 'Maruti Swift', plateNumber: 'MH12CD5678', type: 'car' },
    customer: 'Priya Verma',
    location: { id: '1', name: 'Phoenix Mall', address: 'Lower Parel', city: 'Mumbai' },
    parkingSpot: 'Level 3 - A12',
    entryTime: '5 Jan, 07:30 pm',
    duration: '2h 30m',
    valetId: 'V002',
    valetName: 'Suresh Patel',
    status: 'retrieving',
    assignmentType: 'retrieve',
    paymentStatus: 'paid',
    amount: 150,
  },
  {
    id: '3',
    vehicle: { id: '3', name: 'Hyundai i20', plateNumber: 'MH04EF9012', type: 'car' },
    customer: 'Rahul Singh',
    location: { id: '1', name: 'Phoenix Mall', address: 'Lower Parel', city: 'Mumbai' },
    parkingSpot: 'Level 1 - C05',
    entryTime: '5 Jan, 06:15 pm',
    duration: '3h 45m',
    valetId: 'V001',
    valetName: 'Rajesh Kumar',
    status: 'parked',
    assignmentType: 'park',
    paymentStatus: 'pending',
  },
];

// Drivers
export const drivers = [
  { id: 'V001', name: 'Rajesh Kumar', phone: '+91 9876543210', status: 'busy' },
  { id: 'V002', name: 'Suresh Patel', phone: '+91 9876543211', status: 'busy' },
  { id: 'V003', name: 'Mohan Das', phone: '+91 9876543212', status: 'available' },
];

// Current Driver Assignments (for Driver view)
export const driverCurrentAssignment = {
  id: '1',
  vehicle: { id: '1', name: 'Honda City', plateNumber: 'MH02AB1234', type: 'car' },
  customer: 'Amit Sharma',
  location: { id: '1', name: 'Phoenix Mall', address: 'Lower Parel', city: 'Mumbai' },
  parkingSpot: 'Level 2 - B34',
  entryTime: '10:04 pm',
  duration: '0m',
  status: 'pending',
  assignmentType: 'park',
};

export const driverNewAssignment = {
  id: '2',
  vehicle: { id: '2', name: 'Maruti Swift', plateNumber: 'MH12CD5678', type: 'car' },
  customer: 'Priya Verma',
  location: { id: '1', name: 'Phoenix Mall', address: 'Lower Parel', city: 'Mumbai' },
  parkingSpot: 'Level 3 - A12',
  entryTime: '09:59 pm',
  duration: '0m',
  status: 'retrieving',
  assignmentType: 'retrieve',
};

// Super Admin Stats
export const superAdminStats = {
  ticketsIssuedToday: 87,
  collectionToday: 13050,
  totalTickets: 1247,
  totalCollection: 186450,
  activeParking: 45,
};

// Sites for Super Admin
export const sites = [
  { id: '1', name: 'Phoenix Mall - Lower Parel', address: 'Lower Parel', city: 'Mumbai' },
  { id: '2', name: 'Central Plaza - Andheri', address: 'Andheri West', city: 'Mumbai' },
  { id: '3', name: 'Inorbit Mall - Malad', address: 'Malad West', city: 'Mumbai' },
];
