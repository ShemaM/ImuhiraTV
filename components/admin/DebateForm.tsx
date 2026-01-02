import { useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export interface Argument {
  id?: number;
  speakerName: string;
  argument: string;
}

export interface DebateFormData {
  title: string;
  slug: string;
  topic: string;
  summary: string;
  verdict: string;
  youtubeVideoId: string;
  youtubeVideoTitle: string;
  mainImageUrl: string;
  authorName: string;
  status: 'draft' | 'published';
  idubuArguments: Argument[];
  akagaraArguments: Argument[];
}

interface DebateFormProps {
  initialData?: DebateFormData;
  onSubmit: (data: DebateFormData) => Promise<void>;
  isSubmitting: boolean;
}

const defaultFormData: DebateFormData = {
  title: '',
  slug: '',
  topic: '',
  summary: '',
  verdict: '',
  youtubeVideoId: '',
  youtubeVideoTitle: '',
  mainImageUrl: '',
  authorName: 'Imuhira Staff',
  status: 'draft',
  idubuArguments: [{ speakerName: '', argument: '' }],
  akagaraArguments: [{ speakerName: '', argument: '' }],
};

export default function DebateForm({ initialData, onSubmit, isSubmitting }: DebateFormProps) {
  const [formData, setFormData] = useState<DebateFormData>(initialData || defaultFormData);

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
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArgumentChange = (
    faction: 'idubu' | 'akagara',
    index: number,
    field: 'speakerName' | 'argument',
    value: string
  ) => {
    const key = faction === 'idubu' ? 'idubuArguments' : 'akagaraArguments';
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].map((arg, i) => 
        i === index ? { ...arg, [field]: value } : arg
      ),
    }));
  };

  const addArgument = (faction: 'idubu' | 'akagara') => {
    const key = faction === 'idubu' ? 'idubuArguments' : 'akagaraArguments';
    setFormData(prev => ({
      ...prev,
      [key]: [...prev[key], { speakerName: '', argument: '' }],
    }));
  };

  const removeArgument = (faction: 'idubu' | 'akagara', index: number) => {
    const key = faction === 'idubu' ? 'idubuArguments' : 'akagaraArguments';
    if (formData[key].length <= 1) return; // Keep at least one argument
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., The Twirwaneho Alliance: Defense or Destabilization?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-gray-50"
              placeholder="auto-generated-from-title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author Name
            </label>
            <input
              type="text"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topic/Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., Is the Twirwaneho alliance with M23 justified as self-defense?"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Brief summary of the debate..."
            />
          </div>
        </div>
      </div>

      {/* YouTube Video */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">YouTube Interview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube Video ID
            </label>
            <input
              type="text"
              name="youtubeVideoId"
              value={formData.youtubeVideoId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="e.g., dQw4w9WgXcQ"
            />
            <p className="mt-1 text-xs text-gray-500">
              The ID from the YouTube URL (e.g., youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong>)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Title
            </label>
            <input
              type="text"
              name="youtubeVideoTitle"
              value={formData.youtubeVideoTitle}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Title of the YouTube interview"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Image URL
            </label>
            <input
              type="url"
              name="mainImageUrl"
              value={formData.mainImageUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
      </div>

      {/* Arguments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Idubu Arguments */}
        <div className="bg-blue-50 rounded-lg shadow-sm p-6 border-l-4 border-blue-600">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-blue-800">Idubu Arguments</h3>
              <p className="text-sm text-blue-600">Pro-Twirwaneho perspective</p>
            </div>
            <button
              type="button"
              onClick={() => addArgument('idubu')}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {formData.idubuArguments.map((arg, index) => (
              <div key={index} className="bg-white rounded-lg p-4 relative">
                {formData.idubuArguments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArgument('idubu', index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={arg.speakerName}
                    onChange={(e) => handleArgumentChange('idubu', index, 'speakerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Speaker name (optional)"
                  />
                  <textarea
                    value={arg.argument}
                    onChange={(e) => handleArgumentChange('idubu', index, 'argument', e.target.value)}
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Key argument or point made..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Akagara Arguments */}
        <div className="bg-orange-50 rounded-lg shadow-sm p-6 border-l-4 border-orange-600">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-orange-800">Akagara Arguments</h3>
              <p className="text-sm text-orange-600">Pro-government/FARDC perspective</p>
            </div>
            <button
              type="button"
              onClick={() => addArgument('akagara')}
              className="flex items-center gap-1 text-orange-600 hover:text-orange-800 text-sm font-medium"
            >
              <PlusIcon className="h-4 w-4" />
              Add
            </button>
          </div>
          <div className="space-y-4">
            {formData.akagaraArguments.map((arg, index) => (
              <div key={index} className="bg-white rounded-lg p-4 relative">
                {formData.akagaraArguments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArgument('akagara', index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
                <div className="space-y-3">
                  <input
                    type="text"
                    value={arg.speakerName}
                    onChange={(e) => handleArgumentChange('akagara', index, 'speakerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Speaker name (optional)"
                  />
                  <textarea
                    value={arg.argument}
                    onChange={(e) => handleArgumentChange('akagara', index, 'argument', e.target.value)}
                    rows={3}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Key argument or point made..."
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className="bg-slate-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold text-white mb-4">⚖️ Judge&apos;s Verdict</h3>
        <p className="text-slate-300 text-sm mb-4">
          Provide a balanced conclusion that fairly weighs both perspectives. Remember, Imuhira is a neutral platform.
        </p>
        <textarea
          name="verdict"
          value={formData.verdict}
          onChange={handleChange}
          rows={5}
          required
          className="w-full px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-red-500 bg-slate-700 text-white placeholder-slate-400"
          placeholder="Write a balanced verdict that considers both Idubu and Akagara perspectives..."
        />
      </div>

      {/* Status & Submit */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <label className="block text-sm font-medium text-gray-700">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Debate'}
          </button>
        </div>
      </div>
    </form>
  );
}
