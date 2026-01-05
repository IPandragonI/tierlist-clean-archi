import {BrowserRouter, Route, Routes} from 'react-router-dom';
import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/auth/Login.jsx";
import RegisterPage from "./pages/auth/Register.jsx";
import HomePage from "./pages/home/Home.jsx";
import Layout from "./components/layout/Layout.jsx";
import CreateTierListPage from "./pages/tierList/Create.jsx";
import TierListPage from "./pages/tierList/TierList.jsx";
import ExplorePage from "./pages/tierList/Explore.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<HomePage/>}/>

                    <Route path="/tierlist">
                        <Route index element={<CreateTierListPage />}/>
                        <Route path="new" element={<CreateTierListPage />}/>
                        <Route path="explore" element={<ExplorePage />}/>
                        <Route path=":id" element={<TierListPage />}/>
                    </Route>

                    <Route path="/auth">
                        <Route index element={<LoginPage/>}/>
                        <Route path="login" element={<LoginPage/>}/>
                        <Route path="register" element={<RegisterPage/>}/>
                    </Route>

                    <Route path="*" element={<NotFound/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;