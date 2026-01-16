import React, { useState } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const MealCard = ({ option, label, onLog }) => {
  const [grams, setGrams] = useState(100);
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-emerald-400 hover:shadow-md transition bg-white group">
      <div className="flex justify-between items-start mb-2">
        <Badge color="emerald">Option {label}</Badge>
        <span className="text-xs text-gray-400">{option.cals} cal/100g</span>
      </div>
      <h4 className="font-bold text-gray-800 mb-1">{option.name}</h4>
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
        <input type="number" value={grams} onChange={(e) => setGrams(e.target.value)} className="w-16 border rounded px-1 py-1 text-sm text-center bg-gray-50" />
        <span className="text-xs text-gray-400">g</span>
        <Button onClick={() => onLog(grams)} className="flex-1 py-1 h-8 text-xs">Eat</Button>
      </div>
    </div>
  );
};

export default MealCard;