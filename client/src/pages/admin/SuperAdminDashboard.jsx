import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, TrendingUp, Ticket, DollarSign, ChevronDown, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { statsApi, locationsApi } from '../../services/api';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [showSiteDropdown, setShowSiteDropdown] = useState(false);
  const [superAdminStats, setSuperAdminStats] = useState({
    ticketsIssuedToday: 0,
    collectionToday: 0,
    totalTickets: 0,
    totalCollection: 0,
    activeParking: 0
  });
  const [loading, setLoading] = useState(true);

  const [pendingApprovals, setPendingApprovals] = useState([
    { id: '1', type: 'New Manager', name: 'Vikram Mehta', site: 'Central Plaza - Andheri', date: '4 Jan 2026' },
    { id: '2', type: 'New Site', name: 'R City Mall - Ghatkopar', site: 'Ghatkopar West', date: '3 Jan 2026' },
    { id: '3', type: 'Driver Request', name: 'Amit Patel', site: 'Phoenix Mall - Lower Parel', date: '2 Jan 2026' },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, sitesData] = await Promise.all([
        statsApi.getAdminStats(),
        locationsApi.getAll()
      ]);
      
      setSuperAdminStats(statsData);
      
      const sitesFormatted = sitesData.map(loc => ({
        id: loc.id,
        name: loc.name,
        address: loc.address || '',
        city: loc.city || 'Mumbai'
      }));
      setSites(sitesFormatted);
      if (sitesFormatted.length > 0) {
        setSelectedSite(sitesFormatted[0]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id, name) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
    alert(`✅ Approved: ${name}`);
  };

  const handleReject = (id, name) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
    alert(`❌ Rejected: ${name}`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white pt-8 pb-4 px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-1 -ml-1">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-base font-semibold">Super Admin</h1>
            <p className="text-purple-200 text-xs">System overview and approvals</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'bg-white text-purple-600'
                : 'bg-purple-500/30 text-white hover:bg-purple-500/40'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'approvals'
                ? 'bg-white text-purple-600'
                : 'bg-purple-500/30 text-white hover:bg-purple-500/40'
            }`}
          >
            Approvals
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : activeTab === 'overview' ? (
          <>
            {/* Site Selector */}
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Select Site</p>
              <div className="relative">
                <button
                  onClick={() => setShowSiteDropdown(!showSiteDropdown)}
                  className="w-full flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="font-medium text-sm">{selectedSite?.name || 'Select a site'}</span>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${showSiteDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showSiteDropdown && sites.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
                    {sites.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => {
                          setSelectedSite(site);
                          setShowSiteDropdown(false);
                        }}
                        className={`w-full flex items-center gap-2 p-3 hover:bg-gray-50 text-sm ${
                          selectedSite?.id === site.id ? 'bg-purple-50' : ''
                        }`}
                      >
                        <MapPin size={14} className="text-gray-400" />
                        <span className={selectedSite?.id === site.id ? 'text-purple-600 font-medium' : ''}>{site.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Today's Performance */}
            <div className="mb-3">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Calendar size={14} />
                <h3 className="font-semibold text-sm">Today's Performance</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-indigo-500">
                  <p className="text-gray-500 text-xs">Tickets Issued</p>
                  <p className="text-xl font-bold text-indigo-600">{superAdminStats.ticketsIssuedToday}</p>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm border-l-4 border-green-500">
                  <p className="text-gray-500 text-xs">Collection</p>
                  <p className="text-xl font-bold text-green-600">₹{superAdminStats.collectionToday.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Overall Statistics */}
            <div className="mb-3">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <TrendingUp size={14} />
                <h3 className="font-semibold text-sm">Overall Statistics</h3>
              </div>
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Ticket className="text-indigo-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs">Total Tickets</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{superAdminStats.totalTickets.toLocaleString()}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-green-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs">Total Collection</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">₹{superAdminStats.totalCollection.toLocaleString()}</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="text-purple-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-xs">Active Parking</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{superAdminStats.activeParking}</p>
                </div>
              </div>
            </div>

            {/* Current Site Card */}
            {selectedSite && (
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-4 text-white">
              <h3 className="font-bold text-sm">{selectedSite.name}</h3>
              <p className="text-purple-200 text-xs">{selectedSite.address}, {selectedSite.city}</p>
            </div>
            )}
          </>
        ) : (
          <>
            {/* Pending Approvals */}
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Pending Approvals ({pendingApprovals.length})</h3>
            <div className="space-y-2">
              {pendingApprovals.map((approval) => (
                <div key={approval.id} className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-600 rounded text-[10px] font-medium mb-1">
                        {approval.type}
                      </span>
                      <h4 className="font-semibold text-gray-900 text-sm">{approval.name}</h4>
                      <p className="text-xs text-gray-500">{approval.site}</p>
                    </div>
                    <p className="text-[10px] text-gray-400">{approval.date}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApprove(approval.id, approval.name)}
                      className="flex-1 py-1.5 bg-green-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-1 hover:bg-green-600 transition-colors"
                    >
                      <Check size={14} />
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReject(approval.id, approval.name)}
                      className="flex-1 py-1.5 bg-red-500 text-white rounded-lg font-medium text-xs flex items-center justify-center gap-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {pendingApprovals.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="text-gray-400" size={24} />
                </div>
                <p className="text-gray-500 text-sm">No pending approvals</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
