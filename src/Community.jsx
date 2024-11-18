/* eslint-disable */
import "./css/community.css"
import {testMainCommunity} from "./assets/testMainCommunity.js";
import {testCommunity} from "./assets/testCommunity.js";
import {useNavigate} from "react-router-dom";
import CommunityDetail from "./CommunityDetail.jsx";
import {Routes, Route} from "react-router-dom";
import {useRecoilValue} from "recoil";
import ChatComponent from "./ChatComponent.jsx";
import {useState, useEffect} from "react";
import {  getPostsByCategory } from "./api/postApi.js";

function Community() {

    let [category, setCategory] = useState("ENERGY"); // 카테고리 받아오면 시작 ENERGY로
    let [posts, setPosts] = useState([]);
    let data = useRecoilValue(testCommunity);
    let navigate = useNavigate();

    const fetchPosts = async (selectedCategory) =>{
        try{
            const data = await getPostsByCategory(selectedCategory);
            setPosts(data);
        }catch(err){
            setError('게시글 불러오는중 문제 생김')
        }
    }

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        fetchPosts(newCategory);
    };
    // 컴포넌트가 처음 렌더링될 때 초기 데이터 로드
    useEffect(() => {
        fetchPosts(category);
    }, []); // 빈 배열: 최초 한 번 실행
    {console.log(category)}
    return (
        <>
            <div className={"bg-gray-300 rounded-xl font-bold p-10"} style={{margin: "50px 100px -50px 100px"}}>
                <div style={{fontSize: "25px"}}>REPICK 커뮤니티</div>
                <div className={"rounded-xl bg-gray-400 mt-0"}>
                    <div className={"font-medium flex gap-12 ml-4"}>
                        {/* {category.map((item, index) => ( */}
                        {/* <button key={index} */}
                        {/* // onClick={() => handleCategoryChange(category)} */}
                        {/* > */}
                        {/* {item.description}</button> */}
                        {/* ))} */}
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="left-container">
                    <button className={"border-2 border-b-fuchsia bg-white mb-5"}>작성하기</button>

                    <div className={" rounded-xl border-black border-1 bg-white"} style={{
                        width: "auto",
                        height: "450px",
                        overflow: `auto`
                    }}>
                        <div className={"border-amber-100"}>

                            {/* <PostList category={category} posts={posts}></PostList> */}

                            <ul>
                                {posts.map((post)=> (
                                    <li key={post.id}>
                                        <h3>{post.title}</h3>
                                        <h3>{post.content}</h3>
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
                        </div>

                    </div>
                </div>
                <div className="right-container">
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