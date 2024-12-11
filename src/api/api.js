import axios from 'axios';

export const api = axios.create({
    baseURL: 'https://repick.site/api/v1/posts', // spring 서버 url
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json', // 기본 Content-Type 설정
    }
});

export const commentApi = axios.create({
    baseURL: 'https://repick.site/api/v1/posts', // 댓글 서버 url
    timeout: 5000,
    headers:{
        'Content-Type' : 'application/json'
    }
})

export const usersApi = axios.create({
    baseURL: 'http://localhost:8080/api/v1', // user
    headers: {
        'Content-Type': 'application/json', // 기본 Content-Type 설정
    }
});

export const eksApi = axios.create({
    baseURL: 'https://repick.site/api/v1', // spring 서버 url
});

export const realTimeChatApi = axios.create({
    baseURL: 'https://repick.site/api/v1/chatroom', // spring 서버 url
});

export const tosspaymentsApi = axios.create({
    baseURL: 'https://repick.site/api/v1/tosspayments', // spring 서버 url
});

export const setAuthHeader = (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    commentApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;