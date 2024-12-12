import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function ChatHistory(){
    const navigate = useNavigate();
    const [chatBotRooms, setChatBotRooms] = useState([]);
    useEffect(() => {
        handleChatRoomList()
    }, []);

    const handleChatRoomList = async () => {
        const token = localStorage.getItem("accessToken");
        if (token === null){return;}
        const { data: chatBotRooms } = await axios.get(`http://localhost:8001/api/v1/chatbot`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(chatBotRooms);
        setChatBotRooms(chatBotRooms);
    }

    return(
        <>
            <div>
                <p className={"w-4/5 mb-1 bg-gray-600 text-white rounded-lg text-center ml-5"}>최신 검색 기록</p>
                {chatBotRooms.length === 0 &&
                    <h2 className={"w-full hover:bg-gray-200 hover:cursor-pointer mb-1"}>채팅 기록이 없습니다.</h2>}
                {
                    chatBotRooms.map((chatBotRoom, index)=>{
                        return(
                            <h2 key={index}
                                onClick={() => navigate(`/chatbot/${chatBotRoom.uuid}`)}
                                className={"w-full hover:bg-gray-200 hover:cursor-pointer mb-1 text-center"}>
                                {chatBotRoom.title}
                            </h2>
                        )
            })
                }
            </div>
        </>
    )
}

export default ChatHistory;