import React from 'react';
import { X, Headphones } from 'lucide-react';

const ProductDrawer = ({ car, onClose, onInterested, theme }) => {
    if (!car) return null;

    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="absolute right-0 top-0 h-full w-[85%] sm:w-[75%] max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto custom-scrollbar">
                <div className="min-h-full flex flex-col relative">
                    <div className="absolute top-4 right-4 z-10">
                        <button onClick={onClose} className="bg-white/80 backdrop-blur rounded-full p-2 text-gray-800 shadow-md hover:bg-gray-100"><X className="w-5 h-5" /></button>
                    </div>

                    {/* Drawer Content */}
                    <div className="relative h-48 w-full">
                        <img src={car.image} className="w-full h-full object-cover" alt={car.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                        <button className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2 hover:bg-white transition-colors" style={{ color: theme?.primaryColor || '#0D9488' }}>
                            <Headphones className="w-4 h-4" /> <span>Listen to Tour</span>
                        </button>
                    </div>

                    <div className="px-5 pt-2 pb-6">
                        <div className="mb-4">
                            <span className="inline-block px-2 py-1 text-xs font-bold rounded-md mb-1" style={{ backgroundColor: `${theme?.primaryColor}20` || '#E0F2F1', color: theme?.primaryColor || '#0D9488' }}>{car.tagline}</span>
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{car.name}</h2>
                            <p className="text-gray-500 text-sm mt-1 font-medium">{car.price}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {car.specs.map((spec, i) => (
                                <div key={i} className="bg-gray-50 p-2 rounded-lg text-center border border-gray-100">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold">{spec.label}</p>
                                    <p className="text-sm font-bold text-gray-800">{spec.value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="prose prose-sm">
                            <h3 className="text-sm font-bold text-gray-900 uppercase mb-2">Overview</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{car.description}</p>
                        </div>
                    </div>

                    <div className="mt-auto sticky bottom-0 p-4 bg-white/95 border-t border-gray-100 backdrop-blur">
                        <button onClick={onInterested} className="w-full text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity" style={{ backgroundColor: theme?.primaryColor || '#0D9488' }}>
                            I'm Interested
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDrawer;
