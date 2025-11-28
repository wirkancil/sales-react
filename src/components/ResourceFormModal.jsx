import React, { useState, useEffect } from 'react';
import { X, Upload, Link as LinkIcon, MapPin, FileText } from 'lucide-react';

const ResourceFormModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        type: 'link',
        title: '',
        subtitle: '',
        url: '',
        file: null
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                type: initialData.type || 'link',
                title: initialData.title || '',
                subtitle: initialData.subtitle || '',
                url: initialData.url || '',
                file: null // Reset file on edit, unless we want to show existing? existing is url.
            });
        } else {
            setFormData({
                type: 'link',
                title: '',
                subtitle: '',
                url: '',
                file: null
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, file: e.target.files[0] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900">{initialData ? 'Edit Link' : 'Add New Link'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Type Selection */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Link Type</label>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'link', label: 'Link', icon: LinkIcon },
                                { id: 'pdf', label: 'PDF', icon: FileText },
                                { id: 'location', label: 'Map', icon: MapPin }
                            ].map(type => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                                    className={`flex flex-col items-center justify-center gap-1 p-3 rounded-xl border transition-all ${formData.type === type.id
                                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                        }`}
                                >
                                    <type.icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Fields */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Download Brochure"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle</label>
                        <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            placeholder="e.g. PDF Format (5MB)"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                        />
                    </div>

                    {/* URL or File Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                            {formData.type === 'pdf' ? 'Upload PDF' : 'Destination URL'}
                        </label>
                        {formData.type === 'pdf' ? (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-colors cursor-pointer"
                                />
                                {initialData?.url && !formData.file && (
                                    <p className="text-[10px] text-green-600 mt-1.5 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Current file: {initialData.url.split('/').pop().split('?')[0].substring(0, 20)}...
                                    </p>
                                )}
                            </div>
                        ) : (
                            <input
                                type="url"
                                name="url"
                                value={formData.url}
                                onChange={handleChange}
                                required={formData.type !== 'pdf'} // PDF might keep existing URL
                                placeholder="https://..."
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none text-sm font-mono text-gray-600"
                            />
                        )}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
                        >
                            Save Link
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResourceFormModal;
