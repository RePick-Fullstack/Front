/* eslint-disable */
import {useEffect, useState} from "react";
import axios from "axios";
import {eksApi} from "../../../api/api.js";
import {useNavigate} from "react-router-dom";

export const MainCommunity = () => {
    const [community, setCommunity] = useState([]);
    const navigate = useNavigate();
    const [view, setView] = useState(false);
    const [selected, setSelected] = useState("조회순");
    const [viewOrLike, setViewOrLike] = useState("조회순");

    useEffect(() => {
        handleCommunity()
        handlePosts()
    }, []);

    const handlePosts = async () => {
        const {data: posts} = await eksApi.get(`/posts`).catch(() => {
            console.log("server is not running");
        });
        console.log(posts);
        const sortedPosts = sortCommunity(posts,'조회순');
        setCommunity(sortedPosts);
    };

    const handleCommunity = async () => {
        try {
            const getCommunity = await axios.get("https://repick.site/api/v1/posts");
            console.log("=============================");
            console.log(getCommunity);
            console.log("=============================");
            // posts = 게시물 가져오는 API임. 커뮤니티 가져오는 API를 만들거나 아니면 걍 정적데이터 testMainCommunity 쓰던가 해야됨.
            const sortedCommunity = sortCommunity(getCommunity.data,'조회순'); //정렬후 업데이트
            setCommunity(sortedCommunity);
        } catch {
            console.log("Community is not running");
        }
    }
    const handleSelect = (value) => {
        setSelected(value);
        setView(false);
        const sorted = sortCommunity(community,value);
        setCommunity(sorted);
    };

    const sortCommunity = (data, sortBy) => {
        const sorted = [...data].sort((a, b) => {
            if (sortBy === '조회순') {
                return b.viewCount - a.viewCount; // 조회수 내림차순
            } else if (sortBy === '인기순') {
                return b.likesCount - a.likesCount; // 좋아요 내림차순
            }
            return 0;
        });
        return sorted;
    };


    return (
        <div
            className="w-[10wv] min-h-[221px] h-[33svh] bg-[#fff] rounded-[20px] border-[3px] border-solid border-[#f5f5f5] shadow-[2px_2px_2px_2px_#f5f5f5] flex flex-col py-3">
            <div className="flex justify-between items-center px-3">
                <p className={"news_title font-b text-[18px] py-2 ml-2"}>인기 급상승 게시글</p>
                <div className={"flex text-[11px] gap-2 mb-2 hover:cursor-pointer"}>
                    <ul className={"caret-transparent"} onClick={()=> setView(!view)}>
                        {view ? '' : `${selected} ▼`}
                        {view && <Dropdown onSelect = {handleSelect} setViewOrLike={setViewOrLike}/>}
                    </ul>
                </div>
            </div>
            <div className="overflow-y-scroll scrollbar-custom pb-2 "
                 style={{animation: `opacityAnimation 1s ease-out forwards`}}>
                {community.map((item, index) => {
                    return (
                        <div
                            className={"hover:bg-gray-200 text-sm rounded-xl py-2 pl-2 ml-3 flex items-center gap-1 cursor-pointer text-[#213457]"}
                            onClick={() => {
                                navigate(`/posts/${item.id}`)
                            }}
                            key={index}>
                            <p
                                className={"w-[170px] text-[13px]"}
                                target="_blank"
                                rel="noopener noreferrer">
                                {index + 1 + " "}{item.title}
                            </p>
                            <div className={"flex justify-between text-[11px] items-center gap-1"}>
                                <p>{viewOrLike === "조회순" ? "조회순": "인기순"} </p>
                                <p className={"w-10 text-center"}>{viewOrLike === "조회순" ?  item.viewCount : item.likesCount}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function Dropdown( { onSelect, setViewOrLike }) {
    const handleDropdownView  = ()=>{
        onSelect("조회순");
        setViewOrLike("조회순");
    }
    const handleDropdownLike  = ()=>{
        onSelect("인기순");
        setViewOrLike("인기순");
    }
    return (
        <div className={"border-solid border rounded-lg "}>
            <li onClick={() => handleDropdownView()}>조회순 ▲</li>
            <li onClick={() => handleDropdownLike()}>인기순</li>
        </div>
    );
}