import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9000/communities', // spring 서버 url
    timeout: 5000,
});

export const setAuthHeader = (token) =>{
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

};

export default api;