import '../css/Main.css'
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {testNews} from "../data/testNews.js";
//import {testReport} from "../data/testReport.js";
import {eksApi} from "../api/api.js";

function MainScreen() {
    let navigate = useNavigate();
    const [news, setNews] = useState(testNews);
    const [reports, setReports] = useState([]);
    const [community, setCommunity] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [userMessage, setUserMessage] = useState("");  // userMessage로 상태 관리
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
            const getNews = await eksApi.get("/news");
            console.log(getNews.data);
            !getNews.data.isEmpty && setNews(getNews.data);
        } catch {
            console.log("server is not running");
        }
    };

    const handleCommunity = async () => {
        try {
            const getCommunity = await axios.get("https://repick.site/api/v1/posts");
            console.log("=============================");
            console.log(getCommunity);
            console.log("=============================");
            // posts = 게시물 가져오는 API임. 커뮤니티 가져오는 API를 만들거나 아니면 걍 정적데이터 testMainCommunity 쓰던가 해야됨.
            getCommunity.data;
        } catch {
            console.log("Community is not running");
        }
    }

    const handleReports = async () => {
        try {
            const getReports = await eksApi.get("/reports");  //eksApi로 report 데이터를 받아오고
            console.log(getReports.data);
            getReports.data && setReports(getReports.data); //받아온 데이터를 setReports로 바꾸기
        } catch {
            console.log("server is not running");
        }
    };

    useEffect(() => {
        handleNews();
        handleReports()
        handleCommunity()
    }, []);

    // const handleSendRequest = async () => {
    //     if (inputValue.trim() !== "") {
    //         const userMessage = {type: "user", text: inputValue};
    //         setChatHistory((prev) => [...prev, userMessage]);
    //         setLlmTyping(true);
    //         navigate("/ChatBot", {state : {chatHistory: [ ...chatHistory, userMessage]}});
    //
    //         try {
    //             const response = await axios.get(`http://localhost:8080/generate-text?keyword=${inputValue} search result`);
    //             console.log(response.data);
    //             const generatedText = response.data[0]?.generated_text;
    //             const words = generatedText.split(" ");
    //             let currentText = "";
    //             for (let i = 0; i < words.length; i++) {
    //                 currentText += (i === 0 ? "" : " ") + words[i];
    //                 setChatHistory((prev) => {
    //                     const updatedHistory = [...prev];
    //                     if (updatedHistory[updatedHistory.length - 1]?.type === "llm") {
    //                         updatedHistory[updatedHistory.length - 1].text = currentText + "_";
    //                     } else {
    //                         updatedHistory.push({type: "llm", text: currentText + "_"});
    //                     }
    //                     return updatedHistory;
    //                 });
    //                 await new Promise((resolve) => setTimeout(resolve, 25)); // 타이핑 효과를 위해 지연 시간 설정 (단어 단위)
    //             }
    //             // 마지막 _ 제거
    //             setChatHistory((prev) => {
    //                 const updatedHistory = [...prev];
    //                 if (updatedHistory[updatedHistory.length - 1]?.type === "llm") {
    //                     updatedHistory[updatedHistory.length - 1].text = currentText;
    //                 }
    //                 return updatedHistory;
    //             });
    //         } catch (error) {
    //             console.log("Failed to fetch data from server");
    //         }
    //         setLlmTyping(false);
    //         setInputValue(""); // 요청 후 입력 필드 초기화
    //     }alert("내용 입력하삼 ; ")
    //
    // };

    const handleSendRequest = async () => {
        if (inputValue.trim() !== "") {
            const userMessage = { type: "user", text: inputValue };
            setChatHistory((prev) => [...prev, userMessage]);
            navigate("/ChatBot", { state: { chatHistory: [...chatHistory, userMessage] } });

            try {
                const response = await axios.post(`https://repick.site/api/v1/chatbot/message/3784f905-bef5-46e6-b58a-69ee72d414cd`,
                    {
                        message: inputValue,
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                const generatedText = JSON.parse(response.data.response).response || "LLM의 응답을 가져오지 못했습니다.";
                const llmMessage = { type: "llm", text: generatedText };
                console.log(llmMessage);
                setChatHistory((prev) => [...prev, llmMessage]);
            } catch (error) {
                console.error("Failed to fetch data from server", error);
            }
        } else {
            alert("내용을 입력해주세요!");
        }
        setInputValue("");
    };


    const handleEnterKey = (event) => {
        if (event.key === "Enter") {
            handleSendRequest();
            // setChating(true);
            // setTimeout(() => {
            //     setEnterDelay(true);
            // }, 500); // 0.5초 후에 enterDelay를 false로 변경
        }
    };

    return (
        <div className={"ml-[150px]"} style={{maxWidth: `calc(100% - 50px)`}}>
            <div className="main_container justify-center">
                <div className="left_container">
                    <div className="report_header">
                        <p className={"font-bold text-2xl ml-11"}>Reports</p>

                        {enterDelay || <div className="hotReport">

                            <ul className={"h-full font-semibold"}>
                                <hr/>
                                <li className={"grid grid-cols-[5fr_3fr_2fr] px-4 py-2"}>
                                    <span className="text-left">리포트 제목</span>
                                    <span className="text-center">회사</span>
                                    <span className="text-right">발행 일자</span>
                                </li>
                                <hr className={"border-1 h-[1px]"}/>
                                {reports.map((report, index) =>
                                    <li key={index}>
                                        <div
                                            className={"report_data grid grid-cols-[5fr_3fr_2fr] px-4 py-2"}>
                                            <span
                                                className={"text-left"}>{`${index + 1}. ${report.company_name}`}</span>
                                            <span className={"text-center"}><a className={"ml-5 hover:underline"}
                                                                               href={report.pdf_link}>{report.securities_firm}</a></span>
                                            <span className={"text-right"}>{report.report_date}</span>
                                            <span>{report.report_title}</span>
                                            {/*여기에 리포트 내용의 요약이 들어가야됨*/}
                                        </div>

                                    </li>
                                )}
                            </ul>
                        </div>}
                    </div>
                </div>
                {enterDelay || <div className="right-column">
                    <p className={"news_title font-bold text-2xl ml-11 "} >뉴스
                    </p>

                    <div className="newsCrawling">     {/*뉴스 컴포넌트*/}
                        <div>
                            {news.map((item, index) => (
                                <div className={"hover:underline"} key={index}>{index + 1 + ".    "}
                                    <a href={item.url} target="_blank" rel="noopener noreferrer"  style={{color: `black`}}>{item.title}</a>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={"justify-items-start"}>   {/*  커뮤니티 컴포넌트   */}
                        <span className={"font-bold text-2xl ml-11"}>커뮤니티</span>
                        {/* 페이지 시작은 조회순으로 시작하고 인기순 누르면 조회 or 좋아요로 orderBy*/}
                        <button onClick={() => {
                            console.log("조회순 누름")
                        }}>조회순
                        </button>
                        <button onClick={() => {
                            console.log("추천순 누름")
                        }}>추천순
                        </button>


                    </div>
                    <div className="community">
                        {community.map((item, index) => (
                            <button className={"flex flex-col gap-y-2"}
                                    key={index} onClick={() => {
                                navigate(`/community?category=${item.title}`);
                            }}>{item.id}. {item.description}</button>
                        ))}
                    </div>
                </div>}
            </div>

            <div>
                <div className={`w-full flex justify-center ${chating ? `h-96` : `h-0`} overflow-y-scroll pl-5`}>
                    <div className="chatArea w-full max-w-[744px]" ref={chatAreaRef}>
                        {chatHistory.map((chat, index) => (
                            <div
                                key={index}
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
                                className="chatInput rounded-2xl border border-black flex justify-between"
                                placeholder="쳇봇에게 질문"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleEnterKey}
                            />
                            <div className={"absolute flex items-center justify-center w-5 h-[35px]"}
                                 style={{left: 'calc(100% - 30px)'}}
                            >
                                <button className="inputButton" onClick={handleSendRequest}
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
            </div>
        </div>
    );
}

export default MainScreen;
