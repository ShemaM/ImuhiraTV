import { useState } from 'react';
import dynamic from 'next/dynamic';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import 'react-quill-new/dist/quill.snow.css';

// Lazy load Quill to prevent "document is not defined" error during build
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export interface DebateFormData {
  title: string;
  slug: string;
  topic: string;
  summary: string;
  verdict:string;
  youtubeVideoId: string;
  youtubeVideoTitle: string;
  mainImageUrl: string;
  authorName: string;
  status: 'draft' | 'published';
  faction1Label: string;
  faction2Label: string;
  faction1Arguments: string[];
  faction2Arguments: string[];
}

interface DebateFormProps {
  initialData?: Partial<DebateFormData>;
  onSubmit: (data: DebateFormData) => Promise<void>;
  isSubmitting: boolean;
}

const defaultFormData: DebateFormData = {
  title: '',
  slug: '',
  topic: '',
  summary: '',
  verdict:'Pending',
  youtubeVideoId: '',
  youtubeVideoTitle: '',
  mainImageUrl: '',
  authorName: 'Imuhira Staff',
  status: 'published', // 🟢 Default to Published now
  faction1Label: 'Idubu',
  faction2Label: 'Akagara',
  faction1Arguments: [''],
  faction2Arguments: [''],
};

export default function DebateForm({ initialData, onSubmit, isSubmitting }: DebateFormProps) {
  const [formData, setFormData] = useState<DebateFormData>({
    ...defaultFormData,
    ...initialData,
    faction1Arguments: initialData?.faction1Arguments?.length ? initialData.faction1Arguments : [''],
    faction2Arguments: initialData?.faction2Arguments?.length ? initialData.faction2Arguments : [''],
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (!initialData) {
      setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
    } else {
      setFormData(prev => ({ ...prev, title }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSummaryChange = (value: string) => {
    setFormData(prev => ({ ...prev, summary: value }));
  };

  const handleArgumentChange = (faction: 'faction1' | 'faction2', index: number, value: string) => {
    const field = faction === 'faction1' ? 'faction1Arguments' : 'faction2Arguments';
    const newArgs = [...formData[field]];
    newArgs[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArgs }));
  };

  const addArgument = (faction: 'faction1' | 'faction2') => {
    const field = faction === 'faction1' ? 'faction1Arguments' : 'faction2Arguments';
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArgument = (faction: 'faction1' | 'faction2', index: number) => {
    const field = faction === 'faction1' ? 'faction1Arguments' : 'faction2Arguments';
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-8 pb-20">
      
      {/* 1. Basic Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text" name="title" required
              value={formData.title} onChange={handleTitleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              placeholder="e.g. Should we adopt remote work?"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Category</label>
              <input
                type="text" name="topic" required
                value={formData.topic} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Technology, Politics, Culture"
              />
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
              <input
                id="slug"
                type="text" name="slug" required
                value={formData.slug} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Summary / Context</label>
            <div className="h-64 mb-12"> 
              <ReactQuill 
                theme="snow"
                value={formData.summary}
                onChange={handleSummaryChange}
                className="h-full"
                placeholder="Write your summary here... (supports bold, italics, etc)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. The Debate */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">The Debate</h3>
        
        <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50 p-4 rounded-lg border border-slate-100">
           <div>
             <label htmlFor="faction1Label" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Group A Name</label>
             <input
                id="faction1Label"
                type="text" name="faction1Label"
                value={formData.faction1Label} onChange={handleChange}
                className="block w-full rounded border-gray-300 shadow-sm focus:ring-red-500 sm:text-sm p-2 border"
             />
           </div>
           <div>
             <label htmlFor="faction2Label" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Group B Name</label>
             <input
                id="faction2Label"
                type="text" name="faction2Label"
                value={formData.faction2Label} onChange={handleChange}
                className="block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm p-2 border"
             />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-red-50 p-5 rounded-lg border border-red-100">
            <h4 className="font-bold text-red-900 mb-1">{formData.faction1Label} Arguments</h4>
            <div className="space-y-3 mt-4">
              {formData.faction1Arguments.map((arg, idx) => (
                <div key={idx} className="flex gap-2">
                  <textarea
                    rows={2}
                    value={arg}
                    onChange={(e) => handleArgumentChange('faction1', idx, e.target.value)}
                    className="block w-full rounded-md border-red-200 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-3"
                    placeholder={`Point for ${formData.faction1Label}...`}
                  />
                  <button type="button" onClick={() => removeArgument('faction1', idx)} className="text-red-400 hover:text-red-600 p-1" aria-label="Remove argument">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArgument('faction1')}
                className="flex items-center text-sm text-red-700 hover:text-red-900 font-medium mt-2"
              >
                <PlusIcon className="h-4 w-4 mr-1" /> Add Point
              </button>
            </div>
          </div>

          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-1">{formData.faction2Label} Arguments</h4>
            <div className="space-y-3 mt-4">
              {formData.faction2Arguments.map((arg, idx) => (
                <div key={idx} className="flex gap-2">
                  <textarea
                    rows={2}
                    value={arg}
                    onChange={(e) => handleArgumentChange('faction2', idx, e.target.value)}
                    className="block w-full rounded-md border-blue-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3"
                    placeholder={`Point for ${formData.faction2Label}...`}
                  />
                  <button type="button" onClick={() => removeArgument('faction2', idx)} className="text-blue-400 hover:text-blue-600 p-1" aria-label="Remove argument">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArgument('faction2')}
                className="flex items-center text-sm text-blue-700 hover:text-blue-900 font-medium mt-2"
              >
                <PlusIcon className="h-4 w-4 mr-1" /> Add Point
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Media & Meta */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Media & Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">YouTube Video ID</label>
            <input
              type="text" name="youtubeVideoId"
              value={formData.youtubeVideoId} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. dQw4w9WgXcQ"
            />
          </div>
          <div>
             {/* 🟢 Status moved here for better flow */}
             <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Publication Status</label>
             <select
               id="status"
               name="status"
               value={formData.status}
               onChange={handleChange}
               className="w-full px-4 py-2 border border-gray-300 rounded-lg"
             >
               <option value="published">Published (Visible)</option>
               <option value="draft">Draft (Hidden)</option>
             </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
            <input
              type="text" name="mainImageUrl"
              value={formData.mainImageUrl} onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Footer / Submit */}
      <div className="bg-gray-50 p-6 rounded-lg flex justify-end gap-3 sticky bottom-0 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white transition-colors"
        >
          Cancel
        </button>
        {/* 🟢 Button Updated */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </form>
  );
}