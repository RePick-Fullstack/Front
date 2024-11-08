import {useState} from 'react';
import '../css/header.css';
import PropTypes from "prop-types"; // 스타일을 외부 파일로 관리

function Header() {
    let [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
    let [isSignInOpen, setIsSignInOpen] = useState(false);
    let [isSignUpOpen, setIsSignUpOpen] = useState(false);

    let handleLogin = () => {
        setIsLoggedIn(true); // 로그인 처리
    };

    let handleLogout = () => {
        setIsLoggedIn(false); // 로그아웃 처리
    };


    return (
        <>
            <header className="header">
                <div className="header-content">
                    <div className="auth-buttons">
                        {isLoggedIn ? (
                            <button onClick={handleLogout}>로그아웃</button> // 로그인 시 로그아웃 버튼
                        ) : (
                            <>
                                <button onClick={handleLogin}>로그인</button> {/* 이거 누르면 로그인 Modal 창 */}
                                {/* 로그인 버튼 */}
                                <button>회원가입</button> {/* 이거 누르면 회원가입 Modal 창 */}
                                {/* 회원가입 버튼 */}
                            </>
                        )}
                    </div>
                </div>
            </header>
            <SignIn isSignInOpen = {isSignInOpen} setIsSignInOpen = {setIsSignInOpen}></SignIn>
        </>
    );
}

// 로그인 모달
function SignIn(props) {
    return (
        <div className="modal-overlay" onClick={() => props.setIsSignInOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>로그인</h2>
                <input type="text" placeholder="아이디" />
                <input type="password" placeholder="비밀번호" />
                <button onClick={handleLogin}>로그인 완료</button>
                <button className="close-modal" onClick={() => setIsSignInOpen(false)}>닫기</button>
            </div>
        </div>
    );
}

Header.propTypes = {
    setIsSignInOpen: PropTypes.func.isRequired
}
export default Header;