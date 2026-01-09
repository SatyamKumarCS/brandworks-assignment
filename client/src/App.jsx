import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import MobileFrame from './components/MobileFrame';
import RoleSwitcher from './components/RoleSwitcher';

// User Pages
import UserHome from './pages/user/UserHome';
import QRScanner from './pages/user/QRScanner';
import RegisterVehicle from './pages/user/RegisterVehicle';
import ParkingTicket from './pages/user/ParkingTicket';
import Ticket from './pages/user/Ticket';
import History from './pages/user/History';
import Settings from './pages/user/Settings';
import ManageVehicles from './pages/user/ManageVehicles';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';

// Driver Pages
import DriverConsole from './pages/driver/DriverConsole';

// Admin Pages
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';

const App = () => {
  const [currentRole, setCurrentRole] = useState('user');

  const renderRoleContent = () => {
    switch (currentRole) {
      case 'user':
        return (
          <Routes>
            <Route path="/" element={<UserHome />} />
            <Route path="/scan" element={<QRScanner />} />
            <Route path="/register-vehicle" element={<RegisterVehicle />} />
            <Route path="/parking-ticket" element={<ParkingTicket />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/manage-vehicles" element={<ManageVehicles />} />
          </Routes>
        );
      case 'manager':
        return <ManagerDashboard />;
      case 'driver':
        return <DriverConsole />;
      case 'superadmin':
        return <SuperAdminDashboard />;
      default:
        return <UserHome />;
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-200 flex flex-col items-center justify-center py-4 gap-4">
        <MobileFrame>
          {renderRoleContent()}
        </MobileFrame>
        
        <RoleSwitcher currentRole={currentRole} onRoleChange={setCurrentRole} />
      </div>
    </Router>
  );
};

export default App;
