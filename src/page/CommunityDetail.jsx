/* eslint-disable */
import {testMainCommunity} from "../data/testMainCommunity.js";
import {useParams} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {getPostById} from "../api/postApi.js";
import {useEffect, useState} from "react";


function CommunityDetail() {
    const [post , setPost] = useState([]);
    let {id} = useParams();
    useEffect(() => {
        handlePost()
    }, []);

    const handlePost = async () => {
        const newPost = await getPostById(id)
        setPost(newPost)
        console.log(newPost)
    }

    return (
        <>
            {post ?(
            <div className={"bg-gray-300 rounded-xl font-bold p-10"} style={{margin: "50px 100px -50px 100px"}}>
                {/*<span> {category[0].title}</span> /!* 해당하는 category 뜨게 할 예정 *!/*/}
                <div className={"border-amber-100 mb-5"}>
                    <div className={"bg-white mt-5"}> 제목 : {post.title}
                        <p className={"mb-5 text-right"}>조회 {post.viewCount}</p>
                        <div>내용 : {post.content}</div>
                        {/*<div>{post.nickname}</div>*/}
                    </div>
                </div>
                <div className={"bg-amber-800 rounded-l p-5"}>댓글 0
                    <div className={"bg-yellow-500 rounded-l p-5"}>따뜻한 댓글을 남겨주세요 :)
                        <div><input placeholder={"댓글을 입력해주세요 :)"} className={"bg-white rounded-l"}></input></div>
                    </div>
                </div>
            </div>
                ): (
            <p className={"text-center"}>존재 하지 않는 게시글 입니다.</p>
                    )}
        </>
    )
}

export default CommunityDetail;