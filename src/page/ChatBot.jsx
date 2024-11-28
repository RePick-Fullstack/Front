import {useLocation} from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";
import '../css/ChatBot.css'

function ChatBot() {
    const location = useLocation();
    const [inputValue, setinputValue] = useState(location.state?.userMessage || ""); // MainScreen에서 받은 메시지
    const [chatHistory, setChatHistory] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [llmResponse, setLlmResponse] = useState(""); // 챗봇 응답
    const [animation, setAnimation] = useState(false);

    useEffect(() => {
        setAnimation(true);
    }, []);

    // 챗봇 응답 요청 및 타이핑 효과 적용
    useEffect(() => {
        const fetchChatBotResponse = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/generate-text?keyword=${inputValue} search result`);
                const generatedText = response.data[0].generated_text || "챗봇 응답 없음";
                simulateTypingEffect(generatedText);
            } catch (error) {
                console.error("챗봇 응답 실패", error);
                setChatHistory((prev) => [
                    ...prev,
                    { type: "error", text: "챗봇 응답을 불러오지 못했습니다." },
                ]);
            }
        }
        if (inputValue) {
            addChatEntry("user", inputValue); // 사용자가 입력한 메시지 추가
            fetchChatBotResponse();
        }
    }, [inputValue]);



    if (userMessage) {
        addChatEntry("user", userMessage);
        fetchChatBotResponse();
    }

    // 채팅 기록 추가
    const addChatEntry = (type, text) => {
        setChatHistory((prev) => [...prev, { type, text }]);
    };
    // 타이핑 효과를 시뮬레이션하는 함수
    const simulateTypingEffect = async (text) => {
        setIsTyping(true);
        const words = text.split(" ");
        let currentText = "";

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
            await new Promise((resolve) => setTimeout(resolve, 25)); // 타이핑 효과 지연 시간
        }

        setChatHistory((prev) => {
            const updatedHistory = [...prev];
            if (updatedHistory[updatedHistory.length - 1]?.type === "llm") {
                updatedHistory[updatedHistory.length - 1].text = currentText;
            }
            return updatedHistory;
        });
        setIsTyping(false);
    };

    return (
        <div className={`chatBot-container ${animation ? "slide-up" : ""}`}>
            <h1 className="text-2xl font-bold mb-4">ChatBot</h1>
            <div className="chatBox">
                {chatHistory.map((entry, index) => (
                    <div key={index} className={"mb-10 text-left"}>
                        <span className="user-message inline-block p-2 rounded">
                            {entry}
                        </span>
                    </div>
                ))}
                {isTyping && <div className="text-left text-gray-500">챗봇이 응답 중입니다...</div>}
            </div>
            <div className="reportBox">
                <div>
                    Report 띄우는 박스
                </div>
            </div>
        </div>
    );
}


export default ChatBot;