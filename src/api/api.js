import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9000/posts', // spring 서버 url
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json', // 기본 Content-Type 설정
    }
});

export const setAuthHeader = (token) =>{
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

};

export default api;