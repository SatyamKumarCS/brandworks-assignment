import { useState, useEffect } from 'react';
import { Car, FileText, HelpCircle, ChevronRight, ArrowLeft, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { vehiclesApi } from '../../services/api';
import BottomNav from '../../components/BottomNav';

const Settings = () => {
  const navigate = useNavigate();
  const [vehicleCount, setVehicleCount] = useState(2);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const vehicles = await vehiclesApi.getUserVehicles();
      if (vehicles && vehicles.length > 0) {
        setVehicleCount(vehicles.length);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const settingsItems = [
    { icon: Car, label: 'Manage Vehicles', subtitle: `${vehicleCount} vehicles saved`, path: '/manage-vehicles' },
    { icon: FileText, label: 'Transaction History', subtitle: 'View all payments', path: '/history' },
    { icon: HelpCircle, label: 'Help & Support', subtitle: 'Get assistance', path: null },
    { icon: HelpCircle, label: 'FAQ', subtitle: 'Frequently Asked Questions', path: null },
  ];

  const handleItemClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Header */}
      <div className="bg-indigo-600 text-white pt-4 pb-6 px-4 flex-shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate('/')} className="p-1 -ml-1">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Settings</h1>
        </div>
        <p className="text-indigo-200 text-sm ml-8">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="px-4 -mt-2 flex-shrink-0">
        <div className="bg-indigo-50 rounded-xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-semibold">J</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base">John Doe</h3>
            <p className="text-sm text-gray-500">+91 98765 43210</p>
          </div>
          <Pencil className="text-indigo-500" size={20} />
        </div>
      </div>

      {/* Settings Items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {settingsItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="w-full flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Icon className="text-gray-600" size={20} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-semibold text-gray-900 text-sm">{item.label}</p>
                <p className="text-xs text-gray-500">{item.subtitle}</p>
              </div>
              <ChevronRight className="text-gray-400" size={20} />
            </button>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Settings;
