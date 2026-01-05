import {useAuth} from "../../AuthProvider.jsx";
import {FaUserCircle} from "react-icons/fa";
import {Link} from "react-router-dom";

const Header = () => {

    const {isAuthenticated} = useAuth();

    return (
        <header className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4 6h16M4 12h8m-8 6h16"/>
                        </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link to="/tierlist/explore">Explore</Link></li>
                        <li><Link to="/tierlist/new">Make</Link></li>
                    </ul>
                </div>
                <Link to="/" className="flex items-center">
                    <img src="/icon.png" alt="Logo" className="w-8 h-8 inline-block"/>
                    <a className="btn btn-ghost normal-case text-xl">Rank That</a>
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to="/tierlist/explore">Explore</Link></li>
                    <li><Link to="/tierlist/new">Make</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                {isAuthenticated ? (
                    <button className="btn btn-ghost btn-circle">
                        <FaUserCircle size={24}/>
                    </button>
                ) : (
                    <Link to="/auth/login" className="btn btn-primary">
                        <FaUserCircle className="mr-2"/>
                        Login
                    </Link>
                )}
            </div>
        </header>
    )
}

export default Header;