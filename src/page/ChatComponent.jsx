import { useEffect, useState, useRef } from 'react';

let socket = null;

const buttonUi = `w-32 h-10 border border-black active:bg-gray-500`

function ChatComponent() {
    const [messages, setMessages] = useState([]);
    const [connect, setConnect] = useState(true);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('JGJ');
    const messagesEndRef = useRef(null);


    const connectWebSocket = (channel) => {
        if (socket) {
            socket.close();
        }

        socket = new WebSocket(`${channel}`);

        socket.onopen = () => {
            console.log(`WebSocket connection to ${channel} opened`);
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);

            try {
                const chat = JSON.parse(event.data);
                console.log('chat:', chat);
                // 유저 연결 감지 로직
                if (chat.id && chat.id !== "") {
                    setConnect(false); // 연결 성공 상태 처리
                    return;
                }
                // 일반 메시지 처리
                setMessages((prevMessages) => [...prevMessages, chat]);
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    };

    const sendMessage = () => {
        if (input.trim() && socket && socket.readyState === WebSocket.OPEN) {
            const message = {user: username, input: input}
            socket.send(JSON.stringify(message));
            setInput(''); // Clear the input field after sending
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
                <div className={"flex justify-center flex-wrap"}>
                    <div>닉네임 설정</div>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                           placeholder={username}
                           className={"mt-2 w-full p-2 border rounded text-center"}
                    />
                </div>
                <div className={"mt-2 flex justify-center mb-2"}>
                    <button className={`${buttonUi} bg-amber-300 active:bg-amber-500`}
                            onClick={() => {
                                setLoading(true);
                                connectWebSocket('ws://localhost:8081/websocket/2f977970-d0be-4224-97e0-bc71ba8ed67b')
                            }}>채팅방 입장
                    </button>
                </div>
                    <div className={"flex justify-center"}>
                    {loading && <h3>입장 대기중...</h3>}
                    </div>
            </div>
            }
            <div className={"h-full"}>
                <div className={"h-full"} style={{maxHeight: `calc(100% - 70px)`}}>
                    <ul className={"h-full overflow-y-scroll"} >
                        {messages.map((message, index) => {
                            const isMe = message.user === username
                            return(
                                <li key={index} className={`${isMe ? `flex justify-end` : `flex justify-normal`} p-1 pl-5 pr-5`}>
                                    <div>
                                        <div className={`text-${isMe ? `right` : 'left' }`}>{message.user}</div>
                                        <div className={`border ${isMe ? `bg-amber-300` : `white`} rounded-b p-2`}>{`${message.input}`}</div>
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