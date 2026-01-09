import { User, Shield, Car, Crown } from 'lucide-react';

const RoleSwitcher = ({ currentRole, onRoleChange }) => {
  const roles = [
    { id: 'user', label: 'User', icon: User },
    { id: 'manager', label: 'Manager', icon: Shield },
    { id: 'driver', label: 'Driver', icon: Car },
    { id: 'superadmin', label: 'Super Admin', icon: Crown },
  ];

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg p-3"
      style={{ width: '350px' }}
    >
      <p className="text-center text-gray-500 text-xs mb-2">Login As</p>
      <div className="flex justify-center gap-2">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = currentRole === role.id;
          return (
            <button
              key={role.id}
              onClick={() => onRoleChange(role.id)}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span className="text-[10px] mt-1 whitespace-nowrap">{role.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSwitcher;
