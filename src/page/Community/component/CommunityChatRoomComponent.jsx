import {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {v4 as uuidv4} from 'uuid';
import {LoadingSvg} from "../../../assets/LoadingSvg.jsx";

let socket = null;

function ChatComponent() {
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
        if(localStorage.getItem("accessToken")=== null){alert("먼저 로그인 하여 주시기 바랍니다."); return;}
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

    const handleKeyPress = (event) => {event.key === 'Enter' && sendMessage();};

    return (
        <div className={"relative h-full"}>
            <div className={"h-full bg-white"}>
                <div className={"h-full"} style={{maxHeight: `calc(100% - 70px)`}}>
                    {!isJoin ? <button className={"w-full h-12 bg-[#2c3e50] text-white rounded-none border-white"}
                             onClick={() => {connectWebSocket()}}>채팅방 입장
                    </button>
                    : <button className={"w-full h-12 bg-[#2c3e50] text-white rounded-none border-white"}
                    onClick={() => {
                        setIsJoin(false)
                        setLoading(false)
                        socket.close();
                        setMessages([]);
                    }}>채팅방 나가기
                </button>
                }
                    {(!isJoin || !loading) && <div
                        className={"absolute bg-[#dddddd]/40 w-full h-[402px] z-10 flex justify-center items-center"}>
                        {isJoin && <div className={"flex flex-col items-center"}>
                            <LoadingSvg w={32} h={32}/>
                            로딩중
                        </div>}
                    </div>}
                    <ul className={"h-full overflow-y-scroll"}
                        style={{maxHeight: `calc(100% - 48px)`}}>
                        {messages.map((message, index) => {
                            const isMe = message.uuid === sessionUUID
                            return (
                                <li key={index}
                                    className={`${isMe ? `flex justify-end` : `flex justify-normal`} p-1 pl-5 pr-5`}>
                                    <div>
                                        <div className={`text-${isMe ? `right` : 'left'}`}>{message.nickName}</div>
                                        <div
                                            className={`border ${isMe ? `bg-[#2c3e50] text-white` : `white`} rounded-b p-2`}>{`${message.message}`}</div>
                                    </div>
                                </li>
                            )
                        })
                        }
                        <div ref={messagesEndRef}/>
                </ul>
                </div>
                <div className={"flex"}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요..."
                        style={{width: '80%', padding: '10px'}}
                        disabled={connect}
                    />
                    <button onClick={sendMessage} style={{padding: '10px'}}>전송</button>
                </div>
            </div>
        </div>
    );
}

export default ChatComponent;