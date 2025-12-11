import React, { useState } from 'react';

function AdminLayout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}

export default function AdminSettings() {
  // Simple state to simulate form handling
  const [siteName, setSiteName] = useState('The Kivu Monitor');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <AdminLayout title="Platform Settings">
      <div className="max-w-2xl">
        
        {/* General Settings Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">General Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input 
                id="siteName"
                type="text" 
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="The Kivu Monitor"
                title="Site name shown in the browser tab and SEO"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" 
              />
              <p className="text-xs text-gray-500 mt-1">This appears in the browser tab and SEO meta tags.</p>
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input 
                id="contactEmail"
                type="email" 
                defaultValue="admin@kivumonitor.com"
                placeholder="admin@kivumonitor.com"
                title="Contact email for site administration"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        <div className="bg-white p-6 rounded-xl border border-red-200 shadow-sm">
          <h3 className="text-lg font-bold text-red-700 mb-4 border-b border-red-100 pb-2">Danger Zone</h3>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Shut down the public-facing site temporarily.</p>
            </div>
            <button 
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              aria-pressed={maintenanceMode}
              aria-label={maintenanceMode ? 'Disable maintenance mode' : 'Enable maintenance mode'}
              title={maintenanceMode ? 'Disable maintenance mode' : 'Enable maintenance mode'}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${maintenanceMode ? 'bg-red-600' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100">
            <button className="text-red-600 text-sm font-bold border border-red-200 px-4 py-2 rounded hover:bg-red-50 w-full">
              Flush Cache & Restart
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}