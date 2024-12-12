import '../css/Main.css'
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
//import {testNews} from "../data/testNews.js";
//import {testReport} from "../data/testReport.js";
import {eksApi} from "../api/api.js";

function MainScreen() {
    let navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [reports, setReports] = useState([]);
    const [industryReports, setIndustryReports] = useState([]);
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

    const handleReports = async (type) => {
            const {data: {content : reports}} = await eksApi.get(`/reports/${type}`,{params:{page: 0, size: 5}}).catch(() => {console.log("server is not running");});
            console.log(reports);
            type === "company" ? setReports(reports) : setIndustryReports(reports);
    };

    useEffect(() => {
        handleNews();
        handleReports("company");
        handleReports("industry");
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
        if (localStorage.getItem("accessToken") === null) {
            alert("먼저 로그인 하여 주시기 바랍니다.");
            return;
        }
        if (inputValue.trim() !== "") {
            const userMessage = {type: "user", text: inputValue};
            setChatHistory((prev) => [...prev, userMessage]);
            navigate("/ChatBot", {state: {chatHistory: [...chatHistory, userMessage]}});

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
                const llmMessage = {type: "llm", text: generatedText};
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
        <div className={"ml-[10px] h-[100vh]"} style={{maxWidth: `calc(100% - 50px)`}}>
            <div className="main_container justify-center">
                <div className="left_container">
                    <div className="report_header">
                        {enterDelay || <div className="hotReport">
                            <p className={"font-bold text-xl pl-5 p-3"}>종목분석 레포트</p>
                            <ul className={"font-extrabold"}>
                                <hr className={"border-whitesmoke border-[0.5px]"}/>
                                <li className={"grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 font-black text-[13px] gap-4 px-4 py-2"}>
                                    <span className="text-left ml-6">기업</span>
                                    <span className="text-left">제목</span>
                                    <span className="text-center ml-3">증권사</span>
                                    <span className="text-center ml-2">발행 일자</span>
                                </li>
                            </ul>
                            <hr className={"border-whitesmoke border-[0.5px]"}/>
                            <div className="report_scroll">
                                <ul> {/*     종목분석 레포트     */}
                                    {reports.map((report, index) =>
                                        <li key={index}>
                                            <div className={"report_data grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4  gap-4 px-4 py-2"}>
                                            <span
                                                className={"text-left ml-4"}>{`${report.company_name}`}</span>
                                                <span>{report.report_title}</span>
                                                <span className={"text-left ml-[52px]"}><a className={"ml-5 hover:underline"}
                                                                                   href={report.pdf_link}>{report.securities_firm}</a></span>
                                                <span className={"text-center ml-[25px]"}>{report.report_date}</span>
                                                {/*여기에 리포트 내용의 요약이 들어가야됨*/}
                                            </div>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>}
                    </div>
                    {enterDelay || <div className="industryReport">
                        <p className={"font-bold text-xl pl-5 p-3"}>산업분석 레포트</p>
                        <ul className={"font-extrabold"}>
                            <hr className={"border-whitesmoke border-[1px]"}/>
                            <li className={"grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 font-black text-[13px] gap-5 px-4 py-2"}>
                                <span className="text-left ml-6">기업</span>
                                <span className="text-left">제목</span>
                                <span className="text-center ml-3">증권사</span>
                                <span className="text-center">발행 일자</span>
                            </li>
                        </ul>
                        <hr className={"border-whitesmoke border-[1px]"}/>
                        <div className="industry_scroll">
                            <ul>       {/*    여기에 산업분석 레포트 나오는거 넣기  */}
                                {industryReports.map((report, index) =>
                                    <li key={index}>
                                        <div className={"report_data grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4  gap-5 px-4 py-2"}>
                                            <span
                                                className={"text-left ml-4"}>{`${report.sector}`}</span>
                                            <span>{report.report_title}</span>
                                            <span className={"text-left ml-[52px]"}><a className={"ml-5 hover:underline"}
                                                                             href={report.pdf_link}>{report.securities_firm}</a></span>
                                            <span className={"text-center ml-[20px]"}>{report.report_date}</span>
                                            {/*여기에 리포트 내용의 요약이 들어가야됨*/}
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>}
                </div>
                {enterDelay || <div className="right-column">

                    <div className="newsCrawling">     {/*뉴스 컴포넌트*/}
                        <div>
                            <p className={"news_title font-bold text-xl p-3 ml-2"}>뉴스</p>
                            {news.map((item, index) => (
                                <div className={"w-[20vw] hover:bg-gray-200 text-[12.5px] font-semibold rounded-xl p-3 ml-4"} key={index}>
                                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                                       style={{color: `black`}}>{item.title}</a>

                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={"communityOrder"}>   {/*  커뮤니티 컴포넌트   */}
                    </div>
                    <div className="community">
                        <span className={"font-bold text-lg"}>커뮤니티</span>
                        {/* 페이지 시작은 조회순으로 시작하고 인기순 누르면 조회 or 좋아요로 orderBy*/}
                        <div className={"float-right active:border-black text-[11px]"}>
                            <button className={"mr-5"} onClick={() => {
                                console.log("조회순 누름")
                            }}>조회순
                            </button>
                            <button onClick={() => {
                                console.log("추천순 누름")
                            }}>추천순
                            </button>
                        </div>
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
                        <div className={"relative w-full flex"} style={{maxWidth: `900px`}}>
                            <input
                                className="chatInput rounded-2xl flex"
                                placeholder="어떤 레포트가 궁금하신가요?"
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
                                         height="25px" width="25px">
                                        <path
                                            d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0432C16.1223 22.5716 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99992 12L1.94607 9.31543Z"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <p className={"relative justify-center w-full flex text-[10px]"}>AI는 실수할 수 있습니다. 원문을 꼭 확인하시길 바라며, 투자는 개인의 책임입니다.</p>
            </div>
        </div>
    );
}

export default MainScreen;
