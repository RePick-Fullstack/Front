
/* eslint-disable */
import { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/header.css';

function Header() {
    let [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
    let [isSignInOpen, setIsSignInOpen] = useState(false);
    let [isSignUpOpen, setIsSignUpOpen] = useState(false);

    // 페이지 로드 시 localStorage에서 토큰 확인
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // 로그아웃 시 토큰 삭제
        setIsLoggedIn(false); // 로그아웃 처리
    };

    return (
        <div className={"w-full flex justify-end"}>
            <header className="header">
                <div className="header-content">
                    <div className="auth-buttons">
                        {isLoggedIn ? (
                            <button onClick={handleLogout}>로그아웃</button> // 로그인 시 로그아웃 버튼
                        ) : (
                            <>
                                <button onClick={() => setIsSignInOpen(!isSignInOpen)}>로그인</button>
                                {/* 로그인 Modal 창 */}
                                <button onClick={() => setIsSignUpOpen(!isSignUpOpen)}>회원가입</button>
                                {/* 회원가입 Modal 창 */}
                            </>
                        )}
                    </div>
                </div>
            </header>
            {isSignInOpen && <SignIn setIsSignInOpen={setIsSignInOpen} setIsLoggedIn={setIsLoggedIn} />}
            {isSignUpOpen && <SignUp setIsSignUpOpen={setIsSignUpOpen} />}
        </div>
    );
}

// 로그인 모달 컴포넌트
function SignIn({ setIsSignInOpen, setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios.post('http://localhost:8080/login', { email, password })
            .then(response => {
                if (response.status === 200) {
                    const token = response.data;  // 서버에서 반환된 토큰
                    console.log("Token received: ", token);

                    if (token) {
                        localStorage.setItem('authToken', token);  // 토큰을 localStorage에 저장
                        setIsSignInOpen(false);
                        setIsLoggedIn(true); // 로그인 상태 업데이트
                    } else {
                        alert("토큰을 받지 못했습니다.");
                    }
                }
            })
            .catch(error => {
                console.error('Login error', error);
                alert('로그인 실패');
            });
    };


    return (
        <div className="modal-overlay" onClick={() => setIsSignInOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>로그인</h2>
                <button className="close-modal" onClick={() => setIsSignInOpen(false)}>⊗</button>
                <div className="input-container">
                    <label>Email</label>
                    <input type="text" placeholder="abc123@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-container">
                    <label>Password</label>
                    <input type="password" placeholder="*********" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button onClick={handleLogin}>로그인</button>
            </div>
        </div>
    );
}

// 회원가입 모달 컴포넌트
function SignUp({ setIsSignUpOpen }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        gender: '',
        birthDate: '',
        nickname: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSignUp = () => {
        axios.post('http://localhost:8080/signup', formData)
            .then(response => {
                if (response.status === 201) {
                    setIsSignUpOpen(false);
                    alert('회원가입 성공!');
                }
            })
            .catch(error => {
                console.error('Sign up error', error);
                alert('회원가입 실패');
            });
    };

    return (
        <div className="modal-overlay" onClick={() => setIsSignUpOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>회원가입</h2>
                <button className="close-modal" onClick={() => setIsSignUpOpen(false)}>⊗</button>
                <div className="input-container">
                    <label>이름*</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름" />
                </div>
                <div className="input-container">
                    <label>Email*</label>
                    <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="abc123@gmail.com" />
                </div>
                <div className="input-container">
                    <label>Password*</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="*********" />
                </div>
                <div className="input-container">
                    <label>Password 재확인*</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="*********" />
                </div>
                <div className="input-container">
                    <label>성별*</label>
                    <div className="gender-buttons">
                        <button className={`gender-button ${formData.gender === '남성' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, gender: '남성' })}>남성</button>
                        <button className={`gender-button ${formData.gender === '여성' ? 'active' : ''}`} onClick={() => setFormData({ ...formData, gender: '여성' })}>여성</button>
                    </div>
                </div>
                <div className="input-container">
                    <label>생년월일*</label>
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} max="2024-12-18" />
                </div>
                <div className="input-container">
                    <label>닉네임(선택)</label>
                    <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} placeholder="근면한 복어" />
                </div>
                <button onClick={handleSignUp}>회원가입</button>
            </div>
        </div>
    );
}

export default Header;
