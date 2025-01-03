import arrow from "../../../../../assets/arrow2.svg";
import {LoadingSvg} from "../../../../../assets/LoadingSvg.jsx";
import {changeCategory} from "../../../../../data/changeCategory.js";
import React, {useState} from "react";
import axios from "axios";

export const LikePostView = () => {
    const [isView, setIsView] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const handlePostView = async () => {
        if(!isView){
            setLoading(false);
            const {data: myLikes} = await axios.get("https://repick.site/api/v1/posts/users/me/like",{
                headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
            })
            console.log(myLikes);
            setPosts(myLikes);
            setLoading(true);}
        setIsView(!isView);
    }

    return (
        <>
            <div className={"pl-[34px] flex items-center gap-2 h-10"}>
                <div className={"w-20"}>
                    게시글
                </div>
                <img src={arrow} className={`ml-4 w-6 hover:cursor-pointer ${isView && `rotate-180`}`}
                     onClick={handlePostView}></img>
                {!loading && <LoadingSvg h={40} w={40}/>}
            </div>
            {isView && <div
                className="w-full mt-[17px] mb-[17px] p-2 bg-[#F2F2F2] border-[1px] border-[#CCCCCC] rounded text-[14px]">
                {posts.length === 0 && <div className={"w-full text-center"}>좋아요한 게시글이 없습니다.</div>}
                {posts.map((post, index) => {
                    return (<div key={index} className={"flex items-center gap-2 h-6"}>
                        <div className={"w-36 text-center border-r-[1px] border-black"}>
                            {post.id}
                        </div>
                        <div>{post.content}</div>
                    </div>)
                })}
            </div>}
        </>
    );
}