/* eslint-disable */
import {useParams} from "react-router-dom";
import {createComment, getPostById} from "../api/postApi.js";
import {getCommentByPostId} from "../api/postApi.js";
import React, {useEffect, useState} from "react";
import {setAuthHeader} from "../api/api.js";
import ReLoad from "../assets/reload.svg"
import {useLocation} from "react-router-dom";

function PostDetail() {

    const location = useLocation();
    const categoryDescription = location.state?.category || "카테고리 없음";
    const [post, setPost] = useState([]); //게시글
    const [comments, setComments] = useState([]); //등록된 댓글들
    const [content, setContent] = useState(""); //댓글창

    const {id} = useParams();

    useEffect(() => {
        handlePost()
        handleComment()
    }, []);

    const handlePost = async () => {
        console.log(" 클릭한 게시글 id " + id)
        const fetchedPost = await getPostById(id);
        console.log("fetchedPost 찍음 " + JSON.stringify(fetchedPost, null, 2))
        setPost(fetchedPost);
    }
    const handleComment = async () => {
        const fetchedComment = await getCommentByPostId(id);
        console.log("fetchedComment" + JSON.stringify(fetchedComment, null, 2));
        setComments(fetchedComment);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) {
            alert('댓글을 입력하세요.');
            return;
        }
        try {
            const token = localStorage.getItem("accessToken");
            if (token) {
                setAuthHeader(token);
            }
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

    return (
        <>
            {post ? (
                <div className={"rounded-xl font-bold p-10 w-4/5"} style={{margin: "50px 100px -50px 150px"}}>
                    {/*<span> {category[0].title}</span> /!* 해당하는 category 뜨게 할 예정 *!/*/}
                    <div className={"border-amber-100 mb-5"}>
                        <div>{categoryDescription}</div>
                        <div className={"bg-white mt-5 text-2xl"}> {post.title}
                            <div className={"text-sm"}>{post.createdAt}</div>
                            <p className={"mb-5 text-right text-sm"}>조회 {post.viewCount}</p>
                            <hr className={"mb-5"}/>
                            {/* <p>게시글 id : {post.id}</p> */}
                            <div className={"text-lg font-normal w-4/5 ml-5"}>내용 : {post.content}</div>
                        </div>

                    </div>
                    <div className={"rounded-l p-5"}>
                        <div className={"bg-white flex justify-between"}>
                            <span>댓글 0 <img onClick={() => {
                                location.reload();
                            }} className={"cursor-pointer"} src={ReLoad} alt="ReLoad Logo"/> </span>
                            <button className={"h-10 bg-orange-50 text-right"} type="submit" onClick={handleSubmit}>등록
                            </button>
                        </div>
                        <div className={"bg-emerald-50 rounded-l p-5 mb-5"}>따뜻한 댓글을 남겨주세요 :)
                            <div>
                                <textarea
                                    value={content}
                                    placeholder="댓글을 입력해주세요 :)"
                                    onChange={(e) => setContent(e.target.value)}
                                    className={"bg-white rounded-l outline-0 resize-none w-2/5 h-auto block m-3"}
                                    required
                                />

                            </div>
                        </div>
                        <div className={"bg-white p-2"}>
                            <div className={"bg-white"}>
                                {comments.map((comment) => (
                                    <div>
                                        <div className={"text-xl"}>{comment.userNickname}</div>
                                        <div>{comment.content}</div>
                                        <hr className={"border-2"}/>
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