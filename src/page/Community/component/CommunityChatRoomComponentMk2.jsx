import {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import {LoadingSvg} from "../../../assets/LoadingSvg.jsx";

let socket = null;

export const CommunityChatRoomComponentMk2 = () => {
    const [messages, setMessages] = useState([]);
    const [connect, setConnect] = useState(true);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [sessionUUID, setSessionUUID] = useState("");
    const [isJoin, setIsJoin] = useState(false);

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const connectWebSocket = () => {
        if (localStorage.getItem("accessToken") === null) {
            alert("먼저 로그인 하여 주시기 바랍니다.");
            return;
        }
        setIsJoin(true)
        console.log(`community chatroom join`);
        socket = new WebSocket(`wss://repick.site/api/v1/chatroom/websocket/38e05c99-d5c7-41bd-ae84-4c7f2d0de160`);

        socket.onopen = async () => {
            const uuid = uuidv4().toString();
            setSessionUUID(uuid)
            console.log(`user uuid :` + uuid)
            console.log(`WebSocket connection opened`);
            await delay(250);
            const initData = {token: localStorage.getItem('accessToken'), uuid: uuid};
            socket.send(JSON.stringify(initData));
            await delay(250);
            if (connect) {
                console.log('resent')
                socket.send(JSON.stringify(initData));
            }
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            const chat = JSON.parse(event.data);
            console.log('chat:', chat);
            try {
                if (chat.uuid && Object.keys(chat).length === 1) {
                    setLoading(true);
                    setConnect(false);
                    return;
                }

                setMessages((prevMessages) => [...prevMessages, chat]);
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        socket.onclose = () => {
            setSessionUUID('')
            console.log('WebSocket connection closed');
            setIsJoin(false)
            setLoading(false)
            setMessages([]);
            setConnect(true)
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    };

    const sendMessage = () => {
        if (input.trim() && socket && socket.readyState === WebSocket.OPEN) {
            const message = {uuid: sessionUUID, input: input}
            socket.send(JSON.stringify(message));
            setInput('');
        }
    };

    useEffect(() => {
        // connectWebSocket();
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
            <div className="w-[390px] h-[521px] bg-white rounded-[30px] shadow border-2 border-[#f7f7f9] mt-14">
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
                                connectWebSocket()
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
                                const isMe = message.uuid === sessionUUID
                                return (
                                    <li key={index}
                                        className={`${isMe ? `flex justify-end` : `flex justify-normal`} p-2 pl-5 pr-5`}>
                                        <div>
                                            <div
                                                className={`text-${isMe ? `right` : 'left'} text-[#232323] text-xs font-bold my-1`}>{message.nickName}</div>
                                            <div className={"flex"}>
                                                <div
                                                    className="min-w-16 text-center text-[#8f8f8f] text-[11px] flex items-end justify-center">
                                                    {formatKoreanTime(new Date())}
                                                </div>
                                                <div
                                                    className={`min-h-[30px] bg-[#f4f7f8] rounded-[20px] p-2 flex items-center px-5`}>{`${message.message}`}</div>

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
                            disabled={connect}
                        />
                        <button onClick={sendMessage}>전송</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
