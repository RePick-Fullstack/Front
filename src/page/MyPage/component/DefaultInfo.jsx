export const DefaultInfo = () => {
    const name = "조경준"
    const nickName = "닉네임"
    const birthday = "1998년 01월 23일"
    return (
        <div>
            <div className={"font-bold text-2xl mb-2 mt-5"}>기본정보</div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>이름</div>
                <div className={"w-64"}>{name}</div>
                <div className={"h-8 min-w-14 flex items-center justify-center"}/>
            </div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>닉네임</div>
                <div className={"w-64"}>{nickName}</div>
                <div className={"h-8 min-w-14 flex items-center justify-center"}/>
            </div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>생년월일</div>
                <div className={"w-64"}>{birthday}</div>
                <div className={"h-8 min-w-14 flex items-center justify-center"}/>
            </div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>이메일</div>
                <div className={"w-64"}>yoop80075@gmail.com</div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}>
                    수정
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>비밀번호</div>
                <div className={"w-64"}>**********</div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}>
                    수정
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
        </div>
    )
}