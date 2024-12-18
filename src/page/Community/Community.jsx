/* eslint-disable */
import "../../css/community.css"
import {useNavigate, useSearchParams} from "react-router-dom";
import {testMainCommunity} from "../../data/testMainCommunity.js";
import {useEffect, useState} from "react";
import {getPosts, getPostsByCategory} from "../../api/postApi.js";
import {translateToKorean} from "../../data/changeCategory.js";
import {CommunityChatRoomComponent} from "./component/CommunityChatRoomComponent.jsx";

//import {translateToEnglish} from "../../data/changeCategory.js"


function Community() {
    const isCommunity = true;
    const [category, setCategory] = useState("TOTAL"); // 카테고리 받아오면 시작 TOTAL로
    const [selectCat, setSelectCat] = useState("전체");
    const [posts, setPosts] = useState([]);
    const data = testMainCommunity;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams(); // URL에서 쿼리스트링 읽기

    const getData = async (selectedCategory) => {
        try {
            localStorage.setItem("selectedCategory", selectedCategory)
            console.log("선택한 카테고리" + selectedCategory);
            if (selectedCategory === "TOTAL") {
                return await getPosts();
            }
            return await getPostsByCategory(selectedCategory);
        } catch (e) {
            alert('게시글 불러오는중 문제 생김');
            return null;
        }
    }

    const fetchPosts = async (selectedCategory) => {
        const data = await getData(selectedCategory);
        if (data) setPosts(data);
        console.log("data : " + JSON.stringify(data, null, 2))
    }
    const createButton = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("로그인 후 게시글을 작성할 수 있습니다.");

        } else {
            navigate("/CreatePost")
        }
    }

    const handleCategoryChange = (newCategory) => {
        console.log(`categorychange :`, newCategory)
        const selected = data.find(item => item.title === newCategory);
        if (!selected) return;
        setCategory(selected.title);
        setSelectCat(selected.description);
        fetchPosts(selected.title);
        navigate(`/community?category=${selected.title}`); // URL 업데이트
    };

    const handlePostClick = async (post) => {
        try {
            //await increaseViewCount(post.id);
            navigate(`/posts/${post.id}`,
                {state: {category: post.category}}
            );
        } catch {
            console.log("server is not running");
        }
    }

    // // 컴포넌트가 처음 렌더링될 때 초기 데이터 로드
    // useEffect(() => {
    //     fetchPosts("ENERGY");
    // }, []); // 빈 배열: 최초 한 번 실행

    useEffect(() => {
        const urlCategory = searchParams.get("category") || "TOTAL";
        const selected = data.find((item) => item.title === urlCategory);
        if (urlCategory) {
            console.log("urlCategory " + urlCategory);
            console.log("selected.title " + selected);
            setCategory(selected.title);
            setSelectCat(selected.description);
            fetchPosts(selected.title);
        } else {
            setCategory("TOTAL");
            fetchPosts("TOTAL");
        }
    }, [searchParams]); // searchParams 변경 시 실행
    return (
        <div className={"ml-[50px] flex flex-col items-center"}>
            <div className={"rounded-xl font-bold pb-5 px-10 w-full max-w-[1130px]"}>
                <div className={"community_font caret-transparent"}
                     style={{fontSize: "30px"}}>{selectCat ? `${selectCat} 커뮤니티` : "커뮤니티"}</div>
                <div
                    className={"h-auto min-h-10 rounded-xl items-center flex relative top-3 overflow-auto whitespace-nowrap scrollbar-custom"}> { /*  카테고리 클릭 태그*/}
                    <span className={"font-semibold text-sm flex gap-6 "}>
                         {data.map((item, index) => (
                             <span
                                 className={"caret-transparent cursor-pointer text-center transform transition-transform duration-300 hover:scale-125  hover:text-slate-700"}
                                 key={index}
                                 onClick={() => handleCategoryChange(item.title)}>
                                 {item.description}</span>
                         ))}
                    </span>
                </div>
            </div>
            <div className="flex max-w-[1130px] w-full px-10 gap-5">
                <div className="left-container w-full">
                    <div className={"hotPost mb-1"}>인기 게시글</div>
                    <hr className={"mb-1"}/>
                    <button className={" border-2 border-b-fuchsia text-[15px] bg-[#303E4F] hover:bg-[#37afe1] text-white py-1 px-5 mx-2.5 my-2"}
                            onClick={() => createButton()}>작성하기
                    </button>

                    <div className={"rounded-xl border-black border-1 scrollbar-custom"} style={{
                        height: "50vh",
                        overflow: `auto`,
                        minWidth: "360px"
                    }}>
                        <div className={"border-amber-100 p-2 border-solid min-w-[360px]"}>
                            <ul>
                                {posts.map((post) => (
                                    <li key={post.id} className={"border-2 border-gray-200 mb-2 rounded-md"}>
                                        <h3 className={"hover:cursor-pointer hover:underline hover:font-semibold p-5 text-[14px] "}
                                            onClick={() => {
                                                handlePostClick(post)
                                            }}>{post.title} <span className={"float-right text-[11px]"}>{translateToKorean(post.category)}</span></h3>


                                        <div className={"relative text-sm"}>
                                            <h3 className={"inline-block align-middle ml-5 mb-2 font-bold text-[#232323] text-[12px]"}>{post.userNickname}</h3>
                                            <div className={"absolute top-0 right-0 inline-block align-middle"}>
                                                <ul className={"list-none flex text-[#232323] text-[10px] mr-2"}>
                                                    <li className={"mr-2"}> 좋아요 : {post.likesCount}</li>
                                                    <li className={"mr-2"}> 댓글 : {post.commentsCount}</li>
                                                    <li> 조회 : {post.viewCount}</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
                <CommunityChatRoomComponent/>
            </div>

        </div>
    )
}

export default Community;