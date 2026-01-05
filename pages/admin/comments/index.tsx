// pages/admin/comments/index.ts
import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';

interface CommentAdminView {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
  debate: {
    title: string;
    slug: string;
  } | null;
}

export default function AdminComments() {
  const [comments, setComments] = useState<CommentAdminView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      // We'll use a special endpoint or just fetch all for now.
      // NOTE: For a real app, you might want pagination.
      // For now, let's just reuse the main GET but we need to ensure the API
      // supports fetching ALL comments if no debateId is provided.
      // *See Step 3 below for the API tweak*
      const res = await fetch('/api/comments/all'); 
      if (res.ok) {
        setComments(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setComments(prev => prev.filter(c => c.id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch {
      alert('Error deleting comment');
    }
  };

  return (
    <AdminLayout title="Manage Comments">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Author</th>
                <th className="px-6 py-3">Comment</th>
                <th className="px-6 py-3">Article</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">Loading comments...</td>
                </tr>
              ) : comments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No comments found.</td>
                </tr>
              ) : (
                comments.map((comment) => (
                  <tr key={comment.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                      {comment.authorName}
                      {comment.likes > 0 && (
                        <span className="ml-2 text-xs font-normal text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">
                          ♥ {comment.likes}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={comment.content}>
                      {comment.content}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {comment.debate ? (
                        <a href={`/en/articles/${comment.debate.slug}`} target="_blank" className="hover:text-blue-600 hover:underline">
                          {comment.debate.title.slice(0, 30)}...
                        </a>
                      ) : (
                        <span className="italic text-slate-400">Deleted Article</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="font-medium text-red-600 hover:text-red-900 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}