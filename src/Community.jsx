/* eslint-disable */
import "./css/community.css"
import {testMainCommunity} from "./assets/testMainCommunity.js";
import {testCommunity} from "./assets/testCommunity.js";
import {useNavigate} from "react-router-dom";
import CommunityDetail from "./CommunityDetail.jsx";
import {Routes, Route} from "react-router-dom";
import {useRecoilValue} from "recoil";
import ChatComponent from "./ChatComponent.jsx";
import {useState} from "react";

function Community() {

    let [category, setCategory] = useState(testMainCommunity);
    let [posts, setPosts] = useState(testCommunity.filter((post) => post.category === 'ENERGY'));
    let data = useRecoilValue(testCommunity);
    let navigate = useNavigate();

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        setPosts(
            testCommunity.filter((post) => post.category === newCategory) // 새 카테고리 데이터 설정
        );
    };

    return (
        <>
            <div className={"bg-gray-300 rounded-xl font-bold p-10"} style={{margin: "50px 100px -50px 100px"}}>
                <div style={{fontSize: "25px"}}>REPICK 커뮤니티</div>
                <div className={"rounded-xl bg-gray-400 mt-0"}>
                    <div className={"font-medium flex gap-12 ml-4"}>
                        {category.map((item, index) => (
                            <button key={index}
                                    onClick={() => handleCategoryChange(category)}>{item.description}</button>
                        ))}
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

                            <PostList category={category} posts={posts}></PostList>
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