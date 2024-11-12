/* eslint-disable */
import {useState} from "react";

import "../css/sidebar.css";

function SideBar() {
    let [menuOpen, setMenuOpen] = useState(false);
    let [sidebarVisible, setSidebarVisible] = useState(false);


    return (
        <>
            <div className="icon">
                <nav className={menuOpen ? "active" : ""}>
                    {!menuOpen && (
                    <div className="sideBarHome">
                        <a href="#home">
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px"
                                 fill="#5f6368">
                                <path
                                    d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
                            </svg>
                        </a>
                    </div>
                        )}
                    <div className="sideBarHome">
                        <button onClick={() => {
                            setMenuOpen(!menuOpen)
                        }}>{menuOpen ?
                            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960"
                                 width="20px" //이게 X 표
                                 fill="#5f6368" style={{ position: "absolute", top: "20px", right: "20px" }}>
                                <path
                                    d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="20px"
                                 fill="#5f6368">
                                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                            </svg>}
                        </button>
                    </div>
                    {menuOpen ? (
                        <>
                            <div className="sideBarHome"><a href="#new1">New Content 1</a></div>
                            <div className="sideBarHome"><a href="#new2">New Content 2</a></div>
                        </>
                    ) : (
                        <>
                            <div className="sideBarHome"><a href="#about">third</a></div>
                            <div className="sideBarHome"><a href="#contact">four</a></div>
                        </>
                    )}
                </nav>
            </div>
        </>
    )

}




export default SideBar;