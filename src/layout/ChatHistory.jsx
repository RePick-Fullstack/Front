function ChatHistory(){
    return(
        <>
            <div>
                <p className={"w-4/5 mb-1 bg-gray-600 text-white rounded-lg text-center ml-5"}>최신 검색 기록</p>
                <h2 className={"w-full hover:bg-gray-200 hover:cursor-pointer mb-1"}>채팅 기록</h2> {/* tailwind 예시. map쓰면 이런식으로 tailwind 예정  */}
                <h2>채팅 기록</h2>
                <p>채팅 기록</p>
                <p>채팅 기록</p>
                <p>채팅 기록</p>
            </div>
        </>
    )
}

export default ChatHistory;