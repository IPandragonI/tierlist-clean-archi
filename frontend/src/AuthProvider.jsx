import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {toast} from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({children, pollInterval = 1000}) => {
    const getTokenFromStorage = () => window.localStorage.getItem('token');

    const [token, setTokenState] = useState(getTokenFromStorage());
    const [currentUser, setCurrentUser] = useState(JSON.parse(window.localStorage.getItem('currentUser')) || null);
    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getTokenFromStorage()));

    const applyToken = useCallback((newToken) => {
        setTokenState(newToken);
        setIsAuthenticated(Boolean(newToken));
    }, []);

    const setAuthData = useCallback((auth) => {
        if (!auth) {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('currentUser');
            applyToken(null);
            window.location = '/auth/login';
            toast('Vous avez été déconnecté.', { type: 'info' });
            return;
        }

        const newToken = typeof auth === 'string' ? auth : (auth.token ?? null);
        const loggedUser = typeof auth === 'object' ? (auth.currentUser ?? null) : null;

        if (newToken) {
            window.localStorage.setItem('token', newToken);
            if (loggedUser) window.localStorage.setItem('currentUser', JSON.stringify(loggedUser));
            applyToken(newToken);
        } else {
            window.localStorage.removeItem('token');
            window.localStorage.removeItem('currentUser');
            applyToken(null);
        }
    }, [applyToken]);

    const logout = useCallback(() => {
        setAuthData(null);
    }, [setAuthData]);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === 'token') {
                applyToken(e.newValue);
            }
            if (e.key === 'currentUser') {
                setCurrentUser(e.newValue);
            }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [applyToken]);

    useEffect(() => {
        let cancelled = false;
        let last = getTokenFromStorage();

        const tick = () => {
            if (cancelled) return;
            const current = getTokenFromStorage();
            if (current !== last) {
                last = current;
                applyToken(current);
            }
        };

        const id = setInterval(tick, pollInterval);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [applyToken, pollInterval]);

    useEffect(() => {
        setCurrentUser(JSON.parse(window.localStorage.getItem('currentUser')) || null);
    }, [token]);

    const value = {
        token,
        isAuthenticated,
        setAuthData,
        logout,
        currentUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (ctx === null) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
};
