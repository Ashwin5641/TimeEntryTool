import axios from "axios";

const api = axios.create({
    baseURL: 'http://172.21.4.36:3000',
    withCredentials: true
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config;
    },

    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/refresh')) {
            originalRequest._retry = true

            try {
                const res = await api.post('/auth/refresh');

                const newAccessToken = res.token;

                localStorage.setItem('token', newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
                window.location.href = '/login';

                return Promise.reject(err);
            }
        }
        return Promise.reject(error)
    }
)

export default api;