import arrow from "../../../../../assets/arrow2.svg";
import {LoadingSvg} from "../../../../../assets/LoadingSvg.jsx";
import React, {useState} from "react";
import axios from "axios";

export const LikeCommentView = () => {
    const [isView, setIsView] = useState(false);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const handlePostView = async () => {
        if(!isView){
            setLoading(false);
            const {data: myComments} = await axios.get("https://repick.site/api/v1/posts/1/comments/users/me/like",{
                headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
            })
            console.log(myComments);
            setComments(myComments);
            setLoading(true);}
        setIsView(!isView);
    }

    return (
        <>
            <div className={"pl-[34px] flex items-center gap-2 h-10"}>
                <div className={"w-20"}>
                    댓글
                </div>
                <img src={arrow} className={`ml-4 w-6 hover:cursor-pointer ${isView && `rotate-180`}`}
                     onClick={handlePostView}></img>
                {!loading && <LoadingSvg h={40} w={40}/>}
            </div>
            {isView && <div
                className="w-full mt-[17px] mb-[17px] p-2 bg-[#F2F2F2] border-[1px] border-[#CCCCCC] rounded text-[14px]">
                {comments.length === 0 && <div className={"w-full text-center"}>좋아요한 댓글이 없습니다.</div>}
                {comments.map((comment, index) => {
                    return (<div key={index} className={"flex items-center gap-2 h-6"}>
                        <div className={"w-36 text-center border-r-[1px] border-black"}>
                            게시글 번호 : {comment.postId}
                        </div>
                        <div>{comment.content}</div>
                    </div>)
                })}
            </div>}
        </>
    );
}