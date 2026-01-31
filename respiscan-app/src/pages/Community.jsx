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
        <div className={`min-h-screen pb-24 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-hospital-blue-50 text-hospital-blue-900'}`}>
            {/* Header */}
            <div className={`p-6 pt-12 sticky top-0 z-10 backdrop-blur-md border-b ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-hospital-blue-50/80 border-hospital-blue-200'}`}>
                <div className="flex items-center gap-3">
                    <Users size={28} className={isDarkMode ? 'text-blue-400' : 'text-medical-teal-500'} />
                    <h1 className="text-2xl font-bold font-display">Komunitas</h1>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Create Post Input */}
                <div className={`p-4 rounded-2xl shadow-sm ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-hospital-blue-100'}`}>
                    <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-hospital-blue-100 text-hospital-blue-600'}`}>
                            <span className="font-bold">A</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Bagikan cerita kesehatanmu..."
                            className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'placeholder-slate-500 text-white' : 'placeholder-hospital-blue-300 text-hospital-blue-900'}`}
                        />
                    </div>
                </div>

                {/* Feed */}
                {posts.map(post => (
                    <div key={post.id} className={`p-5 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-hospital-blue-100'}`}>
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-hospital-blue-50 text-hospital-blue-600'}`}>
                                    {post.user.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{post.user}</h3>
                                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-hospital-blue-400'}`}>{post.time}</p>
                                </div>
                            </div>
                        </div>

                        <p className={`mb-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-hospital-blue-800'}`}>
                            {post.content}
                        </p>

                        <div className={`flex items-center gap-6 pt-3 border-t ${isDarkMode ? 'border-slate-700' : 'border-hospital-blue-50'}`}>
                            <button className={`flex items-center gap-2 text-xs font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-red-400' : 'text-hospital-blue-400 hover:text-red-500'}`}>
                                <Heart size={16} /> {post.likes}
                            </button>
                            <button className={`flex items-center gap-2 text-xs font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-blue-400' : 'text-hospital-blue-400 hover:text-medical-teal-500'}`}>
                                <MessageCircle size={16} /> {post.comments}
                            </button>
                            <button className={`flex items-center gap-2 text-xs font-medium transition-colors ${isDarkMode ? 'text-slate-400 hover:text-green-400' : 'text-hospital-blue-400 hover:text-green-500'}`}>
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
