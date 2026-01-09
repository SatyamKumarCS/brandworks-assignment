import { useState, useEffect } from 'react';
import { ArrowLeft, Car, Pencil, Trash2, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vehiclesApi } from '../../services/api';
import BottomNav from '../../components/BottomNav';

const sampleVehicles = [
  { id: '1', name: 'Toyota Camry', plateNumber: 'MH 12 AB 1234', type: 'car', userId: 'user1', ownerName: 'John Doe' },
  { id: '2', name: 'Honda Civic', plateNumber: 'MH 14 CD 5678', type: 'car', userId: 'user1', ownerName: 'John Doe' },
];

const ManageVehicles = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState(sampleVehicles);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    plateNumber: '',
    type: 'car',
    ownerName: 'John Doe'
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehiclesApi.getUserVehicles();
      if (data && data.length > 0) {
        const vehiclesWithOwner = data.map(v => ({
          ...v,
          ownerName: v.ownerName || 'John Doe'
        }));
        setVehicles(vehiclesWithOwner);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({ name: '', plateNumber: '', type: 'car', ownerName: 'John Doe' });
    setShowModal(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      plateNumber: vehicle.plateNumber,
      type: vehicle.type || 'car',
      ownerName: vehicle.ownerName || 'John Doe'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVehicle(null);
    setFormData({ name: '', plateNumber: '', type: 'car', ownerName: 'John Doe' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.plateNumber) {
      alert('Please fill all required fields');
      return;
    }

    try {
      if (editingVehicle) {
        const updated = await vehiclesApi.update(editingVehicle.id, formData);
        setVehicles(prev => prev.map(v => 
          v.id === editingVehicle.id ? { ...v, ...formData } : v
        ));
        alert('Vehicle updated successfully!');
      } else {
        const newVehicle = await vehiclesApi.create({
          ...formData,
          userId: 'user1'
        });
        setVehicles(prev => [...prev, { ...newVehicle, ownerName: formData.ownerName }]);
        alert('Vehicle added successfully!');
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save vehicle:', error);
      if (editingVehicle) {
        setVehicles(prev => prev.map(v => 
          v.id === editingVehicle.id ? { ...v, ...formData } : v
        ));
      } else {
        const newVehicle = {
          id: Date.now().toString(),
          ...formData,
          userId: 'user1'
        };
        setVehicles(prev => [...prev, newVehicle]);
      }
      closeModal();
    }
  };

  const handleRemove = async (vehicle) => {
    if (!confirm(`Are you sure you want to remove ${vehicle.name}?`)) {
      return;
    }

    try {
      await vehiclesApi.delete(vehicle.id);
      setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
      alert('Vehicle removed successfully!');
    } catch (error) {
      console.error('Failed to remove vehicle:', error);
      setVehicles(prev => prev.filter(v => v.id !== vehicle.id));
    }
  };

  return (
    <div className="relative flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white pt-8 pb-4 px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/settings')} className="p-1 -ml-1">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-semibold">Manage Vehicles</h1>
            <p className="text-indigo-200 text-xs">{vehicles.length} vehicles registered</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-8">
            <Car className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500 text-sm">No vehicles registered</p>
            <p className="text-gray-400 text-xs mt-1">Add your first vehicle to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Car className="text-indigo-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                    <p className="text-sm text-gray-600">{vehicle.plateNumber}</p>
                    <p className="text-xs text-gray-400">{vehicle.ownerName}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => openEditModal(vehicle)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemove(vehicle)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-50 text-red-500 rounded-lg font-medium text-sm hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Vehicle Button */}
        <button
          onClick={openAddModal}
          className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add New Vehicle
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold">
                {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
              </h2>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Vehicle Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Toyota Camry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Plate Number *
                </label>
                <input
                  type="text"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                  placeholder="e.g., MH 12 AB 1234"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                >
                  <option value="car">Car</option>
                  <option value="suv">SUV</option>
                  <option value="bike">Bike</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="e.g., John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors"
                >
                  {editingVehicle ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default ManageVehicles;
