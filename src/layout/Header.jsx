import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usersApi } from '../api/api.js'; // API 연결
import { decodeJWT, formatRemainingTime } from '../page/mainuser/MainUtils.jsx'; // 유틸리티 함수
import MainSignIn from '../page/mainuser/MainSignIn.jsx'; // 로그인 컴포넌트
import MainSignUp from '../page/mainuser/MainSignUp.jsx'; // 회원가입 컴포넌트
import '../css/header.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [modalState, setModalState] = useState({ signIn: false, signUp: false });
    const [userName, setUserName] = useState('');
    const [tokenRemainingTime, setTokenRemainingTime] = useState(null);

    // URL에서 토큰 추출 및 처리
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const accessToken = queryParams.get('accessToken');
        const refreshToken = queryParams.get('refreshToken');

        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            updateTokenRemainingTime();
            fetchUserName(accessToken);

            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    // 토큰 남은 시간 계산
    const updateTokenRemainingTime = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        const decodedToken = decodeJWT(accessToken);
        if (decodedToken?.exp) {
            const remainingTime = decodedToken.exp - Math.floor(Date.now() / 1000);
            setTokenRemainingTime(Math.max(remainingTime, 0));
        }
    };

    // 사용자 이름 가져오기
    const fetchUserName = async (accessToken) => {
        const token = accessToken || localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const { data } = await usersApi.get('/users/name', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const name = data.userName || data.username || data.name || '사용자';
            setUserName(name);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('사용자 이름 가져오기 실패:', error);
            setUserName('사용자');
        }
    };

    // 로그아웃 처리
    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await usersApi.get('/users/logout', {
                    headers: { Authorization: `Bearer ${refreshToken}` },
                });
            }
        } catch (error) {
            console.error('로그아웃 실패:', error.response || error.message);
        } finally {
            localStorage.clear();
            setIsLoggedIn(false);
            setUserName('');
            window.location.reload();
        }
    };

    // 초기화 및 주기적 토큰 확인
    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            updateTokenRemainingTime();
            fetchUserName();
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(updateTokenRemainingTime, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (tokenRemainingTime === 0) {
            alert('토큰이 만료되었습니다. 다시 로그인하세요.');
            handleLogout();
        }
    }, [tokenRemainingTime]);

    // 관리자 페이지 접근 제어
    useEffect(() => {
        if (location.pathname === '/admin' && !isLoggedIn) {
            alert('관리자 권한이 없습니다. 로그인 후 다시 시도하세요.');
            navigate('/');
        }
    }, [location, isLoggedIn, navigate]);

    return (
        <div className="w-full flex justify-end">
            <header className="header">
                <div className="header-content">
                    <div className="auth-buttons">
                        {isLoggedIn ? (
                            <>
                                <button onClick={() => navigate('/tosspayment')}>결제하기</button>
                                <button onClick={handleLogout}>로그아웃</button>
                                <div className="user-greeting">안녕하세요, {userName}님!</div>
                                <div className="token-timer">
                                    토큰 남은 시간: {tokenRemainingTime !== null ? formatRemainingTime(tokenRemainingTime) : '계산 중...'}
                                </div>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setModalState({ signIn: true, signUp: false })}>로그인</button>
                                <button onClick={() => setModalState({ signIn: false, signUp: true })}>회원가입</button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {modalState.signIn && (
                <MainSignIn
                    setIsSignInOpen={(isOpen) => setModalState({ ...modalState, signIn: isOpen })}
                    setIsLoggedIn={setIsLoggedIn}
                    setUserName={setUserName}
                />
            )}
            {modalState.signUp && (
                <MainSignUp
                    setIsSignUpOpen={(isOpen) => setModalState({ ...modalState, signUp: isOpen })}
                    setIsLoggedIn={setIsLoggedIn}
                />
            )}
        </div>
    );
}

export default Header;