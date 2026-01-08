import React, {useEffect, useState} from 'react';
import {
    closestCorners,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {arrayMove, sortableKeyboardCoordinates,} from '@dnd-kit/sortable';
import {restrictToWindowEdges} from '@dnd-kit/modifiers';
import {
    FaAward,
    FaCertificate,
    FaGhost,
    FaMedal,
    FaPalette,
    FaRibbon,
    FaSave,
    FaShare,
    FaStar,
    FaTrophy
} from 'react-icons/fa';
import GalleryItem from "../../components/tier/Gallery.jsx";
import Tier from "../../components/tier/Tier.jsx";
import config from "../../api/apiConfig.js";
import { useParams } from 'react-router-dom';

const TierListPage = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTierListData();
    }, []);

    useEffect(() => {
        setTierListTitle((data?.name + ' -  by ' + data?.creator?.firstname + ' ' + data?.creator?.lastname) || 'Ma Tier List Personnalisée');
    }, [data]);

    const fetchTierListData = async () => {
        try {
            const response = await fetch(`${config.apiBaseUrl}/tier-lists/${id}`, {
                headers: config.getHeaders(),
            });

            const result = await response.json();
            setData(result);
            console.log(result)
        }catch (error) {

        } finally {
            setLoading(false);
        }
    }
    const tiers = [
        {id: 's', title: 'S', icon: <FaTrophy className="text-yellow-600"/>, color: 'bg-yellow-400', items: []},
        {id: 'a', title: 'A', icon: <FaStar className="text-red-500"/>, color: 'bg-red-400', items: []},
        {id: 'b', title: 'B', icon: <FaAward className="text-orange-500"/>, color: 'bg-orange-400', items: []},
        {id: 'c', title: 'C', icon: <FaMedal className="text-yellow-500"/>, color: 'bg-yellow-300', items: []},
        {id: 'd', title: 'D', icon: <FaCertificate className="text-green-500"/>, color: 'bg-green-400', items: []},
        {id: 'e', title: 'E', icon: <FaRibbon className="text-blue-500"/>, color: 'bg-blue-400', items: []},
        {id: 'f', title: 'F', icon: <FaGhost className="text-gray-500"/>, color: 'bg-gray-400', items: []},
    ];

    const initialGalleryItems = [
        {
            id: 1,
            title: 'The Legend of Zelda',
            category: 'Jeux Vidéo',
            imageUrl: 'https://picsum.photos/seed/zelda/300/200',
            description: 'Jeu d\'aventure culte'
        },
        {
            id: 2,
            title: 'Avatar 2',
            category: 'Films',
            imageUrl: 'https://picsum.photos/seed/avatar/300/200',
            description: 'Blockbuster visuel'
        },
        {
            id: 3,
            title: 'iPhone 15 Pro',
            category: 'Technologie',
            imageUrl: 'https://picsum.photos/seed/iphone/300/200',
            description: 'Smartphone premium'
        },
        {
            id: 4,
            title: 'Pizza Margherita',
            category: 'Nourriture',
            imageUrl: 'https://picsum.photos/seed/pizza/300/200',
            description: 'Classique italien'
        },
        {
            id: 5,
            title: 'Mona Lisa',
            category: 'Art',
            imageUrl: 'https://picsum.photos/seed/monalisa/300/200',
            description: 'Peinture célèbre'
        },
        {
            id: 6,
            title: 'Tesla Model S',
            category: 'Voitures',
            imageUrl: 'https://picsum.photos/seed/tesla/300/200',
            description: 'Voiture électrique'
        },
        {
            id: 7,
            title: 'Harry Potter',
            category: 'Livres',
            imageUrl: 'https://picsum.photos/seed/harrypotter/300/200',
            description: 'Série fantastique'
        },
        {
            id: 8,
            title: 'Michael Jordan',
            category: 'Sports',
            imageUrl: 'https://picsum.photos/seed/jordan/300/200',
            description: 'Légende du basket'
        },
        {
            id: 9,
            title: 'MacBook Pro',
            category: 'Technologie',
            imageUrl: 'https://picsum.photos/seed/macbook/300/200',
            description: 'Ordinateur portable'
        },
        {
            id: 10,
            title: 'Sushi',
            category: 'Nourriture',
            imageUrl: 'https://picsum.photos/seed/sushi/300/200',
            description: 'Spécialité japonaise'
        },
        {
            id: 11,
            title: 'Star Wars',
            category: 'Films',
            imageUrl: 'https://picsum.photos/seed/starwars/300/200',
            description: 'Saga spatiale'
        },
        {
            id: 12,
            title: 'Messi',
            category: 'Sports',
            imageUrl: 'https://picsum.photos/seed/messi/300/200',
            description: 'Génie du football'
        },
    ];

    const [tierData, setTierData] = useState(tiers);
    const [galleryItems, setGalleryItems] = useState(initialGalleryItems);
    const [activeId, setActiveId] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [tierListTitle, setTierListTitle] = useState('Ma Tier List Personnalisée');
    const [searchQuery, setSearchQuery] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
        const itemId = event.active.id.toString();

        const galleryItem = galleryItems.find(item => `gallery-${item.id}` === itemId);
        if (galleryItem) {
            setActiveItem(galleryItem);
            return;
        }

        for (const tier of tierData) {
            const tierItem = tier.items.find(item => item.id === itemId);
            if (tierItem) {
                setActiveItem(tierItem);
                return;
            }
        }
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if (!over) {
            setActiveId(null);
            setActiveItem(null);
            return;
        }

        const activeIdStr = active.id.toString();
        const overId = over.id.toString();

        if (activeIdStr.startsWith('gallery-') && overId.match(/^[sabcdef]$/)) {
            const itemId = parseInt(activeIdStr.replace('gallery-', ''));
            const galleryItem = galleryItems.find(item => item.id === itemId);

            if (galleryItem) {
                setGalleryItems(prev => prev.filter(item => item.id !== itemId));

                setTierData(prev => prev.map(tier =>
                    tier.id === overId
                        ? {...tier, items: [...tier.items, {...galleryItem, id: galleryItem.id.toString()}]}
                        : tier
                ));
            }
        }
        else if (!activeIdStr.startsWith('gallery-') && overId.match(/^[sabcdef]$/)) {
            let sourceTierId = null;
            let draggedItem = null;

            for (const tier of tierData) {
                const item = tier.items.find(item => item.id === activeIdStr);
                if (item) {
                    sourceTierId = tier.id;
                    draggedItem = item;
                    break;
                }
            }

            if (draggedItem && sourceTierId !== overId) {
                setTierData(prev => prev.map(tier => {
                    if (tier.id === sourceTierId) {
                        return {...tier, items: tier.items.filter(item => item.id !== activeIdStr)};
                    }
                    if (tier.id === overId) {
                        return {...tier, items: [...tier.items, draggedItem]};
                    }
                    return tier;
                }));
            }
        }
        else if (activeIdStr !== overId) {
            const tierId = tierData.find(tier =>
                tier.items.some(item => item.id === activeIdStr || item.id === overId)
            )?.id;

            if (tierId) {
                setTierData(prev => prev.map(tier => {
                    if (tier.id === tierId) {
                        const oldIndex = tier.items.findIndex(item => item.id === activeIdStr);
                        const newIndex = tier.items.findIndex(item => item.id === overId);
                        if (oldIndex !== -1 && newIndex !== -1) {
                            return {...tier, items: arrayMove(tier.items, oldIndex, newIndex)};
                        }
                    }
                    return tier;
                }));
            }
        }

        setActiveId(null);
        setActiveItem(null);
    };

    const handleRemoveItem = (itemId) => {
        let removedItem = null;

        setTierData(prev => prev.map(tier => {
            const item = tier.items.find(i => i.id === itemId);
            if (item) {
                removedItem = {...item, id: parseInt(item.id) || item.id};
            }
            return {...tier, items: tier.items.filter(i => i.id !== itemId)};
        }));

        // Remettre dans la galerie
        if (removedItem) {
            const originalId = typeof removedItem.id === 'string' ? parseInt(removedItem.id) : removedItem.id;
            setGalleryItems(prev => [...prev, {...removedItem, id: originalId}]);
        }
    };

    const handleAddFromGallery = (item, tierId = 's') => {
        setGalleryItems(prev => prev.filter(i => i.id !== item.id));
        setTierData(prev => prev.map(tier =>
            tier.id === tierId
                ? {...tier, items: [...tier.items, {...item, id: item.id.toString()}]}
                : tier
        ));
    };

    const handleSave = () => {
        console.log('Tier List sauvegardée:', {title: tierListTitle, tiers: tierData});
        alert('Tier List sauvegardée avec succès !');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({title: tierListTitle, url: window.location.href});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Lien copié dans le presse-papier !');
        }
    };

    const filteredGalleryItems = galleryItems.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div className="text-white text-xl">Chargement de la tier list...</div>
            </div>
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
        >
            <div className="min-h-screen bg-gray-900">
                <div className="bg-gray-800 shadow-lg sticky top-0">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold bg-transparent border-none focus:outline-none text-white w-full">
                                    {tierListTitle}
                                </h2>
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={handleSave} className="btn btn-primary btn-sm">
                                    <FaSave className="mr-2"/> Sauvegarder
                                </button>
                                <button onClick={handleShare} className="btn btn-outline btn-primary btn-sm">
                                    <FaShare className="mr-2"/> Partager
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    <div className="space-y-1 mb-8">
                        {tierData.map((tier) => (
                            <Tier key={tier.id} {...tier} handleRemove={handleRemoveItem}/>
                        ))}
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Galerie</h3>
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-700 text-white border-none"
                                    placeholder="Rechercher..."
                                />
                                <FaPalette className="absolute left-3 top-3 text-gray-400"/>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {filteredGalleryItems.map((item) => (
                                <GalleryItem key={item.id} item={item} handleAddToTier={handleAddFromGallery}/>
                            ))}
                        </div>

                        {filteredGalleryItems.length === 0 && (
                            <div className="text-center py-8 text-gray-400">
                                Aucun item disponible
                            </div>
                        )}
                    </div>
                </div>

                <DragOverlay>
                    {activeItem && (
                        <img src={activeItem.imageUrl} alt={activeItem.title}
                             className="w-16 h-16 object-cover rounded shadow-xl"/>
                    )}
                </DragOverlay>
            </div>
        </DndContext>
    );
};

export default TierListPage;