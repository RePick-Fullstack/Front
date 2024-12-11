import {useLocation} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import axios from "axios";
import '../css/ChatBot.css';

function ChatBot() {
    const location = useLocation();
    const [inputValue, setInputValue] = useState(location.state?.userMessage || []);
    const [chatHistory, setChatHistory] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [llmResponse, setLlmResponse] = useState("");
    const [enterDelay, setEnterDelay] = useState(false);
    const [animation, setAnimation] = useState(false);

    // chatBox DOM을 참조하기 위한 ref 추가
    const chatBoxRef = useRef(null);

    useEffect(() => {
        setAnimation(true);
    }, []);

    useEffect(() => {
        if (location.state?.chatHistory) {
            setChatHistory(location.state.chatHistory);
        }
    }, [location.state?.chatHistory]);

    // 챗봇 응답 요청 및 타이핑 효과 적용
    const addChatEntry = (type, text) => {
        setChatHistory((prev) => [...prev, {type, text}]);
    };

    const simulateTypingEffect = async (text) => {
        const words = text.split(" ");
        let currentText = "";
        setIsTyping(true);

        for (let i = 0; i < words.length; i++) {
            currentText += (i === 0 ? "" : " ") + words[i];
            setChatHistory((prev) => {
                const updatedHistory = [...prev];
                if (updatedHistory[updatedHistory.length - 1]?.type === "llm") {
                    updatedHistory[updatedHistory.length - 1].text = currentText + "_";
                } else {
                    updatedHistory.push({type: "llm", text: currentText + "_"});
                }
                return updatedHistory;
            });
            await new Promise((resolve) => setTimeout(resolve, 50)); // 타이핑 효과를 위해 지연 시간 설정
        }

        // 타이핑 끝난 후 마지막 "_" 제거
        setChatHistory((prev) => {
            const updatedHistory = [...prev];
            if (updatedHistory[updatedHistory.length - 1]?.type === "llm") {
                updatedHistory[updatedHistory.length - 1].text = currentText;
            }
            return updatedHistory;
        });
        setIsTyping(false);
    };

    const handleSendRequest = async () => {
        const fetchChatBotResponse = async () => {
            try {
                const response = await axios.post(`https://repick.site/api/v1/chatbot/message/3784f905-bef5-46e6-b58a-69ee72d414cd`,
                    {
                        message: inputValue,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                const text = JSON.parse(response.data.response).response;
                simulateTypingEffect(text);
            } catch (error) {
                console.error("챗봇 응답 실패", error);
                addChatEntry("error", "챗봇 응답을 불러오지 못했습니다.");
            }
        };

        if (inputValue) {
            addChatEntry("user", inputValue); // 사용자가 입력한 메시지 추가
            await fetchChatBotResponse();
        }
    };

    const handleEnterKey = (event) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            handleSendRequest();
            setInputValue(""); // 입력 필드 초기화
        }
    };

    // useEffect(() => {
    //     if (chatBoxRef.current) {
    //         // ul 요소의 부모 컨테이너에만 스크롤이 발생하도록 설정
    //         chatBoxRef.current.scrollIntoView({
    //             behavior: 'smooth',
    //             block: 'nearest', // 부모 컨테이너 내부에서만 스크롤
    //         });
    //     }
    // }, [chatHistory]);

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    // MutationObserver를 사용하여 chatBox의 자식 변화 감지
    useEffect(() => {
        const chatBoxElement = chatBoxRef.current;

        if (chatBoxElement) {
            const observer = new MutationObserver(() => {
                scrollToBottom(); // 자식 요소가 변할 때마다 스크롤을 아래로 내림
            });

            // chatBox의 자식 요소 변화(자식 추가)를 감지하도록 설정
            observer.observe(chatBoxElement, {
                childList: true,
                subtree: true,
            });

            // 컴포넌트가 unmount 될 때 observer를 해제
            return () => {
                observer.disconnect();
            };
        }
    }, []);

    // 스크롤을 맨 아래로 내리는 함수
    const scrollToBottom = () => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    };

    return (
        <>
            <div className={"flex flex-row"}>
                <div className="chatBot-container">
                    <div className="chatBox">
                        <h1>번거로운 자료 조사를 간편하게</h1>
                        {chatHistory.map((message, index) => (
                            <div
                                key={index}
                                className={`slide-up ${message.type === "user" ? "user-message" : "llm-message"}`}
                            >
                                <span>{message.text}</span>
                                {message.type === "user" && <hr/>}
                            </div>
                        ))}
                    </div>
                </div>
                {/*<div className="reportBox">*/}
                {/*    <h2>Report Section</h2>*/}
                {/*    <p>여기에 추가 정보를 표시할 수 있습니다.</p>*/}
                {/*</div>*/}
            </div>
            <div className={"flex justify-center"}>
                <div className="inputContainer flex w-full justify-center pb-5">
                    <div className={"relative w-full flex"} style={{maxWidth: `744px`}}>
                        <input
                            className="chatInput rounded-2xl border border-black flex justify-between"
                            placeholder="챗봇에게 질문"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleEnterKey}
                        />
                        <div className={"absolute flex items-center justify-center w-5 h-[35px]"}
                             style={{left: 'calc(100% - 30px)'}}
                        >
                            <button className="inputButton" disabled={enterDelay}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                     className="input-svg">
                                    <path
                                        d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0432C16.1223 22.5716 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99992 12L1.94607 9.31543Z"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatBot;
