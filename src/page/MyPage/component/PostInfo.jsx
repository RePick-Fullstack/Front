import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export const PostInfo = () => {
    const [posts, setPosts] = useState([]);
    const [likePosts, setLikePosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isView, setIsView] = useState(false);
    const [isLikeView, setIsLikeView] = useState(false);
    const navigate = useNavigate();

    const handlePostView = async () => {
        setIsView(!isView);
        setLoading(false);
        const {data: myPosts} = await axios.get("https://repick.site/api/v1/posts/users/me",{
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        })
        console.log(myPosts);
        setPosts(myPosts);
        setLoading(true);
    }

    const handleLikePostView = async () => {
        setIsLikeView(!isLikeView);
        setLoading(false);
        const {data: myLikes} = await axios.get("https://repick.site/api/v1/posts/users/me/like",{
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        })
        console.log(myLikes);
        setLikePosts(myLikes);
        setLoading(true);
    }

    return (
        <div>
            <div className={"font-bold text-2xl mb-2 mt-5"}>게시글정보</div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>작성한 게시글</div>
                <div className={"w-64"}></div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                    onClick={handlePostView}>
                    {isView ? `닫기` : `보기`}
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
            {isView &&
                <div>
                    {posts.length === 0 ? <div>
                            <div className="w-full h-16 flex items-center px-2 justify-center">
                            작성한 게시글이 없습니다.
                            </div>
                            <hr className="border-t-[2.4px]"/>
                        </div> :
                        posts.map((posts, index) => {
                            return (
                                <div key={index}>
                                    <div className="w-full py-2 px-2 h-16 flex items-center justify-between bg-gray-100">
                                        <div className={"w-48"}>카테고리 : {posts.category}</div>
                                        <div className={"w-64"}>제목 : {posts.title}</div>
                                        <div
                                            className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                                            onClick={() => {navigate(`/posts/${posts.id}`)}}>
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
                <div className={"w-48"}>좋아요 한 게시글</div>
                <div className={"w-64"}></div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                    onClick={handleLikePostView}>
                    {isLikeView ? `닫기` : `보기`}
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
            {isLikeView &&
                <div>
                    {likePosts.length === 0 ? <div>
                            <div className="w-full h-16 flex items-center px-2 justify-center">
                                좋아요 한 게시글이 없습니다.
                            </div>
                            <hr className="border-t-[2.4px]"/>
                        </div> :
                        likePosts.map((posts, index) => {
                            return (
                                <div key={index}>
                                    <div className="w-full py-2 px-2 h-16 flex items-center justify-between bg-gray-100">
                                        <div className={"w-48"}>카테고리 : {posts.category}</div>
                                        <div className={"w-64"}>제목 : {posts.title}</div>
                                        <div
                                            className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                                            onClick={() => {navigate(`/posts/${posts.id}`)}}>
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