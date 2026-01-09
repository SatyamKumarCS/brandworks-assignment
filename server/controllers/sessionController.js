import prisma from '../config/prisma.js';

const mockSessions = [
  {
    id: 1,
    ticketId: 'PRK-10001',
    vehicleName: 'Honda City',
    vehiclePlate: 'MH02AB1234',
    customerName: 'Amit Sharma',
    driverId: 1,
    driverName: 'Rajesh Kumar',
    locationName: 'Phoenix Mall',
    locationAddress: 'Lower Parel, Mumbai',
    parkingSpot: 'Level 2 - B34',
    status: 'parked',
    entryTime: new Date().toISOString(),
    amount: 150.00,
    paymentStatus: 'pending'
  },
  {
    id: 2,
    ticketId: 'PRK-10002',
    vehicleName: 'Maruti Swift',
    vehiclePlate: 'MH12CD5678',
    customerName: 'Priya Verma',
    driverId: 2,
    driverName: 'Suresh Patel',
    locationName: 'Phoenix Mall',
    locationAddress: 'Lower Parel, Mumbai',
    parkingSpot: 'Level 3 - A12',
    status: 'retrieving',
    entryTime: new Date(Date.now() - 3600000).toISOString(),
    amount: 150.00,
    paymentStatus: 'paid'
  }
];

const mockHistory = [
  {
    id: 'h1',
    locationName: 'Phoenix Mall',
    locationAddress: 'Lower Parel, Mumbai',
    date: '8 Dec 2025',
    vehiclePlate: 'MH 12 AB 1234',
    vehicleName: 'Toyota Camry',
    duration: '4h 15m',
    amount: 180,
    status: 'completed',
    entryTime: '02:15 pm',
    exitTime: '06:30 pm',
    paymentMethod: 'UPI',
    ticketId: 'TK-2025-12-01-001'
  },
  {
    id: 'h2',
    locationName: 'Central Plaza',
    locationAddress: 'Andheri West, Mumbai',
    date: '5 Dec 2025',
    vehiclePlate: 'MH 14 CD 5678',
    vehicleName: 'Honda Civic',
    duration: '2h 50m',
    amount: 120,
    status: 'completed',
    entryTime: '03:20 pm',
    exitTime: '06:10 pm',
    paymentMethod: 'Credit Card',
    ticketId: 'TK-2025-12-02-002'
  }
];

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await prisma.parkingSession.findMany({
      orderBy: { entryTime: 'desc' }
    });
    
    if (sessions.length > 0) {
      return res.json(sessions);
    }
    res.json(mockSessions);
  } catch (err) {
    console.error('Session fetch error:', err);
    res.json(mockSessions);
  }
};

export const getActiveSessions = async (req, res) => {
  try {
    const sessions = await prisma.parkingSession.findMany({
      where: {
        status: { in: ['parked', 'retrieving', 'pending'] }
      },
      orderBy: { entryTime: 'desc' }
    });
    
    if (sessions.length > 0) {
      return res.json(sessions);
    }
    
    const active = mockSessions.filter(s => ['parked', 'retrieving', 'pending'].includes(s.status));
    res.json(active);
  } catch (err) {
    console.error('Active sessions fetch error:', err);
    res.json(mockSessions);
  }
};

export const getParkingHistory = async (req, res) => {
  try {
    const sessions = await prisma.parkingSession.findMany({
      where: { status: 'completed' },
      orderBy: { exitTime: 'desc' }
    });
    
    if (sessions.length > 0) {
      return res.json(sessions);
    }
    res.json(mockHistory);
  } catch (err) {
    console.error('History fetch error:', err);
    res.json(mockHistory);
  }
};

export const getActiveTicket = async (req, res) => {
  try {
    const session = await prisma.parkingSession.findFirst({
      where: {
        status: { in: ['parked', 'retrieving'] }
      },
      orderBy: { entryTime: 'desc' }
    });
    
    if (session) {
      return res.json({
        id: session.id,
        locationName: session.locationName,
        locationAddress: session.locationAddress,
        vehicleName: session.vehicleName,
        vehiclePlate: session.vehiclePlate,
        entryTime: new Date(session.entryTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date(session.entryTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        spot: session.parkingSpot,
        status: session.status,
        estimatedCost: 40
      });
    }
    
    const activeTicket = mockSessions.find(s => s.status === 'parked' || s.status === 'retrieving');
    if (activeTicket) {
      return res.json({
        id: activeTicket.id,
        locationName: activeTicket.locationName,
        locationAddress: activeTicket.locationAddress,
        vehicleName: activeTicket.vehicleName,
        vehiclePlate: activeTicket.vehiclePlate,
        entryTime: new Date(activeTicket.entryTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        date: new Date(activeTicket.entryTime).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        spot: activeTicket.parkingSpot,
        status: activeTicket.status,
        estimatedCost: 40
      });
    }
    res.json(null);
  } catch (err) {
    console.error('Active ticket fetch error:', err);
    res.json(null);
  }
};

export const createSession = async (req, res) => {
  const { plateNumber, carModel, location, locationAddress, customerName, vehicleId } = req.body;
  const ticketId = 'PRK-' + Math.floor(Math.random() * 90000 + 10000);

  try {
    const session = await prisma.parkingSession.create({
      data: {
        ticketId,
        vehicleName: carModel,
        vehiclePlate: plateNumber,
        customerName,
        locationName: location,
        locationAddress: locationAddress || 'Mumbai',
        status: 'pending',
        paymentStatus: 'unpaid'
      }
    });
    
    res.status(201).json(session);
  } catch (err) {
    console.error('Create session error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const updateSessionStatus = async (req, res) => {
  const { id } = req.params;
  const { status, valetId, valetName, parkingSpot } = req.body;

  try {
    const session = await prisma.parkingSession.update({
      where: { id: parseInt(id) },
      data: {
        status,
        driverId: valetId ? parseInt(valetId) : undefined,
        driverName: valetName,
        parkingSpot
      }
    });
    
    res.json(session);
  } catch (err) {
    console.error('Update session error:', err);
    res.status(500).json({ error: err.message });
  }
};

export const completeSession = async (req, res) => {
  const { id } = req.params;
  const { amount, paymentMethod } = req.body;

  try {
    const session = await prisma.parkingSession.update({
      where: { id: parseInt(id) },
      data: {
        status: 'completed',
        exitTime: new Date(),
        amount: amount || 0,
        paymentMethod: paymentMethod || 'UPI',
        paymentStatus: 'paid'
      }
    });
    
    res.json({ success: true, session });
  } catch (err) {
    console.error('Complete session error:', err);
    res.status(500).json({ error: err.message });
  }
};
