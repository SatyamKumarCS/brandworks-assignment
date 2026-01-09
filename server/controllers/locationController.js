const prisma = require('../config/prisma');

const mockLocations = [
  { id: 1, name: 'Phoenix Mall', address: 'Lower Parel', city: 'Mumbai' },
  { id: 2, name: 'Central Plaza', address: 'Andheri West', city: 'Mumbai' },
  { id: 3, name: 'Inorbit Mall', address: 'Malad West', city: 'Mumbai' },
  { id: 4, name: 'City Center Mall', address: 'Bandra East', city: 'Mumbai' },
];

const getAllLocations = async (req, res) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' }
    });
    
    if (locations.length > 0) {
      return res.json(locations);
    }
    res.json(mockLocations);
  } catch (err) {
    console.error('Fetch locations error:', err);
    res.json(mockLocations);
  }
};

const getLocationById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const location = await prisma.location.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (location) {
      return res.json(location);
    }
    
    const mockLocation = mockLocations.find(l => l.id === parseInt(id));
    if (mockLocation) {
      return res.json(mockLocation);
    }
    
    res.status(404).json({ error: 'Location not found' });
  } catch (err) {
    console.error('Fetch location error:', err);
    res.status(500).json({ error: err.message });
  }
};

const createLocation = async (req, res) => {
  const { name, address, city, state, totalSlots, hourlyRate } = req.body;
  
  try {
    const location = await prisma.location.create({
      data: {
        name,
        address,
        city,
        state,
        totalSlots: totalSlots || 100,
        availableSlots: totalSlots || 100,
        hourlyRate: hourlyRate || 50.00
      }
    });
    
    res.status(201).json(location);
  } catch (err) {
    console.error('Create location error:', err);
    res.status(500).json({ error: err.message });
  }
};

const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name, address, city, state, totalSlots, availableSlots, hourlyRate, status } = req.body;
  
  try {
    const location = await prisma.location.update({
      where: { id: parseInt(id) },
      data: {
        name,
        address,
        city,
        state,
        totalSlots,
        availableSlots,
        hourlyRate,
        status
      }
    });
    
    res.json(location);
  } catch (err) {
    console.error('Update location error:', err);
    res.status(500).json({ error: err.message });
  }
};

const deleteLocation = async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.location.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ success: true });
  } catch (err) {
    console.error('Delete location error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation
};
