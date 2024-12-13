import {useEffect, useState} from "react";
import axios from "axios";
import {eksApi} from "../../../api/api.js";
import {useNavigate} from "react-router-dom";

export const MainCommunity = () => {
    const [community, setCommunity] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        handleCommunity()
        handlePosts()
    }, []);

    const handlePosts = async () => {
        const {data: posts} = await eksApi.get(`/posts`).catch(() => {
            console.log("server is not running");
        });
        console.log(posts);
        setCommunity(posts);
    };

    const handleCommunity = async () => {
        try {
            const getCommunity = await axios.get("https://repick.site/api/v1/posts");
            console.log("=============================");
            console.log(getCommunity);
            console.log("=============================");
            // posts = 게시물 가져오는 API임. 커뮤니티 가져오는 API를 만들거나 아니면 걍 정적데이터 testMainCommunity 쓰던가 해야됨.
            getCommunity.data;
        } catch {
            console.log("Community is not running");
        }
    }

    return (
        <div className="w-[300px] min-h-[221px] bg-white rounded-[25px] shadow flex flex-col py-3">
            <div className="flex justify-between items-center px-3">
                <p className={"news_title font-bold text-lg pb-3 ml-2"}>커뮤니티</p>
                <div className={"flex text-sm gap-2"}>
                    <button onClick={() => {
                        console.log("조회순 누름")
                    }}>조회순
                    </button>
                    <button onClick={() => {
                        console.log("추천순 누름")
                    }}>추천순
                    </button>
                </div>
            </div>
            <div className="overflow-y-scroll scrollbar-custom pb-2">
                {community.map((item, index) => {
                    return (
                        <div
                            className={"hover:bg-gray-200 text-sm rounded-xl py-2 pl-2 ml-3 flex items-center gap-1"}
                            key={index}>
                            <p
                                className={"w-[170px] cursor-pointer"}
                                onClick={() => {navigate(`/posts/${item.id}`)}}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{color: `black`}}>
                                {item.title}
                            </p>
                            <div className={"flex justify-between items-center gap-1"}>
                                <p>조회수 : </p>
                                <p className={"w-10 text-center"}>{item.viewCount}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}