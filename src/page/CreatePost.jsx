/* eslint-disable */
import '../css/CreatePost.css'
import {testMainCommunity} from "../data/testMainCommunity.js";
import {useState} from 'react';
import {setAuthHeader} from "../api/api.js";
import {useNavigate} from "react-router-dom";
import {createPost} from "../api/postApi.js";
import {translateToEnglish} from "../data/changeCategory.js";

const CreatePost = () => {
    const navigate = useNavigate();
    const data = testMainCommunity;
    const [isOpen, setIsOpen] = useState(false);
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
            const token = localStorage.getItem("accessToken");
            if (token) {
                setAuthHeader(token);
            }
            const postRequest = {title, content, category: translateToEnglish(category)};
            console.log("전송데이터 : " + JSON.stringify(postRequest, null, 2));
            await createPost(postRequest);
            alert('게시글 작성 완료!');
            navigate("/community")
            console.log('응답 데이터:', postRequest.data);
        } catch (error) {
            console.log(title);
            console.log(content);
            console.log(category);
            console.error('게시글 작성 중 오류 발생:', error);
            alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
        }
    };
    const handleCategorySelect = (title, description) => {
        setCategory(description);
        console.log("title : " + title);
        console.log("description : " + description);
        setIsOpen(false);
    }

    return (
        <>
            <div className="create_container">
                <div className="Form_header">
                        <span className="category_select">
                            <div className="category_select_toggle"
                                 onClick={() => setIsOpen(!isOpen)}>
                                {category || '카테고리 선택'}
                            </div>
                            {isOpen && (
                                <ul className="category_select_menu">
                                    {data.slice(1).map((cat) => (
                                        <li
                                            key={cat.value}
                                            value={cat.title}
                                            onClick={() => handleCategorySelect(cat.title, cat.description)}
                                            className="dropdown_item"
                                        >
                                            {cat.description}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </span>
                    <span className="submit_button" type="submit" onClick={handleSubmit}>게시글 작성</span>
                </div>
                <div className={"caret-transparent"}>
                    <input
                        type="text"
                        className="title_write"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 입력하세요"
                        required
                    />
                </div>
                <div>
                    <textarea
                        value={content}
                        className="content_write"
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                        required
                    />
                </div>
            </div>
        </>
    );
};

export default CreatePost;