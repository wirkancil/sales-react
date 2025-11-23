import React, { useState, useEffect, useRef } from 'react';
import {
    Star, Car, Phone, Share2, ChevronRight, FileText, Download,
    MapPin, ExternalLink, Instagram, Facebook, Linkedin, Video,
    Sparkles, X, Bot, Send, MessageCircle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import CarCard from '../components/CarCard';
import ProductDrawer from '../components/ProductDrawer';

const LandingPage = ({ previewData }) => {
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '' });
    const chatEndRef = useRef(null);

    // Data State
    const [cars, setCars] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Load Settings (or use preview data)
                if (previewData) {
                    setSettings(previewData);
                } else {
                    const settingsSnap = await getDoc(doc(db, "settings", "landingPage"));
                    if (settingsSnap.exists()) {
                        setSettings(settingsSnap.data());
                    } else {
                        // Fallback default settings if nothing in DB yet
                        setSettings({
                            profile: {
                                name: "Generic Auto Sales",
                                title: "Premium Vehicle Consultant",
                                description: "Helping you find your dream car.",
                                image: "https://ui-avatars.com/api/?name=Auto+Sales&background=0D8ABC&color=fff&size=128"
                            },
                            hero: {
                                headline: "Drive the Future",
                                subheadline: "Experience premium electric performance.",
                                ctaText: "Book a Test Drive"
                            },
                            contact: {
                                phone: "+1234567890",
                                whatsapp: "1234567890",
                                location: "https://maps.google.com",
                                social: { instagram: "#", linkedin: "#" }
                            },
                            theme: {
                                primaryColor: "#0D9488",
                                backgroundColor: "#111827",
                                textColor: "#F9FAFB",
                                cardColor: "#1F2937"
                            },
                            enableChatbot: true
                        });
                    }
                }

                // 2. Load Cars
                const carsSnap = await getDocs(collection(db, "cars"));
                const carList = carsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCars(carList);

            } catch (error) {
                console.error("Error loading landing page data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [previewData]);

    // Initialize Chat
    useEffect(() => {
        if (settings?.profile?.name) {
            setChatMessages([
                { role: 'ai', text: `Hi! 👋 I'm ${settings.profile.name}'s digital assistant. How can I help you?` }
            ]);
        }
    }, [settings]);

    // Scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages, isTyping]);

    // Update browser title dynamically
    useEffect(() => {
        if (settings?.profile?.name) {
            document.title = settings.profile.name;
        }
    }, [settings]);

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        showToast("Profile Link Copied!");
    };

    const handleWhatsApp = () => {
        if (settings?.contact?.whatsapp) {
            window.open(`https://wa.me/${settings.contact.whatsapp}?text=Hi%20I%27m%20interested%20in%20a%20car.`, '_blank');
        }
    };

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const userMsg = chatInput.trim();
        setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setChatInput('');
        setIsTyping(true);

        try {
            const apiUrl = import.meta.env.VITE_CHATBOT_API_URL || "http://localhost:3000/api/chat";

            // Build Context
            const inventoryContext = cars.map(c =>
                `- ${c.name}: ${c.tagline}, Price: ${c.price}. Specs: ${c.specs.map(s => `${s.label}: ${s.value}`).join(', ')}`
            ).join('\n');

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMsg,
                    inventoryContext: inventoryContext,
                    customInstructions: settings.customInstructions,
                    brochureUrl: settings.profile?.brochureUrl || null
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            setChatMessages(prev => [...prev, { role: 'ai', text: data.response }]);

        } catch (error) {
            console.error("Chatbot Error:", error);
            setChatMessages(prev => [...prev, {
                role: 'ai',
                text: "Maaf, sistem sedang sibuk. Silakan coba lagi nanti atau hubungi kami via WhatsApp."
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleTestDriveSubmit = (e) => {
        e.preventDefault();
        setIsTestDriveOpen(false);
        showToast("Request Sent! We'll be in touch.");
    };

    if (loading || !settings) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">Loading...</div>;
    }

    // Dynamic Styles
    const themeStyles = {
        backgroundColor: settings.theme.backgroundColor,
        color: settings.theme.textColor || (settings.theme.backgroundColor === '#111827' ? '#F9FAFB' : '#111827'),
        '--primary-color': settings.theme.primaryColor,
        '--card-bg': settings.theme.cardColor || (settings.theme.backgroundColor === '#111827' ? '#1F2937' : '#FFFFFF'),
    };

    return (
        <div style={themeStyles} className="min-h-screen flex flex-col items-center justify-center py-8 px-4 relative overflow-x-hidden transition-colors duration-300">
            {/* Background Decorative Elements */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div style={{ backgroundColor: settings.theme.primaryColor }} className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div style={{ backgroundColor: settings.theme.primaryColor }} className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>

            <main className="w-full max-w-md mx-auto">
                {/* Header / Profile */}
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <img
                            src={settings.profile.image}
                            alt="Profile"
                            className="w-28 h-28 rounded-full border-4 border-white shadow-xl mx-auto object-cover"
                            onError={(e) => e.target.src = 'https://ui-avatars.com/api/?name=Auto+Sales&background=0D8ABC&color=fff&size=128'}
                        />
                        <div className="absolute bottom-0 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-50" title="Online"></div>
                    </div>

                    <h1 className="text-2xl font-bold mt-4" style={{ color: themeStyles.color }}>{settings.profile.name}</h1>
                    <p className="text-sm font-medium uppercase tracking-wide opacity-80">{settings.profile.title}</p>
                    <p className="text-xs opacity-60 mt-1">{settings.profile.description}</p>

                    {/* Social Stats */}
                    <div className="flex justify-center gap-4 mt-4 text-sm opacity-70">
                        <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {settings.stats?.rating || "4.9/5"} {settings.stats?.ratingLabel || "Rating"}</span>
                        <span className="flex items-center gap-1"><Car className="w-4 h-4" style={{ color: settings.theme.primaryColor }} /> {cars.length} {settings.stats?.inventoryLabel || "Cars Available"}</span>
                    </div>
                </div>

                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button onClick={handleWhatsApp} className="col-span-2 text-white py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 font-semibold transition-all transform hover:scale-[1.02]" style={{ backgroundColor: '#25D366' }}>
                        <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                    </button>
                    <a href={`tel:${settings.contact.phone}`} className="py-3 px-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 font-medium transition-colors" style={{ backgroundColor: themeStyles['--card-bg'], color: themeStyles.color }}>
                        <Phone className="w-4 h-4" style={{ color: settings.theme.primaryColor }} /> Call Now
                    </a>
                    <button onClick={handleCopyLink} className="py-3 px-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 font-medium transition-colors" style={{ backgroundColor: themeStyles['--card-bg'], color: themeStyles.color }}>
                        <Share2 className="w-4 h-4" style={{ color: settings.theme.primaryColor }} /> Share
                    </button>
                </div>

                {/* Main Links List */}
                <div className="flex flex-col gap-4 relative z-10">
                    {/* Test Drive Highlight */}
                    <button onClick={() => setIsTestDriveOpen(true)} className="btn-hover w-full p-1 rounded-xl group text-left relative overflow-hidden" style={{ backgroundColor: themeStyles['--card-bg'] }}>
                        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: `linear-gradient(to right, ${settings.theme.primaryColor}, transparent)` }}></div>
                        <div className="p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md" style={{ backgroundColor: settings.theme.primaryColor }}>
                                    <Car className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold" style={{ color: themeStyles.color }}>{settings.hero.ctaText}</h3>
                                    <p className="text-xs opacity-60">{settings.hero.subheadline}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>

                    {/* Car Models */}
                    {cars.map((car) => (
                        <CarCard
                            key={car.id}
                            car={car}
                            onClick={() => setActiveDrawer(car)}
                            theme={settings.theme}
                        />
                    ))}

                    {/* Resources Divider */}
                    <div className="flex items-center gap-4 my-2 opacity-30">
                        <div className="h-px bg-current flex-1"></div>
                        <span className="text-xs font-bold uppercase">Resources</span>
                        <div className="h-px bg-current flex-1"></div>
                    </div>

                    {/* Brochure */}
                    <a
                        href={settings.hero.brochureUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn-hover w-full p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 group ${!settings.hero.brochureUrl ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ backgroundColor: themeStyles['--card-bg'], color: themeStyles.color }}
                        onClick={(e) => !settings.hero.brochureUrl && e.preventDefault()}
                    >
                        <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors group-hover:text-white" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'inherit' }}>
                            <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                            <h3 className="font-medium">Download E-Brochures</h3>
                            <p className="text-xs opacity-60">Specs & Pricing Lists</p>
                        </div>
                        <Download className="w-5 h-5 opacity-30" />
                    </a>

                    {/* Location */}
                    <a href={settings.contact.location || "https://maps.google.com"} target="_blank" className="btn-hover w-full p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 group" style={{ backgroundColor: themeStyles['--card-bg'], color: themeStyles.color }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors group-hover:text-white" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'inherit' }}>
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-medium">Visit Showroom</h3>
                            <p className="text-xs opacity-60">Find us on Google Maps</p>
                        </div>
                        <ExternalLink className="w-5 h-5 opacity-30" />
                    </a>
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center pb-4">
                    <div className="flex justify-center gap-6 mb-6">
                        {settings.contact.social.instagram && <a href={settings.contact.social.instagram} className="opacity-40 hover:opacity-100 transition-opacity"><Instagram className="w-6 h-6" /></a>}
                        {settings.contact.social.linkedin && <a href={settings.contact.social.linkedin} className="opacity-40 hover:opacity-100 transition-opacity"><Linkedin className="w-6 h-6" /></a>}
                    </div>
                    <p className="text-xs opacity-40">© 2024 Smart Generic Auto with Gemini. All rights reserved.</p>
                </footer>
            </main>

            {/* AI FAB */}
            {settings.enableChatbot && (
                <button onClick={() => setIsChatOpen(true)} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform group" style={{ backgroundColor: settings.theme.primaryColor }}>
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse shadow-sm border border-white">NEW</span>
                </button>
            )}

            {/* Test Drive Modal */}
            {/* Test Drive Modal */}
            {isTestDriveOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsTestDriveOpen(false)}></div>
                    <div className="relative w-full sm:w-96 bg-white rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{settings.testDrive?.title || "Book Test Drive"}</h2>
                            <button onClick={() => setIsTestDriveOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleTestDriveSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Select Model</label>
                                <select className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-teal-500">
                                    {cars.map(car => <option key={car.id}>{car.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Your Name</label>
                                <input type="text" required placeholder="John Doe" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone / WhatsApp</label>
                                <input type="tel" required placeholder="+1 234..." className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500" />
                            </div>
                            <button type="submit" className="mt-2 w-full text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity" style={{ backgroundColor: settings.theme.primaryColor }}>Request Appointment</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Product Drawer */}
            <ProductDrawer
                car={activeDrawer}
                onClose={() => setActiveDrawer(null)}
                onInterested={() => { setActiveDrawer(null); setTimeout(() => setIsTestDriveOpen(true), 300); }}
                theme={settings.theme}
            />

            {/* AI Chat Modal */}
            {settings.enableChatbot && isChatOpen && (
                <div className="fixed z-[60] inset-0 sm:inset-auto sm:bottom-6 sm:right-6 flex items-end sm:items-auto">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm sm:hidden" onClick={() => setIsChatOpen(false)}></div>
                    <div className="relative w-full sm:w-[380px] h-[85vh] sm:h-[550px] bg-gray-50 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100/50 animate-in slide-in-from-bottom duration-300">
                        {/* Chat Header */}
                        <div className="p-4 flex items-center justify-between shrink-0 cursor-pointer" style={{ backgroundColor: settings.theme.primaryColor }} onClick={() => setIsChatOpen(false)}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">Smart Assistant</h3>
                                    <p className="text-xs text-blue-100 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Online</p>
                                </div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setIsChatOpen(false); }} className="text-white/80 hover:text-white transition-colors">
                                <ChevronRight className="w-6 h-6 rotate-90" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50">
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex items-start gap-2.5 chat-bubble ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${msg.role === 'ai' ? 'text-white' : 'bg-gray-200 text-gray-600'}`} style={msg.role === 'ai' ? { backgroundColor: settings.theme.primaryColor } : {}}>
                                        {msg.role === 'ai' ? 'AI' : <span className="font-bold">U</span>}
                                    </div>
                                    <div className={`p-3 rounded-2xl shadow-sm max-w-[85%] text-sm ${msg.role === 'ai' ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`} style={msg.role === 'user' ? { backgroundColor: settings.theme.primaryColor } : {}}>
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-start gap-2.5 chat-bubble">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs shrink-0" style={{ backgroundColor: settings.theme.primaryColor }}>AI</div>
                                    <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="p-3 pb-8 sm:pb-3 bg-white border-t border-gray-200 shrink-0">
                            <form onSubmit={handleChatSubmit} className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="Ask about range..."
                                    className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-3 focus:outline-none focus:ring-2 border-none"
                                    style={{ '--tw-ring-color': settings.theme.primaryColor }}
                                />
                                <button type="submit" className="w-12 h-12 rounded-full text-white flex items-center justify-center hover:shadow-lg transition-shadow shrink-0" style={{ backgroundColor: settings.theme.primaryColor }}>
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                            <p className="text-[10px] text-center text-gray-400 mt-2">Powered by Gemini AI ✨</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast */}
            {toast.show && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg z-[60] flex items-center gap-2 animate-in slide-in-from-top duration-300">
                    <Sparkles className="w-4 h-4 text-green-400" />
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
