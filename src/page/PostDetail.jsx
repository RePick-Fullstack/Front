/* eslint-disable */
import {useParams} from "react-router-dom";
import {getPostById} from "../api/postApi.js";
import {getCommentByPostId} from "../api/postApi.js";
import {useEffect, useState} from "react";


function PostDetail() {

    const [post, setPost] = useState([]);
    const [comment, setComment] = useState([]);

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
    const handleComment = async () =>{
        const fetchedComment = await getCommentByPostId(id);
        console.log("fetchedComment" + JSON.stringify(fetchedComment));
        setComment(fetchedComment);
    }

    return (
        <>
            {post ? (
                <div className={"bg-gray-300 rounded-xl font-bold p-10"} style={{margin: "50px 100px -50px 100px"}}>
                    {/*<span> {category[0].title}</span> /!* 해당하는 category 뜨게 할 예정 *!/*/}
                    <div className={"border-amber-100 mb-5"}>
                        <div className={"bg-white mt-5"}> 제목 : {post.title}
                            <p className={"mb-5 text-right"}>조회 {post.viewCount}</p>
                            <p>게시글 id : {post.id}</p>
                            <div>내용 : {post.content}</div>
                        </div>

                    </div>
                    <div className={"bg-amber-800 rounded-l p-5"}>댓글 0
                        <div className={"bg-yellow-500 rounded-l p-5 mb-5"}>따뜻한 댓글을 남겨주세요 :)
                            <div><input placeholder={"댓글을 입력해주세요 :)"} className={"bg-white rounded-l"}></input></div>
                        </div>
                        <div className={"bg-amber-50 p-2"}>
                            <div className={"bg-gray-300"}>
                                <span>{comment.content}</span>
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