const Urls = {
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
    },
    tierlist: {
        create: '/api/tierlist/create',
        get: (id) => `/api/tierlist/${id}`,
        update: (id) => `/api/tierlist/${id}/update`,
    }
}

export default Urls;