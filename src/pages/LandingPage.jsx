import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import {
    Star, Car, Phone, Share2, ChevronRight, FileText, Download,
    MapPin, ExternalLink, Instagram, Facebook, Linkedin, Video,
    Sparkles, X, Bot, Send, MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import CarCard from '../components/CarCard';
import ProductDrawer from '../components/ProductDrawer';

const LandingPage = ({ previewData }) => {
    const [activeDrawer, setActiveDrawer] = useState(null);
    const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
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
                                role: "Premium Vehicle Consultant",
                                bio: "Helping you find your dream car.",
                                image: "https://ui-avatars.com/api/?name=Auto+Sales&background=0D8ABC&color=fff&size=128",
                                phone: "+1234567890",
                                whatsapp: "1234567890"
                            },
                            socials: [
                                { type: 'instagram', url: '#', enabled: true },
                                { type: 'linkedin', url: '#', enabled: true }
                            ],
                            resources: [
                                { type: 'location', title: 'Visit Showroom', subtitle: 'Find us on Google Maps', url: 'https://maps.google.com' }
                            ],
                            testDrive: {
                                title: "Book a Test Drive",
                                subtitle: "Schedule an appointment",
                                enabled: true
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

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Profile Link Copied!");
    };

    const handleWhatsApp = () => {
        if (settings?.profile?.whatsapp) {
            window.open(`https://wa.me/${settings.profile.whatsapp}?text=Hi%20I%27m%20interested%20in%20a%20car.`, '_blank');
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
                    inventoryContext,
                    customInstructions: settings.chatbot?.customInstructions || '', // Inject Custom Knowledge
                    brochureUrl: settings.brochure?.url
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

    const handleTestDriveSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const model = formData.get('model');
        const name = formData.get('name');
        const phone = formData.get('phone');

        // Phone Validation
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;
        if (!phoneRegex.test(phone)) {
            toast.error("Please enter a valid phone number.");
            return;
        }

        // Log to Firestore
        try {
            await signInAnonymously(auth);
            const docRef = await addDoc(collection(db, "appointments"), {
                model,
                name,
                phone,
                date: new Date().toISOString(),
                status: 'new',
                formName: 'Test Drive Request'
            });
            console.log("Appointment logged with ID: ", docRef.id);
        } catch (error) {
            console.error("Error logging appointment:", error);
            // Silently fail or show generic toast if needed, but don't block user flow
        }

        if (settings?.profile?.whatsapp) {
            const message = `Hello, I would like to book a test drive.\n\n*Model:* ${model}\n*Name:* ${name}\n*Phone:* ${phone}`;
            const url = `https://wa.me/${settings.profile.whatsapp}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
            toast.info("Redirecting to WhatsApp...");
        } else {
            toast.success("Request recorded! We will contact you.");
        }

        setIsTestDriveOpen(false);
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
                    <p className="text-sm font-medium uppercase tracking-wide opacity-80">{settings.profile.role}</p>
                    <p className="text-xs opacity-60 mt-1">{settings.profile.bio}</p>

                    {/* Stats: Rating & Delivered */}
                    {(settings.profile.rating || settings.profile.deliveredCount) && (
                        <div className="flex justify-center gap-4 mt-4 text-sm font-semibold">
                            {settings.profile.rating && (
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    {settings.profile.rating}/5 Rating
                                </span>
                            )}
                            {settings.profile.deliveredCount && (
                                <span className="flex items-center gap-1">
                                    <Car className="w-4 h-4" style={{ color: settings.theme?.primaryColor || '#0D9488' }} />
                                    {settings.profile.deliveredCount} Delivered
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Primary Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button onClick={handleWhatsApp} className="col-span-2 text-white py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 font-semibold transition-all transform hover:scale-[1.02]" style={{ backgroundColor: '#25D366' }}>
                        <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                    </button>
                    <a href={`tel:${settings.profile.phone}`} className="py-3 px-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 font-medium transition-colors" style={{ backgroundColor: themeStyles['--card-bg'], color: themeStyles.color }}>
                        <Phone className="w-4 h-4" style={{ color: settings.theme?.primaryColor || '#0D9488' }} /> Call Now
                    </a>
                    <button onClick={handleCopyLink} className="py-3 px-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center gap-2 font-medium transition-colors" style={{ backgroundColor: themeStyles['--card-bg'], color: themeStyles.color }}>
                        <Share2 className="w-4 h-4" style={{ color: settings.theme?.primaryColor || '#0D9488' }} /> Share
                    </button>
                </div>

                {/* Main Links List */}
                <div className="flex flex-col gap-4 relative z-10">
                    {/* Test Drive Highlight (Functional CTA) */}
                    {settings.testDrive?.enabled !== false && (
                        <button onClick={() => setIsTestDriveOpen(true)} className="btn-hover w-full p-1 rounded-xl group text-left relative overflow-hidden" style={{ backgroundColor: themeStyles['--card-bg'] }}>
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{ background: `linear-gradient(to right, ${settings.theme?.primaryColor || '#0D9488'}, transparent)` }}></div>
                            <div className="p-4 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md" style={{ backgroundColor: settings.theme?.primaryColor || '#0D9488' }}>
                                        <Car className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold" style={{ color: themeStyles.color }}>{settings.testDrive?.title || "Book a Test Drive"}</h3>
                                        <p className="text-xs opacity-60">{settings.testDrive?.subtitle || "Schedule an appointment"}</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </button>
                    )}

                    {/* Car Models */}
                    {cars.map((car) => (
                        <CarCard
                            key={car.id}
                            car={car}
                            onClick={() => setActiveDrawer(car)}
                            theme={settings.theme || {}}
                        />
                    ))}

                    {/* Resources Divider */}
                    {settings.resources && settings.resources.length > 0 && (
                        <div className="flex items-center gap-4 my-2 opacity-30">
                            <div className="h-px bg-current flex-1"></div>
                            <span className="text-xs font-bold uppercase">Resources</span>
                            <div className="h-px bg-current flex-1"></div>
                        </div>
                    )}

                    {/* Dynamic Resources */}
                    {settings.resources && settings.resources.map((res, index) => (
                        <a
                            key={index}
                            href={res.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-hover w-full p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 group"
                            style={{ backgroundColor: themeStyles['--card-bg'], color: themeStyles.color }}
                        >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center transition-colors group-hover:text-white" style={{ backgroundColor: 'rgba(0,0,0,0.05)', color: 'inherit' }}>
                                {res.type === 'pdf' ? <FileText className="w-5 h-5" /> :
                                    res.type === 'location' ? <MapPin className="w-5 h-5" /> :
                                        <ExternalLink className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 text-left">
                                <h3 className="font-medium">{res.title}</h3>
                                <p className="text-xs opacity-60">{res.subtitle}</p>
                            </div>
                            {res.type === 'pdf' ? <Download className="w-5 h-5 opacity-30" /> : <ExternalLink className="w-5 h-5 opacity-30" />}
                        </a>
                    ))}
                </div>

                {/* Footer */}
                <footer className="mt-12 text-center pb-4">
                    <div className="flex justify-center gap-6 mb-6">
                        {settings.socials && settings.socials.filter(s => s.enabled !== false).map((social, index) => (
                            <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="opacity-40 hover:opacity-100 transition-opacity" title={social.type}>
                                {social.type === 'instagram' && <Instagram className="w-6 h-6" />}
                                {social.type === 'facebook' && <Facebook className="w-6 h-6" />}
                                {social.type === 'linkedin' && <Linkedin className="w-6 h-6" />}
                                {social.type === 'website' && <ExternalLink className="w-6 h-6" />}
                                {/* Fallback for others */}
                                {['tiktok', 'twitter', 'youtube'].includes(social.type) && <Share2 className="w-6 h-6" />}
                            </a>
                        ))}
                    </div>
                    <p className="text-xs opacity-40">© 2024 {settings.profile.name}. All rights reserved.</p>
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
                                <select name="model" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-teal-500">
                                    {cars.map(car => <option key={car.id}>{car.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Your Name</label>
                                <input name="name" type="text" required placeholder="John Doe" className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone / WhatsApp</label>
                                <input name="phone" type="tel" required placeholder="+1 234..." className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500" />
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
                                    <div className={`p-3 rounded-2xl shadow-sm max-w-[85%] text-sm ${msg.role === 'ai' ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-none prose prose-sm max-w-none' : 'bg-indigo-600 text-white rounded-tr-none'}`} style={msg.role === 'user' ? { backgroundColor: settings.theme.primaryColor } : {}}>
                                        {msg.role === 'ai' ? (
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                                                    ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
                                                    h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                                                    h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-sm font-bold mb-1" {...props} />,
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        ) : (
                                            <p>{msg.text}</p>
                                        )}
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


        </div>
    );
};

export default LandingPage;
