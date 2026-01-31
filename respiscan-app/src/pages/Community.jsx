import React from 'react';
import { Users, MessageCircle, Heart, Share2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import BottomNav from '../components/BottomNav';

const Community = () => {
    const { isDarkMode } = useTheme();

    const posts = [
        {
            id: 1,
            user: "Sarah M.",
            time: "2 jam yang lalu",
            content: "Latihan pernapasan 4-7-8 sangat membantu saya tidur lebih nyenyak malam ini! 😴",
            likes: 24,
            comments: 5
        },
        {
            id: 2,
            user: "Budi Santoso",
            time: "5 jam yang lalu",
            content: "Skor kesehatan paru-paru saya naik 5 poin minggu ini. Semangat terus semuanya! 💪",
            likes: 42,
            comments: 12
        },
        {
            id: 3,
            user: "Dr. Lina",
            time: "1 hari yang lalu",
            content: "Ingat untuk selalu menjaga kualitas udara di dalam ruangan. Buka jendela di pagi hari.",
            likes: 156,
            comments: 34
        }
    ];

    return (
        <div className="min-h-screen relative pb-24 overflow-hidden font-sans">
            {/* Background */}
            <div
                className="fixed inset-0 w-full h-full -z-20 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: "url('/hospital-bg.png')" }}
            />
            <div className={`fixed inset-0 w-full h-full -z-10 ${isDarkMode ? 'bg-hospital-blue-900/90' : 'bg-hospital-blue-50/90 transition-colors duration-300'}`} />

            {/* Ambient Decorations */}
            <div className={`absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none transition-colors duration-700 ${isDarkMode ? 'bg-blue-600' : 'bg-cyan-400'}`}></div>
            <div className={`absolute bottom-[10%] left-[-10%] w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse pointer-events-none transition-colors duration-700 delay-1000 ${isDarkMode ? 'bg-purple-600' : 'bg-fuchsia-400'}`}></div>
            <div className={`absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 animate-pulse pointer-events-none transition-colors duration-700 delay-500 ${isDarkMode ? 'bg-indigo-600' : 'bg-blue-300'}`}></div>

            {/* Header */}
            <div className="px-6 pt-12 pb-6 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl backdrop-blur-md ${isDarkMode ? 'bg-slate-800/50' : 'bg-white/50'}`}>
                        <Users size={28} className={isDarkMode ? 'text-blue-400' : 'text-medical-teal-600'} />
                    </div>
                    <h1 className={`text-2xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-hospital-blue-900'}`}>Komunitas</h1>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Create Post Input */}
                <div className={`p-4 rounded-3xl shadow-sm border backdrop-blur-xl ${isDarkMode ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-white/50'}`}>
                    <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-hospital-blue-100 text-hospital-blue-600'}`}>
                            <span className="font-bold">A</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Bagikan cerita kesehatanmu..."
                            className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'placeholder-slate-400 text-white' : 'placeholder-slate-500 text-hospital-blue-900'}`}
                        />
                    </div>
                </div>

                {/* Feed */}
                {posts.map(post => (
                    <div key={post.id} className={`p-5 rounded-3xl shadow-sm border backdrop-blur-xl ${isDarkMode ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-white/50'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-hospital-blue-50 text-hospital-blue-600'}`}>
                                    {post.user.charAt(0)}
                                </div>
                                <div>
                                    <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-hospital-blue-900'}`}>{post.user}</h3>
                                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{post.time}</p>
                                </div>
                            </div>
                        </div>

                        <p className={`mb-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            {post.content}
                        </p>

                        <div className={`flex items-center gap-6 pt-3 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
                            <button className={`flex items-center gap-2 text-xs font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-red-400' : 'text-slate-500 hover:text-red-500'}`}>
                                <Heart size={16} /> {post.likes}
                            </button>
                            <button className={`flex items-center gap-2 text-xs font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-slate-500 hover:text-medical-teal-500'}`}>
                                <MessageCircle size={16} /> {post.comments}
                            </button>
                            <button className={`flex items-center gap-2 text-xs font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-green-400' : 'text-slate-500 hover:text-green-500'}`}>
                                <Share2 size={16} /> Bagikan
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
};

export default Community;
