/* eslint-disable */
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import "../css/sidebar.css";
import SideBarOpen from "../assets/sideBarOpen.svg";
import SideBarClose from "../assets/sideBarClose.svg";
import Home from "../assets/home.svg";
import ReportDownload from "../assets/reportDownload.svg";
import Community from "../assets/community.svg";
import ChatBot from "../assets/chatBot.svg";
import MyPageLogo from "../assets/myPageLogo.svg";
import XLogo from "../assets/XLogo.svg"
import ChatHistory from "./ChatHistory.jsx";
import MainSignIn from "../page/mainuser/MainSignIn.jsx";
import MainSignUp from "../page/mainuser/MainSignUp.jsx";
import {usersApi} from "../api/api.js";
import {v4 as uuidv4} from "uuid";
import MainContactAdmin from "../page/mainuser/MainContactAdmin.jsx";
import axios from "axios";

function SideBar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalState, setModalState] = useState({signIn: false, signUp: false, contactAdmin: false});
    const [userName, setUserName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isVisible, setIsVisible] = useState(null); // 상태 관리로 보여짐 여부 설정

    useEffect(() => {
        const handleBilling = async () => {
            const {data: billing} = await usersApi.get("/users/billing", {
                headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
            })
            console.log("billing 타입 : " + typeof billing);
            console.log("billing : " + JSON.stringify(billing));
            if (billing && billing.billing===false) {
                console.log("결제 안됐음 false임")
                setIsVisible(true);

            } else {
                console.log("결제 했음 true임");
                setIsVisible(false);
            }
        };
        handleBilling();
    },[])
    const handleHide = () => {
        setIsVisible(false); // 클릭 시 숨기기
    };

    const handleNavigation = (path) => {
        setMenuOpen(false);
        navigate(path);
    }

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
                <div className={"flex justify-between items-center mb-5 w-3/4 ml-2.5"}>
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
                    <div onClick={() => {
                        handleNavigation(`/chatbot/${uuidv4().toString()}?type=new`)
                    }} // 챗봇 페이지 이동버튼
                         className={"cursor-pointer items-center w-4/5 h-[40px] flex border-[1px] border-solid border-[#B3B3B3] text-left  rounded-xl"}>
                        <span className={"font-thin text-white text-[15px] ml-3"}>+ 새 질문</span>
                    </div>
                    <div className={" w-4/5 flex flex-row text-left mb-1"}>
                        <img src={MyPageLogo} alt={"MyPageLogo"}/> {/*  마이페이지 로고 */}
                        <div className={"cursor-pointer font-semibold text-white text-[14px] mt-1 ml-2.5"}
                             onClick={() => { //사이드바 열렸을때
                                 handleNavigation("/myPage")
                             }}>마이페이지
                        </div>
                    </div>
                    <hr className={"w-4/5 bg-white border-[0.5px] scale-y-50 mb-5"}/>

                    <h3 className={"text-white h-[40vh] w-3/4 rounded-xl flex justify-center"}>
                        <ChatHistory/> {/* 최근 검색 기록 나오는 곳*/}
                    </h3>
                    {!localStorage.getItem("accessToken") ? (<>
                        <div className={"absolute bottom-5 left-5 font-medium text-[12px]"}>
                            <button className={"text-white mr-5"}
                                    onClick={() => setModalState({
                                        signIn: true,
                                        signUp: false,
                                        contactAdmin: false
                                    })}>로그인
                            </button>
                            <button className={"text-white mr-5"}
                                    onClick={() => setModalState({
                                        signIn: false,
                                        signUp: true,
                                        contactAdmin: false
                                    })}>회원가입
                            </button>
                            <button
                                className={"text-white"}
                                onClick={() => setModalState({signIn: false, signUp: false, contactAdmin: true})}>
                                고객센터
                            </button>
                        </div>
                    </>) : (<>
                        {isVisible && ( //isVisible이 true때 표시
                            <div className={"w-[263px] h-[147px] bg-[#DADEE3] border-2 rounded-lg"}>
                                <div className={"flex text-[#2c3e50] flex-row justify-between p-2.5"}>
                                    <div
                                        className={"w-[45px] h-[19px] bg-white rounded-lg text-center text-[9px] text-[#2c3e50] flex items-center justify-center"}>신규
                                    </div>
                                    <p className={"px-2 pt-1"}><img className={"cursor-pointer"} src={XLogo}
                                                                    alt="X Logo" onClick={handleHide} // 클릭 이벤트 핸들러 연결
                                    /></p>
                                </div>
                                <div className={"text-[14px] text-[#2c3e50] text-center p-1"}>
                                    <div>RePick만의 특별한 기능을</div>
                                    <div>무제한으로 이용하세요!</div>
                                </div>
                                <div onClick={() => {
                                    handleNavigation("/tosspayment")
                                }}
                                     className={"cursor-pointer bg-[#2c3e50] w-[233px] h-[40px] rounded-lg ml-2.5 mt-[5px] py-2"}>
                                    <div className={"text-white text-center text-[15px] font-bold"}>결제하기</div>
                                </div>
                            </div>)} {/* 결제 한 인원을 이 div태그박스가 안보이게 삼항연산자 사용해서 */}
                        <button
                            className={"text-white font-medium text-[12px] absolute bottom-5 left-5"}
                            onClick={() => setModalState({signIn: false, signUp: false, contactAdmin: true})}>
                            고객센터
                        </button>
                    </>)}
                </>) : (<>
                        <span className={"cursor-pointer"} onClick={() => { //챗봇 페이지
                            navigate(`/chatbot/${uuidv4().toString()}?type=new`)
                        }}>
                            <img src={ChatBot} alt="ChatBot Logo"/> 
                        </span>
                    <div className={"cursor-pointer mb-3.5" +
                        ""} onClick={() => { //커뮤니티 TOTAL 페이지
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
            {modalState.contactAdmin && (
                <MainContactAdmin
                    setIsContactUsOpen={(isOpen) => setModalState({...modalState, contactAdmin: isOpen})} // 수정
                    setIsLoggedIn={setIsLoggedIn}
                />
            )}
        </div>
    </>)

}


export default SideBar;