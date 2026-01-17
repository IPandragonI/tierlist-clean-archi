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
    FaCertificate, FaDownload,
    FaGhost,
    FaMedal,
    FaPalette,
    FaRibbon,
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
    const [loading, setLoading] = useState(true);
    const [tierData, setTierData] = useState([]);
    const [galleryItems, setGalleryItems] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [tierListTitle, setTierListTitle] = useState('Ma Tier List Personnalisée');
    const [searchQuery, setSearchQuery] = useState('');
    const [columnsMap, setColumnsMap] = useState({});

    const tierIconsByPosition = [
        <FaTrophy className="text-yellow-600"/>,
        <FaStar className="text-red-500"/>,
        <FaAward className="text-orange-500"/>,
        <FaMedal className="text-yellow-500"/>,
        <FaCertificate className="text-green-500"/>,
        <FaRibbon className="text-blue-500"/>,
        <FaGhost className="text-gray-500"/>,
    ];

    const tierColorsByPosition = [
        'bg-yellow-400',
        'bg-red-400',
        'bg-orange-400',
        'bg-yellow-300',
        'bg-green-400',
        'bg-blue-400',
        'bg-gray-400',
    ];

    useEffect(() => {
        const fetchTierListData = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/tier-lists/${id}`, {
                    headers: config.getHeaders(),
                });

                if (!response.ok) {
                    console.error('Erreur lors du chargement de la tier list');
                    return;
                }

                const result = await response.json();
                console.log('Données reçues:', result);

                setTierListTitle(
                    result.name +
                    (result.creator ? ` - by ${result.creator.firstname} ${result.creator.lastname}` : '')
                );

                if (result.columns && result.columns.length > 0) {
                    const sortedColumns = [...result.columns].sort((a, b) => a.position - b.position);

                    const columnMapping = {};
                    sortedColumns.forEach(column => {
                        columnMapping[column.name.toLowerCase()] = column;
                    });
                    setColumnsMap(columnMapping);

                    const transformedTiers = sortedColumns.map((column, index) => {
                        const columnId = column.name.toLowerCase();
                        return {
                            id: columnId,
                            title: column.name,
                            icon: tierIconsByPosition[index] || <FaMedal className="text-gray-500"/>,
                            color: tierColorsByPosition[index] || 'bg-gray-400',
                            items: []
                        };
                    });
                    setTierData(transformedTiers);
                }

                if (result.logo && result.logo.length > 0) {
                    const transformedLogos = result.logo.map(logo => ({
                        id: logo.id,
                        title: logo.name || logo.domain,
                        category: result.category?.name || 'Non catégorisé',
                        imageUrl: logo.storedUrl || logo.originalUrl || `https://img.logo.dev/${logo.domain}?token=pk_X-NzFXTFRRWLHBetzHJnvQ`,
                        description: logo.domain,
                        domain: logo.domain
                    }));
                    setGalleryItems(transformedLogos);
                }

            } catch (error) {
                console.error('Erreur lors du chargement:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTierListData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const sensors = useSensors(
        useSensor(PointerSensor, {activationConstraint: {distance: 8}}),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    );

    const saveLogoMove = async (logoId, tierId) => {
        const column = columnsMap[tierId];
        if (!column) {
            console.error('Column not found for tier:', tierId);
            return;
        }

        try {
            const response = await fetch(`${config.apiBaseUrl}/tier-list-logo-moves`, {
                method: 'POST',
                headers: config.getHeaders(),
                body: JSON.stringify({
                    tierListId: parseInt(id),
                    logoId: parseInt(logoId),
                    columnId: column.id
                })
            });

            if (!response.ok) {
                console.error('Erreur lors de la sauvegarde du mouvement');
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du mouvement:', error);
        }
    };

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

                saveLogoMove(galleryItem.id, overId);
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

                saveLogoMove(draggedItem.id, overId);
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

    const handleAddFromGallery = (item, tierId) => {
        setGalleryItems(prev => prev.filter(i => i.id !== item.id));
        setTierData(prev => prev.map(tier =>
            tier.id === tierId
                ? {...tier, items: [...tier.items, {...item, id: item.id.toString()}]}
                : tier
        ));

        saveLogoMove(item.id, tierId);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({title: tierListTitle, url: window.location.href});
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Lien copié dans le presse-papier !');
        }
    };

    const handleExport = async () => {
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
                                <button onClick={handleShare} className="btn btn-outline btn-primary btn-sm">
                                    <FaShare className="mr-2"/> Partager
                                </button>
                                <button onClick={handleExport} className="btn btn-outline btn-primary btn-sm">
                                    <FaDownload className="mr-2"/> Exporter toutes les statistiques
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-6">
                    <div className="space-y-1 mb-8">
                        {tierData.map((tier) => (
                            <Tier key={tier.id} {...tier}/>
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