/* eslint-disable */
import '../css/CreatePost.css';
import {testMainCommunity} from "../data/testMainCommunity.js";
import {useEffect, useState} from 'react';
import {setAuthHeader} from "../api/api.js";
import {useNavigate} from "react-router-dom";
import {createPost} from "../api/postApi.js";
import {translateToEnglish, translateToKorean} from "../data/changeCategory.js";

const CreatePost = () => {
    const navigate = useNavigate();
    const data = testMainCommunity;
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        // 로컬 스토리지에서 카테고리 값을 가져와서 한글로 변환하여 상태에 설정
        const storedCategory = localStorage.getItem('selectedCategory');
        if (storedCategory) {
            const koreanCategory = translateToKorean(storedCategory); // 영어 -> 한글 변환
            setCategory(koreanCategory);
        }

        // 로그인 여부 확인
        if (localStorage.getItem("accessToken") === null) {
            alert("게시글을 작성하기 위해선 먼저 로그인 하여 주시기 바랍니다.");
            navigate("/community");
            return;
        }
    }, [navigate]);

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

            // 게시글 데이터 전송
            const postRequest = {title, content, category: translateToEnglish(category)};
            console.log("전송데이터 : " + JSON.stringify(postRequest, null, 2));
            await createPost(postRequest);
            alert('게시글 작성 완료!');
            navigate("/community");
        } catch (error) {
            console.error('게시글 작성 중 오류 발생:', error);
            alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleCategorySelect = (title, description) => {
        // 선택한 카테고리 저장
        setCategory(description);
        localStorage.setItem('selectedCategory', title); // 선택된 카테고리 영어 값 로컬 스토리지에 저장
        setIsOpen(false); // 드롭다운 닫기
    };

    return (
        <>
            <div className="create_container">
                <div className="Form_header">
                    <span className="category_select">
                        <div className="category_select_toggle" onClick={() => setIsOpen(!isOpen)}>
                            {category || '카테고리 선택'}
                        </div>
                        {isOpen && (
                            <ul className="category_select_menu overflow-y-scroll scrollbar-custom">
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
                    <span className="border-2 border-b-fuchsia text-[15px] bg-[#303E4F] text-white py-2.5 px-5 mx-2.5 my-2 rounded-[20px]" type="submit" onClick={handleSubmit}>게시글 작성</span>
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