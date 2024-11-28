/* eslint-disable */
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import "../css/sidebar.css";

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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="30" viewBox="0 0 24 24">
                                        <path fill="currentColor"
                                              d="m10 18l-6-6l6-6l1.4 1.45L7.85 11H20v2H7.85l3.55 3.55z"/>
                                    </svg>
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                        <g fill="none">
                                            <path
                                                d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/>
                                            <path fill="currentColor"
                                                  d="M19 19a1 1 0 1 0 2 0V5a1 1 0 1 0-2 0zM11.297 7.05a1 1 0 0 0 0 1.415L13.833 11H4a1 1 0 0 0 0 2h9.833l-2.536 2.536a1 1 0 0 0 1.415 1.414l4.242-4.243a1 1 0 0 0 0-1.414L12.712 7.05a1 1 0 0 0-1.415 0"/>
                                        </g>
                                    </svg>}
                            </button>
                        </div>
                    )}
                    <div className={"flex justify-between items-center mb-9 w-3/4 ml-1"}>
                        <button onClick={() => {  //홈 버튼
                            navigate('/');
                            location.reload();
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960"
                                 width="35px" fill="black">
                                <path
                                    d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
                            </svg>
                        </button>
                        <button onClick={() => { //사이드바 열기
                            setMenuOpen(!menuOpen)
                        }}>{menuOpen ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="30" viewBox="0 0 24 24">
                                <path fill="currentColor"
                                      d="m10 18l-6-6l6-6l1.4 1.45L7.85 11H20v2H7.85l3.55 3.55z"/>
                            </svg> : ""}
                        </button>
                    </div>
                    {menuOpen ? (
                        <>
                            <h4 className={"cursor-pointer hover:underline font-semibold"} onClick={() => { //사이드바 열렸을때
                                handleNavigation("/myPage")
                            }}>마이 페이지</h4>
                            <div className="sideBarHome"><a href="#new2">New Content 2</a></div>
                        </>
                    ) : (
                        <>
                            <span className={"cursor-pointer hover:underline"} onClick={() => { //사이드바 닫혔을때
                                navigate("/ReportPage")
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 24 24"><g
                                    fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                    strokeWidth="2"><path d="M14 3v4a1 1 0 0 0 1 1h4"/><path
                                    d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2m-5-10v6m-3-3h6"/></g></svg>
                            </span>
                            <div className={"cursor-pointer"} onClick={() => {
                                navigate("/community?category=TOTAL")
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
                                    <g fill="currentColor">
                                        <path
                                            d="M14 10a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1zM2 9a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2z"/>
                                        <path
                                            d="M5 11.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m-2 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0M14 3a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM2 2a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/>
                                        <path
                                            d="M5 4.5a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m-2 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0"/>
                                    </g>
                                </svg>
                            </div>
                        </>
                    )}
                </nav>
            </div>
        </>
    )

}


export default SideBar;