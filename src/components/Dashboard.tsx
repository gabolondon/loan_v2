import React from 'react';
    import { LogOut, Home, Users, Wallet } from 'lucide-react';
    import { useStore } from "../store/useStore";
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
        <div className="flex h-screen bg-gray-50">
          <aside className="flex flex-col w-64 p-4 bg-gray-100 border-r">
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
                        isActive ? "bg-gray-200 font-semibold" : "text-gray-700"
                      }`
                    }
                  >
                    <span className="mr-2">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="pt-4 mt-auto border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={user?.photoURL}
                    alt={user?.name}
                    className="w-8 h-8 mr-2 rounded-full"
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
          <main className="flex-1 h-screen px-6 py-4 overflow-y-auto">
            <Breadcrumb location={location} />
            <Outlet />
          </main>
        </div>
      );
    };
