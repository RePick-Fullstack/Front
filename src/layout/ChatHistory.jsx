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
        const { data: chatBotRooms } = await axios.get(`https://repick.site/api/v1/chatbot`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log(chatBotRooms);
        setChatBotRooms(chatBotRooms);
    }

    return(
        <div className={"w-full h-full"}>
            <div className={"w-full h-full flex flex-col justify-center items-center"}>
                <p className={"w-36 mb-1 bg-[#303e4f] text-white rounded-lg text-center"}>최근 검색 기록</p>
                <div className={"w-full h-full scrollbar-custom overflow-y-scroll"}
                style={{maxHeight:"calc(100% - 28px"}}>
                {chatBotRooms.length === 0 &&
                    <h2 className={"w-full text-center hover:bg-gray-200 hover:cursor-pointer mb-1"}>채팅 기록이 없습니다.</h2>}
                {
                    chatBotRooms.map((chatBotRoom, index)=>{
                        return(
                            <h2 key={index}
                                onClick={() => navigate(`/chatbot/${chatBotRoom.uuid}`)}
                                className={"w-full hover:bg-gray-200 hover:cursor-pointer mb-1 text-center text-[#303e4f]"}>
                                {chatBotRoom.title}
                            </h2>
                        )
            })
                }
                </div>
            </div>
        </div>
    )
}

export default ChatHistory;