import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Plus, Trash2, LogOut, Database, Edit2, Settings, Layout, Eye, Save, Upload, MapPin, MessageSquare, LayoutDashboard, Calendar, RotateCcw, Link as LinkIcon, FileText, User, ChevronDown, Package, Briefcase, Sparkles, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import ResourceFormModal from '../components/ResourceFormModal';
import SettingsModal from '../components/SettingsModal';

const themeTemplates = {
  modernTeal: {
    name: "Modern Teal",
    primaryColor: "#0D9488",
    backgroundColor: "#F9FAFB",
    textColor: "#111827",
    cardColor: "#FFFFFF"
  },
  oceanBlue: {
    name: "Ocean Blue",
    primaryColor: "#2563EB",
    backgroundColor: "#EFF6FF",
    textColor: "#1E3A8A",
    cardColor: "#FFFFFF"
  },
  sunsetOrange: {
    name: "Sunset Orange",
    primaryColor: "#EA580C",
    backgroundColor: "#FFF7ED",
    textColor: "#7C2D12",
    cardColor: "#FFFFFF"
  },
  forestGreen: {
    name: "Forest Green",
    primaryColor: "#059669",
    backgroundColor: "#F0FDF4",
    textColor: "#14532D",
    cardColor: "#FFFFFF"
  },
  royalPurple: {
    name: "Royal Purple",
    primaryColor: "#7C3AED",
    backgroundColor: "#FAF5FF",
    textColor: "#4C1D95",
    cardColor: "#FFFFFF"
  },
  darkMode: {
    name: "Dark Mode",
    primaryColor: "#10B981",
    backgroundColor: "#111827",
    textColor: "#F9FAFB",
    cardColor: "#1F2937"
  }
};

const ContentCreatorDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  // Removed cars state
  const [loading, setLoading] = useState(true);
  // Removed car modal state
  const [uploading, setUploading] = useState(false);

  // Resource Modal State
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  // Settings Modal State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    profile: {
      name: "Alex Creator",
      role: "Lifestyle & Tech Creator",
      bio: "Helping brands tell better stories...",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      phone: "+123456789",
      whatsapp: "123456789",
      verified: true,
      onlineStatus: true
    },
    socials: [
      { type: 'instagram', url: '#', enabled: true },
      { type: 'tiktok', url: '#', enabled: true },
      { type: 'youtube', url: '#', enabled: true }
    ],
    resources: [
      { type: 'link', title: 'Business Inquiries', subtitle: 'Direct WhatsApp chat', url: '#' }
    ],
    rateCard: {
      title: "Download Rate Card 2025",
      subtitle: "Updated Jan 2025 • PDF",
      fileUrl: "",
      enabled: true
    },
    portfolio: {
      showreel: "",
      topContent: [],
      gallery: [],
      assets: []
    },
    aiPitch: {
      enabled: true,
      customPrompt: ""
    },
    theme: {
      preset: "modernTeal", // Reuse existing theme logic for now
      custom: false,
      primaryColor: "#0D9488",
      backgroundColor: "#F9FAFB",
      textColor: "#111827",
      cardColor: "#FFFFFF"
    }
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
        // Merge with default structure to ensure all fields exist
        const data = docSnap.data();
        setSettings(prev => ({
          ...prev,
          ...data,
          profile: { ...prev.profile, ...data.profile },
          socials: data.socials ? data.socials.map(s => ({ enabled: true, ...s })) : prev.socials,
          resources: data.resources || prev.resources,
          testDrive: { ...prev.testDrive, ...data.testDrive },
          chatbot: { ...prev.chatbot, ...data.chatbot },
          theme: { ...prev.theme, ...data.theme }
        }));
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

  // Helper to convert image to WebP
  const convertImageToWebP = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          }, 'image/webp', 0.95); // Increased quality to 0.95
        };
        img.src = event.target.result;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setUploading(true);
    try {
      // Phone Validation
      const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
      if (settings.profile.phone && !phoneRegex.test(settings.profile.phone)) {
        toast.error("Invalid Profile Phone Number");
        setUploading(false);
        return;
      }
      if (settings.profile.whatsapp && !phoneRegex.test(settings.profile.whatsapp)) {
        toast.error("Invalid WhatsApp Number");
        setUploading(false);
        return;
      }

      let updatedSettings = { ...settings };

      // Handle Profile Image Upload
      if (settings.profile.image instanceof File) {
        const imageUrl = await handleFileUpload(settings.profile.image, `profile/${settings.profile.image.name}`);
        updatedSettings.profile.image = imageUrl;
      }

      // Handle Resource PDF Uploads
      const updatedResources = await Promise.all(updatedSettings.resources.map(async (res) => {
        if (res.file instanceof File) {
          const fileUrl = await handleFileUpload(res.file, `resources/${res.file.name}`);
          // Remove the file object from the saved data, keep the URL
          const { file, ...rest } = res;
          return { ...rest, url: fileUrl };
        }
        return res;
      }));
      updatedSettings.resources = updatedResources;

      await setDoc(doc(db, "settings", "landingPage"), updatedSettings);

      // Update local state to reflect the saved URLs (and remove File objects)
      setSettings(updatedSettings);

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    try {
      await deleteDoc(doc(db, "cars", id));
      setCars(cars.filter(car => car.id !== id));
    } catch (error) {
      console.error("Error deleting car:", error);
      toast.error("Error deleting car");
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
      toast.error("Error saving car");
    }
  };

  // --- Social Media Logic ---
  const addSocialRow = () => {
    setSettings(prev => ({
      ...prev,
      socials: [...prev.socials, { type: 'instagram', url: '', enabled: true }]
    }));
  };

  const removeSocial = (index) => {
    setSettings(prev => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index)
    }));
  };

  const updateSocial = (index, field, value) => {
    const newSocials = [...settings.socials];
    newSocials[index][field] = value;
    setSettings(prev => ({ ...prev, socials: newSocials }));
  };

  // --- Resources Logic ---
  const addResourceRow = () => {
    setSettings(prev => ({
      ...prev,
      resources: [...prev.resources, { type: 'link', title: 'New Link', subtitle: 'Description', url: '#' }]
    }));
  };

  const handleSaveResource = async (resourceData) => {
    setUploading(true);
    try {
      let finalUrl = resourceData.url;

      // Handle File Upload if PDF
      if (resourceData.type === 'pdf' && resourceData.file) {
        finalUrl = await handleFileUpload(resourceData.file, `resources/${resourceData.file.name}`);
      }

      const newResource = {
        type: resourceData.type,
        title: resourceData.title,
        subtitle: resourceData.subtitle,
        url: finalUrl
      };

      setSettings(prev => {
        const newResources = [...prev.resources];
        if (editingResource && editingResource.index !== undefined) {
          newResources[editingResource.index] = newResource;
        } else {
          newResources.push(newResource);
        }
        return { ...prev, resources: newResources };
      });

      toast.success("Link saved! Don't forget to click 'Save Changes' to persist.");
    } catch (error) {
      console.error("Error saving resource:", error);
      toast.error("Failed to save link.");
    } finally {
      setUploading(false);
    }
  };

  const removeResource = (index) => {
    setSettings(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const updateResource = (index, field, value) => {
    const newResources = [...settings.resources];
    newResources[index][field] = value;
    setSettings(prev => ({ ...prev, resources: newResources }));
  };

  const handleResourceFileChange = async (index, file) => {
    if (file) {
      const newResources = [...settings.resources];
      newResources[index].file = file;
      // Optionally set a preview URL if needed, but for PDF mainly just showing name is enough
      setSettings(prev => ({ ...prev, resources: newResources }));
    }
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const webpFile = await convertImageToWebP(file);
        setSettings({ ...settings, profile: { ...settings.profile, image: webpFile } });
      } catch (error) {
        console.error("Image conversion failed:", error);
        alert("Failed to process image. Please try another one.");
      }
    }
  };

  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort by date desc
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
      setAppointments(list);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments();
    }
  }, [activeTab]);

  const handleReset = () => {
    if (confirm("Reset all data to original defaults?")) {
      window.location.reload();
    }
  };

  // --- Header Actions ---
  const handleLogout = async () => {
    try {
      await logout();
      // navigate('/login'); // Handled by ProtectedRoute/AuthContext usually
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium border border-gray-200"
            >
              <Eye className="w-4 h-4" /> <span className="hidden sm:inline">View Site</span>
            </Link>

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                  <User className="w-4 h-4" />
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {isAccountDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsAccountDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50">
                      <p className="text-sm font-bold text-gray-900">{settings.profile.name}</p>
                      <p className="text-xs text-gray-500 truncate">{settings.profile.role}</p>
                    </div>
                    <button
                      onClick={() => { setIsSettingsModalOpen(true); setIsAccountDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-400" /> Settings
                    </button>
                    <div className="h-px bg-gray-50 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100/80 p-1 rounded-xl mb-8 w-full sm:w-auto inline-flex overflow-x-auto">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'home' ? 'bg-white text-teal-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
          >
            <Layout className="w-4 h-4" /> Home
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'inventory' ? 'bg-white text-teal-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
          >
            <Package className="w-4 h-4" /> Inventory
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'appointments' ? 'bg-white text-teal-700 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
          >
            <Calendar className="w-4 h-4" /> Inbox
          </button>
        </div>

        {activeTab === 'home' ? (
          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                Public Profile
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Display Name</label>
                  <input
                    type="text"
                    className="w-full p-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    value={settings.profile.name}
                    onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, name: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Job Title</label>
                  <input
                    type="text"
                    className="w-full p-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    value={settings.profile.role}
                    onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, role: e.target.value } })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Bio / Tagline</label>
                  <input
                    type="text"
                    className="w-full p-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    value={settings.profile.bio}
                    onChange={(e) => setSettings({ ...settings, profile: { ...settings.profile, bio: e.target.value } })}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Profile Image</label>
                  <div className="flex gap-4 items-center mt-2">
                    {settings.profile.image && (
                      <img
                        src={settings.profile.image instanceof File ? URL.createObjectURL(settings.profile.image) : settings.profile.image}
                        className="w-20 h-20 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                        alt="Profile Preview"
                      />
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/jpeg, image/jpg"
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-colors cursor-pointer"
                        onChange={handleProfileImageChange}
                      />
                      <p className="text-[10px] text-gray-400 mt-2">Upload JPG/JPEG. Automatically converts to WebP.</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                  <input
                    type="text"
                    className="w-full p-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    value={settings.profile.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setSettings({ ...settings, profile: { ...settings.profile, phone: value } });
                    }}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp Number</label>
                  <input
                    type="text"
                    className="w-full p-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    value={settings.profile.whatsapp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setSettings({ ...settings, profile: { ...settings.profile, whatsapp: value } });
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-teal-600" />
                  Links
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingResource(null);
                    setIsResourceModalOpen(true);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Resource
                </button>
              </div>
              <div className="space-y-3">
                {settings.resources?.map((res, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
                        {res.type === 'link' && <LinkIcon className="w-5 h-5" />}
                        {res.type === 'pdf' && <FileText className="w-5 h-5" />}
                        {res.type === 'map' && <MapPin className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-gray-900 text-sm">{res.title}</div>
                        <div className="text-xs text-gray-500">{res.subtitle}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingResource({ ...res, index: idx });
                          setIsResourceModalOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeResource(idx)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {(!settings.resources || settings.resources.length === 0) && (
                  <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    No resources added yet
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Section */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                  Social Media
                </h3>
                <div className="flex items-center gap-2">
                  <select
                    id="socialTypeSelect"
                    className="text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="facebook">Facebook</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="twitter">Twitter</option>
                    <option value="youtube">YouTube</option>
                    <option value="website">Website</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const type = document.getElementById('socialTypeSelect').value;
                      setSettings({
                        ...settings,
                        socials: [...(settings.socials || []), { type, url: '', enabled: true }]
                      });
                    }}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                {settings.socials && settings.socials.length > 0 ? (
                  settings.socials.map((social, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
                        <input
                          type="checkbox"
                          checked={social.enabled}
                          onChange={(e) => {
                            const newSocials = [...settings.socials];
                            newSocials[idx].enabled = e.target.checked;
                            setSettings({ ...settings, socials: newSocials });
                          }}
                          className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500 flex-shrink-0"
                        />
                        <span className="font-medium text-gray-700 capitalize w-20 sm:w-24 flex-shrink-0">{social.type}</span>
                        <input
                          type="text"
                          placeholder={`${social.type} URL`}
                          value={social.url}
                          onChange={(e) => {
                            const newSocials = [...settings.socials];
                            newSocials[idx].url = e.target.value;
                            setSettings({ ...settings, socials: newSocials });
                          }}
                          className="flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-sm min-w-0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newSocials = settings.socials.filter((_, i) => i !== idx);
                          setSettings({ ...settings, socials: newSocials });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-center flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    No social media profiles added yet
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Widget Section */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Appointment Widget
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Widget Title</label>
                  <input
                    type="text"
                    className="w-full p-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    value={settings.testDrive?.title || ''}
                    onChange={(e) => setSettings({ ...settings, testDrive: { ...settings.testDrive, title: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Widget Description</label>
                  <textarea
                    className="w-full p-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                    rows="3"
                    value={settings.testDrive?.subtitle || ''}
                    onChange={(e) => setSettings({ ...settings, testDrive: { ...settings.testDrive, subtitle: e.target.value } })}
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={uploading}
                className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Save className="w-4 h-4" />
                {uploading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : activeTab === 'appointments' ? (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-6 h-6 text-[#0095A8]" />
                <h2 className="text-xl font-bold text-gray-800">Inbox</h2>
              </div>

              {appointments.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <p>No appointment requests yet.</p>
                </div>
              ) : (
                <div>
                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Client</th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Interest</th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="text-right py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {appointments.map((apt) => (
                            <tr key={apt.id} className="group hover:bg-gray-50 transition-colors">
                              <td className="py-4 px-4">
                                <div className="font-bold text-gray-900">{apt.name}</div>
                                <div className="text-xs text-gray-500">{apt.formName || 'General Inquiry'}</div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-sm text-gray-600">{apt.phone}</div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                  {apt.model || 'N/A'}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="text-sm text-gray-500">
                                  {apt.date ? new Date(apt.date).toLocaleDateString() : 'N/A'}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <a
                                  href={`https://wa.me/${apt.phone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Mobile Card View */}
                  <div className="grid grid-cols-1 gap-4 sm:hidden">
                    {appointments.map((apt) => (
                      <div key={apt.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-bold text-gray-900">
                              {new Date(apt.date).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(apt.date).toLocaleTimeString()}
                            </div>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            New
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Contact</label>
                            <div className="font-bold text-gray-900">{apt.name}</div>
                            <div className="text-sm text-gray-500 font-mono">{apt.phone}</div>
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase">Details</label>
                            <div className="font-bold text-teal-600 text-xs uppercase tracking-wide mb-1">{apt.formName || 'Appointment Request'}</div>
                            <div className="text-sm text-gray-900 font-medium">Model: {apt.model}</div>
                            {apt.message && (
                              <div className="mt-1 text-xs text-gray-500 italic bg-white p-2 rounded border border-gray-100">
                                "{apt.message}"
                              </div>
                            )}
                          </div>
                        </div>

                        {/* WhatsApp Action Button */}
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <a
                            href={`https://wa.me/${apt.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors font-medium text-sm"
                          >
                            <MessageSquare className="w-4 h-4" />
                            Contact via WhatsApp
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        ) : (
          // Inventory Tab
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                <i className="fas fa-car text-[#0095A8] mr-2"></i> Inventory
              </h2>
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border hidden sm:inline">Changes reflect in drawer & AI</span>
                <button type="button" onClick={handleAddNew} className="text-xs bg-[#0095A8] hover:bg-teal-700 text-white font-bold py-2 px-3 rounded-lg transition-colors shadow-sm flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Vehicle
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading inventory...</div>
            ) : cars.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p>No vehicles in inventory. Click "Add Vehicle" to start.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {cars.map(car => (
                  <div key={car.id} className="section-card relative group transition-all hover:shadow-md bg-white p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg bg-gray-100 p-2 rounded inline-block">
                        ID: <span className="text-[#0095A8] uppercase text-sm">{car.name}</span>
                      </h3>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(car)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-md transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(car.id)} className="text-red-400 hover:text-white hover:bg-red-500 p-2 rounded-md transition-colors" title="Remove Vehicle">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left Col: Basic Info */}
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <img src={car.image} alt={car.name} className="w-24 h-24 object-cover rounded-lg bg-gray-200" />
                          <div>
                            <h4 className="font-bold text-gray-900">{car.name}</h4>
                            <p className="text-sm text-gray-500">{car.tagline}</p>
                            <p className="text-sm font-bold text-[#0095A8] mt-1">{car.price}</p>
                          </div>
                        </div>
                      </div>

                      {/* Right Col: Specs & Desc */}
                      <div className="space-y-3">
                        <p className="text-xs text-gray-600 line-clamp-2">{car.description}</p>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded border">
                          {car.specs && car.specs.slice(0, 4).map((spec, idx) => (
                            <div key={idx}>
                              <label className="text-[10px] font-bold text-gray-400 uppercase">{spec.label}</label>
                              <p className="text-xs font-medium">{spec.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main >

      <CarFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCar}
        initialData={editingCar}
      />

      {/* Preview Modal */}
      {
        isPreviewOpen && (
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
        )
      }
      {/* Resource Modal */}
      <ResourceFormModal
        isOpen={isResourceModalOpen}
        onClose={() => setIsResourceModalOpen(false)}
        onSave={handleSaveResource}
        initialData={editingResource}
      />
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        setSettings={setSettings}
        onSave={handleSaveSettings}
        uploading={uploading}
        handleProfileImageChange={handleProfileImageChange}
        isResourceModalOpen={isResourceModalOpen}
        setIsResourceModalOpen={setIsResourceModalOpen}
        editingResource={editingResource}
        setEditingResource={setEditingResource}
        handleSaveResource={handleSaveResource}
        removeResource={removeResource}
        themeTemplates={themeTemplates}
      />
    </div >
  );
};

export default AdminDashboard;
