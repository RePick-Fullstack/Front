import {useNavigate, useParams} from "react-router-dom";
import ChatComponent from "./ChatComponent.jsx";
import {useEffect, useState} from "react";
import axios from "axios";

export const ChatRoomList = () => {
    const navigate = useNavigate();
    const [isJoin, setIsJoin] = useState(true)
    const [ChatRoomList, setChatRoomList] = useState([{id: 1, uuid: '1bb1f396-ec88-4a3a-b96b-fc6bf5a93617' , chatRoomName: `샘플 채팅방 1`, ownerName: `Who`, createAt: `2024-06-18`}])
    const [selectChatRoom, setSelectChatRoom] = useState({id: 1, uuid: '1bb1f396-ec88-4a3a-b96b-fc6bf5a93617' , chatRoomName: `샘플 채팅방 1`, ownerName: `Who`, createAt: `2024-06-18`})

    useEffect(() => {
        ChatRoomLoad()
    }, []);

    const ChatRoomLoad = async () => {
        const {data: page} = await axios.get("http://localhost:8080/api/v1/chatroom/chatroom")
        setChatRoomList(page.content)
    }

    const handleCreate = async () => {
        const {data: createdChatRoom} = await axios.post("http://localhost:8080/api/v1/chatroom", {
            chatRoomName: `testChatRoom ${Math.floor(Math.random()*9999)}`,
            ownerId: 0,
            ownerName: "testUser",
        })
        setSelectChatRoom(createdChatRoom)
        ChatRoomLoad()
    }

    const handleSelectChatRoom = async (room) => {
        setSelectChatRoom(room)
        navigate(`/chatroom/${room.uuid}`)
    }

    return(
        <div className={"ml-[50px] flex justify-center p-5 gap-5"}>
            <div className={"w-full max-w-[400px] border"}
                 style={{height: `calc(100vh - 94px)`}}>
                <div className={"w-full h-full p-5"}>
                    <button className={"w-full h-12 bg-amber-300 active:bg-amber-400"}
                    onClick={handleCreate}
                    >채팅방 생성하기
                    </button>
                    <ul className={"overflow-auto h-full"} style={{maxHeight: "calc(100% - 48px)"}}>
                        {ChatRoomList.map((room, index) => {
                            return (
                                <li key={index} className="h-20 hover:bg-gray-100 flex items-center pl-5"
                                onClick={() => handleSelectChatRoom(room)}>
                                    <div>
                                        <div className="font-bold">{room.chatRoomName}</div>
                                        <div>참여자 0 명</div>
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