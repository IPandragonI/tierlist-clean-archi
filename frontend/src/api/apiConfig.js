const config = {
    apiBaseUrl: 'http://localhost:3000/api',
    baseUrl: 'http://localhost:3000/',
    getHeaders: () => ({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    }),
};

export default config;