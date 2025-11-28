import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const CarFormModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        tagline: '',
        description: '',
        price: '',
        images: [], // Array of URLs
        specs: []
    });
    const [imageFiles, setImageFiles] = useState([]); // Array of new files
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            // Backward compatibility: if 'image' exists but 'images' doesn't, use 'image'
            const images = initialData.images || (initialData.image ? [initialData.image] : []);
            setFormData({ ...initialData, images });
        } else {
            setFormData({
                name: '',
                tagline: '',
                description: '',
                price: '',
                images: [],
                specs: []
            });
        }
        setImageFiles([]);
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleRemoveImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleRemoveFile = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddSpec = () => {
        setFormData(prev => ({
            ...prev,
            specs: [...(prev.specs || []), { label: '', value: '' }]
        }));
    };

    const handleSpecChange = (index, field, value) => {
        const newSpecs = [...formData.specs];
        newSpecs[index][field] = value;
        setFormData(prev => ({ ...prev, specs: newSpecs }));
    };

    const handleRemoveSpec = (index) => {
        const newSpecs = formData.specs.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, specs: newSpecs }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            let finalImages = [...formData.images];

            // Upload new files
            if (imageFiles.length > 0) {
                const uploadPromises = imageFiles.map(async (file) => {
                    try {
                        const storageRef = ref(storage, `cars/${Date.now()}_${file.name}`);
                        await uploadBytes(storageRef, file);
                        return await getDownloadURL(storageRef);
                    } catch (storageError) {
                        console.warn("Storage upload failed, using placeholder", storageError);
                        return URL.createObjectURL(file);
                    }
                });

                const newUrls = await Promise.all(uploadPromises);
                finalImages = [...finalImages, ...newUrls];
            }

            // Ensure we have at least one image (optional, but good practice)
            // if (finalImages.length === 0) { ... }

            // Save with both 'images' array and 'image' string (for backward compat/thumbnail)
            await onSave({
                ...formData,
                images: finalImages,
                image: finalImages[0] || '' // Main thumbnail
            });
            onClose();
        } catch (error) {
            console.error("Error saving car:", error);
            alert("Error saving car. Please check console.");
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900">{initialData ? 'Edit Component' : 'Add New Component'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. Model X" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                            <input type="text" name="tagline" value={formData.tagline} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. Dynamic Aesthetic" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="Car description..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price Category</label>
                            <input type="text" name="price" value={formData.price} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none" placeholder="e.g. Premium Pricing" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                    {/* Existing Images & Previews */}
                                    {formData.images && formData.images.map((img, index) => (
                                        <div key={`existing-${index}`} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                            <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* New File Previews */}
                                    {imageFiles.map((file, index) => (
                                        <div key={`new-${index}`} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                            <img src={URL.createObjectURL(file)} alt={`New ${index}`} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload Button */}
                                    <label className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-gray-100 transition-colors aspect-video">
                                        <Upload className="w-5 h-5 text-gray-400" />
                                        <span className="text-xs text-gray-500">Add Photos</span>
                                        <input type="file" onChange={handleImageChange} accept="image/*" multiple className="hidden" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-400">First image will be the cover.</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Specifications</label>
                            <button type="button" onClick={handleAddSpec} className="text-xs flex items-center gap-1 text-teal-600 font-bold hover:text-teal-700">
                                <Plus className="w-3 h-3" /> Add Spec
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.specs && formData.specs.map((spec, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input type="text" value={spec.label} onChange={(e) => handleSpecChange(index, 'label', e.target.value)} placeholder="Label" className="flex-1 min-w-0 p-2 border border-gray-200 rounded-lg text-sm" />
                                    <input type="text" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} placeholder="Value" className="flex-1 min-w-0 p-2 border border-gray-200 rounded-lg text-sm" />
                                    <button type="button" onClick={() => handleRemoveSpec(index)} className="shrink-0 text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                        <button type="submit" disabled={uploading} className="px-6 py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            {uploading ? 'Saving...' : 'Save Component'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CarFormModal;
