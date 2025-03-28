import Link from 'next/link';
import { LayoutGrid, User, Users } from 'lucide-react';

const Sidebar = ({ role }) => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-6 flex flex-col justify-between">
      <div>

        <nav className="space-y-4">
          {role === 'ADMIN' && (
            <Link href="/dashboard/admin" className="flex items-center gap-2 hover:text-blue-400">
              <LayoutGrid size={20} /> Admin Dashboard
            </Link>
          )}
          {role === 'PM' && (
            <Link href="/dashboard/pm" className="flex items-center gap-2 hover:text-blue-400">
              <Users size={20} /> PM Dashboard
            </Link>
          )}
          {role === 'TEAM' && (
            <Link href="/dashboard/team" className="flex items-center gap-2 hover:text-blue-400">
              <User size={20} /> Team Dashboard
            </Link>
          )}
        </nav>
      </div>

     
    </aside>
  );
};

export default Sidebar;