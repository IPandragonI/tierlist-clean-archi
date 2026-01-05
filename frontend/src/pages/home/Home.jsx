import React from 'react';
import { FaFire, FaStar, FaUsers, FaChartBar, FaArrowRight, FaPlayCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const features = [
        {
            icon: <FaFire className="text-2xl" />,
            title: "Créez vos Classements",
            description: "Organisez vos favoris dans des tier lists personnalisées avec un simple glisser-déposer",
            color: "from-red-500 to-orange-500"
        },
        {
            icon: <FaUsers className="text-2xl" />,
            title: "Partagez avec la Communauté",
            description: "Découvrez les classements des autres et partagez vos propres créations",
            color: "from-blue-500 to-purple-500"
        },
        {
            icon: <FaStar className="text-2xl" />,
            title: "Explorez des Catégories",
            description: "Jeux vidéo, films, musique, nourriture et bien plus encore",
            color: "from-yellow-500 to-amber-500"
        },
        {
            icon: <FaChartBar className="text-2xl" />,
            title: "Analysez les Tendances",
            description: "Voyez ce que la communauté préfère et découvrez de nouveaux favoris",
            color: "from-green-500 to-teal-500"
        }
    ];

    const trendingTierLists = [
        { id: 1, title: "Top Films 2024", category: "Cinéma", author: "@cinéphile", likes: 1245 },
        { id: 2, title: "Meilleurs Jeux PS5", category: "Jeux Vidéo", author: "@gamerpro", likes: 892 },
        { id: 3, title: "Artistes Hip-Hop", category: "Musique", author: "@musiclover", likes: 756 },
        { id: 4, title: "Restaurants Paris", category: "Nourriture", author: "@foodie", likes: 543 }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>

                <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Créez, Partagez et Découvrez des
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Tier Lists</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                            La plateforme ultime pour classer tout ce que vous aimez. Des jeux vidéo aux films, en passant par la musique et bien plus encore.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/tierlist/new"
                                className="btn btn-primary btn-lg rounded-xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <FaPlayCircle className="mr-2" />
                                Créer une Tier List
                            </Link>

                            <Link
                                to="/tierlist/explore"
                                className="btn btn-outline btn-primary btn-lg rounded-xl px-8 py-4 text-lg font-semibold"
                            >
                                Explorer
                                <FaArrowRight className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Pourquoi choisir Rank That ?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Une plateforme intuitive et complète pour tous vos besoins de classement
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Tier Lists Tendance
                            </h2>
                            <p className="text-gray-600">
                                Découvrez ce que la communauté aime en ce moment
                            </p>
                        </div>
                        <Link
                            to="/tierlist/explore"
                            className="btn btn-outline btn-primary rounded-xl hidden md:flex"
                        >
                            Voir tout
                            <FaArrowRight className="ml-2" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trendingTierLists.map((list) => (
                            <div
                                key={list.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                            >
                                <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-white text-4xl opacity-20">
                                            <FaFire />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                                            {list.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">
                                        {list.title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">
                                            {list.author}
                                        </span>
                                        <div className="flex items-center text-amber-500">
                                            <FaStar className="mr-1" />
                                            <span className="text-sm font-semibold">{list.likes}</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/tier-list/${list.id}`}
                                        className="btn btn-sm btn-primary w-full mt-4 rounded-xl"
                                    >
                                        Voir le classement
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            Prêt à créer votre premier classement ?
                        </h2>
                        <p className="text-xl text-blue-100 mb-10">
                            Rejoignez des milliers d'utilisateurs qui créent déjà leurs tier lists
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/auth/register"
                                className="btn btn-lg bg-white text-blue-600 hover:bg-gray-100 rounded-xl px-8 py-4 text-lg font-semibold"
                            >
                                Commencer gratuitement
                            </Link>

                            <Link
                                to="/explore"
                                className="btn btn-lg btn-outline btn-white text-white border-white hover:bg-white/10 rounded-xl px-8 py-4 text-lg font-semibold"
                            >
                                Explorer sans compte
                            </Link>
                        </div>

                        <p className="text-blue-200 mt-8 text-sm">
                            Aucune carte de crédit requise • Création en 30 secondes
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomePage;