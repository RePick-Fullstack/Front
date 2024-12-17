import {useEffect, useState} from "react";
import axios from "axios";
import {useLocation, useNavigate} from "react-router-dom";

function ChatHistory() {
    const navigate = useNavigate();
    const location = useLocation();
    const [chatBotRooms, setChatBotRooms] = useState([]);
    useEffect(() => {
        console.log(location);
        handleChatRoomList()
    }, [location]);

    const handleChatRoomList = async () => {
        const token = localStorage.getItem("accessToken");
        if (token === null) {
            return;
        }
        const {data: chatBotRooms} = await axios.get(`https://repick.site/api/v1/chatbot`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            , params: {
                page: 0,
                size: 10
            }
        })
        console.log(chatBotRooms);
        setChatBotRooms(chatBotRooms.content);
    }

    const handleDelete = async (chatBotRoom) => {
        const isDelete = confirm(`${chatBotRoom.title} 이 채팅방을 삭제하시겠습니까?`);
        if (!isDelete) {
            return;
        }
        await axios.delete(`https://repick.site/api/v1/chatbot/${chatBotRoom.uuid}`)
        await handleChatRoomList();
        if (location.pathname === `/chatbot/${chatBotRoom.uuid}`) {
            navigate(`/`);
        }
    }

    return (
        <div className={"w-full h-full"}>
            <div className={"w-full h-[40vh] flex flex-col justify-center items-center mb-10"}>
                <p className={"w-full mb-1 text-[#9e9e9e] text-[10px] rounded-lg text-left"}>최근 검색 기록</p>
                <div className={"w-full h-[35vh] scrollbar-custom overflow-y-scroll mb-2"}
                     style={{maxHeight: "calc(100% - 28px"}}>
                    {chatBotRooms.length === 0 &&
                        <h2 className={"font-bold text-left hover:bg-gray-500 text-[14px] h-5 hover:cursor-pointer rounded-lg"}>채팅
                            기록이 없습니다.</h2>}
                    {
                        chatBotRooms.map((chatBotRoom, index) => {
                            return (
                                <div key={index}
                                     className={"overflow-hidden flex justify-center items-center hover:cursor-pointer px-2 hover:bg-gray-500 rounded-lg"}>
                                    <h2
                                        onClick={() => navigate(`/chatbot/${chatBotRoom.uuid}`)}
                                        className={"text-white font-bold w-full my-1 h-6 text-[13px] overflow-hidden flex items-center"}>
                                        {chatBotRoom.title}
                                    </h2>
                                    <svg className={"hover:fill-red-500 z-10"}
                                         onClick={() => handleDelete(chatBotRoom)}
                                         width="15" height="15" viewBox="0 0 36 36" fill="currentColor"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M11.8922 4.81778H11.5708C11.7476 4.81778 11.8922 4.67314 11.8922 4.49636V4.81778H24.1065V4.49636C24.1065 4.67314 24.2512 4.81778 24.4279 4.81778H24.1065V7.71064H26.9994V4.49636C26.9994 3.07805 25.8463 1.92493 24.4279 1.92493H11.5708C10.1525 1.92493 8.99937 3.07805 8.99937 4.49636V7.71064H11.8922V4.81778ZM32.1422 7.71064H3.85652C3.14535 7.71064 2.5708 8.28519 2.5708 8.99636V10.2821C2.5708 10.4589 2.71544 10.6035 2.89223 10.6035H5.31902L6.31143 31.6169C6.37571 32.987 7.50875 34.0678 8.87884 34.0678H27.1199C28.494 34.0678 29.623 32.991 29.6873 31.6169L30.6797 10.6035H33.1065C33.2833 10.6035 33.4279 10.4589 33.4279 10.2821V8.99636C33.4279 8.28519 32.8534 7.71064 32.1422 7.71064ZM26.8105 31.1749H9.18821L8.21589 10.6035H27.7829L26.8105 31.1749Z"
                                            fillOpacity="0.85"/>
                                    </svg>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ChatHistory;