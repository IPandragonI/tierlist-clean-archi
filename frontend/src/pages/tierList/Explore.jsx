import React, { useState } from 'react';
import { FaFire, FaStar, FaGamepad, FaFilm, FaMusic, FaUtensils, FaBook, FaFutbol, FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ExplorePage = () => {
    const [selectedCategory, setSelectedCategory] = useState('tendance');
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 'tendance', name: 'Tendance', icon: <FaFire />, color: 'from-red-500 to-orange-500' },
        { id: 'top-rated', name: 'Top Rated', icon: <FaStar />, color: 'from-yellow-500 to-amber-500' },
        { id: 'jeux', name: 'Jeux Vidéo', icon: <FaGamepad />, color: 'from-green-500 to-emerald-600' },
        { id: 'films', name: 'Films & Séries', icon: <FaFilm />, color: 'from-blue-500 to-indigo-600' },
        { id: 'musique', name: 'Musique', icon: <FaMusic />, color: 'from-purple-500 to-pink-500' },
        { id: 'nourriture', name: 'Nourriture', icon: <FaUtensils />, color: 'from-orange-500 to-red-500' },
        { id: 'livres', name: 'Livres', icon: <FaBook />, color: 'from-amber-700 to-yellow-600' },
        { id: 'sports', name: 'Sports', icon: <FaFutbol />, color: 'from-green-600 to-teal-500' },
        { id: 'tech', name: 'Technologie', icon: <FaGamepad />, color: 'from-gray-700 to-gray-900' },
        { id: 'voyage', name: 'Voyage', icon: <FaStar />, color: 'from-cyan-500 to-blue-500' },
    ];

    const generateItems = (categoryId, count) => {
        const categoryNames = {
            'tendance': ['Top TikTok 2024', 'Meilleures Séries Netflix', 'IA Tools Populaires'],
            'top-rated': ['Classiques Cinéma', 'Jeux Éternels', 'Albums Légendaires'],
            'jeux': ['PS5 Exclusives', 'Jeux Indé 2024', 'Meilleurs RPG'],
            'films': ['Marvel vs DC', 'Films d\'Animation', 'Horreur 2024'],
            'musique': ['Artistes Hip-Hop', 'Festivals 2024', 'Nouveaux Albums'],
            'nourriture': ['Restos Paris', 'Recettes Faciles', 'Cuisine du Monde'],
            'livres': ['Best-Sellers', 'Fantasy Épique', 'Sci-Fi Modernes'],
            'sports': ['Joueurs NBA', 'Équipes Football', 'Athlètes Olympiques'],
            'tech': ['Smartphones 2024', 'Gadgets High-Tech', 'Applications'],
            'voyage': ['Destinations Pas Chères', 'Plages Paradisiaques', 'Villes Culturelles']
        };

        return Array.from({ length: count }, (_, i) => ({
            id: `${categoryId}-${i}`,
            title: `${categoryNames[categoryId]?.[i % 3] || 'Item'} ${i + 1}`,
            author: `@user${Math.floor(Math.random() * 1000)}`,
            likes: Math.floor(Math.random() * 1000) + 100,
            items: Math.floor(Math.random() * 20) + 5,
            color: `bg-gradient-to-br ${categories.find(c => c.id === categoryId)?.color || 'from-gray-500 to-gray-700'}`,
            imageUrl: `https://picsum.photos/seed/${categoryId}${i}/300/200`
        }));
    };

    const allItems = categories.reduce((acc, category) => {
        acc[category.id] = generateItems(category.id, 8);
        return acc;
    }, {});

    const categoryScrollRef = React.useRef(null);

    const scrollLeft = () => {
        if (categoryScrollRef.current) {
            categoryScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (categoryScrollRef.current) {
            categoryScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
        }
    };

    const filteredItems = allItems[selectedCategory]?.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Explore
                            </h1>
                            <p className="text-gray-600">Découvrez les meilleurs classements de la communauté</p>
                        </div>

                        <div className="relative w-full md:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-3 w-full md:w-80 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Rechercher des classements..."
                            />
                            <button className="absolute inset-y-0 right-0 pr-3 flex items-center md:hidden">
                                <FaFilter className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-800">Catégories</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={scrollLeft}
                                className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow"
                            >
                                <FaChevronLeft className="text-gray-600" />
                            </button>
                            <button
                                onClick={scrollRight}
                                className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow"
                            >
                                <FaChevronRight className="text-gray-600" />
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div
                            ref={categoryScrollRef}
                            className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide scroll-smooth"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`flex-shrink-0 flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                                        selectedCategory === category.id
                                            ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                                            : 'bg-white text-gray-700 hover:bg-gray-50 shadow hover:shadow-md'
                                    }`}
                                >
                                    <div className={`text-xl ${selectedCategory === category.id ? 'text-white' : 'text-gray-500'}`}>
                                        {category.icon}
                                    </div>
                                    <span className="font-semibold whitespace-nowrap">{category.name}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        selectedCategory === category.id
                                            ? 'bg-white/20'
                                            : 'bg-gray-100'
                                    }`}>
                                        {allItems[category.id]?.length || 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {categories.find(c => c.id === selectedCategory)?.name}
                            </h3>
                            <p className="text-gray-600">
                                {filteredItems?.length} classements disponibles
                            </p>
                        </div>
                        <select className="select select-bordered rounded-xl">
                            <option>Plus populaires</option>
                            <option>Plus récents</option>
                            <option>Plus de likes</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems?.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${item.color} opacity-60`}></div>
                                    <div className="absolute top-4 right-4">
                                        <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                                            <FaStar className="text-yellow-500" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h4 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                                        {item.title}
                                    </h4>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold mr-3">
                                            {item.author.substring(1, 3).toUpperCase()}
                                        </div>
                                        <span className="text-sm">{item.author}</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <FaStar className="text-yellow-500 mr-1" />
                                                <span className="text-sm font-semibold">{item.likes}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500">{item.items} items</span>
                                            </div>
                                        </div>
                                        <button className="btn btn-sm btn-primary rounded-xl px-4">
                                            Voir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems?.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Aucun résultat trouvé
                            </h3>
                            <p className="text-gray-500">
                                Essayez avec d'autres mots-clés ou explorez d'autres catégories
                            </p>
                        </div>
                    )}

                    {filteredItems && filteredItems.length > 0 && (
                        <div className="text-center mt-10">
                            <button className="btn btn-outline btn-primary px-8 rounded-xl">
                                Voir plus de classements
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Tendances du moment</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3">
                                <div className="bg-white rounded-xl p-5 shadow">
                                    <div className="flex items-center mb-4">
                                        <div className="p-2 bg-red-100 rounded-lg mr-3">
                                            <FaFire className="text-red-500" />
                                        </div>
                                        <h4 className="font-bold text-lg">Classement du jour</h4>
                                    </div>
                                    <p className="text-gray-600 mb-4">
                                        "Top 10 des films de science-fiction 2024"
                                    </p>
                                    <div className="flex items-center">
                                        <div className="avatar-group -space-x-4 mr-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="avatar">
                                                    <div className="w-8 h-8">
                                                        <img
                                                            src={`https://i.pravatar.cc/150?img=${i}`}
                                                            alt={`User ${i}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500">+120 votes aujourd'hui</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-2/3">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {['Trend #1', 'Trend #2', 'Trend #3'].map((trend, i) => (
                                        <div key={i} className="bg-white rounded-xl p-4 shadow hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-gray-700">{trend}</span>
                                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                                                    {i + 1}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">Explore this trending list</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default ExplorePage;