import React from "react";
import { NavLink, Link } from "react-router-dom";

type MainContainerProps = {
  children: React.ReactNode;
};

const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.627 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconProperty = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.75L12 4l9 5.75V20a1 1 0 01-1 1h-4v-6H8v6H4a1 1 0 01-1-1V9.75z" />
  </svg>
);

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  const userName = typeof window !== "undefined" ? localStorage.getItem("userName") : null;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white border-r">
        <div className="p-4 border-b">
          <Link to="/profile" className="flex items-center gap-3">
            <div className="rounded-full bg-red-600 text-white w-10 h-10 flex items-center justify-center font-semibold">
              {userName ? userName.charAt(0).toUpperCase() : "A"}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">{userName || "Admin"}</div>
              <div className="text-xs text-gray-500">Administrator</div>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink to="/user" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded ${isActive ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'}`}>
            <IconUser />
            <span className="text-sm font-medium">User</span>
          </NavLink>

          <NavLink to="/properties" className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded ${isActive ? 'bg-red-50 text-red-700' : 'text-gray-700 hover:bg-gray-100'}`}>
            <IconProperty />
            <span className="text-sm font-medium">Property</span>
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </header>

        <section>
          {children}
        </section>
      </main>
    </div>
  );
};

export default MainContainer;
