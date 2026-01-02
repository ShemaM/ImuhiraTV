import AdminLayout from '../../components/admin/AdminLayout';
import Link from 'next/link';
import { 
  DocumentTextIcon, 
  PlusCircleIcon,
  ChartBarIcon,
  UsersIcon 
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to the Admin Portal</h2>
          <p className="text-gray-600">
            Manage debate posts derived from YouTube interviews. Create balanced discussions 
            featuring both Idubu (pro-Twirwaneho) and Akagara (pro-government) perspectives.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            href="/admin/debates/new" 
            className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-6 transition-colors flex flex-col items-center text-center"
          >
            <PlusCircleIcon className="h-12 w-12 mb-3" />
            <span className="font-bold text-lg">Create New Debate</span>
            <span className="text-red-200 text-sm mt-1">Add a new debate post</span>
          </Link>

          <Link 
            href="/admin/debates" 
            className="bg-white hover:bg-gray-50 text-gray-800 rounded-lg p-6 shadow-sm transition-colors flex flex-col items-center text-center border border-gray-200"
          >
            <DocumentTextIcon className="h-12 w-12 mb-3 text-slate-600" />
            <span className="font-bold text-lg">Manage Debates</span>
            <span className="text-gray-500 text-sm mt-1">View and edit debates</span>
          </Link>

          <div className="bg-white text-gray-800 rounded-lg p-6 shadow-sm flex flex-col items-center text-center border border-gray-200 opacity-50">
            <ChartBarIcon className="h-12 w-12 mb-3 text-slate-400" />
            <span className="font-bold text-lg">Analytics</span>
            <span className="text-gray-400 text-sm mt-1">Coming soon</span>
          </div>

          <div className="bg-white text-gray-800 rounded-lg p-6 shadow-sm flex flex-col items-center text-center border border-gray-200 opacity-50">
            <UsersIcon className="h-12 w-12 mb-3 text-slate-400" />
            <span className="font-bold text-lg">Subscribers</span>
            <span className="text-gray-400 text-sm mt-1">Coming soon</span>
          </div>
        </div>

        {/* About Our Stance */}
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-3">📌 Editorial Reminder</h3>
          <p className="text-slate-600 leading-relaxed">
            <strong>Imuhira is a neutral platform.</strong> When creating debate posts, ensure both the 
            Idubu perspective (supporting Twirwaneho) and the Akagara perspective (pro-government/FARDC) 
            are fairly represented. The verdict should be balanced and not favor either side.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
