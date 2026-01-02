import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';

interface Debate {
  id: number;
  title: string;
  slug: string;
  topic: string;
  status: 'draft' | 'published';
  authorName: string;
  createdAt: string;
  publishedAt: string | null;
}

export default function DebatesList() {
  const [debates, setDebates] = useState<Debate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDebates();
  }, []);

  const fetchDebates = async () => {
    try {
      const response = await fetch('/api/debates');
      if (!response.ok) throw new Error('Failed to fetch debates');
      const data = await response.json();
      setDebates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this debate? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/debates/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete debate');
      
      setDebates(debates.filter(d => d.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete debate');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AdminLayout title="Manage Debates">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Create and manage debate posts from YouTube interviews
          </p>
          <Link
            href="/admin/debates/new"
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            New Debate
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading debates...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchDebates}
              className="mt-4 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        ) : debates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <p className="text-gray-500 mb-4">No debates created yet</p>
            <Link
              href="/admin/debates/new"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              Create Your First Debate
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {debates.map((debate) => (
                  <tr key={debate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{debate.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-md">{debate.topic}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        debate.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {debate.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {debate.authorName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(debate.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/en/debates/${debate.slug}`}
                        className="inline-flex items-center p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="View"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/admin/debates/${debate.id}/edit`}
                        className="inline-flex items-center p-2 text-gray-400 hover:text-green-600 transition-colors"
                        title="Edit"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(debate.id)}
                        className="inline-flex items-center p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
