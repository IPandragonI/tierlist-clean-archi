import React, { useState, useEffect } from 'react';
import {
    FaUserCircle, FaEdit, FaCamera, FaSave, FaTimes, FaEnvelope,
    FaCalendar, FaMapMarkerAlt, FaLink, FaTwitter, FaInstagram,
    FaGithub, FaLinkedin, FaGlobe, FaLock, FaStar, FaChartBar,
    FaEye, FaHeart, FaShare, FaCog, FaBell, FaShieldAlt,
    FaPalette, FaKey, FaTrash, FaDownload, FaQrcode
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('tierlists');
    const [showChangeAvatar, setShowChangeAvatar] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    // Données utilisateur
    const [userData, setUserData] = useState({
        username: 'gamer_pro',
        displayName: 'Alex Tremblay',
        email: 'alex.tremblay@example.com',
        bio: 'Passionné de jeux vidéo, cinéma et technologie. Je crée des tier lists depuis 2022.',
        avatar: 'https://i.pravatar.cc/300',
        cover: 'https://picsum.photos/seed/cover/1200/400',
        location: 'Montréal, Canada',
        joinDate: '2023-03-15',
        website: 'https://alex-tremblay.dev',
        social: {
            twitter: '@alex_gamer',
            instagram: 'alex.tremblay',
            github: 'alex-tremblay',
            linkedin: 'alex-tremblay'
        },
        preferences: {
            theme: 'light',
            notifications: true,
            privacy: 'public',
            emailUpdates: true
        },
        stats: {
            tierLists: 12,
            likes: 456,
            views: 2345,
            followers: 89,
            following: 156,
            featured: 3
        }
    });

    // Données fictives
    const [tierLists, setTierLists] = useState([
        {
            id: 1,
            title: "Top Films 2024",
            category: "Films",
            likes: 156,
            views: 1245,
            privacy: "public",
            createdAt: "2024-01-15",
            isFeatured: true,
            thumbnail: "https://picsum.photos/seed/film1/400/250"
        },
        {
            id: 2,
            title: "Jeux PS5 Essentiels",
            category: "Jeux Vidéo",
            likes: 89,
            views: 567,
            privacy: "public",
            createdAt: "2024-01-10",
            isFeatured: true,
            thumbnail: "https://picsum.photos/seed/game1/400/250"
        },
        {
            id: 3,
            title: "Restaurants Paris",
            category: "Nourriture",
            likes: 45,
            views: 234,
            privacy: "private",
            createdAt: "2024-02-01",
            isFeatured: false,
            thumbnail: "https://picsum.photos/seed/food1/400/250"
        },
        {
            id: 4,
            title: "Artistes Hip-Hop 2024",
            category: "Musique",
            likes: 23,
            views: 156,
            privacy: "public",
            createdAt: "2024-02-25",
            isFeatured: false,
            thumbnail: null
        },
        {
            id: 5,
            title: "Marques de Smartphones",
            category: "Technologie",
            likes: 67,
            views: 456,
            privacy: "public",
            createdAt: "2024-01-05",
            isFeatured: true,
            thumbnail: "https://picsum.photos/seed/tech1/400/250"
        },
        {
            id: 6,
            title: "Séries Netflix à voir",
            category: "Séries",
            likes: 34,
            views: 189,
            privacy: "shared",
            createdAt: "2024-02-15",
            isFeatured: false,
            thumbnail: "https://picsum.photos/seed/series1/400/250"
        }
    ]);

    const [formData, setFormData] = useState({ ...userData });

    useEffect(() => {
        setFormData({ ...userData });
    }, [userData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSocialChange = (platform, value) => {
        setFormData(prev => ({
            ...prev,
            social: {
                ...prev.social,
                [platform]: value
            }
        }));
    };

    const handleSave = () => {
        setUserData({ ...formData });
        setIsEditing(false);
        // Ici, vous ajouteriez l'appel API pour sauvegarder
    };

    const handleCancel = () => {
        setFormData({ ...userData });
        setIsEditing(false);
    };

    const handleExportData = () => {
        const data = JSON.stringify(userData, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rankthat-profile-${userData.username}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDeleteAccount = () => {
        // Ici, vous ajouteriez l'appel API pour supprimer le compte
        console.log('Compte supprimé');
        navigate('/');
    };

    const filteredTierLists = tierLists.filter(list => {
        if (activeTab === 'tierlists') return true;
        if (activeTab === 'featured') return list.isFeatured;
        if (activeTab === 'public') return list.privacy === 'public';
        if (activeTab === 'private') return list.privacy === 'private';
        return true;
    });

    // Modal de changement d'avatar
    const AvatarModal = () => (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Changer la photo de profil</h3>
                <div className="space-y-4">
                    <div className="flex flex-col items-center">
                        <div className="avatar mb-4">
                            <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-2">
                                <img src={formData.avatar} alt="Avatar actuel" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.avatar}
                                onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                                placeholder="URL de l'image"
                                className="input input-bordered flex-1"
                            />
                            <button className="btn btn-primary">
                                <FaCamera />
                                Uploader
                            </button>
                        </div>
                    </div>
                    <div className="modal-action">
                        <button className="btn" onClick={() => setShowChangeAvatar(false)}>
                            Annuler
                        </button>
                        <button className="btn btn-primary" onClick={() => {
                            setUserData(prev => ({ ...prev, avatar: formData.avatar }));
                            setShowChangeAvatar(false);
                        }}>
                            Sauvegarder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Modal de changement de mot de passe
    const PasswordModal = () => (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Changer le mot de passe</h3>
                <div className="space-y-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Mot de passe actuel</span>
                        </label>
                        <input type="password" className="input input-bordered w-full" />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Nouveau mot de passe</span>
                        </label>
                        <input type="password" className="input input-bordered w-full" />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Confirmer le nouveau mot de passe</span>
                        </label>
                        <input type="password" className="input input-bordered w-full" />
                    </div>
                    <div className="modal-action">
                        <button className="btn" onClick={() => setShowChangePassword(false)}>
                            Annuler
                        </button>
                        <button className="btn btn-primary">
                            Mettre à jour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // Modal de suppression de compte
    const DeleteAccountModal = () => (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-2 text-red-600">Supprimer le compte</h3>
                <p className="py-4">
                    Cette action est <strong>irréversible</strong>. Toutes vos données seront perdues :
                </p>
                <ul className="list-disc pl-5 mb-4 space-y-2">
                    <li>Toutes vos tier lists</li>
                    <li>Vos likes et commentaires</li>
                    <li>Vos préférences et paramètres</li>
                    <li>Vos données personnelles</li>
                </ul>
                <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-3">
                        <input type="checkbox" className="checkbox checkbox-error" />
                        <span className="label-text">Je comprends les conséquences</span>
                    </label>
                </div>
                <div className="modal-action">
                    <button className="btn" onClick={() => setShowDeleteAccount(false)}>
                        Annuler
                    </button>
                    <button className="btn btn-error" onClick={handleDeleteAccount}>
                        Supprimer définitivement
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Banner et Avatar */}
            <div className="relative">
                {/* Banner */}
                <div className="h-64 overflow-hidden">
                    <img
                        src={userData.cover}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Avatar et actions */}
                <div className="container mx-auto px-4 relative -mt-20">
                    <div className="flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
                        <div className="flex items-end gap-6">
                            <div className="relative group">
                                <div className="avatar">
                                    <div className="w-40 h-40 rounded-full ring-4 ring-white bg-white shadow-lg">
                                        <img src={userData.avatar} alt={userData.displayName} />
                                    </div>
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={() => setShowChangeAvatar(true)}
                                        className="absolute bottom-2 right-2 btn btn-circle btn-sm btn-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaCamera />
                                    </button>
                                )}
                            </div>
                            <div className="mb-6">
                                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="displayName"
                                            value={formData.displayName}
                                            onChange={handleInputChange}
                                            className="input input-bordered bg-white/90"
                                        />
                                    ) : (
                                        userData.displayName
                                    )}
                                </h1>
                                <p className="text-white/90 drop-shadow-lg">
                                    @{isEditing ? (
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="input input-bordered input-sm bg-white/90"
                                    />
                                ) : (
                                    userData.username
                                )}
                                </p>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex gap-2 mb-6">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} className="btn btn-success gap-2">
                                        <FaSave />
                                        Sauvegarder
                                    </button>
                                    <button onClick={handleCancel} className="btn btn-ghost gap-2">
                                        <FaTimes />
                                        Annuler
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="btn btn-primary gap-2">
                                        <FaEdit />
                                        Modifier le profil
                                    </button>
                                    <button className="btn btn-outline gap-2">
                                        <FaShare />
                                        Partager
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar gauche - Informations */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-6 sticky top-24">
                            {/* Bio */}
                            <div>
                                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                    <FaUserCircle />
                                    Bio
                                </h3>
                                {isEditing ? (
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="textarea textarea-bordered w-full h-32"
                                        placeholder="Parlez-nous de vous..."
                                    />
                                ) : (
                                    <p className="text-gray-700 whitespace-pre-line">{userData.bio}</p>
                                )}
                            </div>

                            {/* Informations */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg">Informations</h3>

                                <div className="flex items-center gap-3">
                                    <FaEnvelope className="text-gray-400" />
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-500">Email</div>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="input input-bordered input-sm w-full"
                                            />
                                        ) : (
                                            <div className="font-medium">{userData.email}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-500">Localisation</div>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="input input-bordered input-sm w-full"
                                            />
                                        ) : (
                                            <div className="font-medium">{userData.location}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FaCalendar className="text-gray-400" />
                                    <div>
                                        <div className="text-sm text-gray-500">Membre depuis</div>
                                        <div className="font-medium">
                                            {new Date(userData.joinDate).toLocaleDateString('fr-FR', {
                                                year: 'numeric',
                                                month: 'long'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FaGlobe className="text-gray-400" />
                                    <div className="flex-1">
                                        <div className="text-sm text-gray-500">Site web</div>
                                        {isEditing ? (
                                            <input
                                                type="url"
                                                name="website"
                                                value={formData.website}
                                                onChange={handleInputChange}
                                                className="input input-bordered input-sm w-full"
                                                placeholder="https://..."
                                            />
                                        ) : (
                                            <a
                                                href={userData.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                {userData.website}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Réseaux sociaux */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-lg">Réseaux sociaux</h3>
                                <div className="space-y-3">
                                    {['twitter', 'instagram', 'github', 'linkedin'].map((platform) => (
                                        <div key={platform} className="flex items-center gap-3">
                                            {platform === 'twitter' && <FaTwitter className="text-blue-400" />}
                                            {platform === 'instagram' && <FaInstagram className="text-pink-500" />}
                                            {platform === 'github' && <FaGithub className="text-gray-700" />}
                                            {platform === 'linkedin' && <FaLinkedin className="text-blue-600" />}
                                            <div className="flex-1">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        value={formData.social[platform] || ''}
                                                        onChange={(e) => handleSocialChange(platform, e.target.value)}
                                                        className="input input-bordered input-sm w-full"
                                                        placeholder={`@${platform}_username`}
                                                    />
                                                ) : (
                                                    <div className="font-medium">
                                                        {userData.social[platform] || 'Non renseigné'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Paramètres rapides */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <FaCog />
                                    Paramètres rapides
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setShowChangePassword(true)}
                                        className="btn btn-outline btn-sm w-full justify-start gap-2"
                                    >
                                        <FaKey />
                                        Changer le mot de passe
                                    </button>
                                    <button
                                        onClick={handleExportData}
                                        className="btn btn-outline btn-sm w-full justify-start gap-2"
                                    >
                                        <FaDownload />
                                        Exporter mes données
                                    </button>
                                    <Link
                                        to="/settings"
                                        className="btn btn-outline btn-sm w-full justify-start gap-2"
                                    >
                                        <FaShieldAlt />
                                        Confidentialité
                                    </Link>
                                    <button
                                        onClick={() => setShowDeleteAccount(true)}
                                        className="btn btn-outline btn-sm w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:border-red-500"
                                    >
                                        <FaTrash />
                                        Supprimer mon compte
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenu principal */}
                    <div className="lg:w-2/3">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            <div className="stats shadow">
                                <div className="stat">
                                    <div className="stat-figure text-primary">
                                        <FaChartBar />
                                    </div>
                                    <div className="stat-title">Tier Lists</div>
                                    <div className="stat-value">{userData.stats.tierLists}</div>
                                </div>
                            </div>

                            <div className="stats shadow">
                                <div className="stat">
                                    <div className="stat-figure text-secondary">
                                        <FaStar />
                                    </div>
                                    <div className="stat-title">En vedette</div>
                                    <div className="stat-value">{userData.stats.featured}</div>
                                </div>
                            </div>

                            <div className="stats shadow">
                                <div className="stat">
                                    <div className="stat-figure text-accent">
                                        <FaHeart />
                                    </div>
                                    <div className="stat-title">Likes</div>
                                    <div className="stat-value">{userData.stats.likes}</div>
                                </div>
                            </div>

                            <div className="stats shadow">
                                <div className="stat">
                                    <div className="stat-figure text-info">
                                        <FaEye />
                                    </div>
                                    <div className="stat-title">Vues</div>
                                    <div className="stat-value">{userData.stats.views}</div>
                                </div>
                            </div>

                            <div className="stats shadow">
                                <div className="stat">
                                    <div className="stat-title">Abonnés</div>
                                    <div className="stat-value">{userData.stats.followers}</div>
                                </div>
                            </div>

                            <div className="stats shadow">
                                <div className="stat">
                                    <div className="stat-title">Abonnements</div>
                                    <div className="stat-value">{userData.stats.following}</div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="tabs tabs-boxed bg-base-200 p-1 mb-8">
                            <button
                                className={`tab flex-1 ${activeTab === 'tierlists' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('tierlists')}
                            >
                                Toutes les tier lists
                            </button>
                            <button
                                className={`tab flex-1 ${activeTab === 'featured' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('featured')}
                            >
                                En vedette
                            </button>
                            <button
                                className={`tab flex-1 ${activeTab === 'public' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('public')}
                            >
                                Publiques
                            </button>
                            <button
                                className={`tab flex-1 ${activeTab === 'private' ? 'tab-active' : ''}`}
                                onClick={() => setActiveTab('private')}
                            >
                                Privées
                            </button>
                        </div>

                        {/* Liste des tier lists */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredTierLists.map((list) => (
                                <div key={list.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="relative h-48 overflow-hidden">
                                        {list.thumbnail ? (
                                            <img
                                                src={list.thumbnail}
                                                alt={list.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                <FaChartBar className="text-gray-400 text-4xl" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            {list.privacy === 'public' && (
                                                <span className="badge badge-success gap-1">
                          <FaGlobe size={10} />
                          Public
                        </span>
                                            )}
                                            {list.privacy === 'private' && (
                                                <span className="badge badge-error gap-1">
                          <FaLock size={10} />
                          Privé
                        </span>
                                            )}
                                            {list.isFeatured && (
                                                <span className="badge badge-warning gap-1 ml-2">
                          <FaStar size={10} />
                          En vedette
                        </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-lg text-gray-900 mb-2">{list.title}</h3>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="badge badge-outline">{list.category}</span>
                                            <span className="text-sm text-gray-500">
                        {new Date(list.createdAt).toLocaleDateString()}
                      </span>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <FaEye className="text-gray-500" />
                            {list.views}
                        </span>
                                                <span className="flex items-center gap-1">
                          <FaHeart className="text-red-500" />
                                                    {list.likes}
                        </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <Link
                                                to={`/tierlist/${list.id}`}
                                                className="btn btn-primary btn-sm flex-1"
                                            >
                                                <FaEye className="mr-1" />
                                                Voir
                                            </Link>
                                            <Link
                                                to={`/tierlist/edit/${list.id}`}
                                                className="btn btn-outline btn-sm flex-1"
                                            >
                                                <FaEdit className="mr-1" />
                                                Modifier
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredTierLists.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    Aucune tier list trouvée
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    {activeTab === 'private'
                                        ? "Vous n'avez pas encore de tier lists privées"
                                        : "Commencez par créer votre première tier list !"
                                    }
                                </p>
                                <Link to="/tierlist/new" className="btn btn-primary gap-2">
                                    <FaEdit />
                                    Créer une tier list
                                </Link>
                            </div>
                        )}

                        {/* QR Code de profil */}
                        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-white p-4 rounded-xl shadow">
                                    <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded">
                                        <FaQrcode className="text-4xl text-gray-400" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-2">QR Code de profil</h3>
                                    <p className="text-gray-600 mb-4">
                                        Partagez votre profil Rank That facilement avec ce QR Code
                                    </p>
                                    <button className="btn btn-primary gap-2">
                                        <FaDownload />
                                        Télécharger le QR Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showChangeAvatar && <AvatarModal />}
            {showChangePassword && <PasswordModal />}
            {showDeleteAccount && <DeleteAccountModal />}
        </div>
    );
};

export default ProfilePage;