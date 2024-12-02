/* eslint-disable */
import {useParams, useSearchParams} from "react-router-dom";
import {createComment, getPostById} from "../api/postApi.js";
import {getCommentByPostId} from "../api/postApi.js";
import React, {useEffect, useState} from "react";
import {setAuthHeader} from "../api/api.js";


function PostDetail() {

    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    //const [searchParams] = useSearchParams(); // URL에서 쿼리스트링 읽기

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
        console.log("fetchedComment" + JSON.stringify(fetchedComment));
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
            createComment(id);
        } catch (error) {
            alert("겠냐")
        }
    }

    return (
        <>
            {post ? (
                <div className={"bg-blue-50 rounded-xl font-bold p-10"} style={{margin: "50px 100px -50px 100px"}}>
                    {/*<span> {category[0].title}</span> /!* 해당하는 category 뜨게 할 예정 *!/*/}
                    <div className={"border-amber-100 mb-5"}>
                        <div className={"bg-white mt-5"}> 제목 : {post.title}
                            <p className={"mb-5 text-right"}>조회 {post.viewCount}</p>
                            {/* <p>게시글 id : {post.id}</p> */}
                            <div>내용 : {post.content}</div>
                        </div>

                    </div>
                    <div className={"bg rounded-l p-5"}>
                        <div className={"bg-white flex justify-between"}>
                            <span>댓글 0</span>
                        <button className={"h-10 bg-orange-50 text-right"} type="submit" onClick={handleSubmit}>게시글 작성</button>
                        </div>
                        <div className={"bg-emerald-50 rounded-l p-5 mb-5"}>따뜻한 댓글을 남겨주세요 :)
                            <div>
                                <textarea
                                    value={content}
                                    placeholder="댓글을 입력해주세요 :)"
                                    onChange={(e) => setContent(e.target.value)}
                                    className={"bg-white rounded-l outline-0 resize-none w-2/5 h-10 overflow-auto block m-3"}
                                    required
                                />

                            </div>
                        </div>
                        <div className={"bg-amber-50 p-2"}>
                            <div className={"bg-gray-300"}>
                                {comments.map((comment) => (
                                    <div>{comment.content}</div> //대충 ㅋㅋ
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