import { useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { extractAndValidateYouTubeVideoId } from '../../lib/url-validation';

// --- Types ---
interface ArticleData {
  title: string;
  slug: string;
  videoUrl: string; // <--- Added this
  excerpt: string;
  content: string;
  coverImage: string;
  isPublished: boolean;
}

// --- Sub-Component: Toolbar for Rich Text ---
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const buttonClass = (isActive: boolean) =>
    `p-2 rounded text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-slate-900 text-white' 
        : 'text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className="flex flex-wrap gap-1 border-b border-slate-200 p-2 mb-2 bg-slate-50 rounded-t-lg">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(editor.isActive('heading', { level: 2 }))}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive('bulletList'))}>List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClass(editor.isActive('blockquote'))}>Quote</button>
    </div>
  );
};

// --- Main Component: Article Form ---
export default function ArticleForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ArticleData>({
    title: '',
    slug: '',
    videoUrl: '', // <--- Initialize this
    excerpt: '',
    content: '',
    coverImage: '',
    isPublished: true, // Default to published or draft as you prefer
  });

  // Initialize Tiptap Editor
  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[300px] px-4 py-2',
      },
    },
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({ ...prev, content: editor.getHTML() }));
    },
    immediatelyRender: false,
  });

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    setFormData((prev) => ({ ...prev, title, slug }));
  };

  // Auto-populate cover image from YouTube thumbnail when video URL changes
  const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const videoUrl = e.target.value;
    const videoId = extractAndValidateYouTubeVideoId(videoUrl);
    
    if (videoId) {
      // Set the cover image to the YouTube video thumbnail (validated)
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      setFormData((prev) => ({ ...prev, videoUrl, coverImage: thumbnailUrl }));
    } else {
      setFormData((prev) => ({ ...prev, videoUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    setLoading(true);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        alert('Article created successfully!');
        router.push('/admin/posts'); // Redirect back to list
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">New Article</h1>
        <div className="flex gap-3">
           <button 
             type="button"
             onClick={() => router.back()}
             className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
           >
             Cancel
           </button>
           <button 
             onClick={handleSubmit}
             disabled={loading}
             className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
           >
             {loading ? 'Publishing...' : 'Publish'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-1">
             <input
               type="text"
               placeholder="Article Title"
               value={formData.title}
               onChange={handleTitleChange}
               className="w-full text-4xl font-black text-slate-900 placeholder:text-slate-300 border-none outline-none bg-transparent"
             />
             <div className="flex items-center gap-2 text-sm text-slate-400">
               <span>slug:</span>
               <input 
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="bg-transparent border-b border-dashed border-slate-300 focus:border-indigo-500 outline-none text-slate-600 w-full"
                  aria-label="Article slug"
               />
             </div>
          </div>

          <div className="border border-slate-200 rounded-lg shadow-sm bg-white min-h-100">
             <MenuBar editor={editor} />
             <EditorContent editor={editor} />
          </div>
        </div>

        {/* Right Column: Meta Data (Sidebar) */}
        <div className="space-y-6">
          
          {/* --- NEW: Video Integration --- */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
               <span className="text-red-600">▶</span> YouTube Video
            </h3>
            <input 
               type="text" 
               placeholder="https://youtu.be/..."
               className="w-full text-sm border border-slate-300 rounded px-3 py-2 outline-none focus:border-indigo-500"
               value={formData.videoUrl}
               onChange={handleVideoUrlChange}
            />
            <p className="text-xs text-slate-400 mt-2">
              Paste the full YouTube URL to feature it at the top of the post.
            </p>
          </div>

          {/* Featured Image */}
          {/* Featured Image Preview */}
<div className="aspect-video bg-slate-100 rounded border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 overflow-hidden relative">
   {formData.coverImage && formData.coverImage.startsWith('http') ? (
     <Image 
        src={formData.coverImage} 
        alt="Cover Preview" 
        className="w-full h-full object-cover" 
        width={400} 
        height={225}
        unoptimized // Use this if you haven't configured img.youtube.com in next.config.js
     />
   ) : (
     <>
       <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
       </svg>
       <span className="text-xs">Preview will appear here</span>
     </>
   )}
</div>

          {/* Excerpt */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
               <h3 className="font-bold text-sm text-slate-900">Excerpt</h3>
               <span className="text-xs text-slate-400">{formData.excerpt.length}/160</span>
            </div>
            <textarea
              rows={4}
              value={formData.excerpt}
              onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
              className="w-full text-sm border border-slate-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 outline-none resize-none text-slate-600"
              placeholder="A short summary..."
            />
          </div>

        </div>
      </div>
    </div>
  );
}