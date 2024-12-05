import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:9000/api/v1/posts', // spring 서버 url
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json', // 기본 Content-Type 설정
    }
});

export const commentApi = axios.create({
    baseURL: 'http://localhost:9001/api/v1/posts', // 댓글 서버 url
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
    baseURL: 'http://k8s-repick-59dd78f5ea-980331128.us-east-1.elb.amazonaws.com/api/v1', // spring 서버 url
});

export const realTimeChatApi = axios.create({
    baseURL: 'http://ec2-15-168-229-141.ap-northeast-3.compute.amazonaws.com:8402/api/v1/chatroom', // spring 서버 url
});

export const setAuthHeader = (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    commentApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export default api;