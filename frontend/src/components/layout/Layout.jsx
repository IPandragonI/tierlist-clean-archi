import Header from "./Header.jsx";
import {Outlet} from "react-router-dom";
import Footer from "./Footer.jsx";

const Layout = () => {
    return (
        <div className="flex min-h-screen flex-col">
            <Header/>
            <main className="flex-1 overflow-y-auto">
                <Outlet/>
            </main>
            <Footer />
        </div>
    );
}

export default Layout;