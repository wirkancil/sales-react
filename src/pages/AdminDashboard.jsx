import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Trash2, LogOut, Database, Edit2, Settings, Layout, Eye, Save, Upload, MapPin, MessageSquare } from 'lucide-react';
import CarFormModal from '../components/CarFormModal';
import LandingPage from './LandingPage';

const themeTemplates = {
  modernDark: {
    name: "Modern Dark",
    primaryColor: "#0D9488", // Teal 600
    backgroundColor: "#111827", // Gray 900
    textColor: "#F9FAFB", // Gray 50
    cardColor: "#1F2937" // Gray 800
  },
  oceanBlue: {
    name: "Ocean Blue",
    primaryColor: "#2563EB", // Blue 600
    backgroundColor: "#EFF6FF", // Blue 50
    textColor: "#1E3A8A", // Blue 900
    cardColor: "#FFFFFF" // White
  },
  classicLight: {
    name: "Classic Light",
    primaryColor: "#4F46E5", // Indigo 600
    backgroundColor: "#F3F4F6", // Gray 100
    textColor: "#111827", // Gray 900
    cardColor: "#FFFFFF" // White
  }
};

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    profile: {
      name: "Generic Auto Sales",
      title: "Premium Vehicle Consultant",
      description: "Helping you find your dream car.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    hero: {
      headline: "Drive the Future",
      subheadline: "Experience premium electric performance.",
      ctaText: "Book a Test Drive",
      brochureUrl: ""
    },
    contact: {
      phone: "+6281234567890",
      whatsapp: "+6281234567890",
      location: "",
      social: {
        instagram: "#",
        linkedin: "#"
      }
    },
    testDrive: {
      title: "Book a Test Drive",
      description: "Experience premium electric performance."
    },
    stats: {
      rating: "4.9/5",
      ratingLabel: "Rating",
      inventoryLabel: "Cars Available"
    },
    theme: {
      template: "modernDark",
      primaryColor: "#0D9488",
      backgroundColor: "#111827"
    },
    enableChatbot: true,
    customInstructions: ""
  });

  const fetchCars = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "cars"));
      const carList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCars(carList);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, "settings", "landingPage");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchSettings();
  }, []);

  const handleFileUpload = async (file, path) => {
    if (!file) return null;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSaveSettings = async () => {
    setUploading(true);
    try {
      let updatedSettings = { ...settings };

      // Handle Profile Image Upload
      if (settings.profile.image instanceof File) {
        const imageUrl = await handleFileUpload(settings.profile.image, `profile/${settings.profile.image.name}`);
        updatedSettings.profile.image = imageUrl;
      }

      // Handle Brochure Upload
      if (settings.hero.brochureUrl instanceof File) {
        const brochureUrl = await handleFileUpload(settings.hero.brochureUrl, `brochures/${settings.hero.brochureUrl.name}`);
        updatedSettings.hero.brochureUrl = brochureUrl;
      }

      await setDoc(doc(db, "settings", "landingPage"), updatedSettings);
      setSettings(updatedSettings); // Update local state with URLs
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Error saving settings");
    } finally {
      setUploading(false);
    }
  };

  const handleThemeTemplateChange = (templateKey) => {
    const template = themeTemplates[templateKey];
    setSettings(prev => ({
      ...prev,
      theme: {
        template: templateKey,
        primaryColor: template.primaryColor,
        backgroundColor: template.backgroundColor
      }
    }));
  };

  const handleSeedData = async () => {
    if (!confirm("This will add initial data to Firestore. Continue?")) return;
    try {
      // Seed logic here if needed, removed for brevity as requested to remove mock data
      alert("Seed function disabled for production mode.");
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    try {
      await deleteDoc(doc(db, "cars", id));
      setCars(cars.filter(car => car.id !== id));
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("Error deleting car");
    }
  };

  const handleEdit = (car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCar(null);
    setIsModalOpen(true);
  };

  const handleSaveCar = async (carData) => {
    try {
      if (editingCar) {
        await updateDoc(doc(db, "cars", editingCar.id), carData);
      } else {
        await addDoc(collection(db, "cars"), carData);
      }
      fetchCars();
    } catch (error) {
      console.error("Error saving car:", error);
      alert("Error saving car");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar / Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`${activeTab === 'inventory' ? 'border-brand-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Database className="w-4 h-4 mr-2" /> Inventory
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`${activeTab === 'settings' ? 'border-brand-primary text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Settings className="w-4 h-4 mr-2" /> Landing Page Settings
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button onClick={logout} className="flex items-center gap-2 text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'inventory' ? (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Component</h2>
              <button onClick={handleAddNew} className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                <Plus className="w-4 h-4" /> Add New Component
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading inventory...</div>
            ) : cars.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p>No component found in database.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map(car => (
                  <div key={car.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-48 bg-gray-200 relative">
                      <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button onClick={() => handleEdit(car)} className="bg-white/90 p-2 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(car.id)} className="bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-900">{car.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{car.tagline}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {car.specs && car.specs.slice(0, 2).map((spec, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                            {spec.label}: {spec.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Settings Tab Content */}
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              {/* Profile Section */}
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Profile Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, name: e.target.value } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={settings.profile.title}
                      onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, title: e.target.value } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={3}
                      value={settings.profile.description}
                      onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, description: e.target.value } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                    <div className="mt-1 flex items-center gap-4">
                      {settings.profile.image && (
                        <img
                          src={settings.profile.image instanceof File ? URL.createObjectURL(settings.profile.image) : settings.profile.image}
                          alt="Profile"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      )}
                      <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                        <span>Upload Image</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setSettings({ ...settings, profile: { ...settings.profile, image: e.target.files[0] } });
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                  <div className="sm:col-span-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="enableChatbot"
                          name="enableChatbot"
                          type="checkbox"
                          checked={settings.enableChatbot}
                          onChange={(e) => setSettings({ ...settings, enableChatbot: e.target.checked })}
                          className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="enableChatbot" className="font-medium text-gray-700">Enable Gemini AI Chatbot</label>
                        <p className="text-gray-500">Allow visitors to chat with the AI assistant.</p>
                      </div>
                    </div>
                  </div>

                  {settings.enableChatbot && (
                    <>
                      <div className="sm:col-span-6">
                        <label className="block text-sm font-medium text-gray-700">Custom Knowledge / Instructions</label>
                        <textarea
                          rows={4}
                          value={settings.customInstructions || ""}
                          onChange={(e) => setSettings({ ...settings, customInstructions: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                          placeholder="e.g. We are open Mon-Fri 9am-6pm. We offer 5-year warranty on all parts..."
                        />
                        <p className="mt-1 text-xs text-gray-500">Provide specific details about your business that the AI should know.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Stats Section Settings */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Stats</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Rating Value</label>
                    <input
                      type="text"
                      value={settings.stats?.rating || "4.9/5"}
                      onChange={(e) => setSettings({ ...settings, stats: { ...settings.stats, rating: e.target.value } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Rating Label</label>
                    <input
                      type="text"
                      value={settings.stats?.ratingLabel || "Rating"}
                      onChange={(e) => setSettings({ ...settings, stats: { ...settings.stats, ratingLabel: e.target.value } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Inventory Label</label>
                    <input
                      type="text"
                      value={settings.stats?.inventoryLabel || "Cars Available"}
                      onChange={(e) => setSettings({ ...settings, stats: { ...settings.stats, inventoryLabel: e.target.value } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Hero Section</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Headline</label>
                    <input
                      type="text"
                      value={settings.hero.headline}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, headline: e.target.value } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Subheadline</label>
                    <input
                      type="text"
                      value={settings.hero.subheadline}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, subheadline: e.target.value } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">CTA Text</label>
                    <input
                      type="text"
                      value={settings.hero.ctaText}
                      onChange={(e) => setSettings({ ...settings, hero: { ...settings.hero, ctaText: e.target.value } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Brochure (PDF)</label>
                    <div className="mt-1 flex items-center gap-4">
                      <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                        <span>Upload Brochure</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="application/pdf"
                          onChange={(e) => {
                            if (e.target.files[0]) {
                              setSettings({ ...settings, hero: { ...settings.hero, brochureUrl: e.target.files[0] } });
                            }
                          }}
                        />
                      </label>
                      {settings.hero.brochureUrl && (
                        <span className="text-sm text-gray-500">
                          {settings.hero.brochureUrl instanceof File ? settings.hero.brochureUrl.name : "Current Brochure Uploaded"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Section */}
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      value={settings.contact.phone}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
                    <input
                      type="text"
                      value={settings.contact.whatsapp}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, whatsapp: e.target.value } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">Office Location (Google Maps Link)</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <input
                        type="text"
                        value={settings.contact.location}
                        onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, location: e.target.value } })}
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-teal-500 focus:border-teal-500 sm:text-sm border-gray-300"
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Instagram</label>
                    <input
                      type="text"
                      value={settings.contact.social.instagram}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, social: { ...settings.contact.social, instagram: e.target.value } } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                    <input
                      type="text"
                      value={settings.contact.social.linkedin}
                      onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, social: { ...settings.contact.social, linkedin: e.target.value } } })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Theme Section */}
              <div className="p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Theme Settings</h3>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme Template</label>
                    <div className="flex gap-4">
                      {Object.entries(themeTemplates).map(([key, template]) => (
                        <button
                          key={key}
                          onClick={() => handleThemeTemplateChange(key)}
                          className={`px-4 py-2 rounded-lg border ${settings.theme.template === key ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-gray-200 hover:bg-gray-50'}`}
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Primary Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={settings.theme.primaryColor}
                        onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })}
                        className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.theme.primaryColor}
                        onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, primaryColor: e.target.value } })}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Background Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={settings.theme.backgroundColor}
                        onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, backgroundColor: e.target.value } })}
                        className="h-8 w-8 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.theme.backgroundColor}
                        onChange={(e) => setSettings({ ...settings, theme: { ...settings.theme, backgroundColor: e.target.value } })}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-gray-50 flex justify-end gap-4 rounded-b-lg sticky bottom-0">
                <button
                  onClick={() => setIsPreviewOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={uploading}
                  className={`flex items-center gap-2 px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${uploading ? 'bg-teal-400 cursor-not-allowed' : 'bg-brand-primary hover:bg-teal-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500`}
                >
                  {uploading ? (
                    <>
                      <Upload className="w-4 h-4 animate-spin" /> Publishing...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Publish Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <CarFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCar}
        initialData={editingCar}
      />

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-white overflow-auto">
          <div className="fixed top-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center z-[101] shadow-lg">
            <span className="font-bold flex items-center gap-2"><Eye className="w-4 h-4" /> Preview Mode</span>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="bg-white text-gray-900 px-4 py-1 rounded-md text-sm font-bold hover:bg-gray-100"
            >
              Close Preview
            </button>
          </div>
          <div className="pt-16">
            <LandingPage previewData={settings} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
