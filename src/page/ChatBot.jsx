import {useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";
import '../css/ChatBot.css'

function ChatBot() {
    const location = useLocation();
    const [inputValue, setInputValue] = useState(location.state?.userMessage || []); // MainScreen에서 받은 메시지
    const [chatHistory, setChatHistory] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [llmResponse, setLlmResponse] = useState(""); // 챗봇 응답
    const [enterDelay, setEnterDelay] = useState(false);
    const [animation, setAnimation] = useState(false);

    useEffect(() => {
        setAnimation(true);
    }, []);

    useEffect(() => {
        if(location.state?.chatHistory){
            setChatHistory(location.state.chatHistory);
        }
    }, [location.state?.chatHistory]);

    // 챗봇 응답 요청 및 타이핑 효과 적용
    // 사용자가 입력한 메시지를 추가
    const addChatEntry = (type, text) => {
        setChatHistory((prev) => [...prev, {type, text}]);
        console.log(chatHistory)
    };

    // 타이핑 효과를 시뮬레이션
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

    // 챗봇 응답 요청 및 타이핑 효과 적용
    useEffect(() => {
        const fetchChatBotResponse = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/generate-text?keyword=${inputValue} search result`);
                const generatedText = response.data[0].generated_text || "챗봇 응답 없음";
                simulateTypingEffect(generatedText);
            } catch (error) {
                console.error("챗봇 응답 실패", error);
                addChatEntry("error", "챗봇 응답을 불러오지 못했습니다.");
            }
        };

        if (inputValue) {
            addChatEntry("user", inputValue); // 사용자가 입력한 메시지 추가
            fetchChatBotResponse();
        }
    }, [inputValue]);

    const handleEnterKey = (event) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            //handleSendRequest();
            setInputValue(""); // 입력 필드 초기화
        }
    };


    return (
        <>
            <div className="chatBot-container">
                <div className="chatBox">
                    <h1>ChatBot</h1>
                    {chatHistory.map((message, index) => (
                        <div
                            key={index}
                            className={`slide-up ${message.type === "user" ? "user-message" : "llm-message"}`}
                        >
                            {/* <strong>{message.type === "user" ? "사용자: " : "LLM: "}</strong> */}
                            <span>{message.text}</span>
                            {message.type === "user" && <hr/>}
                        </div>
                    ))}
                </div>
                <div className="reportBox">
                    <h2>Report Section</h2>
                    <p>여기에 추가 정보를 표시할 수 있습니다.</p>
                </div>
            </div>
            <div className={"flex justify-center"}>
                <div className="inputContainer flex w-full justify-center">
                    <div className={"relative w-full flex"} style={{maxWidth: `744px`}}>
                        <input
                            className="chatInput rounded-2xl border border-black flex justify-between"
                            placeholder="쳇봇에게 질문"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleEnterKey}
                        />
                        <div className={"absolute flex items-center justify-center w-5 h-[35px]"}
                             style={{left: 'calc(100% - 30px)'}}
                        >
                            <button className="inputButton"
                                    disabled={enterDelay}> {/* enterDelay 상태에 따라 버튼 비활성화 */}
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
    )
        ;
};

export default ChatBot;
