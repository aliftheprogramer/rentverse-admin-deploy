import React from "react";
import { } from "react-router-dom";

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg p-8 bg-white rounded shadow text-center">
        <h1 className="text-2xl font-semibold text-red-600">Unauthorized</h1>
        <p className="mt-4 text-gray-600">You do not have permission to access this page.</p>
        <div className="mt-6">
          <Link to="/login" className="inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Sign in with another account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
