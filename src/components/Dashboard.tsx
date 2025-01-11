import React from 'react';
    import { LogOut, Home, Users, Wallet } from 'lucide-react';
    import { useStore } from '../store/useStore';
    import { UserManagement } from './UserManagement';
    import { auth } from '../config/firebase';
    import { NavLink, Outlet, useLocation } from 'react-router-dom';
    import { Breadcrumb } from './Breadcrumb';

    export const Dashboard: React.FC = () => {
      const { user } = useStore();
      const location = useLocation();

      const handleLogout = () => {
        auth.signOut();
      };

      const navItems = [
        {
          path: '/',
          icon: <Home size={20} />,
          label: 'Home',
        },
        {
          path: '/users',
          icon: <Users size={20} />,
          label: 'Users',
          adminOnly: true,
        },
        {
          path: '/loans',
          icon: <Wallet size={20} />,
          label: 'Loans',
        },
      ];

      return (
        <div className="min-h-screen bg-gray-50 flex">
          <aside className="w-64 bg-gray-100 border-r p-4 flex flex-col">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Loan Manager</h1>
            </div>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                if (item.adminOnly && !user?.isAdmin) return null;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-md hover:bg-gray-200 ${
                        isActive ? 'bg-gray-200 font-semibold' : 'text-gray-700'
                      }`
                    }
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="mt-auto pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={user?.photoURL}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </aside>
          <main className="flex-1 p-4">
            <Breadcrumb location={location} />
            <Outlet />
          </main>
        </div>
      );
    };
