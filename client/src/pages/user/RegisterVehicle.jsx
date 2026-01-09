import { useState } from 'react';
import { ArrowLeft, Car } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterVehicle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vehicleName: '',
    plateNumber: '',
    vehicleType: 'car',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In real app, this would save to backend
    alert('Vehicle registered successfully!');
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="bg-indigo-600 text-white pt-8 pb-4 px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-base font-semibold">Register Vehicle</h1>
        </div>
        <p className="text-indigo-200 text-xs mt-0.5 ml-8">Add a new vehicle to your account</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Vehicle Name
          </label>
          <input
            type="text"
            placeholder="e.g., My Honda City"
            value={formData.vehicleName}
            onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Registration Number
          </label>
          <input
            type="text"
            placeholder="e.g., MH 12 AB 1234"
            value={formData.plateNumber}
            onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Vehicle Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['car', 'bike', 'suv'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, vehicleType: type })}
                className={`py-2 px-3 rounded-lg border-2 capitalize text-sm font-medium transition-colors ${
                  formData.vehicleType === type
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {formData.vehicleName && formData.plateNumber && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1.5">Preview</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Car className="text-indigo-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{formData.vehicleName}</h3>
                <p className="text-xs text-gray-500">{formData.plateNumber}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          Register Vehicle
        </button>
      </form>
    </div>
  );
};

export default RegisterVehicle;
