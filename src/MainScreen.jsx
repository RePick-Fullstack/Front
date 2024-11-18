import './css/Main.css'
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { testNews } from "./assets/testNews.js";
import { testMainCommunity } from "./assets/testMainCommunity.js";

function MainScreen() {
    let navigate = useNavigate();
    const [news, setNews] = useState(testNews);
    let mainCommunity = testMainCommunity;
    const [inputValue, setInputValue] = useState("");
    const [chating, setChating] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [llmTyping, setLlmTyping] = useState(false);
    const [enterDelay, setEnterDelay] = useState(false); // 추가된 상태
    const chatAreaRef = useRef(null);

    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const handleNews = async () => {
        try {
            const getNews = await axios.get("http://localhost:8080/api/v1/news");
            console.log(getNews.data);
            getNews.data && setNews(getNews.data);
        } catch {
            console.log("server is not running");
        }
    };

    useEffect(() => {
        handleNews();
    }, []);

    const handleSendRequest = async () => {
        if (inputValue.trim() !== "") {
            const userMessage = { type: "user", text: inputValue };
            setChatHistory((prev) => [...prev, userMessage]);
            setLlmTyping(true);

            try {
                const response = await axios.get(`http://localhost:8080/generate-text?keyword=${inputValue} search result`);
                console.log(response.data);
                const generatedText = response.data[0].generated_text;
                const words = generatedText.split(" ");
                let currentText = "";
                for (let i = 0; i < words.length; i++) {
                    currentText += (i === 0 ? "" : " ") + words[i];
                    setChatHistory((prev) => {
                        const updatedHistory = [...prev];
                        if (updatedHistory[updatedHistory.length - 1]?.type === "llm") {
                            updatedHistory[updatedHistory.length - 1].text = currentText + "_";
                        } else {
                            updatedHistory.push({ type: "llm", text: currentText + "_" });
                        }
                        return updatedHistory;
                    });
                    await new Promise((resolve) => setTimeout(resolve, 25)); // 타이핑 효과를 위해 지연 시간 설정 (단어 단위)
                }
                // 마지막 _ 제거
                setChatHistory((prev) => {
                    const updatedHistory = [...prev];
                    if (updatedHistory[updatedHistory.length - 1]?.type === "llm") {
                        updatedHistory[updatedHistory.length - 1].text = currentText;
                    }
                    return updatedHistory;
                });
            } catch (error) {
                console.log("Failed to fetch data from server");
            }
            setLlmTyping(false);
            setInputValue(""); // 요청 후 입력 필드 초기화
        }
    };

    const handleEnterKey = (event) => {
        if (event.key === "Enter") {
            handleSendRequest();
            setChating(true);
            setTimeout(() => {
                setEnterDelay(true);
            }, 500); // 0.5초 후에 enterDelay를 false로 변경
        }
    };

    return (
        <div className={"ml-[50px] w-full"} style={{maxWidth: `calc(100% - 50px)`}}>
            <div className={"flex justify-center"}>
                <div className="container justify-center">
                    {enterDelay || <div className="hotReport" style={{
                        transition: "height 0.5s ease-in-out",
                        height: chating ? "0px" : "500px",
                        overflow: "hidden"
                    }}>
                        <p>인기 리포트 ㅇㅇ</p>
                        <div>모크 데이터</div>
                        <p>만들어서</p>
                        <p>map으로</p>
                        <p>반복문 돌리기</p>
                        <p>내용길면</p>
                        <p>스크롤 되게 만들거임</p>
                    </div>}
                    {enterDelay || <div className="right-column">
                        <div className="newsCrawling" style={{
                            transition: "height 0.5s ease-in-out",
                            height: chating ? "0px" : "240px",
                            overflow: chating ? "hidden" : `auto`,
                        }}>
                            <div>
                                {news.map((item, index) => (
                                    <div key={index}>{index + 1 + ".    "}
                                        <a href={item.url} style={{color: `black`}}>{item.title}</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={"justify-items-start"}>
                        <span className={"font-bold text-2xl"}>커뮤니티</span>
                            {/* 페이지 시작은 조회순으로 시작하고 인기순 누르면 조회 or 좋아요로 orderBy*/}
                        <button onClick={()=> {console.log("조회순 누름")}}>조회순</button>
                        <button onClick={()=> {console.log("추천순 누름")}}>추천순</button>
                            {/*전체보기 누르면 /community 페이지로 이동 */}
                        <button onClick={()=> {navigate('/community')}}>전체보기</button>

                        </div>
                        <div className="community" style={{
                            transition: "height 0.5s ease-in-out",
                            height: chating ? "0px" : "240px",
                            overflow: chating ? "hidden" : `auto`,
                        }}>
                            {mainCommunity.map((item, index) => (
                                <button className={"flex flex-col gap-y-2"} key={index}>{item.id}. {item.description}</button>
                            ))}
                        </div>
                    </div>}
                </div>
            </div>
            <div>
                <div className={`w-full flex justify-center ${chating ? `h-96` : `h-0`} overflow-y-scroll pl-5`}>
                    <div className="chatArea w-full max-w-[744px]" ref={chatAreaRef}>
                        {chatHistory.map((chat, index) => (
                            <div
                                key={index}
                                className={chat.type === "user" ? "userMessage" : "llmMessage"}
                                style={chat.type === "user" ? {textAlign: "right", marginTop: `20px`} : {
                                    textAlign: "left",
                                    marginTop: `20px`
                                }}
                            >
                                {chat.text}
                            </div>
                        ))}
                    </div>
                </div>
                <div className={"flex justify-center"}>
                    <div className="inputContainer flex w-full justify-center">
                        <div className={"relative w-full flex"} style={{maxWidth: `744px`}}>
                            <input
                                className="chatInput border border-black flex justify-between"
                                placeholder="쳇봇에게 질문"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleEnterKey}
                            />
                            <div className={"absolute flex items-center justify-center w-5 h-[35px]"}
                                 style={{left: 'calc(100% - 30px)'}}
                            >
                                <button className="inputButton" onClick={handleSendRequest} disabled={enterDelay}> {/* enterDelay 상태에 따라 버튼 비활성화 */}
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
        </div>
    );
}

export default MainScreen;
