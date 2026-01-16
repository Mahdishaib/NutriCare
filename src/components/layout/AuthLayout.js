import React from 'react';

const AuthLayout = ({ children, title }) => (
  <div className="min-h-screen flex items-center justify-center bg-emerald-50 p-4">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <div className="text-center mb-8">
        <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
          🩺
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      {children}
    </div>
  </div>
);

export default AuthLayout;