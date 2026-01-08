import React, {useEffect, useState} from 'react';
import {
    FaCalendar,
    FaChartBar,
    FaDownload,
    FaEdit,
    FaEllipsisV,
    FaEye,
    FaFilter,
    FaLink,
    FaLock,
    FaPlus,
    FaSearch,
    FaShare,
    FaSort,
    FaTrash
} from 'react-icons/fa';
import {Link} from 'react-router-dom';
import config from "../../api/apiConfig.js";
import {useAuth} from "../../AuthProvider.jsx";
import {useTheme} from '../../ThemeProvider.jsx';

const MyTierListsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('recent');
    const [selectedLists, setSelectedLists] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [activeListId, setActiveListId] = useState(null);
    const [tierLists, setTierLists] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [exportFormat, setExportFormat] = useState('json');
    const {currentUser} = useAuth();
    const {theme} = useTheme();

    const itemsPerPage = 9;

    useEffect(() => {
        fetchTierLists();
    }, []);

    const fetchTierLists = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/tier-lists/creator/${currentUser.id}`, {
                headers: config.getHeaders(),
            });

            if (response.ok) {
                const data = await response.json();
                setTierLists(data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des tier lists:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const filteredLists = tierLists
        .filter(list => {
            const matchesSearch =
                list.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                list.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filterStatus === 'all';

            return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'recent':
                    return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
                case 'oldest':
                    return new Date(a.updatedAt || a.createdAt) - new Date(b.updatedAt || b.createdAt);
                case 'popular':
                    return (b.likes || 0) - (a.likes || 0);
                case 'views':
                    return (b.views || 0) - (a.views || 0);
                case 'title':
                    return (a.name || '').localeCompare(b.name || '');
                default:
                    return 0;
            }
        });

    const totalPages = Math.ceil(filteredLists.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedLists = filteredLists.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus, sortBy]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    };

    const toggleSelectList = (id) => {
        setSelectedLists(prev =>
            prev.includes(id)
                ? prev.filter(listId => listId !== id)
                : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedLists.length === paginatedLists.length) {
            setSelectedLists([]);
        } else {
            setSelectedLists(paginatedLists.map(list => list.id));
        }
    };

    const handleDelete = async (id) => {
        try {
            if (id) {
                const response = await fetch(`${config.apiBaseUrl}/tier-lists/${id}`, {
                    method: 'DELETE',
                    headers: config.getHeaders(),
                });

                if (response.ok) {
                    setTierLists(prev => prev.filter(list => list.id !== id));
                    setSelectedLists(prev => prev.filter(listId => listId !== id));
                }
            } else {
                const deletePromises = selectedLists.map(listId =>
                    fetch(`${config.apiBaseUrl}/tier-lists/${listId}`, {
                        method: 'DELETE',
                        headers: config.getHeaders(),
                    })
                );

                await Promise.all(deletePromises);
                setTierLists(prev => prev.filter(list => !selectedLists.includes(list.id)));
                setSelectedLists([]);
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        } finally {
            setShowDeleteModal(false);
            setActiveListId(null);
        }
    };

    const handleExport = async (id) => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/tier-list-logo-moves/export/${id}`, {
                method: 'POST',
                headers: config.getHeaders(),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'exportation');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `tierlist-${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors de l\'exportation:', error);
        }
    };


    const handleShare = (list) => {
        const shareUrl = `${window.location.origin}/tierlist/${list.id}`;

        if (navigator.share) {
            navigator.share({
                title: `Ma tier list: ${list.name}`,
                text: `Découvrez ma tier list "${list.name}" sur Rank That!`,
                url: shareUrl,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareUrl)
                .then(() => {
                    alert('Lien copié dans le presse-papier !');
                })
                .catch(err => {
                    console.error('Erreur lors de la copie:', err);
                    const textArea = document.createElement('textarea');
                    textArea.value = shareUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    alert('Lien copié dans le presse-papier !');
                });
        }
    };

    const DeleteModal = () => (
        <div className={`modal modal-open ${theme === 'dark' ? 'text-white' : ''}`}>
            <div className={`modal-box ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                <h3 className="font-bold text-lg">
                    {activeListId ? "Supprimer cette tier list ?" : `Supprimer ${selectedLists.length} tier list(s) ?`}
                </h3>
                <p className="py-4">
                    Cette action est irréversible. Toutes les données seront perdues.
                </p>
                <div className="modal-action">
                    <button
                        className={`btn ${theme === 'dark' ? 'btn-ghost text-white' : 'btn-ghost'}`}
                        onClick={() => {
                            setShowDeleteModal(false);
                            setActiveListId(null);
                        }}
                    >
                        Annuler
                    </button>
                    <button
                        className="btn btn-error"
                        onClick={() => handleDelete(activeListId)}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );

    const ShareModal = () => {
        const list = tierLists.find(l => l.id === activeListId);
        const shareUrl = `${window.location.origin}/tierlist/${activeListId}`;

        const shareMethods = [
            {
                name: 'Copier le lien',
                icon: <FaLink/>,
                action: () => {
                    navigator.clipboard.writeText(shareUrl);
                    alert('Lien copié dans le presse-papier !');
                },
                color: 'btn-info'
            },
            {
                name: 'Partager via...',
                icon: <FaShare/>,
                action: () => handleShare(list),
                color: 'btn-primary'
            }
        ];

        return (
            <div className={`modal modal-open ${theme === 'dark' ? 'text-white' : ''}`}>
                <div className={`modal-box ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                    <h3 className="font-bold text-lg mb-4">Partager "{list?.name}"</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="label">
                                <span className="label-text">Lien de partage</span>
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={shareUrl}
                                    readOnly
                                    className={`input flex-1 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'input-bordered'}`}
                                />
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        navigator.clipboard.writeText(shareUrl);
                                        alert('Lien copié !');
                                    }}
                                >
                                    <FaLink/>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Partager rapidement</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                {shareMethods.map((method, index) => (
                                    <button
                                        key={index}
                                        className={`btn ${method.color} gap-2`}
                                        onClick={method.action}
                                    >
                                        {method.icon}
                                        {method.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="modal-action">
                        <button
                            className={`btn ${theme === 'dark' ? 'btn-ghost text-white' : 'btn-ghost'}`}
                            onClick={() => {
                                setShowShareModal(false);
                                setActiveListId(null);
                            }}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const FaQrcode = () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path
                d="M1 1h8v8H1V1zm2 2v4h4V3H3zM1 15h8v8H1v-8zm2 2v4h4v-4H3zM15 1h8v8h-8V1zm2 2v4h4V3h-4zM15 15h8v8h-8v-8zm2 2v4h4v-4h-4z"/>
        </svg>
    );

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            theme === 'dark'
                ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white'
                : 'bg-gradient-to-b from-gray-50 to-white text-gray-900'
        }`}>
            <div className={`border-b transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Mes Tier Lists</h1>
                            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Gérez et organisez toutes vos créations
                            </p>
                        </div>

                        <Link
                            to="/tierlist/new"
                            className="btn btn-primary gap-2 rounded-xl px-6 hover:shadow-lg transition-shadow"
                        >
                            <FaPlus/>
                            Nouvelle Tier List
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className={`rounded-2xl shadow-sm border p-4 mb-6 transition-colors duration-300 ${
                    theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-white border-gray-200'
                }`}>
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="relative flex-1 w-full md:w-auto">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className={theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}/>
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher dans mes tier lists..."
                                className={`input w-full pl-10 transition-colors duration-300 ${
                                    theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'input-bordered'
                                }`}
                            />
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="dropdown">
                                <label tabIndex={0} className={`btn gap-2 ${
                                    theme === 'dark'
                                        ? 'btn-outline text-white border-gray-600 hover:bg-gray-700'
                                        : 'btn-outline'
                                }`}>
                                    <FaFilter/>
                                    {filterStatus === 'all' ? 'Tous' : 'Filtré'}
                                </label>
                                <ul tabIndex={0} className={`dropdown-content menu p-2 shadow rounded-box w-52 ${
                                    theme === 'dark'
                                        ? 'bg-gray-800 text-white'
                                        : 'bg-base-100'
                                }`}>
                                    <li>
                                        <button onClick={() => setFilterStatus('all')}>Tous</button>
                                    </li>
                                </ul>
                            </div>

                            <div className="dropdown">
                                <label tabIndex={0} className={`btn gap-2 ${
                                    theme === 'dark'
                                        ? 'btn-outline text-white border-gray-600 hover:bg-gray-700'
                                        : 'btn-outline'
                                }`}>
                                    <FaSort/>
                                    Trier
                                </label>
                                <ul tabIndex={0} className={`dropdown-content menu p-2 shadow rounded-box w-52 ${
                                    theme === 'dark'
                                        ? 'bg-gray-800 text-white'
                                        : 'bg-base-100'
                                }`}>
                                    <li>
                                        <button onClick={() => setSortBy('recent')}>Plus récent</button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSortBy('oldest')}>Plus ancien</button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSortBy('title')}>Par titre</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {selectedLists.length > 0 && (
                        <div
                            className={`mt-4 p-3 rounded-lg flex flex-wrap gap-2 items-center transition-colors duration-300 ${
                                theme === 'dark'
                                    ? 'bg-blue-900/30 border border-blue-800'
                                    : 'bg-blue-50'
                            }`}>
                            <span className="font-semibold">
                                {selectedLists.length} sélectionné(s)
                            </span>
                            <div className={`divider divider-horizontal mx-2 ${
                                theme === 'dark' ? 'before:bg-gray-600 after:bg-gray-600' : ''
                            }`}></div>
                            <button
                                className="btn btn-sm btn-error gap-2"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                <FaTrash/>
                                Supprimer
                            </button>
                            <button
                                className={`btn btn-sm ml-auto ${
                                    theme === 'dark' ? 'btn-ghost text-white' : 'btn-ghost'
                                }`}
                                onClick={() => setSelectedLists([])}
                            >
                                Tout désélectionner
                            </button>
                        </div>
                    )}
                </div>

                {paginatedLists.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedLists.map((list) => (
                                <div
                                    key={list.id}
                                    className={`rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-all duration-300 ${
                                        selectedLists.includes(list.id)
                                            ? 'ring-2 ring-blue-500'
                                            : ''
                                    } ${
                                        theme === 'dark'
                                            ? 'bg-gray-800 border-gray-700'
                                            : 'bg-white border-gray-200'
                                    }`}
                                >
                                    <div className="p-4 border-b flex justify-between items-start">
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedLists.includes(list.id)}
                                                onChange={() => toggleSelectList(list.id)}
                                                className={`checkbox checkbox-primary mt-1 ${
                                                    theme === 'dark' ? 'border-gray-600' : ''
                                                }`}
                                            />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-lg line-clamp-1">
                                                        {list.name}
                                                    </h3>
                                                    {list.isPublic === false && (
                                                        <span className={`badge gap-1 ${
                                                            theme === 'dark'
                                                                ? 'badge-error bg-red-900/30 text-red-300 border-red-700'
                                                                : 'badge-error'
                                                        }`}>
                                                            <FaLock size={10}/>
                                                            Privé
                                                        </span>
                                                    )}
                                                </div>
                                                {list.description && (
                                                    <p className={`text-sm mt-1 line-clamp-2 ${
                                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                        {list.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="dropdown dropdown-end">
                                            <label tabIndex={0} className={`btn btn-ghost btn-sm btn-circle ${
                                                theme === 'dark' ? 'hover:bg-gray-700' : ''
                                            }`}>
                                                <FaEllipsisV/>
                                            </label>
                                            <ul tabIndex={0}
                                                className={`dropdown-content menu p-2 shadow rounded-box w-52 ${
                                                    theme === 'dark'
                                                        ? 'bg-gray-800 text-white'
                                                        : 'bg-base-100'
                                                }`}>
                                                <li>
                                                    <Link to={`/tierlist/${list.id}`} className="gap-2">
                                                        <FaEye/>
                                                        Voir
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`/tierlist/edit/${list.id}`} className="gap-2">
                                                        <FaEdit/>
                                                        Modifier
                                                    </Link>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() => handleExport(list.id)}
                                                        className="gap-2"
                                                    >
                                                        <FaDownload/>
                                                        Exporter
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={() => {
                                                            setActiveListId(list.id);
                                                            setShowShareModal(true);
                                                        }}
                                                        className="gap-2"
                                                    >
                                                        <FaShare/>
                                                        Partager
                                                    </button>
                                                </li>
                                                <div className={`divider my-1 ${
                                                    theme === 'dark' ? 'before:bg-gray-600 after:bg-gray-600' : ''
                                                }`}></div>
                                                <li>
                                                    <button
                                                        onClick={() => {
                                                            setActiveListId(list.id);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="gap-2 text-red-500 hover:text-red-600"
                                                    >
                                                        <FaTrash/>
                                                        Supprimer
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="relative h-48 overflow-hidden">
                                        {list.thumbnail ? (
                                            <img
                                                src={list.thumbnail}
                                                alt={list.name}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center ${
                                                theme === 'dark'
                                                    ? 'bg-gradient-to-br from-gray-700 to-gray-900'
                                                    : 'bg-gradient-to-br from-gray-200 to-gray-300'
                                            }`}>
                                                <FaChartBar className={`text-4xl ${
                                                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                                }`}/>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className={`badge ${
                                                theme === 'dark'
                                                    ? 'badge-outline text-gray-300 border-gray-600'
                                                    : 'badge-outline'
                                            }`}>
                                                {list.category?.name || 'Non catégorisé'}
                                            </span>
                                            <div className={`text-sm ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                <FaCalendar className="inline mr-1"/>
                                                {formatDate(list.updatedAt || list.createdAt)}
                                            </div>
                                        </div>


                                        <div className="flex gap-2">
                                            <Link
                                                to={`/tierlist/${list.id}`}
                                                className="btn btn-primary btn-sm flex-1 gap-1"
                                            >
                                                <FaEye/>
                                                Voir
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setActiveListId(list.id);
                                                    setShowShareModal(true);
                                                }}
                                                className={`btn btn-sm flex-1 gap-1 ${
                                                    theme === 'dark'
                                                        ? 'btn-outline text-white border-gray-600 hover:bg-gray-700'
                                                        : 'btn-outline'
                                                }`}
                                            >
                                                <FaShare/>
                                                Partager
                                            </button>
                                            <button
                                                onClick={() => handleExport(list.id)}
                                                className={`btn btn-sm flex-1 gap-1 ${
                                                    theme === 'dark'
                                                        ? 'btn-outline text-white border-gray-600 hover:bg-gray-700'
                                                        : 'btn-outline'
                                                }`}
                                            >
                                                <FaDownload/>
                                                Exporter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <div className="join">
                                    <button
                                        className={`join-item btn ${
                                            theme === 'dark'
                                                ? 'btn-outline text-white border-gray-600 hover:bg-gray-700'
                                                : 'btn-outline'
                                        }`}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        «
                                    </button>
                                    {Array.from({length: totalPages}, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            className={`join-item btn ${
                                                currentPage === page
                                                    ? 'btn-active'
                                                    : theme === 'dark'
                                                        ? 'btn-outline text-white border-gray-600 hover:bg-gray-700'
                                                        : 'btn-outline'
                                            }`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        className={`join-item btn ${
                                            theme === 'dark'
                                                ? 'btn-outline text-white border-gray-600 hover:bg-gray-700'
                                                : 'btn-outline'
                                        }`}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        »
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className={`text-6xl mb-4 ${
                            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                        }`}>
                            📊
                        </div>
                        <h3 className="text-2xl font-semibold mb-2">
                            Aucune tier list trouvée
                        </h3>
                        <p className={`mb-8 max-w-md mx-auto ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            {searchQuery
                                ? "Aucune tier list ne correspond à votre recherche. Essayez d'autres termes."
                                : "Commencez par créer votre première tier list !"
                            }
                        </p>
                        <Link to="/tierlist/new" className="btn btn-primary gap-2">
                            <FaPlus/>
                            Créer ma première tier list
                        </Link>
                    </div>
                )}
            </div>

            {showDeleteModal && <DeleteModal/>}
            {showShareModal && <ShareModal/>}
        </div>
    );
};

export default MyTierListsPage;