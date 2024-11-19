import api from './api';
// 카테고리별 게시글 목록 조회
export const getPostsByCategory = async (category) => {
    const response = await api.get(``, {
        params : { category : category }
    });
    return response.data;
};
// 사용자가 작성한 게시글 조회
export const getMyPosts = async () => {
    const response = await api.get('/my-posts');
    return response.data;
};
// 게시글 상세 조회
export const getPostById = async (id) => {
    const response = await api.get(`/${id}`);
    return response.data;
};
// 게시글 생성
export const createPost = async (postRequest) => {
    const response = await api.post('', postRequest);
    return response.data;
};
// 게시글 수정
export const updatePost = async (id, postRequest) => {
    const response = await api.put(`/${id}`, postRequest);
    return response.data;
};
// 게시글 삭제
export const deletePost = async (id) => {
    await api.delete(`/${id}`);
};