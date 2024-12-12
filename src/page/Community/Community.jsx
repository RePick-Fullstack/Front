/* eslint-disable */
import "../../css/community.css"
import {useNavigate, useSearchParams} from "react-router-dom";
import {testMainCommunity} from "../../data/testMainCommunity.js";
import {useEffect, useState} from "react";
import {getPosts, getPostsByCategory, increaseViewCount} from "../../api/postApi.js";
import {CommunityChatRoomComponentMk2} from "./component/CommunityChatRoomComponentMk2.jsx";


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
        <>
            <div className={"rounded-xl font-bold p-10 w-[75vw]"} style={{margin: "0 0 0px 120px"}}>
                <div className={"community_font caret-transparent"}
                     style={{fontSize: "30px"}}>{selectCat ? `${selectCat} 커뮤니티` : "커뮤니티"}</div>
                <div className={"h-auto min-h-10 rounded-xl items-center flex flex-wrap relative top-3"}> { /*  카테고리 클릭 태그*/}
                    <span className={"font-semibold text-sm flex gap-6 flex-wrap"}>
                         {data.map((item, index) => (
                             <span
                                 className={"caret-transparent cursor-pointer hover:underline hover:text-xl hover:text-slate-700 text-center"}
                                 key={index}
                                 onClick={() => handleCategoryChange(item.title)}>
                                 {item.description}</span>
                         ))}
                    </span>
                </div>
            </div>
            <div className="container">
                <div className="left-container">
                    <button className={"border-2 border-b-fuchsia  bg-white mb-5"}
                            onClick={() => createButton()}>작성하기
                    </button>

                    <div className={"rounded-xl border-black border-1 bg-[rgb(132,116,216)]"} style={{
                        height: "60vh",
                        overflow: `auto`
                    }}>
                        <div className={"border-amber-100 p-2 border-solid"}>
                            <ul>
                                {posts.map((post) => (
                                    <li key={post.id} className={"border-2 border-gray-200 mb-2 rounded-md"}>
                                        <h3 className={"hover:cursor-pointer hover:underline hover:font-semibold p-5 text-lg "}
                                            onClick={() => {
                                                handlePostClick(post)
                                            }}>{post.title}</h3>

                                        <div className={"relative text-sm"}>
                                            <h3 className={"inline-block align-middle m-3"}>{post.userNickname}</h3>
                                            <div className={"absolute top-0 right-0 inline-block align-middle"}>
                                                <ul className={"list-none mr-2.5 mt-3 p-0 flex"}>
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
                {/*<div className="right-container p-1 rounded-xl ">*/}
                {/*    <p className={"chatRoom_font text-[25px] font-bold p-2"}>커뮤니티 채팅방</p>*/}
                {/*    <div className={"bg-white mt-2"}>*/}
                {/*        <div style={{*/}
                {/*            height: "60vh",*/}
                {/*        }}><CommunityChatRoomComponent/>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <CommunityChatRoomComponentMk2/>
            </div>

        </>
    )
}

export default Community;