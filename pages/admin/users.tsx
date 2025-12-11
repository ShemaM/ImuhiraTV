import React from 'react';

type AdminLayoutProps = {
  title?: string;
  children: React.ReactNode;
};

function AdminLayout({ title, children }: AdminLayoutProps) {
  return (
    <div className="p-6">
      {title && <h1 className="text-xl font-semibold mb-4">{title}</h1>}
      <div>{children}</div>
    </div>
  );
}

// Local mock data for display purposes
const MOCK_USERS = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Subscriber", status: "Active", joined: "Oct 24, 2025" },
  { id: 2, name: "Bob Smith", email: "bob@test.com", role: "Admin", status: "Active", joined: "Sep 12, 2025" },
  { id: 3, name: "Charlie Day", email: "charlie@domain.com", role: "Subscriber", status: "Inactive", joined: "Nov 01, 2025" },
  { id: 4, name: "Dana White", email: "dana@ufc.com", role: "Subscriber", status: "Banned", joined: "Aug 05, 2025" },
];

export default function AdminUsers() {
  return (
    <AdminLayout title="User Management">
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {MOCK_USERS.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-700">{user.role}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${user.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    ${user.status === 'Inactive' ? 'bg-gray-100 text-gray-800' : ''}
                    ${user.status === 'Banned' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.joined}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-slate-600 hover:text-slate-900 font-bold text-xs border border-gray-300 rounded px-2 py-1">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}