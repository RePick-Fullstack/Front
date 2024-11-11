/* eslint-disable */
import { useState} from "react";

import "../css/sidebar.css";

function SideBar() {
    let [menuOpen, setMenuOpen] = useState(false);


    return (
        <>
            <BeforeSideBar menuOpen={menuOpen} setMenuOpen={setMenuOpen}></BeforeSideBar>
        </>
    )

}

function BeforeSideBar(props){
    return (
        <div className="icon">
            <nav className={props.menuOpen ? "active" : ""}>
                <div className="sideBarHome"><a href="#home">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px"
                         fill="#5f6368">
                        <path
                            d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
                    </svg>
                </a><p className="home">안녕</p></div>
                <div className="sideBarHome">
                    <button onClick={() => {
                        props.setMenuOpen(!props.menuOpen)
                    }}>{props.menuOpen ? <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                        : <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>}
                    </button>
                    <p className="sideBar">열기</p></div>
                <div className="sideBarHome"><a href="#about">third</a><p className="third">THIRD</p></div>

                <div className="sideBarHome"><a href="#contact">four</a></div>
            </nav>
        </div>
    )
}

export default SideBar;