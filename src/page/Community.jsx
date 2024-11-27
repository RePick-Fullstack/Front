/* eslint-disable */
import "../css/community.css"
import {useSearchParams} from "react-router-dom";
import {testMainCommunity} from "../data/testMainCommunity.js";
import { Link, useNavigate} from "react-router-dom";
import CommunityDetail from "./CommunityDetail.jsx";
import {Routes, Route} from "react-router-dom";
import {useRecoilValue} from "recoil";
import ChatComponent from "./ChatComponent.jsx";
import {useState, useEffect} from "react";
import {createPost, getPostsByCategory} from "../api/postApi.js";
import {randomPostGenerator} from "../data/randomPostGenerator.js";

function Community() {

    let [category, setCategory] = useState("TOTAL"); // 카테고리 받아오면 시작 TOTAL로
    let [selectCat, setSelectCat] = useState("전체");
    let [posts, setPosts] = useState([]);
    let data = testMainCommunity;
    let navigate = useNavigate();
    let [searchParams] = useSearchParams(); // URL에서 쿼리스트링 읽기

    const getData=async ()=>{
        try {
            return  await getPostsByCategory(selectedCategory)
        }catch (e){
            alert('게시글 불러오는중 문제 생김')
        }

    }

    const fetchPosts = async (selectedCategory) => {

        const data = await getData(selectedCategory);
        if (data) setPosts(data);
        console.log(data)

    }

    const handleCreatePost = async () => {
        const post = randomPostGenerator(category)
        await createPost(post)
        await fetchPosts(category);
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

    // 컴포넌트가 처음 렌더링될 때 초기 데이터 로드
    useEffect(() => {
        fetchPosts("TOTAL");
    }, []); // 빈 배열: 최초 한 번 실행

    useEffect(() => {
        const urlCategory = searchParams.get("category") || "TOTAL";
        const selected = data.find((item) => item.title === urlCategory);
        if(urlCategory){
            setCategory(urlCategory);
            setSelectCat(selected.description);
            fetchPosts(urlCategory);
        }else{
            setCategory("TOTAL");
            fetchPosts("TOTAL");
        }
    }, [searchParams]); // searchParams 또는 data 변경 시 실행
    return (
        <>
            <div className={"bg-gray-300 rounded-xl font-bold p-10"} style={{margin: "50px 100px -50px 100px"}}>
                <div onClick={() => handleCategoryChange(category)}
                     style={{fontSize: "25px"}}>{selectCat ? `${selectCat} 커뮤니티` : "커뮤니티"}</div>
                <div className={"h-auto rounded-xl bg-gray-400 mt-0 items-center flex flex-wrap"}>
                    <span className={"font-semibold text-sm flex gap-8 ml-6"}>
                         {data.map((item, index) => (
                             <span className={"cursor-pointer hover:underline  text-center"} key={index}
                                   onClick={() => handleCategoryChange(item.title)}>
                                 {item.description}</span>
                         ))}
                    </span>
                </div>
            </div>
            <div className="container">
                <div className="left-container">
                    <button className={"border-2 border-b-fuchsia bg-white mb-5"} onClick={()=> navigate("/CreatePost")}>작성하기
                    </button>

                    <div className={" rounded-xl border-black border-1 bg-white"} style={{
                        width: "auto",
                        height: "450px",
                        overflow: `auto`
                    }}>
                        <div className={"border-amber-100"}>
                            <ul>
                                {posts.map((post) => (
                                    <li key={post.id}>
                                        <h3 className={"hover:cursor-pointer hover:underline"} onClick={() => {
                                            navigate(`/posts/${post.id}`)
                                        }}>{post.title}</h3>
                                    </li>
                                ))}
                            </ul>

                            {/*{Object.values(data).map((item) => (*/}
                            {/*    <div className={"bg-amber-400 mt-5"} key={item.id}>*/}
                            {/*        <button className={"font-bold"} onClick={()=>{*/}
                            {/*            navigate(`/community/${item.id}`)*/}
                            {/*        }}>{item.title}</button>*/}
                            {/*        <div>{item.content}</div>*/}
                            {/*        <div className={"text-xs font-bold"}>{item.nickname}</div>*/}
                            {/*        <div className={"text-right"}>*/}
                            {/*            <span>좋아요 {item.good}</span>*/}
                            {/*            <span>댓글 {item.comment}</span>*/}
                            {/*            <span>조회 {item.check}</span>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*))}*/}
                            {/*))}*/}
                        </div>

                    </div>
                </div>
                <div className="right-container w-auto">
                    <p className={"text-3xl  font-bold"}>실시간 채팅</p>
                    <div className={"bg-white mt-5"}>
                        <div style={{
                            width: "auto",
                            height: "450px",
                            overflow: `auto`
                        }}>
                            <ChatComponent/>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

function PostList(category, posts) {
    return (
        <>
            <h2>{category} 게시글</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Community;