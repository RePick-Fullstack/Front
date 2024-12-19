import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {realTimeChatApi} from "../../api/api.js";

export const ChatRoomList = () => {
    const navigate = useNavigate();
    const [hashTags, setHashTags] = useState("");
    const [chatRoomName, setChatRoomName] = useState("");
    const [ChatRoomList, setChatRoomList] = useState([])

    useEffect(() => {
        ChatRoomLoad()
    }, []);

    const ChatRoomLoad = async () => {
        const {data: page} = await realTimeChatApi.get("/chatroom",{
            params: {
                page: 0,
                size: 20,
            }
        })
        console.log(page.content)
        setChatRoomList(page.content)
    }

    const handleCreate = async () => {
        if (localStorage.getItem('accessToken') === null) {
            alert('채팅방을 만들려면 로그인이 필요합니다.');
            return;
        }
        const hashtag = hashTags.split(",").map(tag => tag.trim());
        const isValid = hashtag.every(tag => /^#[\w가-힣]+$/.test(tag));
        if (!isValid) {
            alert("헤쉬테그 입력 양식이 옳바르지 않습니다.");
            return;
        }
        await realTimeChatApi.post("", {
            chatRoomName: chatRoomName,
            token: `Bearer ${localStorage.getItem('accessToken')}`,
            hashTags: hashtag
        })
        ChatRoomLoad()
    }

    const handleSelectChatRoom = async (room) => {
        navigate(`/chatroom/${room.uuid}`)
    }

    return (
        <div className={"ml-[50px] flex justify-center p-5 gap-5"}>
            <div className={"w-full max-w-[400px] border"}
                 style={{Height: `calc(100vh - 118px)`}}>
                <div className={"w-full h-full p-5"}>
                    <button
                        className={`w-full h-12 bg-amber-300 active:bg-amber-400`}
                        onClick={handleCreate}
                    >채팅방 생성하기
                    </button>
                    <div>채팅방 이름</div>
                    <input className={"w-full h-12 border"}
                           onChange={(e) => setChatRoomName(e.target.value)}
                    />
                    <div>헤쉬 테그</div>
                    <input className={"w-full h-12 border"}
                           onChange={(e) => setHashTags(e.target.value)}
                    />
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