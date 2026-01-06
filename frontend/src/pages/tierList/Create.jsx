import React, {useState, useEffect} from 'react';
import {FaTrash} from 'react-icons/fa';
import config from "../../api/apiConfig.js";

const emptyLogo = () => ({domain: ''});
const emptyColumn = () => ({name: '', position: 0});

export default function TierListCreate({onSuccess}) {
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [name, setName] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [logos, setLogos] = useState([emptyLogo()]);
    const [columns, setColumns] = useState([emptyColumn()]);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${config.apiBaseUrl}/categories`);
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (ex) {
                console.error('Failed to fetch categories', ex);
            }
        };
        fetchCategories();
    }, []);

    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = 'Le nom est requis';
        if (!columns || columns.length === 0) e.columns = 'Au moins une colonne est requise';
        columns.forEach((c, idx) => {
            if (!c.name || !String(c.name).trim()) e[`column-name-${idx}`] = 'Le nom de colonne est requis';
            if (c.position === '' || Number.isNaN(Number(c.position))) e[`column-pos-${idx}`] = 'Position numérique requise';
        });
        logos.forEach((l, idx) => {
            if (!l.domain || !String(l.domain).trim()) e[`logo-${idx}`] = 'Le domaine du logo est requis';
        });
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleAddLogo = () => setLogos(prev => [...prev, emptyLogo()]);
    const handleRemoveLogo = (i) => setLogos(prev => prev.filter((_, idx) => idx !== i));
    const handleLogoChange = (i, value) => setLogos(prev => prev.map((l, idx) => idx === i ? {
        ...l,
        domain: value
    } : l));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(null);
        if (!validate()) return;

        const payload = {
            name: name.trim(),
            logos: logos.map(l => ({domain: l.domain.trim()})),
            columns: columns.map(c => ({name: String(c.name).trim(), position: Number(c.position)})),
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
                setColumns([emptyColumn()]);
                setErrors({});
                alert('Tier list créée');
            } else if (res.status === 400) {
                const err = await res.json().catch(() => null);
                if (err && err.errors) {
                    const mapped = {};
                    err.errors.forEach(f => {
                        if (f.field && f.defaultMessage) mapped[f.field] = f.defaultMessage;
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
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <h2 className="text-xl font-bold">Créer une nouvelle Tier List</h2>
            <div>
                <label className="block text-sm text-gray-500">Nom</label>
                <input value={name} onChange={e => setName(e.target.value)}
                       className="w-full p-2 rounded bg-gray-100"/>
                {errors.name && <div className="text-red-400 text-sm mt-1">{errors.name}</div>}
            </div>

            <div>
                <label className="block text-sm text-gray-500">Catégorie</label>
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)}
                        className="w-full p-2 rounded bg-gray-100">
                    <option value="">-- Aucune --</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label className="block text-sm text-gray-500">Logos</label>
                    <button type="button" onClick={handleAddLogo} className="text-sm text-blue-400">Ajouter un logo
                    </button>
                </div>
                {logos.map((l, idx) => (
                    <div key={idx} className="flex gap-2 mt-2">
                        <input value={l.domain} onChange={e => handleLogoChange(idx, e.target.value)}
                               placeholder="domain.com" className="flex-1 p-2 rounded bg-gray-100"/>
                        <button type="button" onClick={() => handleRemoveLogo(idx)}
                                className="px-3 rounded text-red-600 hover:cursor-pointer"><FaTrash/>
                        </button>
                        {errors[`logo-${idx}`] &&
                            <div className="text-red-400 text-sm mt-1">{errors[`logo-${idx}`]}</div>}
                    </div>
                ))}
            </div>

            {serverError && <div className="text-red-400 text-sm">{serverError}</div>}

            <div className="flex justify-center mt-10">
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-green-600">
                    {submitting ? 'Envoi...' : 'Créer la Tier List'}
                </button>
            </div>
        </form>
    );
}
