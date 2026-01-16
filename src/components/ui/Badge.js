import React from 'react';

const Badge = ({ children, color = 'emerald' }) => {
  const colors = {
    emerald: "bg-emerald-100 text-emerald-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-600"
  };
  return <span className={`${colors[color]} text-xs px-2 py-0.5 rounded font-bold`}>{children}</span>;
};

export default Badge;