import { useEffect, useState, useRef } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
let socket = null;

const buttonUi = `w-32 h-10 border border-black active:bg-gray-500`

function ChatComponent() {
    const {id} = useParams()
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [connect, setConnect] = useState(true);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('default');
    const messagesEndRef = useRef(null);
    const [sessionUUID, setSessionUUID] = useState("");

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const connectWebSocket = () => {
        socket = new WebSocket(`ws://localhost:8081/websocket/${id}`);
        let myUuid = '';
        let isJoined = false;
        socket.onopen = async () => {
            const uuid = uuidv4().toString();
            setSessionUUID(uuid)
            myUuid = uuid;
            console.log(uuid)
            console.log(`WebSocket connection opened`);
            const initData = { token: localStorage.getItem('accessToken'), uuid: uuid };
            socket.send(JSON.stringify(initData));
            await delay(250);
            if(connect){
                console.log('resent')
                socket.send(JSON.stringify(initData));
            }
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
            try {
                const chat = JSON.parse(event.data);
                console.log('chat:', chat);
                if (chat.uuid && Object.keys(chat).length === 1) {
                    setConnect(false);
                    isJoined = true;
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
            setInput(''); // Clear the input field after sending
        }
    };

    useEffect(() => {
        connectWebSocket();
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);

    useEffect(() => {
        if (messagesEndRef.current) {
            // ul 요소의 부모 컨테이너에만 스크롤이 발생하도록 설정
            messagesEndRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest', // 부모 컨테이너 내부에서만 스크롤
            });
        }
    }, [messages]);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className={"relative h-full"}>
            {connect &&
                <div className={"absolute w-full h-full p-2 bg-white"}>
                    <h3>입장 대기중...</h3>
            </div>
            }
            <div className={"h-full"}>
                <div className={"h-full"} style={{maxHeight: `calc(100% - 70px)`}}>
                    <button className={"w-full h-12 bg-amber-300 active:bg-amber-400"}
                            onClick={() => {
                                socket.close();
                                navigate("/chatRoom")
                            }}>채팅방 나가기
                    </button>
                    <ul className={"h-full overflow-y-scroll"}
                    style={{maxHeight: `calc(100% - 48px)`}}>
                        {messages.map((message, index) => {
                            const isMe = message.uuid === sessionUUID
                            return(
                                <li key={index} className={`${isMe ? `flex justify-end` : `flex justify-normal`} p-1 pl-5 pr-5`}>
                                    <div>
                                        <div className={`text-${isMe ? `right` : 'left' }`}>{message.nickName}</div>
                                        <div className={`border ${isMe ? `bg-amber-300` : `white`} rounded-b p-2`}>{`${message.message}`}</div>
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