import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useState, useEffect, useRef} from "react";
import axios from "axios";
import '../css/ChatBot.css';
import {validate} from "uuid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {LoadingSvg} from "../assets/LoadingSvg.jsx";

function ChatBot() {
    const navigate = useNavigate();
    const id = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const [inputValue, setInputValue] = useState(searchParams.get("message") || "");
    const [chatHistory, setChatHistory] = useState([]);
    const chatBoxRef = useRef(null);
    const [header, setHeader] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isNew, setisNew] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("accessToken") === null) {
            alert("쳇봇을 사용하려면 먼저 로그인 하여 주시기 바랍니다.")
            navigate("/");
            return;
        }
        setHeader("")
        setChatHistory([])
        if (validate(id.id)) {
            setIsError(false);
            !type && handlePullChat(id.id)
            if (searchParams.get("message")) {
                handleSendRequest()
                setInputValue("")
            }
            if (type) {
                !searchParams.get("message") && setisNew(true)
                !searchParams.get("message") && HeaddersimulateTypingEffect("번거로운 자료 조사를 간편하게")
                navigate(`/chatbot/${id.id}`)
            }
        } else {
            console.error('Invalid UUID format:', id.id);
            HeaddersimulateTypingEffect("없는 채팅방입니다. 다시 입장하여 주시기 바랍니다.")
            setIsError(true);
        }
    }, [id.id]);

    const handlePullChat = async (uuid) => {
        const {data: messages} = await axios.get(`https://repick.site/api/v1/chatbot/${uuid}`,
            {params: {page: 0, size: 50}});
        console.log(messages);
        if (messages.content.length === 0) {
            console.log("chat is not found");
            return;
        }
        const chats = [];
        messages.content.map(message => {
            chats.push({type: "user", text: message.request});
            chats.push({type: "llm", text: JSON.parse(message.response).response});
        })
        setChatHistory(chats);
    }

    const handleCreateChat = async (buttonInput) => {
        await axios.post("https://repick.site/api/v1/chatbot", {
                "uuid": `${id.id}`,
                "title": `${buttonInput || inputValue}`
            },
            {headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`,}}).catch((err) => {
            console.log(err)
        });
    }

    // 챗봇 응답 요청 및 타이핑 효과 적용
    const addChatEntry = (type, text) => {
        setChatHistory((prev) => [...prev, {type, text}]);
    };

    const simulateTypingEffect = async (text) => {
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
            await new Promise((resolve) => setTimeout(resolve, 50)); // 타이핑 효과를 위해 지연 시간 설정
        }

        setChatHistory((prev) => {
            const updatedHistory = [...prev];
            if (updatedHistory[updatedHistory.length - 1]?.type === "llm") {
                updatedHistory[updatedHistory.length - 1].text = currentText;
            }
            return updatedHistory;
        });
    };

    const HeaddersimulateTypingEffect = async (text) => {
        const words = Array.from(text);
        let currentText = "";

        for (let i = 0; i < words.length; i++) {
            currentText += words[i];
            setHeader(currentText + "_");
            await new Promise((resolve) => setTimeout(resolve, 150)); // 타이핑 효과를 위해 지연 시간 설정
        }
        setHeader(currentText);
    };

    const handleSendRequest = async (buttonInput) => {
        chatHistory.length === 0 && await handleCreateChat(buttonInput)
        setIsLoading(true);
        const fetchChatBotResponse = async () => {
            try {
                const response = await axios.post(`https://repick.site/api/v1/chatbot/message/${id.id}/async`,
                    {
                        message: buttonInput || inputValue,
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
        if (buttonInput || inputValue) {
            addChatEntry("user", buttonInput || inputValue); // 사용자가 입력한 메시지 추가
            await fetchChatBotResponse();
            setIsLoading(false);
        }
    };

    const handleEnterKey = (event) => {
        if (event.key === "Enter" && inputValue.trim() !== "") {
            handleSendRequest();
            setInputValue(""); // 입력 필드 초기화
        }
    };

    useEffect(() => {
        // chatHistory가 변경될 때마다 스크롤을 최하단으로 설정
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatHistory]);

    return (
        <div className={"ml-[50px] h-full"}
             style={{maxHeight: ` calc(100% - 55px)`}}>
            <div className={"flex flex-row h-full"}
                 style={{maxHeight: ` calc(100% - 80px)`}}>
                <div ref={chatBoxRef}
                     className="chatBot-container w-full flex items-center h-full overflow-y-scroll scrollbar-custom">
                    <ul className="chatBox w-full h-full">
                        {chatHistory.length === 0 && <h1>{header}</h1>}
                        {chatHistory.map((message, index) => (
                            <li
                                key={index}
                                className={`slide-up text-[18px] mt-[15px] w-full ${message.type === "user" ? "font-bold text-center" : ""}`}
                            >
                                {message.type === "llm" ? (
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}
                                                   className="markdown-content"
                                                   breaks={true}
                                                   skipHtml={false}>
                                        {message.text}
                                    </ReactMarkdown>
                                ) : (
                                    <span>{message.text}</span>
                                )}
                                {message.type === "user" && <hr className="mt-[15px]"/>}
                            </li>
                        ))}
                        {isNew && chatHistory.length === 0 && <div className="flex h-full items-end"
                        style={{maxHeight: ` calc(100% - 125px)`}}>
                            <div className={"flex justify-between w-full gap-5"}>
                            <button className={"markdown-content w-full h-20"}
                            style={{paddingLeft: "0px", paddingRight: "0px"}}
                                    onClick={() => {
                                        handleSendRequest("예상 질문 1");
                                    }}
                            >예상 질문 1</button>
                                <button className={"markdown-content w-full h-20"}
                                        style={{paddingLeft: "0px", paddingRight: "0px"}}
                                        onClick={() => {
                                            handleSendRequest("예상 질문 2");
                                        }}
                                >예상 질문 2
                                </button>
                                <button className={"markdown-content w-full h-20"}
                                        style={{paddingLeft: "0px", paddingRight: "0px"}}
                                        onClick={() => {
                                            handleSendRequest("예상 질문 3");
                                        }}
                                >예상 질문 3
                                </button>
                                <button className={"markdown-content w-full h-20"}
                                        style={{paddingLeft: "0px", paddingRight: "0px"}}
                                        onClick={() => {
                                            handleSendRequest("예상 질문 4");
                                        }}
                                >예상 질문 4
                                </button>
                            </div>
                        </div>}
                        {isLoading && <div className={"py-[15px] flex justify-center"}><LoadingSvg w={48} h={48}/></div>}
                    </ul>

                </div>
            </div>
            <div className={"flex justify-center pr-2"}>
                <div className="inputContainer flex w-full justify-center pb-5">
                    <div className={"relative w-full flex"} style={{maxWidth: `744px`}}>
                        <input
                            className="chatInput rounded-2xl border border-black flex justify-between"
                            placeholder="챗봇에게 질문"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleEnterKey}
                            disabled={isError}
                        />
                        <div className={"absolute flex items-center justify-center w-5 h-[35px]"}
                             style={{left: 'calc(100% - 30px)'}}
                        >
                            <button className="inputButton">
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
        </div>
    );
};

export default ChatBot;
