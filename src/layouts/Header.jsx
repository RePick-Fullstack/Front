/* eslint-disable */
import {useState} from 'react';
import '../css/header.css';

function Header() {
    let [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
    let [isSignInOpen, setIsSignInOpen] = useState(false);
    let [isSignUpOpen, setIsSignUpOpen] = useState(false);


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
                                <button onClick={() => {
                                    if (isSignInOpen == true) {
                                        setIsSignInOpen(false)
                                    } else {
                                        setIsSignInOpen(true)
                                    }
                                }
                                }>로그인
                                </button>
                                {/* 이거 누르면 로그인 Modal 창 */}
                                {/* 로그인 버튼 */}
                                <button onClick={() => {
                                    if (isSignUpOpen == true) {
                                        setIsSignUpOpen(false)
                                    } else {
                                        setIsSignUpOpen(true)
                                    }
                                }}>회원가입
                                </button>
                                {/* 이거 누르면 회원가입 Modal 창 */}
                                {/* 회원가입 버튼 */}
                            </>
                        )}
                    </div>
                </div>
            </header>
            {
                isSignInOpen == true ?
                    <SignIn isSignInOpen={isSignInOpen} setIsSignInOpen={setIsSignInOpen}></SignIn> : null
            }
            {
                isSignUpOpen == true ?
                    <SignUp isSignUpOpen={isSignUpOpen} setIsSignUpOpen={setIsSignUpOpen}></SignUp> : null
            }
        </>
    );
}

// 로그인 모달
function SignIn(props) {
    return (
        <div className="modal-overlay" onClick={() => props.setIsSignInOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>로그인</h2>
                <button className="close-modal" onClick={() => props.setIsSignInOpen(false)}>⊗</button>
                <div className="input-container">
                    <label>Email</label>
                    <input type="text" placeholder="abc123@gmail.com"/>
                </div>
                <br></br>
                <div className="input-container">
                    <label>Password</label>
                    <input type="password" placeholder="*********"/>
                </div>

                <h6>소셜 미디어 로그인</h6>
                <h6 className="hr">SNS LOGIN</h6>
                <br></br>
                <div className="oauth-buttons">
                    <button className="oauth-button kakao"></button>
                    <button className="oauth-button google"></button>
                    <button className="oauth-button naver"></button>
                </div>
                <br></br>
                <button onClick={props.handleLogin}>로그인</button>
            </div>
        </div>
    );
}

//회원가입 모달
function SignUp(props) {
    let [selectedGender, setSelectedGender] = useState('');

    let handleGenderSelect = (gender) => {
        setSelectedGender(gender);
    };
    return (
        <div className="modal-overlay" onClick={() => props.setIsSignUpOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>회원가입</h2>
                <button className="close-modal" onClick={() => props.setIsSignUpOpen(false)}>⊗</button>
                <div className="input-container">
                    <label>이름*</label>
                    <input type="text" placeholder="이동현"/>
                </div>
                <div className="input-container">
                    <label>Email*</label>
                    <input type="text" placeholder="abc123@gmail.com"/>
                </div>
                <div className="input-container">
                    <label>Password*</label>
                    <input type="password" placeholder="*********"/>
                </div>
                <div className="input-container">
                    <label>Password 재확인*</label>
                    <input type="password" placeholder="*********"/>
                </div>
                <div className="input-container">

                    <label>성별*</label>
                    <div className="gender-buttons">
                        <button
                            className={`gender-button ${selectedGender === '남성' ? 'active' : ''}`}
                            onClick={() => handleGenderSelect('남성')}
                        >
                            남성
                        </button>
                        <button
                            className={`gender-button ${selectedGender === '여성' ? 'active' : ''}`}
                            onClick={() => handleGenderSelect('여성')}
                        >
                            여성
                        </button>
                    </div>
                    <div className="input-container">
                        <label>생년월일*</label>
                        <input type="date" max="2024-12-18"/>
                    </div>
                    <div className="input-container">
                        <label>닉네임(선택)</label>
                        <input type="text" placeholder="근면한 복어"/>
                    </div>
                </div>
                <br></br>
                <button onClick={props.handleLogin}>회원가입</button>

            </div>
        </div>
    )
}

export default Header;