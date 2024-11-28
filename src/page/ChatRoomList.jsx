import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

export const ChatRoomList = () => {
    const navigate = useNavigate();
    const [inputHashTag, setInputHashTag] = useState([]);
    const [isHashTagRight, setIsHashTagRight] = useState(true)
    const [isJoin, setIsJoin] = useState(true)
    const [ChatRoomList, setChatRoomList] = useState([{
        uuid: "454ccca4-c2d0-4cf3-b46b-086fae57226a",
        chatRoomName: "testChatRoom 1494",
        ownerName: "가나다",
        UserNumber: 1,
        hashTags: [],
        createdAt: "2024-11-26T20:49:23.173148"
    }])
    const [selectChatRoom, setSelectChatRoom] = useState({
        uuid: "454ccca4-c2d0-4cf3-b46b-086fae57226a",
        chatRoomName: "testChatRoom 1494",
        ownerName: "가나다",
        UserNumber: 1,
        hashTags: [],
        createdAt: "2024-11-26T20:49:23.173148"
    })

    useEffect(() => {
        ChatRoomLoad()
    }, []);

    const ChatRoomLoad = async () => {
        const {data: page} = await axios.get("http://localhost:8081/api/v1/chatroom/chatroom")
        console.log(page.content)
        setChatRoomList(page.content)
    }

    const handleCreate = async () => {
        const {data: createdChatRoom} = await axios.post("http://localhost:8081/api/v1/chatroom", {
            chatRoomName: `testChatRoom ${Math.floor(Math.random() * 9999)}`,
            token: localStorage.getItem('accessToken'),
            hashTags: inputHashTag //헤쉬테그 리스트
        })
        setSelectChatRoom(createdChatRoom)
        ChatRoomLoad()
    }

    const handleHashTag = async (e) => {
        const input = e.target.value;
        console.log(input);

        // 쉼표로 해시태그 분리
        const hashtags = input.split(",").map(tag => tag.trim()); // 각 해시태그 앞뒤 공백 제거

        // 모든 해시태그 검증
        const isValid = hashtags.every(tag => /^#[\w가-힣]+$/.test(tag));

        if (isValid) {
            console.log("All hashtags are valid.");
            setIsHashTagRight(true)
        } else {
            console.log("Invalid hashtag(s) detected.");
            setIsHashTagRight(false)
        }

        setInputHashTag(hashtags);
    };


    const handleSelectChatRoom = async (room) => {
        setSelectChatRoom(room)
        navigate(`/chatroom/${room.uuid}`)
    }

    return (
        <div className={"ml-[50px] flex justify-center p-5 gap-5"}>
            <div className={"w-full max-w-[400px] border"}
                 style={{height: `calc(100vh - 94px)`}}>
                <div className={"w-full h-full p-5"}>
                    <button
                        className={`w-full h-12 ${isHashTagRight ? `bg-amber-300` : `bg-gray-400`} active:bg-amber-400`}
                        onClick={handleCreate}
                        disabled={!isHashTagRight}
                    >채팅방 생성하기
                    </button>
                    <div>헤쉬 테그</div>
                    <input className={"w-full h-12 border"}
                           onChange={(e) => handleHashTag(e)}
                    />
                    {!isHashTagRight && <div>헤쉬 테그 입력이 옳바르지 않습니다.</div>}
                    <ul className={"overflow-auto h-full"} style={{maxHeight: "calc(100% - 48px)"}}>
                        {ChatRoomList.map((room, index) => {
                            return (
                                <li key={index} className="h-20 hover:bg-gray-100 flex items-center pl-5"
                                    onClick={() => handleSelectChatRoom(room)}>
                                    <div>
                                        <div className="font-bold">{room.chatRoomName}</div>
                                        <div>참여자 {room.UserNumber} 명</div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}