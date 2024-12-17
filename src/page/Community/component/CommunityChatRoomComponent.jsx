import {useEffect, useRef, useState} from 'react';
import {LoadingSvg} from "../../../assets/LoadingSvg.jsx";
import axios from "axios";

let socket = null;

export const CommunityChatRoomComponent = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [isJoin, setIsJoin] = useState(false);
    const [verification, setVerification] = useState(false);
    const [userId, setUserId] = useState(-1);

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleJoin = async () => {
        if (localStorage.getItem("accessToken") === null) {
            alert("먼저 로그인 하여 주시기 바랍니다.");
            return;
        }
        setVerification(false);
        const {data: user} = await axios.get("https://repick.site/api/v1/chatroom/verification", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).catch((err) => {
            console.log(err)
        });
        if (!user) {
            alert("사용자 정보가 옳바르지 않습니다.");
            return;
        }
        setVerification(true);
        setUserId(user.id);
        setIsJoin(true);
        const {data: messages} = await axios.get("https://repick.site/api/v1/chatroom/38e05c99-d5c7-41bd-ae84-4c7f2d0de160/message", {
            params: {page: 0, size: 30}
        }).catch((err) => {console.log(err)});
        setMessages(messages.content);
        socket = new WebSocket(`wss://repick.site/api/v1/chatroom/websocket/38e05c99-d5c7-41bd-ae84-4c7f2d0de160`);

        socket.onopen = async () => {
            console.log(`WebSocket connection opened`);
            const initData = user.id;
            socket.send(JSON.stringify(initData));
            await delay(250);
            socket.send(JSON.stringify(initData));
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            if (event.data == user.id) {
                setLoading(true);
                return;
            }
            const chat = JSON.parse(event.data);
            try {
                setMessages((prevMessages) => [...prevMessages, chat]);
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        socket.onclose = () => {
            setUserId(-1);
            console.log('WebSocket connection closed');
            setIsJoin(false)
            setLoading(false)
            setMessages([]);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        date.setHours(date.getHours() + 9);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours < 12 ? "오전" : "오후";
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12; // 0시, 12시는 12로 표시
        const formattedMinutes = String(minutes).padStart(2, "0");
        return `${period} ${formattedHours}:${formattedMinutes}`;
    };

    const sendMessage = () => {
        if (input.trim() && socket && socket.readyState === WebSocket.OPEN) {
            const message = {id: userId, input: input}
            socket.send(JSON.stringify(message));
            setInput('');
        }
    };

    useEffect(() => {
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }
    }, [messages]);

    const handleKeyPress = (event) => {
        event.key === 'Enter' && sendMessage();
    };

    function formatKoreanTime(date) {
        const options = {hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Seoul'};
        return new Intl.DateTimeFormat('ko-KR', options).format(date);
    }

    return (
        <div className="right-container">
            <div
                className="w-[390px] h-[530px] bg-white rounded-[20px] shadow-[2px_2px_2px_2px_#f2f4f5] border-solid border-[3px] border-[#f2f4f5]">
                <div
                    className="w-[196px] h-[63px] text-center text-[#303e4f] text-[22px] font-bold flex items-center justify-center">커뮤니티
                    채팅방
                </div>
                <div className="w-[375px] h-[46px] border-y-2 border-[#f7f7f9] flex items-center justify-between">
                    <div className="flex">
                        <div
                            className="w-[125px] h-6 text-[#303e4f] text-[16px] font-bold flex items-center justify-center">2차전지
                            손해방
                        </div>
                        <div
                            className="w-12 h-6 text-center text-[#777777]/70 text-sm font-bold flex items-center justify-center">523명
                        </div>
                    </div>
                    {!isJoin ? <div
                            className="w-[108px] h-[30px] bg-[#303e4f] rounded-[7px] text-white text-[15px] flex items-center justify-center hover:cursor-pointer"
                            onClick={() => {
                                handleJoin()
                            }}>
                            채팅방 입장
                        </div> :
                        <div
                            className="w-[108px] h-[30px] bg-[#303e4f] rounded-[7px] text-white text-[15px] flex items-center justify-center hover:cursor-pointer"
                            onClick={() => {
                                setIsJoin(false)
                                setLoading(false)
                                socket.close();
                                setMessages([]);
                            }}>
                            채팅방 나가기
                        </div>}
                </div>
                <div className={"h-[359px] bg-white relative"}>
                    <div className={"h-full"}>
                        {(!isJoin || !loading) && <div
                            className={"absolute bg-[#f4f7f8] w-full h-full z-1 flex justify-center items-center"}>
                            {isJoin && <div className={"flex flex-col items-center"}>
                                <LoadingSvg w={32} h={32}/>
                                로딩중
                            </div>}
                        </div>}
                        <ul className={"h-full overflow-y-scroll scrollbar-custom"}>
                            {messages.map((message, index) => {
                                const isMe = message.userId === userId
                                return (
                                    <li key={index}
                                        className={`${isMe ? `flex justify-end` : `flex justify-normal`} p-2 pl-5 pr-5`}>
                                        <div>
                                            <div
                                                className={`text-${isMe ? `right` : 'left'} text-[#232323] text-xs font-bold my-1`}>{message.username}</div>
                                            <div className={"flex"}>
                                                {isMe && <div
                                                    className="min-w-16 text-center text-[#8f8f8f] text-[11px] flex items-end justify-center">
                                                    {formatDate(message.createAt)}
                                                </div>}
                                                <div
                                                    className={`min-h-[30px] bg-[#f4f7f8] rounded-[20px] p-2 flex items-center px-5`}>{`${message.message}`}</div>
                                                {!isMe && <div
                                                    className="min-w-16 text-center text-[#8f8f8f] text-[11px] flex items-end justify-center">
                                                    {formatDate(message.createAt)}
                                                </div>}

                                            </div>
                                        </div>
                                    </li>
                                )
                            })
                            }
                            <div ref={messagesEndRef}/>
                        </ul>
                    </div>
                </div>
                <div className={"flex justify-center mt-2"}>
                    <div className="w-[364px] h-[34px] bg-[#f4f7f8] rounded-[23px] flex items-center justify-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="메시지를 입력하세요..."
                            style={{width: '85%', backgroundColor: `rgb(244, 247, 248)`}}
                            disabled={!loading}
                        />
                        <button onClick={sendMessage}>전송</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
