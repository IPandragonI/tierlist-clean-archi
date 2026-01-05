import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginWithEmail, setIsLoginWithEmail] = useState(true);
    const [formData, setFormData] = useState({
        emailOrUsername: '',
        password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login attempt with:', formData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">

                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16">
                    <div className="max-w-md mx-auto">
                        <div className="text-center mb-10">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-linear-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                                    <FaSignInAlt className="text-white text-2xl" />
                                </div>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                                Bienvenue à nouveau
                            </h1>
                            <p className="text-gray-600">
                                Connectez-vous pour accéder à votre espace personnel
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="label">
                                  <span className="label-text font-medium text-gray-700">
                                    Email ou Nom d'utilisateur
                                  </span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={isLoginWithEmail ? formData.email : formData.username}
                                        onChange={handleInputChange}
                                        className="input input-bordered w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder={isLoginWithEmail ? "vous@exemple.com" : "votre_nom_utilisateur"}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">
                                    <span className="label-text font-medium text-gray-700">Mot de passe</span>
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
                                        className="input input-bordered w-full pl-10 pr-12 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="Votre mot de passe"
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
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="cursor-pointer flex items-center">
                                    <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                                    <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
                                </label>
                                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                                    Mot de passe oublié ?
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full py-3 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 bg-linear-to-r from-blue-500 to-purple-600 border-none"
                            >
                                Se connecter
                                <FaSignInAlt className="ml-2" />
                            </button>

                            <div className="divider text-gray-400">ou</div>

                            <div className="text-center">
                                <p className="text-gray-600">
                                    Pas encore de compte ?{' '}
                                    <a href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                        S'inscrire gratuitement
                                    </a>
                                </p>
                            </div>
                        </form>

                        <div className="mt-10 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 text-center">
                                En vous connectant, vous acceptez nos{' '}
                                <a href="#" className="hover:text-blue-600 transition-colors">Conditions d'utilisation</a>
                                {' '}et notre{' '}
                                <a href="#" className="hover:text-blue-600 transition-colors">Politique de confidentialité</a>.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 bg-linear-to-br from-blue-500 to-purple-700 hidden md:flex items-center justify-center p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 translate-y-32"></div>

                    <div className="relative z-10 text-center text-white max-w-md">
                        <div className="mb-8">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                                Rank That
                            </h2>
                            <p className="text-lg text-blue-100">
                                Connectez-vous partout, à tout moment pour créer vos tiers-lists personnalisés.
                            </p>
                        </div>

                        <div className="relative mx-auto max-w-xs">
                            <div className="w-full h-64 rounded-2xl overflow-hidden shadow-2xl">
                                <div className="w-full h-full bg-linear-to-br bg-white flex items-center justify-center">
                                    <img
                                        src="/logo.png"
                                        alt="Rank That Logo"
                                        className="w-32 h-32 object-contain animate-pulse"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:hidden bg-linear-to-r from-blue-500 to-purple-600 p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Connectez-vous partout</h3>
                    <p className="text-blue-100">
                        Accédez à votre compte depuis n'importe quel appareil
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;