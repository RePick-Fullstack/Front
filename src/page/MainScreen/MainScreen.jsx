import '../../css/Main.css'
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
//import {testNews} from "../data/testNews.js";
//import {testReport} from "../data/testReport.js";
import {eksApi} from "../../api/api.js";
import {v4 as uuidv4} from "uuid";
import {News} from "./component/News.jsx";
import {MainCommunity} from "./component/MainCommunity.jsx";
import Logo from "../../assets/logo_black.png"
import {CompanyReport} from "./component/CompanyReport.jsx";
import {IndustryReport} from "./component/IndustryReport.jsx";


function MainScreen() {
    let navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [industryReports, setIndustryReports] = useState([]);
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

    const handleSendRequest = async (text) => {
        if (localStorage.getItem("accessToken") === null) {
            alert("먼저 로그인 하여 주시기 바랍니다.");
            return;
        }
        console.log(text)
        if(text){navigate(`/ChatBot/${uuidv4().toString()}?type=main&message=${text}`); return;}
        if (inputValue.trim() !== "") {
            const userMessage = {type: "user", text: inputValue};
            navigate(`/ChatBot/${uuidv4().toString()}?type=main&message=${inputValue}`);
        } else {
            alert("내용을 입력해주세요!");
        }
        setInputValue("");
    };

    const handleEnterKey = (event) => {
        if (event.key === "Enter") {
            handleSendRequest();
        }
    };

    return (
        <div className={"ml-[50px] h-full w-full"}
             style={{maxHeight: `calc(100% - 135px)`, maxWidth: `calc(100% - 50px)`}}>
            <div className="main_container justify-center">
                <div className="left_container">
                    <div className="report_header">
                        <CompanyReport handleSendRequest={handleSendRequest}/>
                    </div>
                        <IndustryReport handleSendRequest={handleSendRequest}/>
                </div>
                {enterDelay || <div className="flex flex-col gap-[10px]">
                    <News/>
                    <MainCommunity/>
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
                            <div className={"absolute flex items-center justify-center w-3 h-[45px]"}
                                 style={{left: 'calc(100% - 30px)'}}
                            >
                                <button className="inputButton" onClick={() => handleSendRequest()}
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
                <p className={"relative justify-center w-full flex text-[10px]"}>AI는 실수할 수 있습니다. 원문을 꼭 확인하시길 바라며, 투자는
                    개인의 책임입니다.</p>
            </div>
        </div>
    );
}

export default MainScreen;
