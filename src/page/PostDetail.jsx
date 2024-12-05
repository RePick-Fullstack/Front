/* eslint-disable */
import {useParams} from "react-router-dom";
import {clickLike, createComment, getPostById} from "../api/postApi.js";
import {getCommentByPostId} from "../api/postApi.js";
import React, {useEffect, useRef, useState} from "react";
import {setAuthHeader} from "../api/api.js";
import ReLoad from "../assets/reload.svg"
import {useLocation} from "react-router-dom";
import EmptyLike from "../assets/emptylike.svg"
import FullLike from "../assets/fulllike.svg"

function PostDetail() {

    const [isLike, setIsLike] = useState(false);
    const location = useLocation();
    const categoryDescription = location.state?.category || "카테고리 없음";
    const [post, setPost] = useState([]); //게시글
    const [comments, setComments] = useState([]); //등록된 댓글들
    const [content, setContent] = useState(""); //댓글창
    const {id} = useParams();
    const textareaRef = useRef(null);


    useEffect(() => {
        handlePost();
    }, []);

    useEffect(() => {
        handleComment();
    }, [id]);


    const handlePost = async () => {
        console.log(" 클릭한 게시글 id " + id)
        const fetchedPost = await getPostById(id);
        //console.log("fetchedPost 찍음 " + JSON.stringify(fetchedPost, null, 2))
        setPost(fetchedPost);
    }
    const handleComment = async () => {
        const fetchedComment = await getCommentByPostId(id);
        console.log("fetchedComment" + JSON.stringify(fetchedComment, null, 2));
        setComments(fetchedComment.map((comment) => ({
            ...comment,
            isLike: localStorage.getItem(`isLike_${comment.userId}_${comment.id}`) === 'true', //서버에서 isLike값 가져오기 못가져오면 false
        })));
    }

    const handleLike = async (id, commentId) => {

        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("좋아요를 누르려면 로그인이 필요합니다.");
                return;
            }
            setAuthHeader(token);
            await clickLike(id, commentId); // 서버에 좋아요 요청

            setComments(prevComments => {
                const updatedComments = prevComments.map((comment) =>
                    comment.id === commentId
                        ? {
                            ...comment,
                            isLike: !comment.isLike,
                            likeCount: comment.isLike
                                ? comment.likeCount - 1 //좋아요 2번째 클릭 시 감소
                                : comment.likeCount + 1, //좋아요 클릭시 증가
                        }  //좋아요 상태 변화
                        : comment);
                // 해당 댓글의 isLike 상태를 localStorage에 저장
                const updatedComment = updatedComments.find(comment => comment.id === commentId);

                if (updatedComment) {
                    localStorage.setItem(`isLike_${updatedComment.userId}_${commentId}`, updatedComment.isLike);
                }
                return updatedComments;
            });
        } catch (error) {
            alert("좋아요 실패 ㅋ")
        }
    }

    const handleInputChange = (e) => {
        setContent(e.target.value);
        autoResize();
    }
    const autoResize = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // 높이 초기화
            textarea.style.minHeight = "100px";
            textarea.style.height = `${textarea.scrollHeight}px`; // 컨텐츠 크기에 맞게 조정
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) {
            alert('댓글을 입력하세요.');
            return;
        }
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                alert("댓글 작성하려면 로그인이 필요합니다.");
                return;
            }
            setAuthHeader(token);
            console.log(token)
            const commentRequest = {content};
            console.log(commentRequest);
            await createComment(id, commentRequest);
            console.log(id);
            console.log(content);
            await handleComment(); // 댓글 목록 새로고침
            setContent('');
        } catch (error) {
            if (error.request) {
                console.error("서버 요청 실패:", error.request);
            } else if (error.response) {
                console.error("서버 응답 오류:", error.response.data);
            } else {
                console.error("요청 생성 중 오류:", error.message);
            }
            alert("ㅗ");
            setContent('');
        }
    }
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours() + 9).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    return (
        <>
            {post ? (
                <div className={"rounded-xl font-bold p-10 w-4/5"} style={{margin: "-50px 100px -50px 150px"}}>
                    {/*<span> {category[0].title}</span> /!* 해당하는 category 뜨게 할 예정 *!/*/}
                    <div className={"border-amber-100 mb-5"}>
                        <div>{categoryDescription}</div>
                        <div className={"bg-white mt-5 text-2xl"}> {post.title}
                            <div className={"text-sm"}>{formatDateTime(post.createdAt)}</div>
                            <p className={"mb-5 text-right text-sm"}>조회 {post.viewCount}</p>
                            <hr className={"mb-5"}/>
                            <div className={"text-lg font-normal w-4/5 ml-5"}>내용 : {post.content}</div>
                        </div>

                    </div>
                    <div className={"rounded-l p-5"}>
                        <div className={"bg-white flex justify-between"}>
                            <span>댓글 0 <img onClick={() => {
                                location.reload();
                            }} className={"cursor-pointer"} src={ReLoad} alt="ReLoad Logo"/> </span>
                            <button className={"h-10 bg-orange-50 text-right"} type="submit"
                                    onClick={handleSubmit}>등록
                            </button>
                        </div>
                        <div className={"bg-emerald-100 rounded-l p-5 mb-5"}>따뜻한 댓글을 남겨주세요 :)
                            <div>
                                <textarea
                                    ref={textareaRef}
                                    value={content}
                                    placeholder="댓글을 입력해주세요 :)"
                                    onChange={handleInputChange}
                                    className={"bg-white rounded-l outline-0 resize-none w-2/5 h-auto block m-3 min-h-[100px]"}
                                    required
                                />

                            </div>
                        </div>
                        <div className={"bg-white p-2"}>
                            <div className={"bg-white"}>
                                {comments.map((comment) => (
                                    <div>
                                        <hr className={"border-1"}/>
                                        <div className={"text-xl flex flex-row"}>{comment.userNickname}
                                            <img onClick={() => handleLike(id, comment.id)}
                                                 className={"cursor-pointer ml-5"}
                                                 src={comment.isLike ? FullLike : EmptyLike}
                                                 alt={comment.isLike ? "좋아요 누름" : "좋아요 취소"}/>
                                            <div className={"text-xs"}>{comment.likeCount}</div>
                                        </div>
                                        <div className={"w-3/5"}>{comment.content}</div>
                                    </div> //대충 ㅋㅋ
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                <p className={"text-center"}>존재 하지 않는 게시글 입니다.</p>
            )}
        </>
    )
}

export default PostDetail;