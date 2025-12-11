import { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '@/components/admin/AdminLayout';
import { useArticles } from '../../context/ArticleContext';
import { 
  PhotoIcon, 
  CheckCircleIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

export default function CreatePost() {
  const router = useRouter();
  const { addArticle } = useArticles();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Conflict Monitor',
    status: 'Draft',
    content: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      addArticle({
        id: Date.now(),
        title: formData.title,
        category: formData.category,
        author: 'Admin',
        status: formData.status as 'Draft' | 'Published',
        content: formData.content,
        published_at: new Date().toLocaleDateString()
      });
      router.push('/admin/posts');
    }, 800);
  };

  return (
    <AdminLayout title="Add New Post">
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        
        {/* === LEFT COLUMN: CONTENT EDITOR === */}
        <div className="flex-1 space-y-6">
          
          {/* Title Input (Frameless & Huge) */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <input 
              name="title"
              value={formData.title} 
              onChange={handleChange} 
              required
              placeholder="Add title" 
              className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none focus:ring-0 p-0"
            />
          </div>

          {/* Visual Editor (Mock) */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
            
            {/* Mock Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2">
              <ToolbarButton label="B" bold />
              <ToolbarButton label="I" italic />
              <ToolbarButton label="❝" />
              <ToolbarButton label="Link" />
              <div className="h-6 w-px bg-gray-300 mx-2" />
              <ToolbarButton label="H1" />
              <ToolbarButton label="H2" />
              <ToolbarButton label="List" />
            </div>

            {/* Content Textarea */}
            <textarea 
              name="content" 
              value={formData.content} 
              onChange={handleChange} 
              required
              placeholder="Start writing or type / to choose a block" 
              className="flex-1 w-full p-6 text-lg text-gray-700 leading-relaxed border-none focus:ring-0 resize-none font-serif"
            />
          </div>
        </div>

        {/* === RIGHT COLUMN: SIDEBAR SETTINGS === */}
        <div className="w-full lg:w-80 space-y-6">
          
          {/* 1. PUBLISH BOX */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-sm text-gray-700">Publish</h3>
            </div>
            <div className="p-4 space-y-4">
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                   <CheckCircleIcon className="h-4 w-4 mr-2 text-gray-400" />
                   Status:
                </div>
                <span className="font-bold text-gray-900">{formData.status}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                   <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                   Schedule:
                </div>
                <span className="font-bold text-gray-900 underline decoration-dotted">Immediately</span>
              </div>

            </div>
            
            {/* Action Buttons */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <button type="button" className="text-sm text-red-600 hover:underline">
                Move to Trash
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70"
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>

          {/* 2. CATEGORIES BOX */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-sm text-gray-700">Categories</h3>
            </div>
            <div className="p-4 max-h-48 overflow-y-auto">
              {['Conflict Monitor', 'Humanitarian', 'Regional Politics', 'Community & Culture', 'Security', 'Opinion'].map((cat) => (
                <div key={cat} className="flex items-center mb-2">
                  <input 
                    id={`cat-${cat}`}
                    type="radio" 
                    name="category"
                    value={cat}
                    checked={formData.category === cat}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor={`cat-${cat}`} className="ml-2 text-sm text-gray-700">
                    {cat}
                  </label>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
               <button type="button" className="text-xs text-blue-600 hover:underline underline-offset-2">
                 + Add New Category
               </button>
            </div>
          </div>

          {/* 3. FEATURED IMAGE BOX */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
             <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-sm text-gray-700">Featured Image</h3>
            </div>
            <div className="p-4">
              <button 
                type="button"
                className="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <PhotoIcon className="h-8 w-8 mb-2 text-gray-400" />
                <span className="text-xs">Set featured image</span>
              </button>
            </div>
          </div>

        </div>
      </form>
    </AdminLayout>
  );
}

// Simple Toolbar Helper
function ToolbarButton({ label, bold, italic }: { label: string, bold?: boolean, italic?: boolean }) {
  return (
    <button 
      type="button" 
      className={`px-3 py-1 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100 hover:text-gray-900 transition-colors
        ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''}`}
    >
      {label}
    </button>
  );
}