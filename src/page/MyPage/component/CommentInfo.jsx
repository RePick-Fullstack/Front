import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export const CommentInfo = () => {
    const [comments, setComments] = useState([]);
    const [likeComments, setLikeComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isView, setIsView] = useState(false);
    const [isLikeView, setIsLikeView] = useState(false);
    const navigate = useNavigate();

    const handleCommentView = async () => {
        setIsView(!isView);
        setLoading(false);
        const {data: myComments} = await axios.get("https://repick.site/api/v1/posts/1/comments/users/me",{
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        })
        console.log(myComments);
        setComments(myComments);
        setLoading(true);
    }

    const handleLikeCommentView = async () => {
        setIsLikeView(!isLikeView);
        setLoading(false);
        const {data: myLikes} = await axios.get("https://repick.site/api/v1/posts/1/comments/users/me/like",{
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        })
        console.log(myLikes);
        setLikeComments(myLikes);
        setLoading(true);
    }

    return (
        <div>
            <div className={"font-bold text-2xl mb-2 mt-5"}>댓글정보</div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>작성한 댓글</div>
                <div className={"w-64"}></div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                    onClick={handleCommentView}>
                    보기
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
            {isView &&
                <div>
                    {comments.length === 0 ? <div>
                            <div className="w-full h-16 flex items-center px-2 justify-center">
                                작성한 댓글이 없습니다.
                            </div>
                            <hr className="border-t-[2.4px]"/>
                        </div> :
                        comments.map((comments, index) => {
                            return (
                                <div key={index}>
                                    <div className="w-full py-2 px-2 h-16 flex items-center justify-between bg-gray-100">
                                        <div className={"w-48"}>카테고리 : {}</div>
                                        <div className={"w-64"}>내용 : {comments.content}</div>

                                        <div
                                            className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                                            onClick={() => {navigate(`/posts/${comments.postId}`)}}>
                                            열기
                                        </div>
                                    </div>
                                    <hr className="border-t-[2.4px]"/>
                                </div>
                            )
                        })}
                </div>
            }
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>좋아요 한 댓글</div>
                <div className={"w-64"}></div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                    onClick={handleLikeCommentView}>
                    보기
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
            {isLikeView &&
                <div>
                    {likeComments.length === 0 ? <div>
                            <div className="w-full h-16 flex items-center px-2 justify-center">
                                좋아요 한 댓글이 없습니다.
                            </div>
                            <hr className="border-t-[2.4px]"/>
                        </div> :
                        likeComments.map((comments, index) => {
                            return (
                                <div key={index}>
                                    <div className="w-full py-2 px-2 h-16 flex items-center justify-between bg-gray-100">
                                        <div className={"w-48"}>카테고리 : {}</div>
                                        <div className={"w-64"}>내용 : {comments.content}</div>
                                        <div
                                            className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                                            onClick={() => {navigate(`/posts/${comments.postId}`)}}>
                                            열기
                                        </div>
                                    </div>
                                    <hr className="border-t-[2.4px]"/>
                                </div>
                            )
                        })}
                </div>
            }
        </div>
    )
}