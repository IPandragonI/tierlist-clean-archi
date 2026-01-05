import {BrowserRouter, Route, Routes} from 'react-router-dom';
import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/auth/Login.jsx";
import RegisterPage from "./pages/auth/Register.jsx";
import HomePage from "./pages/home/Home.jsx";
import Layout from "./components/layout/Layout.jsx";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path="/" element={<HomePage/>}/>

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