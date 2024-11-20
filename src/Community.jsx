/* eslint-disable */
import "./css/community.css"
import {testMainCommunity} from "./assets/testMainCommunity.js";
import {testCommunity} from "./assets/testCommunity.js";
import {Link, useNavigate} from "react-router-dom";
import CommunityDetail from "./CommunityDetail.jsx";
import {Routes, Route} from "react-router-dom";
import {useRecoilValue} from "recoil";
import ChatComponent from "./ChatComponent.jsx";
import {useState, useEffect} from "react";
import {createPost, getPostsByCategory} from "./api/postApi.js";
import {randomPostGenerator} from "./assets/randomPostGenerator.js";

function Community() {

    let [category, setCategory] = useState("ENERGY"); // 카테고리 받아오면 시작 ENERGY로
    let [selectCat, setSelectCat] = useState("에너지")
    let [posts, setPosts] = useState([]);
    let data = testMainCommunity;
    let navigate = useNavigate();

    const fetchPosts = async (selectedCategory) => {
        try {
            const data = await getPostsByCategory(selectedCategory);
            setPosts(data);
            console.log(data)
        } catch (err) {
            alert('게시글 불러오는중 문제 생김')
        }
    }

    const handleCreatePost = async () => {
        const post = randomPostGenerator(category)
        await createPost(post)
        await fetchPosts(category);
    }

    const handleCategoryChange = (newCategory) => {
        console.log(`categorychange :`, newCategory)
        const selected = data.find(item => item.title === newCategory);
        if (selected) {
            setCategory(selected.title);
            setSelectCat(selected.description);
            fetchPosts(selected.title);
        }
    };

    // 컴포넌트가 처음 렌더링될 때 초기 데이터 로드
    useEffect(() => {
        fetchPosts("ENERGY");
    }, []); // 빈 배열: 최초 한 번 실행
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
                    <button className={"border-2 border-b-fuchsia bg-white mb-5"} onClick={handleCreatePost}>작성하기
                    </button>

                    <div className={" rounded-xl border-black border-1 bg-white"} style={{
                        width: "auto",
                        height: "450px",
                        overflow: `auto`
                    }}>
                        <div className={"border-amber-100"}>

                            {/* <PostList category={category} posts={posts}></PostList> */}

                            <ul>
                                {posts.map((post) => (
                                    <li key={post.id}>
                                        <h3 className={"hover:cursor-pointer hover:underline"} onClick={() => {
                                            navigate(`/community/${post.id}`)
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