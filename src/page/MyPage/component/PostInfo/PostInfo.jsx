import React from "react";
import chat from '../../../../assets/post.svg'
import heart from '../../../../assets/heart.svg'
import likeReport from '../../../../assets/likereport.svg'
import keyword from '../../../../assets/keyword.svg'
import {PostView} from "./component/PostView.jsx";
import {CommentView} from "./component/CommentView.jsx";
import {LikePostView} from "./component/LikePostView.jsx";
import {LikeCommentView} from "./component/LikeCommentView.jsx";
import {CompanyReportView} from "./component/CompanyReportView.jsx";
import {IndustryReportView} from "./component/IndustryReportView.jsx";
import {CompanyKeywordView} from "./component/CompanyKeywordView.jsx";
import {IndustryKeywordView} from "./component/IndustryKeywordView.jsx";


export const PostInfo = () => {
    return (
        <div className={"max-w-[600px] w-full pb-5"}>
            <div className={"font-bold text-lg mb-4 mt-5 "}>내 활동</div>
            <div className={"border-b-[1px] border-black"}/>
            <div className="w-full text-[14px] mt-4">
                <div className={"flex items-center gap-2 font-bold h-10"}>
                    <img src={chat}></img>
                    <div>작성글</div>
                </div>
                <PostView/>
                <CommentView/>
            </div>
            <div className="w-full text-[14px] mt-4">
                <div className={"flex items-center gap-2 font-bold h-10"}>
                    <img src={heart}></img>
                    <div>좋아요</div>
                </div>
                <LikePostView/>
                <LikeCommentView/>
            </div>
            <div className="w-full text-[14px] mt-4">
                <div className={"flex items-center gap-2 font-bold h-10"}>
                    <img src={likeReport}></img>
                    <div>관심 레포트</div>
                </div>
                <CompanyReportView/>
                <IndustryReportView/>
            </div>
            <div className="w-full text-[14px] mt-4">
                <div className={"flex items-center gap-2 font-bold h-10"}>
                    <img src={keyword}></img>
                    <div>저장한 키워드</div>
                </div>
                <CompanyKeywordView/>
                <IndustryKeywordView/>
            </div>
        </div>
    )
}