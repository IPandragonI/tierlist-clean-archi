import React, {useEffect, useState} from 'react';
import {FaPlus, FaSpinner, FaTrash} from 'react-icons/fa';
import config from "../../api/apiConfig.js";

const emptyLogo = () => ({domain: ''});
const defaultColumns = () => ([
    {name: 'S', position: 0},
    {name: 'A', position: 1},
    {name: 'B', position: 2},
    {name: 'C', position: 3},
    {name: 'D', position: 4},
    {name: 'E', position: 5},
    {name: 'F', position: 6},
])

export default function TierListCreate({onSuccess}) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [logos, setLogos] = useState([emptyLogo()]);
    const [columns, setColumns] = useState(defaultColumns());
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${config.apiBaseUrl}/categories`);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (ex) {
                console.error('Failed to fetch categories', ex);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = 'Le nom est requis';

        if (!columns || columns.length === 0) {
            e.columns = 'Au moins une colonne est requise';
        } else {
            columns.forEach((c, idx) => {
                if (!c.name || !String(c.name).trim()) {
                    e[`column-name-${idx}`] = 'Le nom de colonne est requis';
                }
                if (c.position === '' || Number.isNaN(Number(c.position))) {
                    e[`column-pos-${idx}`] = 'Position numérique requise';
                }
            });
        }

        logos.forEach((l, idx) => {
            if (!l.domain || !String(l.domain).trim()) {
                e[`logo-${idx}`] = 'Le domaine du logo est requis';
            }
        });

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleAddLogo = () => {
        setLogos(prev => [...prev, emptyLogo()]);
    };

    const handleRemoveLogo = (index) => {
        if (logos.length > 1) {
            setLogos(prev => prev.filter((_, idx) => idx !== index));
        }
    };

    const handleLogoChange = (index, value) => {
        setLogos(prev => prev.map((l, idx) =>
            idx === index ? {...l, domain: value} : l
        ));
    };

    const handleAddColumn = () => {
        const nextPosition = columns.length > 0
            ? Math.max(...columns.map(c => c.position)) + 1
            : 0;
        setColumns(prev => [...prev, {name: '', position: nextPosition}]);
    };

    const handleRemoveColumn = (index) => {
        if (columns.length > 1) {
            setColumns(prev => prev.filter((_, idx) => idx !== index));
        }
    };

    const handleColumnChange = (index, field, value) => {
        setColumns(prev => prev.map((col, idx) =>
            idx === index ? {...col, [field]: value} : col
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        if (!validate()) return;

        const payload = {
            name: name.trim(),
            logos: logos.map(l => ({domain: l.domain.trim()})),
            columns: columns.map(c => ({
                name: String(c.name).trim(),
                position: Number(c.position)
            })),
            categoryId: categoryId ? Number(categoryId) : null
        };

        setSubmitting(true);
        try {
            const res = await fetch(`${config.apiBaseUrl}/tier-lists`, {
                method: 'POST',
                headers: config.getHeaders(),
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json().catch(() => null);
                if (onSuccess) onSuccess(data);
                setName('');
                setCategoryId('');
                setLogos([emptyLogo()]);
                setColumns([defaultColumns()])
                setErrors({});
                setServerError(null);
            } else if (res.status === 400) {
                const err = await res.json().catch(() => null);
                if (err?.errors) {
                    const mapped = {};
                    err.errors.forEach(f => {
                        if (f.field && f.defaultMessage) {
                            mapped[f.field] = f.defaultMessage;
                        }
                    });
                    setErrors(mapped);
                } else {
                    setServerError('Erreur de validation côté serveur');
                }
            } else {
                setServerError(`Erreur serveur (${res.status})`);
            }
        } catch (ex) {
            setServerError('Impossible de joindre le serveur');
            console.error('Submit error:', ex);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 transition-colors duration-200"
                >
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Créer une nouvelle Tier List
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Remplissez les informations ci-dessous pour créer votre tier list personnalisée
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Informations de base
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nom de la tier list *
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Meilleurs sites e-commerce 2024"
                                className={`w-full px-4 py-3 rounded-lg border ${
                                    errors.name
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-20 focus:outline-none transition-all duration-200`}
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Catégorie
                            </label>
                            <div className="relative">
                                {loading ? (
                                    <div
                                        className="flex items-center justify-center px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                        <FaSpinner className="animate-spin text-gray-400 dark:text-gray-500 mr-2"/>
                                        <span
                                            className="text-gray-500 dark:text-gray-400">Chargement des catégories...</span>
                                    </div>
                                ) : (
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:outline-none appearance-none cursor-pointer transition-all duration-200"
                                    >
                                        <option value="">-- Sélectionnez une catégorie --</option>
                                        {categories.map(cat => (
                                            <option
                                                key={cat.id}
                                                value={cat.id}
                                                className="bg-white dark:bg-gray-700"
                                            >
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Logos
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Ajoutez les domaines des logos à évaluer
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddLogo}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200 font-medium"
                            >
                                <FaPlus className="text-sm"/>
                                Ajouter un logo
                            </button>
                        </div>

                        <div className="space-y-4">
                            {logos.map((logo, index) => (
                                <div key={index} className="flex gap-3 items-start">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <input
                                                value={logo.domain}
                                                onChange={(e) => handleLogoChange(index, e.target.value)}
                                                placeholder="exemple.com"
                                                className={`w-full px-4 py-3 rounded-lg border ${
                                                    errors[`logo-${index}`]
                                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                        : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-opacity-20 focus:outline-none pr-12 transition-all duration-200`}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    .com
                                                </span>
                                            </div>
                                        </div>
                                        {errors[`logo-${index}`] && (
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                {errors[`logo-${index}`]}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveLogo(index)}
                                        disabled={logos.length <= 1}
                                        className={`px-4 py-3 rounded-lg transition-colors duration-200 ${
                                            logos.length <= 1
                                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                        }`}
                                        title={logos.length <= 1 ? "Au moins un logo est requis" : "Supprimer ce logo"}
                                    >
                                        <FaTrash/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Colonnes
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Définissez les catégories de classement (S, A, B, C...)
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddColumn}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 font-medium"
                            >
                                <FaPlus className="text-sm"/>
                                Ajouter une colonne
                            </button>
                        </div>

                        <div className="space-y-4">
                            {columns.map((column, index) => (
                                <div key={index}
                                     className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700">
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nom de la colonne *
                                        </label>
                                        <input
                                            value={column.name}
                                            onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                                            placeholder="Ex: S, A, B, C..."
                                            className={`w-full px-3 py-2 rounded border ${
                                                errors[`column-name-${index}`]
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:outline-none transition-all duration-200`}
                                        />
                                        {errors[`column-name-${index}`] && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors[`column-name-${index}`]}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Position *
                                        </label>
                                        <input
                                            type="number"
                                            value={column.position}
                                            onChange={(e) => handleColumnChange(index, 'position', e.target.value)}
                                            placeholder="0, 1, 2..."
                                            className={`w-full px-3 py-2 rounded border ${
                                                errors[`column-pos-${index}`]
                                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                                            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:outline-none transition-all duration-200`}
                                        />
                                        {errors[`column-pos-${index}`] && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors[`column-pos-${index}`]}
                                            </p>
                                        )}
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveColumn(index)}
                                            disabled={columns.length <= 1}
                                            className={`px-3 py-2 rounded text-sm transition-colors duration-200 ${
                                                columns.length <= 1
                                                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                    : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                                            }`}
                                        >
                                            Supprimer cette colonne
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {serverError && (
                        <div
                            className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <p className="text-red-700 dark:text-red-400 font-medium">
                                {serverError}
                            </p>
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm('Voulez-vous vraiment annuler ? Les données seront perdues.')) {
                                        setName('');
                                        setCategoryId('');
                                        setLogos([emptyLogo()]);
                                        setColumns([emptyColumn()]);
                                        setErrors({});
                                        setServerError(null);
                                    }
                                }}
                                className="px-6 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                disabled={submitting}
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                            >
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <FaSpinner className="animate-spin"/>
                                        Création en cours...
                                    </span>
                                ) : (
                                    'Créer la Tier List'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}