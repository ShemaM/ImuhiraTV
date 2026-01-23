import { useState, useEffect, useCallback } from 'react';

// --- Interfaces ---
interface Comment {
  id: string;
  parentId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
}

interface Props {
  debateId?: string | number;
  articleId?: string | number;
  showVerdict?: boolean; // Optional prop to show/hide verdict section
}

// 1. Define Props for the Form so we can pass state down
interface CommentFormProps {
  authorName: string;
  setAuthorName: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  handlePost: (e: React.FormEvent) => void;
  loading: boolean;
  isReply?: boolean;
  onCancelReply?: () => void;
}

// 2. Define Props for the Item
interface CommentItemProps {
  comment: Comment;
  allComments: Comment[]; // Needed to find replies
  handleLike: (id: string) => void;
  replyingTo: string | null;
  setReplyingTo: (id: string | null) => void;
  // Pass through form props
  formProps: CommentFormProps;
  isReply?: boolean;
}

// --- Sub-Component: The Input Form (MOVED OUTSIDE) ---
const CommentForm = ({ 
  authorName, 
  setAuthorName, 
  content, 
  setContent, 
  handlePost, 
  loading, 
  isReply = false, 
  onCancelReply 
}: CommentFormProps) => (
  <form onSubmit={handlePost} className={`bg-slate-50 p-4 rounded-lg border border-slate-200 shadow-sm ${isReply ? 'ml-14' : ''}`}>
    {!isReply && <h3 className="text-sm font-bold text-slate-900 mb-3">Leave a comment</h3>}
    
    <div className="space-y-3">
      <input 
        type="text" 
        required
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:border-red-600 outline-none bg-white placeholder:text-slate-400"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="Name"
      />
      <textarea 
        required
        rows={isReply ? 2 : 3}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-sm focus:border-red-600 outline-none bg-white resize-none placeholder:text-slate-400"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={isReply ? "Write a reply..." : "Share your perspective..."}
      />
    </div>
    
    <div className="flex items-center justify-end gap-3 mt-3">
      {isReply && (
        <button 
          type="button" 
          onClick={onCancelReply}
          className="text-xs font-bold text-slate-500 hover:text-slate-800"
        >
          Cancel
        </button>
       )}
       <button 
         type="submit"
         disabled={loading}
         className="bg-red-700 text-white px-5 py-2 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-slate-900 transition-colors disabled:opacity-50"
       >
         {loading ? 'Posting...' : isReply ? 'Reply' : 'Post Comment'}
       </button>
    </div>
  </form>
);

// --- Sub-Component: Individual Comment Item (MOVED OUTSIDE) ---
const CommentItem = ({ 
  comment, 
  allComments, 
  handleLike, 
  replyingTo, 
  setReplyingTo, 
  formProps, 
  isReply = false 
}: CommentItemProps) => {
  // Helper filter inside the item now
  const replies = allComments.filter(c => c.parentId === comment.id);
  const initials = comment.authorName.slice(0, 2).toUpperCase();

  return (
    <div className={`group ${isReply ? 'ml-12 mt-4' : 'mt-8'}`}>
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-300">
          {initials}
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-baseline justify-between">
            <h4 className="font-bold text-slate-900 text-sm">{comment.authorName}</h4>
            <span className="text-xs text-slate-400">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Content */}
          <p className="text-slate-700 mt-1 text-sm leading-relaxed">{comment.content}</p>

          {/* Actions: Like & Reply */}
          <div className="flex items-center gap-6 mt-3 select-none">
            <button 
              onClick={() => handleLike(comment.id)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-red-600 transition-colors group/like"
            >
              <svg className="w-4 h-4 transition-transform group-active/like:scale-125" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {comment.likes || 0}
            </button>

            <button 
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors"
            >
              Reply
            </button>
          </div>

          {/* Reply Form (Conditionally Rendered) */}
          {replyingTo === comment.id && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-2">
              <CommentForm 
                {...formProps} 
                isReply={true} 
                onCancelReply={() => setReplyingTo(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Recursive Replies */}
      {replies.length > 0 && (
        <div className="border-l-2 border-slate-100 pl-0">
           {replies.map(reply => (
             <CommentItem 
               key={reply.id} 
               comment={reply} 
               allComments={allComments}
               handleLike={handleLike}
               replyingTo={replyingTo}
               setReplyingTo={setReplyingTo}
               formProps={formProps}
               isReply={true} 
             />
           ))}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export default function CommentSection({ debateId, articleId, showVerdict = true }: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  
  // Form State
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const targetId = articleId ?? debateId;
      const targetKey = articleId ? 'articleId' : 'debateId';
      if (!targetId) return;

      const res = await fetch(`/api/comments?${targetKey}=${targetId}`);
      if (res.ok) setComments(await res.json());
    } catch (err) {
      console.error(err);
    }
  }, [articleId, debateId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !authorName.trim()) return;

    setLoading(true);
    try {
      const targetId = articleId ?? debateId;
      if (!targetId) return;

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          debateId: debateId ?? null,
          articleId: articleId ?? null,
          parentId: replyingTo, 
          authorName, 
          content 
        }),
      });

      if (res.ok) {
        setContent(''); 
        setReplyingTo(null); 
        fetchComments(); 
      }
    } catch {
      alert('Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, likes: (c.likes || 0) + 1 } : c
    ));
    await fetch(`/api/comments/${commentId}`, { method: 'PATCH' });
  };

  const rootComments = comments.filter(c => !c.parentId);

  // Bundle the form props to pass them down easily
  const commonFormProps: CommentFormProps = {
    authorName,
    setAuthorName,
    content,
    setContent,
    handlePost,
    loading,
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 pb-24">
      
      {showVerdict && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center shadow-sm mb-12">
          <h2 className="text-xl font-black font-serif text-slate-900 mb-2 flex items-center justify-center gap-2">
            <span>⚖️</span> What is your verdict?
          </h2>
          <p className="text-slate-600 text-sm">
            We&apos;ve presented the arguments. Now the floor is yours.
          </p>
        </div>
      )}

      {/* Main Input Form */}
      <div className="mb-12">
         <CommentForm {...commonFormProps} />
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 pb-4 mb-6">
          {comments.length} Comments
        </h3>
        
        {rootComments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <p className="text-slate-400 italic text-sm">No comments yet. Be the first to weigh in.</p>
          </div>
        ) : (
          rootComments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment}
              allComments={comments}
              handleLike={handleLike}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              formProps={commonFormProps}
            />
          ))
        )}
      </div>
    </div>
  );
}
