const prisma = require('../config/prisma');

const mockDrivers = [
  { id: 1, name: 'Rahul Kumar', email: 'rahul@valet.com', phone: '+91 9876543210', status: 'available', license: 'DL-MH-04-2022-12345', joined: '2025-01-10', site: 'Phoenix Mall - Lower Parel' },
  { id: 2, name: 'Amit Singh', email: 'amit@valet.com', phone: '+91 9876543211', status: 'busy', license: 'DL-MH-02-2023-67890', joined: '2025-02-15', site: 'City Center Mall' }
];

let mockPendingDrivers = [
  { 
    id: 101, 
    name: 'Test Driver', 
    phone: '+91 9876543212', 
    license: 'DL-MH-01-2024-00001', 
    submittedBy: 'Manager', 
    submittedOn: '2026-01-09',
    status: 'pending',
    site: 'Phoenix Mall - Lower Parel'
  }
];

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    if (drivers.length > 0) {
      const mapped = drivers.map(d => ({
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        status: d.status,
        license: d.licenseNumber,
        joined: d.joinedDate,
        site: d.siteId
      }));
      return res.json(mapped);
    }
    res.json(mockDrivers);
  } catch (err) {
    console.error('Fetch drivers error:', err);
    res.json(mockDrivers);
  }
};

const getPendingDrivers = async (req, res) => {
  try {
    const pending = await prisma.pendingDriverRequest.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' }
    });
    
    if (pending.length > 0) {
      return res.json(pending);
    }
    res.json(mockPendingDrivers);
  } catch (err) {
    console.error('Fetch pending drivers error:', err);
    res.json(mockPendingDrivers);
  }
};

const createDriverRequest = async (req, res) => {
  const { name, phone, license, site, details } = req.body;
  
  try {
    const request = await prisma.pendingDriverRequest.create({
      data: {
        name,
        phone,
        license,
        site: site || 'Phoenix Mall - Lower Parel',
        submittedBy: 'Manager',
        status: 'pending',
        details: details || {}
      }
    });
    
    res.json(request);
  } catch (err) {
    console.error('Create driver request error:', err);
    res.status(500).json({ error: err.message });
  }
};

const approveDriver = async (req, res) => {
  const { id } = req.params;
  
  try {
    const request = await prisma.pendingDriverRequest.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    await prisma.driver.create({
      data: {
        name: request.name,
        phone: request.phone,
        licenseNumber: request.license,
        status: 'available'
      }
    });
    
    await prisma.pendingDriverRequest.update({
      where: { id: parseInt(id) },
      data: { status: 'approved' }
    });
    
    res.json({ success: true, message: 'Driver approved' });
  } catch (err) {
    console.error('Approve driver error:', err);
    res.status(500).json({ error: err.message });
  }
};

const rejectDriver = async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.pendingDriverRequest.update({
      where: { id: parseInt(id) },
      data: { status: 'rejected' }
    });
    
    res.json({ success: true, message: 'Driver rejected' });
  } catch (err) {
    console.error('Reject driver error:', err);
    res.status(500).json({ error: err.message });
  }
};

const createDriver = async (req, res) => {
  const { name, phone, email } = req.body;
  
  try {
    const licenseNumber = `DL-MH-${new Date().getFullYear()}-${Date.now().toString().slice(-5)}`;
    const driverEmail = email || `${name.toLowerCase().replace(/\s/g, '')}@valet.com`;
    
    const driver = await prisma.driver.create({
      data: {
        name,
        email: driverEmail,
        phone,
        licenseNumber,
        status: 'available'
      }
    });
    
    res.json({
      id: driver.id,
      name: driver.name,
      email: driver.email,
      phone: driver.phone,
      status: driver.status,
      license: driver.licenseNumber,
      joined: driver.joinedDate
    });
  } catch (err) {
    console.error('Create driver error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllDrivers,
  getPendingDrivers,
  createDriverRequest,
  approveDriver,
  rejectDriver,
  createDriver
};
