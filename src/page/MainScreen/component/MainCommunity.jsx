import {useEffect, useState} from "react";
import axios from "axios";
import {eksApi} from "../../../api/api.js";
import {useNavigate} from "react-router-dom";

export const MainCommunity = () => {
    const [community, setCommunity] = useState([]);
    const navigate = useNavigate();
    const [view, setView] = useState(false);

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
        <div
            className="w-[10wv] min-h-[221px] h-[33svh] bg-[#fff] rounded-[20px] border-[3px] border-solid border-[#f5f5f5] shadow-[2px_2px_2px_2px_#f5f5f5] flex flex-col py-3">
            <div className="flex justify-between items-center px-3">
                <p className={"news_title font-b text-[18px] py-2 ml-2"}>인기 급상승 게시글</p>
                <div className={"flex text-[11px] gap-2"}>
                    <ul onClick={()=> setView(!view)}>
                        {view && <Dropdown/>}
                    </ul>
                </div>
            </div>
            <div className="overflow-y-scroll scrollbar-custom pb-2 "
                 style={{animation: `opacityAnimation 1s ease-out forwards`}}>
                {community.map((item, index) => {
                    return (
                        <div
                            className={"hover:bg-gray-200 text-sm rounded-xl py-2 pl-2 ml-3 flex items-center gap-1 cursor-pointer text-[#213457]"}
                            key={index}>
                            <p
                                className={"w-[170px] text-[13px]"}
                                onClick={() => {
                                    navigate(`/posts/${item.id}`)
                                }}
                                target="_blank"
                                rel="noopener noreferrer">
                                {index + 1 + " "}{item.title}
                            </p>
                            <div className={"flex justify-between text-[11px] items-center gap-1"}>
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

function Dropdown() {
    return (
        <>
            <li>조회순</li>
            <li>인기순</li>
        </>
    )
}