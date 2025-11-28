import React from 'react';
import { X, Save, Upload, Link as LinkIcon, MapPin, FileText, Car, MessageSquare, Plus, Trash2, Edit2 } from 'lucide-react';
import ResourceFormModal from './ResourceFormModal';

const SettingsModal = ({
    isOpen,
    onClose,
    settings,
    setSettings,
    onSave,
    uploading,
    handleProfileImageChange,
    // Resource props
    isResourceModalOpen,
    setIsResourceModalOpen,
    editingResource,
    setEditingResource,
    handleSaveResource,
    removeResource,
    // Theme props
    themeTemplates
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <form onSubmit={onSave} className="space-y-8">
                        {/* AI Chatbot Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-sm">1</span>
                                AI Assistant
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <input
                                        type="checkbox"
                                        id="chatbotEnabled"
                                        className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                                        checked={settings.chatbot?.enabled !== false}
                                        onChange={(e) => setSettings({ ...settings, chatbot: { ...settings.chatbot, enabled: e.target.checked } })}
                                    />
                                    <label htmlFor="chatbotEnabled" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                        Enable AI Assistant Bubble
                                    </label>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Custom Knowledge / Instructions</label>
                                    <textarea
                                        className="w-full p-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all h-32 text-sm"
                                        placeholder="e.g. We offer 5 year warranty. Our showroom is open 9-5..."
                                        value={settings.chatbot?.customInstructions || ''}
                                        onChange={(e) => setSettings({ ...settings, chatbot: { ...settings.chatbot, customInstructions: e.target.value } })}
                                    />
                                    <p className="text-xs text-gray-400 mt-2">This info will be injected into the AI's context.</p>
                                </div>
                            </div>
                        </div>

                        {/* Theme & Appearance Settings */}
                        <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)] border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-sm">2</span>
                                Theme & Appearance
                            </h3>

                            <div className="space-y-6">
                                {/* Preset Themes */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Choose a Preset Theme</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {themeTemplates && Object.entries(themeTemplates).map(([key, theme]) => (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSettings({
                                                    ...settings,
                                                    theme: {
                                                        preset: key,
                                                        custom: false,
                                                        ...theme
                                                    }
                                                })}
                                                className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${settings.theme?.preset === key && !settings.theme?.custom
                                                    ? 'border-teal-500 ring-2 ring-teal-500/20'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div
                                                        className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                                        style={{ backgroundColor: theme.primaryColor }}
                                                    />
                                                    <span className="text-sm font-semibold text-gray-800">{theme.name}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: theme.backgroundColor }} />
                                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: theme.cardColor }} />
                                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: theme.textColor }} />
                                                </div>
                                            </button>
                                        ))}
                                        {!themeTemplates && (
                                            <div className="col-span-full text-center text-gray-400 py-4">
                                                No theme templates available
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Custom Theme Editor */}
                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-sm font-bold text-gray-700">Custom Theme</label>
                                        <button
                                            type="button"
                                            onClick={() => setSettings({
                                                ...settings,
                                                theme: { ...settings.theme, custom: !settings.theme?.custom }
                                            })}
                                            className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${settings.theme?.custom
                                                ? 'bg-teal-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {settings.theme?.custom ? 'Using Custom' : 'Use Custom'}
                                        </button>
                                    </div>

                                    {settings.theme?.custom && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Primary Color</label>
                                                <input
                                                    type="color"
                                                    value={settings.theme?.primaryColor || '#0D9488'}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        theme: { ...settings.theme, primaryColor: e.target.value }
                                                    })}
                                                    className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Background Color</label>
                                                <input
                                                    type="color"
                                                    value={settings.theme?.backgroundColor || '#F9FAFB'}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        theme: { ...settings.theme, backgroundColor: e.target.value }
                                                    })}
                                                    className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Text Color</label>
                                                <input
                                                    type="color"
                                                    value={settings.theme?.textColor || '#111827'}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        theme: { ...settings.theme, textColor: e.target.value }
                                                    })}
                                                    className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Color</label>
                                                <input
                                                    type="color"
                                                    value={settings.theme?.cardColor || '#FFFFFF'}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        theme: { ...settings.theme, cardColor: e.target.value }
                                                    })}
                                                    className="w-full h-10 rounded-lg border border-gray-200 cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Live Theme Preview */}
                                <div className="border-t border-gray-100 pt-6">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Live Preview</label>
                                    <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                                        {/* Preview Container */}
                                        <div
                                            className="p-8 transition-colors duration-300"
                                            style={{
                                                backgroundColor: settings.theme?.backgroundColor || '#F9FAFB'
                                            }}
                                        >
                                            {/* Hero Section Preview */}
                                            <div className="max-w-2xl mx-auto text-center space-y-4">
                                                <h1
                                                    className="text-2xl font-bold transition-colors duration-300"
                                                    style={{ color: settings.theme?.textColor || '#111827' }}
                                                >
                                                    {settings.profile?.name || 'Your Name'}
                                                </h1>
                                                <p
                                                    className="text-sm opacity-80"
                                                    style={{ color: settings.theme?.textColor || '#111827' }}
                                                >
                                                    {settings.profile?.role || 'Your Role'}
                                                </p>

                                                {/* Sample Button */}
                                                <button
                                                    className="px-6 py-2 rounded-lg text-white font-medium text-sm transition-all duration-300"
                                                    style={{ backgroundColor: settings.theme?.primaryColor || '#0D9488' }}
                                                >
                                                    Contact Me
                                                </button>

                                                {/* Sample Card */}
                                                <div
                                                    className="mt-6 p-4 rounded-lg shadow-sm transition-colors duration-300"
                                                    style={{ backgroundColor: settings.theme?.cardColor || '#FFFFFF' }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                                                            style={{ backgroundColor: settings.theme?.primaryColor || '#0D9488' }}
                                                        >
                                                            BYD
                                                        </div>
                                                        <div className="text-left flex-1">
                                                            <h3
                                                                className="font-bold text-sm"
                                                                style={{ color: settings.theme?.textColor || '#111827' }}
                                                            >
                                                                Sample Car Model
                                                            </h3>
                                                            <p
                                                                className="text-xs opacity-70"
                                                                style={{ color: settings.theme?.textColor || '#111827' }}
                                                            >
                                                                Starting from $25,000
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Preview Label */}
                                        <div className="bg-gray-50 px-4 py-2 text-center">
                                            <p className="text-xs text-gray-500">
                                                This is how your landing page will look with the selected theme
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        disabled={uploading}
                        className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Nested Resource Modal */}
            <ResourceFormModal
                isOpen={isResourceModalOpen}
                onClose={() => setIsResourceModalOpen(false)}
                onSave={handleSaveResource}
                initialData={editingResource}
            />
        </div>
    );
};

export default SettingsModal;
