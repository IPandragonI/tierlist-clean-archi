import {useAuth} from "../../AuthProvider.jsx";
import {FaBell, FaBookmark, FaCaretDown, FaChartBar, FaCog, FaHome, FaPlus, FaUserCircle} from "react-icons/fa";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";

const Header = () => {
    const {isAuthenticated, user, logout} = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const userMenuRef = useRef(null);
    const notificationsRef = useRef(null);

    // Mock notifications data
    useEffect(() => {
        if (isAuthenticated) {
            setNotifications([
                {id: 1, text: "Votre tier list a reçu 15 likes", time: "2h", read: false},
                {id: 2, text: "@gamer_pro a commenté votre liste", time: "1j", read: false},
                {id: 3, text: "Nouveau follower: @movie_lover", time: "2j", read: true},
                {id: 4, text: "Votre liste est dans les tendances", time: "3j", read: true},
            ]);
        }
    }, [isAuthenticated]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
        }
    };

    const handleLogout = () => {
        logout();
        setShowUserMenu(false);
        navigate("/");
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    const navLinks = [
        {path: "/", label: "Home", icon: <FaHome/>},
        {path: "/tierlist/explore", label: "Explore", icon: <FaChartBar/>},
        {path: "/tierlist/new", label: "Create", icon: <FaPlus/>},
    ];

    return (
        <header className="sticky top-0 z-50 bg-base-100/95 backdrop-blur-md shadow-sm border-b">
            <div className="container mx-auto px-4">
                <div className="navbar">
                    <div className="navbar-start">
                        <div className="dropdown lg:hidden">
                            <div tabIndex={0} role="button" className="btn btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </div>
                            <ul tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow-lg">
                                {navLinks.map((link) => (
                                    <li key={link.path}>
                                        <Link
                                            to={link.path}
                                            className={`flex items-center gap-3 ${location.pathname === link.path ? 'active' : ''}`}
                                        >
                                            {link.icon}
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Link to="/" className="flex items-center gap-2 ml-2 lg:ml-0">
                            <div className="relative">
                                <img src="/icon.png" alt="Rank That Logo" className="w-8 h-8"/>
                            </div>
                            <span
                                className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Rank That
                            </span>
                        </Link>
                    </div>

                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal gap-1">
                            {navLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                            location.pathname === link.path
                                                ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 font-semibold'
                                                : 'hover:bg-base-200'
                                        }`}
                                    >
                                        <span className="text-lg">{link.icon}</span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="navbar-end gap-2">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/tierlist/new"
                                    className="btn btn-primary btn-sm lg:hidden rounded-full"
                                >
                                    <FaPlus/>
                                </Link>

                                <Link
                                    to="/tierlist/new"
                                    className="hidden lg:flex btn btn-primary gap-2 rounded-full px-6 hover:shadow-lg transition-shadow"
                                >
                                    <FaPlus/>
                                    <span>Créer</span>
                                </Link>

                                <div className="relative" ref={notificationsRef}>
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="btn btn-ghost btn-circle relative"
                                    >
                                        <FaBell size={20}/>
                                        {unreadNotifications > 0 && (
                                            <span
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                                {unreadNotifications}
                                            </span>
                                        )}
                                    </button>

                                    {showNotifications && (
                                        <div
                                            className="absolute right-0 mt-2 w-80 bg-base-100 rounded-xl shadow-xl border z-50">
                                            <div className="p-4 border-b">
                                                <h3 className="font-bold">Notifications</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    <ul className="menu">
                                                        {notifications.map((notification) => (
                                                            <li key={notification.id}>
                                                                <a className={`py-3 ${!notification.read ? 'bg-blue-50' : ''}`}>
                                                                    <div className="flex justify-between items-start">
                                                                        <p className="text-sm">{notification.text}</p>
                                                                        <span
                                                                            className="text-xs text-gray-500">{notification.time}</span>
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <div className="p-8 text-center text-gray-500">
                                                        <FaBell className="mx-auto text-3xl mb-2 opacity-50"/>
                                                        <p>Aucune notification</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="flex items-center gap-2 btn btn-ghost rounded-full pl-2 pr-4 hover:bg-base-200 transition-colors"
                                    >
                                        <div className="avatar">
                                            <div
                                                className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
                                                {user?.username?.charAt(0)?.toUpperCase() || <FaUserCircle/>}
                                            </div>
                                        </div>
                                        <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                                            {user?.username || "Utilisateur"}
                                        </span>
                                        <FaCaretDown
                                            className={`transition-transform ${showUserMenu ? 'rotate-180' : ''}`}/>
                                    </button>

                                    {showUserMenu && (
                                        <div
                                            className="absolute right-0 mt-2 w-56 bg-base-100 rounded-xl shadow-xl border z-50">
                                            <div className="p-4 border-b">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div
                                                            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
                                                            {user?.username?.charAt(0)?.toUpperCase() || "U"}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold">{user?.username || "Utilisateur"}</p>
                                                        <p className="text-sm text-gray-500">{user?.email || ""}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <ul className="menu p-2">
                                                <li>
                                                    <Link
                                                        to="/profile"
                                                        onClick={() => setShowUserMenu(false)}
                                                        className="flex items-center gap-3 py-3"
                                                    >
                                                        <FaUserCircle/>
                                                        <span>Mon profil</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/my-tierlists"
                                                        onClick={() => setShowUserMenu(false)}
                                                        className="flex items-center gap-3 py-3"
                                                    >
                                                        <FaBookmark/>
                                                        <span>Mes tier lists</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/settings"
                                                        onClick={() => setShowUserMenu(false)}
                                                        className="flex items-center gap-3 py-3"
                                                    >
                                                        <FaCog/>
                                                        <span>Paramètres</span>
                                                    </Link>
                                                </li>
                                                <div className="divider my-1"></div>
                                                <li>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-3 py-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5"
                                                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                  strokeWidth="2"
                                                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                                                        </svg>
                                                        <span>Déconnexion</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/auth/register" className="btn btn-ghost hidden sm:inline-flex rounded-full">
                                    S'inscrire
                                </Link>
                                <Link to="/auth/login" className="btn btn-primary gap-2 rounded-full">
                                    <FaUserCircle/>
                                    <span>Connexion</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;