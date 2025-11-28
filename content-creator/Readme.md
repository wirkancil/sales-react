<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex Creator | Rate Card & Links</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">

    <!-- Markdown Parser for AI response -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background-color: #050505;
            color: #ffffff;
            background-image: 
                radial-gradient(at 0% 0%, rgba(124, 58, 237, 0.15) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%);
            background-attachment: fixed;
        }

        /* Glassmorphism Card Style */
        .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Gradient Text */
        .text-gradient {
            background: linear-gradient(to right, #c084fc, #f472b6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        /* Custom Button Hover Animation */
        .link-btn {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .link-btn:hover {
            transform: translateY(-2px);
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        /* The Special Rate Card Button */
        .rate-card-btn {
            background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%);
            border: 1px solid rgba(167, 139, 250, 0.3);
            position: relative;
            overflow: hidden;
        }
        .rate-card-btn::before {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
            transition: 0.5s;
        }
        .rate-card-btn:hover::before {
            left: 100%;
        }

        /* AI Feature Button */
        .ai-btn {
            background: linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
            border: 1px solid rgba(56, 189, 248, 0.3);
        }
        .ai-btn:hover {
            background: linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%);
            box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
        }

        /* Modal Animation */
        .modal {
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease-in-out;
        }
        .modal.active {
            opacity: 1;
            visibility: visible;
        }
        .modal-content {
            transform: scale(0.95);
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .modal.active .modal-content {
            transform: scale(1);
        }
        
        /* Bottom Sheet behavior for Portfolio on Mobile */
        @media (max-width: 640px) {
            .sheet-modal .modal-content {
                transform: translateY(100%);
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
                margin-bottom: 0;
            }
            .sheet-modal.active .modal-content {
                transform: translateY(0);
            }
            .sheet-modal {
                align-items: flex-end; /* Align to bottom */
            }
        }

        /* Avatar Glow */
        .avatar-glow {
            box-shadow: 0 0 30px rgba(192, 132, 252, 0.3);
        }

        /* Hide Scrollbar but allow scrolling */
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        /* Markdown Styles for AI Response */
        .prose-invert p { margin-bottom: 0.5em; }
        .prose-invert strong { color: #38bdf8; }
        
        /* Video Container Aspect Ratio */
        .aspect-video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 */
            height: 0;
            overflow: hidden;
        }
        .aspect-video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body class="min-h-screen flex justify-center items-start pt-8 pb-12 px-4">

    <!-- Main Container -->
    <main class="w-full max-w-[420px] flex flex-col items-center gap-6 relative z-10">
        
        <!-- Share Button (Top Right) -->
        <button onclick="shareProfile()" class="absolute top-0 right-2 text-gray-400 hover:text-white transition-colors p-2 rounded-full glass-card">
            <i class="fa-solid fa-share-nodes"></i>
        </button>

        <!-- Profile Header -->
        <div class="flex flex-col items-center text-center w-full">
            <div class="relative mb-4 group">
                <div class="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop" 
                    alt="Profile" 
                    class="w-28 h-28 rounded-full object-cover border-2 border-white/10 relative z-10 avatar-glow"
                >
                <!-- Online Status Dot -->
                <div class="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-[#050505] z-20"></div>
            </div>
            
            <h1 class="text-2xl font-bold flex items-center gap-2 mb-1">
                Alex Creator 
                <i class="fa-solid fa-circle-check text-blue-400 text-base" title="Verified Creator"></i>
            </h1>
            <p class="text-gray-400 text-sm px-6 leading-relaxed mb-4">
                Lifestyle & Tech Creator 📸<br>
                Helping brands tell better stories. Based in Jakarta.
            </p>

            <!-- Social Row -->
            <div class="flex gap-4 mb-2">
                <a href="#" class="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <i class="fa-brands fa-instagram text-xl"></i>
                </a>
                <a href="#" class="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <i class="fa-brands fa-tiktok text-xl"></i>
                </a>
                <a href="#" class="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <i class="fa-brands fa-youtube text-xl"></i>
                </a>
                <a href="mailto:hello@alexcreator.com" class="w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                    <i class="fa-solid fa-envelope text-lg"></i>
                </a>
            </div>
        </div>

        <!-- Links Section -->
        <div class="w-full flex flex-col gap-3">
            
            <!-- NEW: AI Feature Button -->
            <button onclick="openAiModal()" class="group w-full p-4 rounded-xl flex items-center justify-between text-left ai-btn link-btn relative overflow-hidden">
                <div class="absolute top-0 right-0 p-2 opacity-10 text-6xl text-blue-400 transform rotate-12 translate-x-2 -translate-y-2 pointer-events-none">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div class="flex items-center gap-4 relative z-10">
                    <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 shadow-lg group-hover:scale-110 transition-transform border border-blue-500/30">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-white group-hover:text-blue-200 transition-colors">AI Pitch Generator ✨</h3>
                        <p class="text-xs text-blue-200/70">Draft a collab proposal instantly</p>
                    </div>
                </div>
                <div class="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full relative z-10">NEW</div>
            </button>

            <!-- Gated Rate Card Link -->
            <button onclick="openModal()" class="group w-full p-4 rounded-xl flex items-center justify-between text-left rate-card-btn link-btn">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <i class="fa-solid fa-file-invoice-dollar text-lg"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-white group-hover:text-purple-200 transition-colors">Download Rate Card 2025</h3>
                        <p class="text-xs text-purple-200/70">Updated Jan 2025 • PDF</p>
                    </div>
                </div>
                <div class="text-purple-300 bg-purple-500/10 px-2 py-1 rounded-md text-xs font-medium border border-purple-500/20 flex items-center gap-1">
                    <i class="fa-solid fa-lock text-[10px]"></i> Locked
                </div>
            </button>

            <!-- UPDATED: Portfolio Button triggers Modal -->
            <button onclick="openPortfolioModal()" class="group w-full p-4 rounded-xl glass-card flex items-center justify-between text-left link-btn">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-300 group-hover:text-white group-hover:bg-gray-700 transition-colors">
                        <i class="fa-solid fa-briefcase"></i>
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-200 group-hover:text-white">View Portfolio / Media Kit</h3>
                        <p class="text-xs text-gray-500">Showcase, Videos & Assets</p>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-right text-gray-600 group-hover:text-gray-400 text-sm"></i>
            </button>

            <!-- Standard Link -->
            <a href="#" class="group w-full p-4 rounded-xl glass-card flex items-center justify-between text-left link-btn">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-green-400 group-hover:text-green-300 group-hover:bg-gray-700 transition-colors">
                        <i class="fa-brands fa-whatsapp text-xl"></i>
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-200 group-hover:text-white">Business Inquiries</h3>
                        <p class="text-xs text-gray-500">Direct WhatsApp chat</p>
                    </div>
                </div>
                <i class="fa-solid fa-arrow-up-right-from-square text-gray-600 group-hover:text-gray-400 text-sm"></i>
            </a>

            <!-- Standard Link -->
            <a href="#" class="group w-full p-4 rounded-xl glass-card flex items-center justify-between text-left link-btn">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-blue-400 group-hover:text-blue-300 group-hover:bg-gray-700 transition-colors">
                        <i class="fa-solid fa-camera"></i>
                    </div>
                    <div>
                        <h3 class="font-medium text-gray-200 group-hover:text-white">My Gear List</h3>
                        <p class="text-xs text-gray-500">Cameras, lights & setup</p>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-right text-gray-600 group-hover:text-gray-400 text-sm"></i>
            </a>

        </div>

        <footer class="mt-8 text-center text-xs text-gray-600">
            <p>© 2025 Alex Creator Management.</p>
            <p class="mt-1">Design by <span class="text-gray-500">Gemini</span></p>
        </footer>
    </main>

    <!-- RATE CARD MODAL -->
    <div id="leadModal" class="modal fixed inset-0 z-50 flex items-center justify-center px-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeModal()"></div>
        
        <!-- Modal Card -->
        <div class="modal-content relative bg-[#121212] border border-gray-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <!-- Header -->
            <div class="p-6 pb-2 text-center relative">
                <button onclick="closeModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto flex items-center justify-center text-white mb-3 shadow-lg shadow-purple-500/30">
                    <i class="fa-solid fa-lock-open"></i>
                </div>
                <h2 class="text-xl font-bold text-white mb-1">Unlock Rate Card</h2>
                <p class="text-sm text-gray-400">Enter your details to download the PDF.</p>
            </div>

            <!-- Form -->
            <div class="p-6 pt-2 overflow-y-auto no-scrollbar">
                <form id="rateCardForm" onsubmit="handleDownload(event)" class="flex flex-col gap-4">
                    
                    <div>
                        <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Brand / Name</label>
                        <div class="relative">
                            <i class="fa-solid fa-user absolute left-3 top-3.5 text-gray-500 text-sm"></i>
                            <input type="text" required class="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600" placeholder="Your Name or Brand">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                        <div class="relative">
                            <i class="fa-solid fa-envelope absolute left-3 top-3.5 text-gray-500 text-sm"></i>
                            <input type="email" required class="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600" placeholder="name@company.com">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">WhatsApp / Phone</label>
                        <div class="relative">
                            <i class="fa-brands fa-whatsapp absolute left-3 top-3.5 text-gray-500 text-sm"></i>
                            <input type="tel" required class="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600" placeholder="+62 812 3456 7890">
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" id="submitBtn" class="mt-2 w-full bg-white text-black font-bold py-3.5 rounded-lg hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <span>Download Now</span>
                        <i class="fa-solid fa-download"></i>
                    </button>

                    <p class="text-[10px] text-center text-gray-600 leading-tight">
                        By downloading, you agree to be contacted regarding potential collaborations. Your data is secure.
                    </p>
                </form>
            </div>
        </div>
    </div>

    <!-- AI PITCH GENERATOR MODAL -->
    <div id="aiModal" class="modal fixed inset-0 z-50 flex items-center justify-center px-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeAiModal()"></div>
        
        <!-- Modal Card -->
        <div class="modal-content relative bg-[#121212] border border-gray-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <!-- Header -->
            <div class="p-6 pb-2 text-center relative">
                <button onclick="closeAiModal()" class="absolute top-4 right-4 text-gray-500 hover:text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 mx-auto flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/30">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <h2 class="text-xl font-bold text-white mb-1">AI Pitch Helper ✨</h2>
                <p class="text-sm text-gray-400">Generate a collaboration proposal instantly.</p>
            </div>

            <!-- Form & Result -->
            <div class="p-6 pt-2 overflow-y-auto no-scrollbar">
                
                <!-- Input State -->
                <div id="aiInputSection">
                    <div class="flex flex-col gap-4">
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Brand Name</label>
                            <input type="text" id="brandName" class="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" placeholder="e.g. Nike, MyLocalCoffee">
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Campaign Idea / Product</label>
                            <textarea id="campaignIdea" rows="3" class="w-full bg-[#1c1c1c] border border-gray-700 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-all resize-none" placeholder="e.g. Promoting our new summer sneaker line. We want a Reel transition video."></textarea>
                        </div>
                        <div>
                            <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Tone</label>
                            <div class="grid grid-cols-3 gap-2">
                                <button onclick="selectTone(this, 'Professional')" class="tone-btn bg-[#1c1c1c] border border-gray-700 text-gray-300 py-2 rounded-md text-xs font-medium hover:bg-gray-800 focus:ring-2 ring-blue-500">Professional</button>
                                <button onclick="selectTone(this, 'Excited')" class="tone-btn bg-[#1c1c1c] border border-gray-700 text-gray-300 py-2 rounded-md text-xs font-medium hover:bg-gray-800 focus:ring-2 ring-blue-500 selected-tone ring-2 border-blue-500 text-white">Excited</button>
                                <button onclick="selectTone(this, 'Casual')" class="tone-btn bg-[#1c1c1c] border border-gray-700 text-gray-300 py-2 rounded-md text-xs font-medium hover:bg-gray-800 focus:ring-2 ring-blue-500">Casual</button>
                            </div>
                        </div>

                        <button onclick="generatePitch()" id="generateBtn" class="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3.5 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                            <span>Generate Magic Pitch</span>
                            <i class="fa-solid fa-wand-sparkles"></i>
                        </button>
                    </div>
                </div>

                <!-- Loading State -->
                <div id="aiLoadingSection" class="hidden flex-col items-center justify-center py-8">
                    <i class="fa-solid fa-circle-notch fa-spin text-3xl text-blue-500 mb-4"></i>
                    <p class="text-sm text-gray-400 animate-pulse">Consulting the AI muse...</p>
                </div>

                <!-- Result State -->
                <div id="aiResultSection" class="hidden flex-col gap-4">
                    <div class="bg-[#1c1c1c] border border-gray-700 rounded-lg p-4 relative">
                        <div class="absolute -top-3 left-4 bg-gray-800 text-[10px] px-2 py-0.5 rounded text-blue-400 border border-gray-700">AI Draft</div>
                        <div id="aiOutput" class="text-sm text-gray-300 leading-relaxed prose-invert whitespace-pre-wrap"></div>
                    </div>
                    
                    <div class="flex gap-2">
                        <button onclick="copyToClipboard()" class="flex-1 bg-gray-800 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
                            <i class="fa-regular fa-copy mr-1"></i> Copy
                        </button>
                        <a id="whatsappLink" href="#" target="_blank" class="flex-[2] bg-[#25D366] text-white py-3 rounded-lg text-sm font-bold hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2">
                            <i class="fa-brands fa-whatsapp text-lg"></i> Send to Alex
                        </a>
                    </div>
                    <button onclick="resetAiModal()" class="text-xs text-gray-500 hover:text-gray-300 underline mt-2 text-center">Start Over</button>
                </div>

            </div>
        </div>
    </div>

    <!-- NEW: PORTFOLIO SHEET/MODAL -->
    <div id="portfolioModal" class="modal sheet-modal fixed inset-0 z-50 flex justify-center px-0 sm:px-4 sm:items-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/85 backdrop-blur-md" onclick="closePortfolioModal()"></div>
        
        <!-- Sheet Content -->
        <div class="modal-content relative bg-[#0f0f0f] border-t sm:border border-gray-800 w-full max-w-[500px] h-[85vh] sm:h-auto sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            <!-- Handle for mobile visual cue -->
            <div class="w-full flex justify-center pt-3 pb-1 sm:hidden">
                <div class="w-12 h-1.5 bg-gray-700 rounded-full"></div>
            </div>

            <!-- Sticky Header -->
            <div class="px-6 py-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#0f0f0f] z-20">
                <h2 class="text-lg font-bold text-white flex items-center gap-2">
                    <i class="fa-solid fa-briefcase text-gray-400"></i> Media Kit
                </h2>
                <button onclick="closePortfolioModal()" class="w-8 h-8 rounded-full bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto p-5 space-y-8 no-scrollbar pb-10">
                
                <!-- Section 1: Showreel -->
                <div>
                    <h3 class="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3">Showreel Highlight</h3>
                    <div class="w-full rounded-xl overflow-hidden border border-gray-800 shadow-lg bg-gray-900 aspect-video-container">
                        <!-- Placeholder Video Embed (YouTube) -->
                        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>

                <!-- Section 2: Top Performing Content (Links with Previews) -->
                <div>
                    <h3 class="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3">Top Content</h3>
                    <div class="space-y-3">
                        
                        <!-- Video Item 1 -->
                        <a href="#" class="flex items-center gap-4 p-3 rounded-xl bg-[#1a1a1a] border border-gray-800 hover:bg-[#252525] transition-all group">
                            <div class="w-16 h-16 rounded-lg bg-gray-700 flex-shrink-0 overflow-hidden relative">
                                <img src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=200&auto=format&fit=crop" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <i class="fa-solid fa-play text-white drop-shadow-md text-xs"></i>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-sm font-semibold text-gray-200 truncate">Samsung Galaxy S24 Review</h4>
                                <p class="text-xs text-gray-500">Instagram Reel • 1.2M Views</p>
                            </div>
                            <i class="fa-solid fa-arrow-up-right-from-square text-gray-600 text-xs"></i>
                        </a>

                        <!-- Video Item 2 -->
                        <a href="#" class="flex items-center gap-4 p-3 rounded-xl bg-[#1a1a1a] border border-gray-800 hover:bg-[#252525] transition-all group">
                            <div class="w-16 h-16 rounded-lg bg-gray-700 flex-shrink-0 overflow-hidden relative">
                                <img src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=200&auto=format&fit=crop" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <i class="fa-solid fa-play text-white drop-shadow-md text-xs"></i>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-sm font-semibold text-gray-200 truncate">Bali Travel Vlog 2024</h4>
                                <p class="text-xs text-gray-500">TikTok • 850k Views</p>
                            </div>
                            <i class="fa-solid fa-arrow-up-right-from-square text-gray-600 text-xs"></i>
                        </a>

                    </div>
                </div>

                <!-- Section 3: Showcase Gallery (Grid) -->
                <div>
                    <h3 class="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3">Photo Gallery</h3>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="aspect-square rounded-lg overflow-hidden bg-gray-800 relative group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300&auto=format&fit=crop" class="w-full h-full object-cover transition-transform group-hover:scale-110">
                        </div>
                        <div class="aspect-square rounded-lg overflow-hidden bg-gray-800 relative group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300&auto=format&fit=crop" class="w-full h-full object-cover transition-transform group-hover:scale-110">
                        </div>
                        <div class="aspect-square rounded-lg overflow-hidden bg-gray-800 relative group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=300&auto=format&fit=crop" class="w-full h-full object-cover transition-transform group-hover:scale-110">
                        </div>
                        <div class="aspect-square rounded-lg overflow-hidden bg-gray-800 relative group cursor-pointer">
                            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&auto=format&fit=crop" class="w-full h-full object-cover transition-transform group-hover:scale-110">
                            <div class="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span class="text-xs font-bold text-white">+ 8 More</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 4: Download Center -->
                <div class="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                    <h3 class="text-sm uppercase tracking-wider text-gray-500 font-bold mb-3">Download Assets</h3>
                    <div class="flex flex-col gap-2">
                        <button class="flex items-center justify-between w-full p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] transition-colors text-left group">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded bg-red-500/10 text-red-400 flex items-center justify-center">
                                    <i class="fa-solid fa-file-pdf"></i>
                                </div>
                                <span class="text-sm font-medium text-gray-300 group-hover:text-white">Full Media Kit 2025</span>
                            </div>
                            <i class="fa-solid fa-download text-gray-600 text-xs"></i>
                        </button>
                        <button class="flex items-center justify-between w-full p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#252525] transition-colors text-left group">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                    <i class="fa-solid fa-images"></i>
                                </div>
                                <span class="text-sm font-medium text-gray-300 group-hover:text-white">High-Res Headshots</span>
                            </div>
                            <i class="fa-solid fa-download text-gray-600 text-xs"></i>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Success Toast (Hidden by default) -->
    <div id="toast" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 translate-y-20 opacity-0 transition-all duration-300 z-[60]">
        <i class="fa-solid fa-circle-check"></i>
        <span class="font-medium text-sm" id="toastMsg">Download Started!</span>
    </div>

    <script>
        // --- Shared Logic ---
        function showToast(msg) {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toastMsg');
            toastMsg.innerText = msg;
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);
        }

        // --- Rate Card Modal Logic ---
        const modal = document.getElementById('leadModal');
        const form = document.getElementById('rateCardForm');
        const submitBtn = document.getElementById('submitBtn');

        function openModal() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function handleDownload(e) {
            e.preventDefault();
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...';
            submitBtn.classList.add('opacity-80', 'cursor-not-allowed');

            setTimeout(() => {
                submitBtn.innerHTML = originalBtnContent;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-80', 'cursor-not-allowed');
                closeModal();
                form.reset();
                showToast("Download Started!");

                // Trigger dummy download
                const link = document.createElement('a');
                link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
                link.download = 'Alex_Creator_Rate_Card_2025.pdf';
                link.target = '_blank';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, 1500);
        }

        function shareProfile() {
            if (navigator.share) {
                navigator.share({
                    title: 'Alex Creator Profile',
                    text: 'Check out my portfolio and rate card!',
                    url: window.location.href,
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        }

        // --- Portfolio Modal Logic ---
        const portfolioModal = document.getElementById('portfolioModal');

        function openPortfolioModal() {
            portfolioModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closePortfolioModal() {
            portfolioModal.classList.remove('active');
            document.body.style.overflow = '';
        }


        // --- AI Modal & Gemini Integration ---
        const aiModal = document.getElementById('aiModal');
        const brandInput = document.getElementById('brandName');
        const ideaInput = document.getElementById('campaignIdea');
        const aiOutput = document.getElementById('aiOutput');
        let selectedToneVal = 'Excited';

        function openAiModal() {
            aiModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeAiModal() {
            aiModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        function selectTone(btn, tone) {
            document.querySelectorAll('.tone-btn').forEach(b => {
                b.classList.remove('ring-2', 'border-blue-500', 'text-white', 'selected-tone');
                b.classList.add('text-gray-300');
            });
            btn.classList.add('ring-2', 'border-blue-500', 'text-white', 'selected-tone');
            btn.classList.remove('text-gray-300');
            selectedToneVal = tone;
        }

        function resetAiModal() {
            document.getElementById('aiInputSection').classList.remove('hidden');
            document.getElementById('aiResultSection').classList.add('hidden');
            brandInput.value = '';
            ideaInput.value = '';
            aiOutput.innerHTML = '';
        }

        function copyToClipboard() {
            const text = aiOutput.innerText;
            navigator.clipboard.writeText(text).then(() => {
                showToast("Pitch copied to clipboard!");
            });
        }

        async function generatePitch() {
            const brand = brandInput.value.trim();
            const idea = ideaInput.value.trim();

            if (!brand || !idea) {
                alert("Please fill in both your Brand Name and Idea!");
                return;
            }

            // UI Transition
            document.getElementById('aiInputSection').classList.add('hidden');
            document.getElementById('aiLoadingSection').classList.remove('hidden');
            document.getElementById('aiLoadingSection').classList.add('flex');

            const apiKey = ""; // System provides key at runtime
            const prompt = `Act as a social media marketing expert. Write a short, engaging direct message that a brand representative from "${brand}" would send to an influencer named "Alex" to propose a collaboration. 
            
            Campaign Details: ${idea}
            Tone: ${selectedToneVal}
            Platform context: Instagram/TikTok
            
            Rules:
            1. Keep it under 80 words.
            2. Use relevant emojis.
            3. Include a clear call to action.
            4. Do not include subject lines, just the message body suitable for WhatsApp.`;

            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });

                const data = await response.json();
                
                if (data.error) throw new Error(data.error.message);
                
                const generatedText = data.candidates[0].content.parts[0].text;

                // Render result
                document.getElementById('aiLoadingSection').classList.add('hidden');
                document.getElementById('aiLoadingSection').classList.remove('flex');
                document.getElementById('aiResultSection').classList.remove('hidden');
                document.getElementById('aiResultSection').classList.add('flex');
                
                // Parse markdown just in case, though usually simple text
                aiOutput.innerHTML = marked.parse(generatedText);

                // Update WhatsApp Link
                const encodedText = encodeURIComponent(generatedText);
                document.getElementById('whatsappLink').href = `https://wa.me/?text=${encodedText}`;

            } catch (error) {
                console.error("Gemini Error:", error);
                alert("Oops! The AI got a bit confused. Please try again.");
                resetAiModal();
            }
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (modal.classList.contains('active')) closeModal();
                if (aiModal.classList.contains('active')) closeAiModal();
                if (portfolioModal.classList.contains('active')) closePortfolioModal();
            }
        });
    </script>
</body>
</html>