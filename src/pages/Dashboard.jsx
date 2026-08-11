import { useAuth } from '../contexts/AuthContext.jsx';
import CrewManager from '../components/CrewManager.jsx';
import ProjectManager from '../components/ProjectManager.jsx';
import CheckinManager from '../components/CheckinManager.jsx';
import ProvisionManager from '../components/ProvisionManager.jsx';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Logged in as: {user?.email} {isAdmin && '(Admin)'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline"
          >
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CrewManager />
          <div className="space-y-6">
            <ProjectManager />
            <CheckinManager />
          </div>
        </div>

        {isAdmin && (
          <div className="mt-8">
            <ProvisionManager />
          </div>
        )}
      </div>
    </div>
  );
}