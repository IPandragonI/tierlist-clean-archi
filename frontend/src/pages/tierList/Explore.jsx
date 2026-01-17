import React, {useEffect, useState} from 'react';
import {FaChevronLeft, FaChevronRight, FaFilter, FaSearch, FaStar} from 'react-icons/fa';
import {Link} from "react-router-dom";
import config from "../../api/apiConfig.js";


const ExplorePage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [tierLists, setTierLists] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchTiersLists = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/tier-lists`);
                const data = await response.json();

                if (response.ok) {
                    setTierLists(data);

                    const uniqueCategories = [];
                    const categoryMap = new Map();

                    data.forEach(tierList => {
                        if (tierList.category && !categoryMap.has(tierList.category.id)) {
                            categoryMap.set(tierList.category.id, tierList.category);
                            uniqueCategories.push(tierList.category);
                        }
                    });

                    setCategories(uniqueCategories);
                    if (uniqueCategories.length > 0) {
                        setSelectedCategory(uniqueCategories[0].id);
                    }
                } else {
                    throw new Error(data.message || 'Failed to fetch tier lists');
                }

            } catch (error) {
                console.error('Error fetching tier lists:', error);
            }
        }

        fetchTiersLists();
    }, []);

    const categoryScrollRef = React.useRef(null);

    const scrollLeft = () => {
        if (categoryScrollRef.current) {
            categoryScrollRef.current.scrollBy({left: -200, behavior: 'smooth'});
        }
    };

    const scrollRight = () => {
        if (categoryScrollRef.current) {
            categoryScrollRef.current.scrollBy({left: 200, behavior: 'smooth'});
        }
    };

    const tierListsByCategory = {};
    tierLists.forEach(tierList => {
        const categoryId = tierList.category.id;
        if (!tierListsByCategory[categoryId]) {
            tierListsByCategory[categoryId] = [];
        }
        tierListsByCategory[categoryId].push(tierList);
    });

    const filteredItems = tierListsByCategory[selectedCategory]?.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
    console.log(filteredItems);

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
            <div className="bg-white shadow-sm sticky top-0">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Explore
                            </h1>
                            <p className="text-gray-600">Découvrez les meilleurs classements de la communauté</p>
                        </div>

                        <div className="relative w-full md:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400"/>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-3 w-full md:w-80 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Rechercher des classements..."
                            />
                            <button className="absolute inset-y-0 right-0 pr-3 flex items-center md:hidden">
                                <FaFilter className="text-gray-400"/>
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
                                <FaChevronLeft className="text-gray-600"/>
                            </button>
                            <button
                                onClick={scrollRight}
                                className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow"
                            >
                                <FaChevronRight className="text-gray-600"/>
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div
                            ref={categoryScrollRef}
                            className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide scroll-smooth"
                            style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
                        >
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`shrink-0 flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 hover:cursor-pointer ${
                                        selectedCategory === category.id
                                            ? `bg-linear-to-r text-white shadow-lg transform scale-105 bg-gradient-to-r from-blue-600 to-purple-600`
                                            : 'bg-white text-gray-700 hover:bg-gray-50 shadow hover:shadow-md'
                                    }`}
                                >
                                    <span className="font-semibold whitespace-nowrap">{category.name}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        selectedCategory === category.id
                                            ? 'bg-white/20'
                                            : 'bg-gray-100'
                                    }`}>
                                                {tierListsByCategory[category.id]?.length || 0}
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
                                {filteredItems.length} classements disponibles
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={item.logo[0]?.storedUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className={`absolute inset-0 bg-linear-to-t opacity-60`}></div>
                                    <div className="absolute top-4 right-4">
                                    </div>
                                </div>

                                <div className="p-5">
                                    <h4 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
                                        {item.name}
                                    </h4>
                                    <div className="flex items-center text-gray-600 mb-4">
                                        <div
                                            className="w-8 h-8 rounded-full bg-linear-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold mr-3">
                                            {item.creator.firstname.substring(0, 1).toUpperCase()}{item.creator.lastname.substring(0, 1).toUpperCase()}
                                        </div>
                                        <span className="text-sm">{item.creator.firstname} {item.creator.lastname}</span>
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center">
                                                <span
                                                    className="text-sm text-gray-500">{item.logo?.length || 0} logos</span>
                                            </div>
                                        </div>
                                        <Link to={'/tierlist/' + item.id}
                                              className="btn btn-sm btn-primary rounded-xl px-4">
                                            Voir
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
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