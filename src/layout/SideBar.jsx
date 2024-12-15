/* eslint-disable */
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "../css/sidebar.css";
import SideBarOpen from "../assets/sideBarOpen.svg"
import SideBarClose from "../assets/sideBarClose.svg"
import Home from "../assets/home.svg"
import ReportDownload from "../assets/reportDownload.svg"
import Community from "../assets/community.svg"
import ChatBot from "../assets/chatBot.svg"
import ChatHistory from "./ChatHistory.jsx";
import MainSignIn from "../page/mainuser/MainSignIn.jsx";
import MainSignUp from "../page/mainuser/MainSignUp.jsx";
import {usersApi} from "../api/api.js";
import {v4 as uuidv4} from "uuid";

function SideBar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalState, setModalState] = useState({signIn: false, signUp: false});
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleNavigation = (path) => {
        setMenuOpen(false);
        navigate(path);
    }

    const handleLogout = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            usersApi.get('/users/logout', {
                headers: {Authorization: `Bearer ${refreshToken}`},
            })
        }
        localStorage.clear();
        setIsLoggedIn(false);
        setUserName('');
        window.location.reload();
    };

    return (<>
        <div className="icon">
            <nav className={menuOpen ? "active" : ""}>
                {!menuOpen && (<div>
                    <button onClick={() => { //사이드바 열기
                        setMenuOpen(!menuOpen)
                    }}>
                        {menuOpen ? "" : <img src={SideBarOpen} alt="SideBar Logo"/>}
                    </button>
                </div>)}
                <div className={"flex justify-between items-center mb-9 w-3/4 ml-1"}>
                    <button onClick={() => {  //홈 버튼
                        navigate('/');
                        setMenuOpen(false);
                    }}>
                        <img src={Home} alt="Home Logo"/>
                    </button>
                    <button onClick={() => { //사이드바 열기
                        setMenuOpen(!menuOpen)
                    }}>{menuOpen ? <img src={SideBarClose} alt="SideBar Logo"/> : ""}
                    </button>
                </div>
                {menuOpen ? (<>
                    <h4 className={"cursor-pointer hover:underline font-semibold text-white m-5"}
                        onClick={() => {
                            handleNavigation(`/ChatBot/${uuidv4().toString()}?type=new`)
                        }}>새 질문</h4>
                    <h4 className={"cursor-pointer hover:underline font-semibold text-white m-5"}
                        onClick={() => { //사이드바 열렸을때
                            handleNavigation("/myPage")
                        }}>마이 페이지</h4>
                    <h3 className={"bg-white h-2/4 w-3/4 p-2 rounded-xl flex justify-center"}>
                        <ChatHistory/> {/* 여기다가 chatHIstory map 써서 나오게 하면 될듯 */}
                    </h3>
                    {!localStorage.getItem("accessToken") ? (<>
                        <button className={"bg-white w-[225px] mt-5"}
                                onClick={() => setModalState({signIn: true, signUp: false})}>로그인
                        </button>
                        <button className={"bg-white w-[225px] mt-5"}
                                onClick={() => setModalState({signIn: false, signUp: true})}>회원가입
                        </button>

                    </>) : (<>
                        <button className={"bg-white w-[225px] mt-5 text-black"} onClick={handleLogout}>로그아웃</button>
                    </>)}
                </>) : (<>
                        <span className={"cursor-pointer"} onClick={() => { //챗봇 페이지
                            navigate("/chatbot")
                        }}>
                            <img src={ChatBot} alt="ChatBot Logo"/> 
                        </span>
                    <div className={"cursor-pointer mb-8"} onClick={() => { //커뮤니티 TOTAL 페이지
                        navigate("/community?category=TOTAL")
                    }}>
                        <img src={Community} alt="Community Logo"/>
                    </div>
                    <span className={"cursor-pointer"} onClick={() => { //사이드바 닫혔을때 레포트 저장소 페이지
                        navigate("/ReportPage")
                    }}>
                                    <img src={ReportDownload} alt="Report Logo"/>
                            </span>

                </>)}
            </nav>


            {modalState.signIn && (<MainSignIn
                setIsSignInOpen={(isOpen) => setModalState({...modalState, signIn: isOpen})}
                setIsLoggedIn={setIsLoggedIn}
                setUserName={setUserName}
            />)}
            {modalState.signUp && (<MainSignUp
                setIsSignUpOpen={(isOpen) => setModalState({...modalState, signUp: isOpen})}
                setIsLoggedIn={setIsLoggedIn}/>)}
        </div>
    </>)

}


export default SideBar;