import {useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {v4 as uuidv4} from 'uuid';

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
                             onClick={() => {
                                 connectWebSocket()
                                 setIsJoin(true)
                             }}>채팅방 입장
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
                            <svg className="animate-spin"
                              width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M27.0156 14.9844C26.4715 14.9844 26.0312 14.5441 26.0312 14C26.0312 12.3758 25.7141 10.8008 25.0852 9.31602C24.4802 7.88664 23.6046 6.58769 22.5066 5.49063C21.4108 4.39118 20.1115 3.51541 18.6813 2.91211C17.1992 2.28594 15.6242 1.96875 14 1.96875C13.4559 1.96875 13.0156 1.52852 13.0156 0.984375C13.0156 0.440234 13.4559 0 14 0C15.8895 0 17.7242 0.369141 19.4496 1.10195C21.1176 1.80469 22.6133 2.81641 23.8984 4.10156C25.1836 5.38672 26.1926 6.88516 26.898 8.55039C27.6281 10.2758 27.9973 12.1105 27.9973 14C28 14.5441 27.5598 14.9844 27.0156 14.9844V14.9844Z"
                                fill="#007AFF" fillOpacity="0.69"/>
                        </svg>
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
                                            className={`border ${isMe ? `bg-amber-300` : `white`} rounded-b p-2`}>{`${message.message}`}</div>
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