/* eslint-disable */
import {useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";

import "../css/sidebar.css";

function SideBar() {
    let navigate = useNavigate();
    let [menuOpen, setMenuOpen] = useState(false);


    return (
        <>
            <div className="icon">
                <nav className={menuOpen ? "active" : ""}>
                    {!menuOpen && (
                        <div className="sideBarHome">
                            <button onClick={() => {
                                navigate('/');
                                location.reload();
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960"
                                     width="35px" fill="black">
                                    <path
                                        d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="sideBarHome">
                        <button onClick={() => {
                            setMenuOpen(!menuOpen)
                        }}>{menuOpen ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
                                <path fill="currentColor" d="m10 18l-6-6l6-6l1.4 1.45L7.85 11H20v2H7.85l3.55 3.55z"/>
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