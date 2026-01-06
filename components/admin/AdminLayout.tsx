import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  UsersIcon, 
  Cog6ToothIcon, 
  ArrowLeftOnRectangleIcon,
  ScaleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter();
  const currentPath = router.pathname;

  const isActive = (path: string) => {
    if (path === '/admin' && currentPath === '/admin') return true;
    if (path !== '/admin' && currentPath.startsWith(path)) return true;
    return false;
  };

  const linkClass = (path: string) => 
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive(path) 
        ? 'bg-slate-800 text-white' 
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10">
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <span className="text-xl font-bold tracking-wider">ADMIN PANEL</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className={linkClass('/admin')}>
            <HomeIcon className="h-6 w-6" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link href="/admin/debates" className={linkClass('/admin/debates')}>
            <ScaleIcon className="h-6 w-6" />
            <span className="font-medium">Debates</span>
          </Link>
          <Link href="/admin/posts" className={linkClass('/admin/posts')}>
            <DocumentTextIcon className="h-6 w-6" />
            <span className="font-medium">Articles</span>
          </Link>
          <Link href="/admin/comments" className={linkClass('/admin/comments')}>
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
            <span className="font-medium">Comments</span>
          </Link>
          <Link href="/admin/users" className={linkClass('/admin/users')}>
            <UsersIcon className="h-6 w-6" />
            <span className="font-medium">Subscribers</span>
          </Link>
          <Link href="/admin/settings" className={linkClass('/admin/settings')}>
            <Cog6ToothIcon className="h-6 w-6" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          {/* Note: Admin panel links to default English homepage. In production, this could detect user's language preference. */}
          <Link href="/en/" className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 w-full transition-colors">
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            <span className="font-medium">Exit to Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 sticky top-0 z-20">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Welcome, <b>Admin</b></span>
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">A</div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}