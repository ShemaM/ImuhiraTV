import AdminLayout from '@/components/admin/AdminLayout'; // Now using the shared layout
import { 
  EyeIcon, 
  DocumentCheckIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon 
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard Overview">
      
      {/* 1. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Views" 
          value="124,592" 
          change="+12%" 
          icon={<EyeIcon className="h-6 w-6 text-blue-600" />} 
          color="bg-blue-50"
        />
        <StatsCard 
          title="Articles Published" 
          value="45" 
          change="+3" 
          icon={<DocumentCheckIcon className="h-6 w-6 text-green-600" />} 
          color="bg-green-50"
        />
        <StatsCard 
          title="Active Subscribers" 
          value="1,203" 
          change="+8%" 
          icon={<UserGroupIcon className="h-6 w-6 text-purple-600" />} 
          color="bg-purple-50"
        />
        <StatsCard 
          title="Revenue (Est)" 
          value="$3,400" 
          change="+5%" 
          icon={<CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />} 
          color="bg-yellow-50"
        />
      </div>

      {/* 2. Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Recent Articles</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">The Kivu Conflict Update</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Shema M.</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Published
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dec 9, 2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

// Helper Component for the Stats
interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

function StatsCard({ title, value, change, icon, color }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        <span className="text-xs font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded">{change}</span>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        {icon}
      </div>
    </div>
  );
}
