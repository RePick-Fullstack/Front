export const CommentInfo = () => {
    return (
        <div>
            <div className={"font-bold text-2xl mb-2 mt-5"}>댓글정보</div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>작성한 댓글</div>
                <div className={"w-64"}></div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}>
                    보기
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>좋아요 한 댓글</div>
                <div className={"w-64"}></div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}>
                    보기
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
        </div>
    )
}