import React, {useState} from 'react';
import {FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import { toast } from 'react-toastify';
import Urls from '../../api/Urls';
import { useAuth } from '../../AuthProvider';
import config from "../../api/apiConfig.js";

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        lastname: '',
        firstname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const { setAuthData } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }
        try {
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                firstname: formData.firstname,
                lastname: formData.lastname
            };
            const res = await fetch(`${config.apiBaseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || 'Échec de l\'inscription');
            }
            const data = await res.json();
            const authPayload = {
                token: data.token,
                currentUser: data.currentUser
            };
            setAuthData(authPayload);
            toast.success('Compte créé et connecté');
            navigate('/');
        } catch (error) {
            toast.error(error.message || 'Erreur lors de l\'inscription');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">

                <div className="w-full md:w-1/2 bg-linear-to-br from-green-500 to-blue-600 hidden md:flex items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 translate-y-32"></div>

                    <div className="relative z-10 text-center text-white max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Rejoignez Rank That
                            </h2>
                            <p className="text-lg text-blue-100">
                                Créez votre compte pour commencer à organiser, classer et partager vos listes préférées.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 p-4">
                    <div className="max-w-md mx-auto">

                        <div className="text-center mb-5">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-linear-to-r from-green-500 to-blue-600 p-3 rounded-full">
                                    <FaUser className="text-white text-2xl" />
                                </div>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                                Créer un compte
                            </h1>
                            <p className="text-gray-600">
                                Rejoignez notre communauté de passionnés
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Nom d'utilisateur *
                                    </span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                        placeholder="Choisissez un nom d'utilisateur unique"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Ce nom sera visible par les autres utilisateurs
                                </p>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Adresse email *
                                    </span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                        placeholder="vous@exemple.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <label className="label">
                                        <span className="label-text font-medium text-gray-700">
                                            Prénom
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="firstname"
                                            value={formData.firstname}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                            placeholder="Votre prénom"
                                        />
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <label className="label">
                                        <span className="label-text font-medium text-gray-700">
                                            Nom
                                        </span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="lastname"
                                            value={formData.lastname}
                                            onChange={handleInputChange}
                                            className="input input-bordered w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Mot de passe *
                                    </span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                        placeholder="Minimum 8 caractères"
                                        minLength="8"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <FaEyeSlash className="text-gray-400 hover:text-gray-600 transition-colors" />
                                        ) : (
                                            <FaEye className="text-gray-400 hover:text-gray-600 transition-colors" />
                                        )}
                                    </button>
                                </div>
                                <div className="mt-2 space-y-1">
                                    <p className="text-xs text-gray-500">Votre mot de passe doit contenir :</p>
                                    <ul className="text-xs text-gray-500 space-y-1 ml-4">
                                        <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                                            <span className="mr-1">•</span>
                                            Au moins 8 caractères
                                        </li>
                                        <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                                            <span className="mr-1">•</span>
                                            Une majuscule
                                        </li>
                                        <li className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
                                            <span className="mr-1">•</span>
                                            Un chiffre
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">
                                        Confirmer le mot de passe *
                                    </span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="text-gray-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`input input-bordered w-full pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'input-error' : ''}`}
                                        placeholder="Retapez votre mot de passe"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash className="text-gray-400 hover:text-gray-600 transition-colors" />
                                        ) : (
                                            <FaEye className="text-gray-400 hover:text-gray-600 transition-colors" />
                                        )}
                                    </button>
                                </div>
                                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="text-red-500 text-xs mt-1">
                                        Les mots de passe ne correspondent pas
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success w-full py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 bg-gradient-to-r from-green-500 to-blue-600 border-none"
                            >
                                Créer mon compte
                                <FaSignInAlt className="ml-2" />
                            </button>

                            <div className="text-center pt-4">
                                <p className="text-gray-600">
                                    Vous avez déjà un compte ?{' '}
                                    <Link to="/auth/login" className="text-green-600 hover:text-green-800 font-semibold transition-colors">
                                        Se connecter
                                    </Link>
                                </p>
                            </div>
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-center text-gray-500">
                                <FaLock className="mr-2" />
                                <p className="text-xs">
                                    Vos données sont sécurisées et cryptées
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:hidden bg-gradient-to-r from-green-500 to-blue-600 p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Commencez votre aventure</h3>
                    <p className="text-blue-100">
                        Rejoignez des milliers d'utilisateurs qui créent déjà leurs classements
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;