const prisma = require('../config/prisma');

const mockVehicles = [
  { id: 1, name: 'Toyota Camry', plateNumber: 'MH 12 AB 1234', type: 'car', userId: 1 },
  { id: 2, name: 'Honda Civic', plateNumber: 'MH 14 CD 5678', type: 'car', userId: 1 },
];

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    if (vehicles.length > 0) {
      return res.json(vehicles);
    }
    res.json(mockVehicles);
  } catch (err) {
    console.error('Fetch vehicles error:', err);
    res.json(mockVehicles);
  }
};

const getUserVehicles = async (req, res) => {
  const { userId } = req.params;
  try {
    const userIdInt = parseInt(userId) || 1;
    const vehicles = await prisma.vehicle.findMany({
      where: { userId: userIdInt },
      orderBy: { createdAt: 'desc' }
    });
    
    if (vehicles.length > 0) {
      return res.json(vehicles);
    }
    res.json(mockVehicles);
  } catch (err) {
    console.error('Fetch user vehicles error:', err);
    res.json(mockVehicles);
  }
};

const createVehicle = async (req, res) => {
  const { name, plateNumber, type, userId, ownerName } = req.body;
  
  try {
    const userIdInt = parseInt(userId) || 1;
    const vehicle = await prisma.vehicle.create({
      data: {
        name,
        plateNumber,
        type: type || 'car',
        userId: userIdInt,
        ownerName: ownerName || 'User'
      }
    });
    
    res.status(201).json(vehicle);
  } catch (err) {
    console.error('Create vehicle error:', err);
    res.status(500).json({ error: err.message });
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { name, plateNumber, type } = req.body;
  
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id: parseInt(id) },
      data: { name, plateNumber, type }
    });
    
    res.json(vehicle);
  } catch (err) {
    console.error('Update vehicle error:', err);
    res.status(500).json({ error: err.message });
  }
};

const deleteVehicle = async (req, res) => {
  const { id } = req.params;
  
  try {
    await prisma.vehicle.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ success: true });
  } catch (err) {
    console.error('Delete vehicle error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllVehicles,
  getUserVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
