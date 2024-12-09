/* eslint-disable */
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import "../css/sidebar.css";
import SideBarOpen from "../assets/sideBarOpen.svg"
import SideBarClose from "../assets/sideBarClose.svg"
import Home from "../assets/home.svg"
import ReportDownload from "../assets/reportDownload.svg"
import Community from "../assets/community.svg"
import ChatHistory from "./ChatHistory.jsx";

function SideBar() {
    let navigate = useNavigate();
    let [menuOpen, setMenuOpen] = useState(false);

    const handleNavigation = (path) => {
        setMenuOpen(false);
        navigate(path);
    }


    return (
        <>
            <div className="icon">
                <nav className={menuOpen ? "active" : ""}>
                    {!menuOpen && (
                        <div>
                            <button onClick={() => { //사이드바 열기
                                setMenuOpen(!menuOpen)
                            }}>
                                {menuOpen ?
                                    ""
                                    :
                                    <img src={SideBarOpen} alt="SideBar Logo"/>
                                }
                            </button>
                        </div>
                    )}
                    <div className={"flex justify-between items-center mb-9 w-3/4 ml-1"}>
                        <button onClick={() => {  //홈 버튼
                            navigate('/');
                            setMenuOpen(false);
                        }}>
                            <img src={Home} alt="Home Logo"/>
                        </button>
                        <button onClick={() => { //사이드바 열기
                            setMenuOpen(!menuOpen)
                        }}>{menuOpen ?
                            <img src={SideBarClose} alt="SideBar Logo"/> : ""}
                        </button>
                    </div>
                    {menuOpen ? (
                        <>
                            <h4 className={"cursor-pointer hover:underline font-semibold text-white m-5"}
                                onClick={() => {
                                    handleNavigation("/ChatBot")
                                }}>새 질문</h4>
                            <h4 className={"cursor-pointer hover:underline font-semibold text-white m-5"} onClick={() => { //사이드바 열렸을때
                                handleNavigation("/myPage")
                            }}>마이 페이지</h4>
                            <h3 className={"bg-white h-2/4 w-3/4 p-2 rounded-xl"}>
                                <ChatHistory/> {/* 여기다가 chatHIstory map 써서 나오게 하면 될듯 */}
                            </h3>
                        </>
                    ) : (
                        <>
                            <span className={"cursor-pointer hover:underline"} onClick={() => { //사이드바 닫혔을때
                                navigate("/ReportPage")
                            }}>
                                    <img src={ReportDownload} alt="Report Logo"/>
                            </span>
                            <div className={"cursor-pointer"} onClick={() => {
                                navigate("/community?category=TOTAL")
                            }}>
                                <img src={Community} alt="Community Logo"/>
                            </div>
                        </>
                    )}
                </nav>
            </div>
        </>
    )

}


export default SideBar;