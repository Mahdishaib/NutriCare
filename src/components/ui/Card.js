import React from 'react';

const Card = ({ children, title, icon, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}>
    {(title || icon) && (
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800">
        {/* Changed to render icon directly as text/node */}
        {icon && <span className="text-2xl">{icon}</span>}
        {title}
      </h3>
    )}
    {children}
  </div>
);

export default Card;