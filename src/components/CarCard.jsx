import React from 'react';
import { ChevronRight } from 'lucide-react';

const CarCard = ({ car, onClick, theme }) => {
    return (
        <button
            onClick={onClick}
            className="w-full p-4 rounded-xl flex items-center justify-between group text-left transition-all hover:shadow-md"
            style={{ backgroundColor: theme?.cardColor || '#FFFFFF' }}
        >
            <div className="flex items-center gap-4">
                <img src={car.image} alt={car.name} className="w-16 h-10 object-cover rounded-md shadow-sm bg-gray-200" />
                <div>
                    <h3 className="font-bold" style={{ color: theme?.textColor || '#111827' }}>{car.name}</h3>
                    <p className="text-xs opacity-60" style={{ color: theme?.textColor || '#111827' }}>{car.tagline}</p>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 opacity-30 group-hover:opacity-100 transition-opacity" style={{ color: theme?.primaryColor }} />
        </button>
    );
};

export default CarCard;
