import AdminLayout from '../../components/admin/AdminLayout';
import Link from 'next/link';
import useSWR from 'swr';
import { 
  DocumentTextIcon, 
  PlusCircleIcon,
  ChatBubbleLeftRightIcon,
  ScaleIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface Stats {
  totalDebates: number;
  totalArticles: number;
  totalComments: number;
  publishedDebates: number;
  publishedArticles: number;
  pendingComments: number;
  recentDebates: Array<{
    id: string;
    title: string;
    slug: string | null;
    isPublished: boolean | null;
    createdAt: string | null;
  }>;
  recentArticles: Array<{
    id: string;
    title: string;
    slug: string;
    isPublished: boolean | null;
    createdAt: string | null;
  }>;
  recentComments: Array<{
    id: string;
    authorName: string;
    content: string;
    isApproved: boolean | null;
    createdAt: string | null;
  }>;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminDashboard() {
  const { data: stats, error, isLoading } = useSWR<Stats>('/api/admin/stats', fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

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

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
            Failed to load statistics. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Debates Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <ScaleIcon className="h-6 w-6 text-red-600" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stats?.publishedDebates || 0} published
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalDebates || 0}</div>
              <div className="text-sm text-gray-500">Total Debates</div>
            </div>

            {/* Articles Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stats?.publishedArticles || 0} published
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalArticles || 0}</div>
              <div className="text-sm text-gray-500">Total Articles</div>
            </div>

            {/* Comments Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600" />
                </div>
                {(stats?.pendingComments || 0) > 0 && (
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    {stats?.pendingComments} pending
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stats?.totalComments || 0}</div>
              <div className="text-sm text-gray-500">Total Comments</div>
            </div>

            {/* Quick Create Card */}
            <Link 
              href="/admin/debates/new" 
              className="bg-red-600 hover:bg-red-700 text-white rounded-lg p-6 transition-colors flex flex-col items-center justify-center text-center shadow-sm"
            >
              <PlusCircleIcon className="h-12 w-12 mb-3" />
              <span className="font-bold text-lg">Create New</span>
              <span className="text-red-200 text-sm mt-1">Add a new debate</span>
            </Link>
          </div>
        )}

        {/* Recent Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Debates */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <ScaleIcon className="h-5 w-5 text-red-600" />
                Recent Debates
              </h3>
              <Link href="/admin/debates" className="text-sm text-red-600 hover:text-red-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {isLoading ? (
                <div className="p-4 text-gray-500 text-sm">Loading...</div>
              ) : stats?.recentDebates && stats.recentDebates.length > 0 ? (
                stats.recentDebates.map((debate) => (
                  <div key={debate.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{debate.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3" />
                          {formatDate(debate.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {debate.isPublished ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircleIcon className="h-3 w-3" />
                            Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            <ExclamationCircleIcon className="h-3 w-3" />
                            Draft
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500 text-sm text-center">No debates yet</div>
              )}
            </div>
          </div>

          {/* Recent Comments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-600" />
                Recent Comments
              </h3>
              <Link href="/admin/comments" className="text-sm text-red-600 hover:text-red-700 font-medium">
                View All →
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {isLoading ? (
                <div className="p-4 text-gray-500 text-sm">Loading...</div>
              ) : stats?.recentComments && stats.recentComments.length > 0 ? (
                stats.recentComments.map((comment) => (
                  <div key={comment.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{comment.authorName}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {comment.content}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3" />
                          {formatDate(comment.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {comment.isApproved ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                            <CheckCircleIcon className="h-3 w-3" />
                            Approved
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                            <ExclamationCircleIcon className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500 text-sm text-center">No comments yet</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <DocumentTextIcon className="h-5 w-5 text-blue-600" />
              Recent Articles
            </h3>
            <Link href="/admin/posts" className="text-sm text-red-600 hover:text-red-700 font-medium">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-4 text-gray-500 text-sm">Loading...</div>
            ) : stats?.recentArticles && stats.recentArticles.length > 0 ? (
              stats.recentArticles.map((article) => (
                <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{article.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3" />
                        {formatDate(article.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {article.isPublished ? (
                        <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <CheckCircleIcon className="h-3 w-3" />
                          Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                          <ExclamationCircleIcon className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-gray-500 text-sm text-center">No articles yet</div>
            )}
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
