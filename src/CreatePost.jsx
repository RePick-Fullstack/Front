/* eslint-disable */
import './css/CreatePost.css'
import {testMainCommunity} from "./data/testMainCommunity.js";
import React, {useState} from 'react';
import axios from 'axios';

const CreatePost = () => {
    const data = testMainCommunity;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content || !category) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post('/api/community/posts', {
                title,
                content,
                category,
            });
            alert('게시글 작성 완료!');
            console.log('응답 데이터:', response.data);
        } catch (error) {
            console.error('게시글 작성 중 오류 발생:', error);
            alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <>
        <div className="create_container">
            <form onSubmit={handleSubmit}>
                <div className={"m-10"}>
                    <select className="category_select"
                            style={{width:"130px"}}
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                    >
                        <option value="">카테고리 선택</option>
                        {data.slice(1).map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.description}
                            </option>
                        ))}
                    </select>
                </div>
                <label className={"ml-10"}>제목</label>
                <div className={"h-40 w-200 border-solid border-2 p-14 ml-10 mr-10"}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        required
                    />
                </div>
                <div>
                    <label>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        required
                    />
                </div>

                <button type="submit">게시글 작성</button>
            </form>
        </div>
        </>
    );
};

export default CreatePost;