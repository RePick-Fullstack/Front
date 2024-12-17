/* eslint-disable */
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {setAuthHeader} from "../api/api.js";
import {translateToEnglish, translateToKorean} from "../data/changeCategory.js";
import {getPostById, updatePost} from "../api/postApi.js";

function EditPost() {
    const navigate = useNavigate();
    const { postId } = useParams();
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
            alert("게시글을 수정하기 위해선 먼저 로그인 하여 주시기 바랍니다.");
            navigate("/community");
            return;
        }

        const fetchPostData = async () => {
            try {
                console.log(postId);
                const postData = await getPostById(postId);
                setTitle(postData.title);
                setContent(postData.content);
                setCategory(translateToKorean(postData.category));
            } catch (error) {
                console.error('게시글을 불러오는 중 오류가 발생하였습니다.: ', error);
                alert("게시글을 불러오는 데 실패했습니다. 다시 시도해주세요.");
            }
        };
        fetchPostData();
    }, [navigate, postId]);


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
            await updatePost(postId, postRequest);
            alert('게시글 작성 완료!');
            navigate("/community");
        } catch (error) {
            console.error('게시글 작성 중 오류 발생:', error);
            alert('게시글 작성에 실패했습니다. 다시 시도해주세요.');
        }
    };
    return (
        <>
            <div className="create_container">
                <div className="Form_header">
                    <span className="category_select cursor-not-allowed opacity-[0.6]">
                        <div className="category_select_toggle">
                            {category || '카테고리 선택'}
                        </div>
                    </span>
                    <span className="submit_button" type="submit" onClick={handleSubmit}>게시글 수정</span>
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
    )
}

export default EditPost;