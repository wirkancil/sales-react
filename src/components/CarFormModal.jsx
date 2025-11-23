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
        image: '',
        specs: []
    });
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                tagline: '',
                description: '',
                price: '',
                image: '',
                specs: []
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
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
            let imageUrl = formData.image;

            if (imageFile) {
                // Fallback for demo if storage is not configured properly or fails
                try {
                    const storageRef = ref(storage, `cars/${Date.now()}_${imageFile.name}`);
                    await uploadBytes(storageRef, imageFile);
                    imageUrl = await getDownloadURL(storageRef);
                } catch (storageError) {
                    console.warn("Storage upload failed (expected in demo without real config), using placeholder or local URL");
                    // Create a fake local URL for preview in this session
                    imageUrl = URL.createObjectURL(imageFile);
                }
            }

            await onSave({ ...formData, image: imageUrl });
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                            <div className="flex items-center gap-4">
                                {formData.image && <img src={formData.image} alt="Preview" className="w-16 h-10 object-cover rounded-md bg-gray-100" />}
                                <label className="flex-1 cursor-pointer bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                                    <Upload className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{imageFile ? imageFile.name : 'Upload Image'}</span>
                                    <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" />
                                </label>
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
                                <div key={index} className="flex gap-3">
                                    <input type="text" value={spec.label} onChange={(e) => handleSpecChange(index, 'label', e.target.value)} placeholder="Label (e.g. Range)" className="flex-1 p-2 border border-gray-200 rounded-lg text-sm" />
                                    <input type="text" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} placeholder="Value (e.g. 570km)" className="flex-1 p-2 border border-gray-200 rounded-lg text-sm" />
                                    <button type="button" onClick={() => handleRemoveSpec(index)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
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
