import {useEffect, useRef, useState} from "react";

import "../css/sidebar.css";
import PropTypes from "prop-types";

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
                <div className="sideBarHome"><a href="#home">₩</a><p className="home">안녕</p></div>
                <div className="sideBarHome">
                    <button onClick={() => {
                        props.setMenuOpen(!props.menuOpen)
                    }}>{props.menuOpen ? "◀" : "▶"}
                    </button>
                    <p className="sideBar">열기</p></div>
                <div className="sideBarHome"><a href="#about">third</a><p className="third">THIRD</p></div>

                <div className="sideBarHome"><a href="#contact">four</a></div>
            </nav>
        </div>
    )
}
// PropTypes 추가
BeforeSideBar.propTypes = {
    menuOpen: PropTypes.bool.isRequired,  // menuOpen은 boolean 타입이고 필수 prop임을 명시
    setMenuOpen: PropTypes.func.isRequired // setMenuOpen은 함수 타입이고 필수 prop임을 명시
};
export default SideBar;