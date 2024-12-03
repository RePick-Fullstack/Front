import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usersApi } from '../api/api.js'; // API 연결
import { decodeJWT, formatRemainingTime } from '../page/mainuser/MainUtils.jsx'; // 유틸리티 함수
import MainSignIn from '../page/mainuser/MainSignIn.jsx'; // 로그인 컴포넌트
import MainSignUp from '../page/mainuser/MainSignUp.jsx'; // 회원가입 컴포넌트
import AdminSignIn from '../page/admin/AdminSignIn.jsx'; // 관리자 로그인 컴포넌트
import '../css/header.css';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [tokenRemainingTime, setTokenRemainingTime] = useState(null);

    // URL에서 토큰 추출 및 저장
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const accessToken = queryParams.get('accessToken');
        const refreshToken = queryParams.get('refreshToken');

        if (accessToken && refreshToken) {
            console.log('카카오 로그인 토큰:', { accessToken, refreshToken });

            // 토큰 저장
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // 로그인 상태 및 사용자 이름 업데이트
            updateTokenRemainingTime();
            fetchUserName(accessToken); // 매개변수로 전달

            // URL에서 토큰 제거
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate]);

    // 토큰 남은 시간 업데이트
    const updateTokenRemainingTime = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        const decodedToken = decodeJWT(accessToken);
        if (decodedToken?.exp) {
            const now = Math.floor(Date.now() / 1000);
            const remainingTime = decodedToken.exp - now;
            setTokenRemainingTime(Math.max(remainingTime, 0));
        }
    };

    // 사용자 이름 가져오기
    const fetchUserName = async (accessToken) => {
        const token = accessToken || localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const response = await usersApi.get('/users/name', {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('사용자 이름 응답:', response.data);
            const name = response.data.userName || response.data.username || response.data.name || '사용자';
            setUserName(name);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('사용자 이름 가져오기 실패:', error);
            setUserName('사용자'); // 기본값 설정
        }
    };

    // 로그아웃 처리
    const handleLogout = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('@tosspayments/merchant-browser-id');

        usersApi
            .get('/users/logout', {
                headers: { Authorization: `Bearer ${refreshToken}` },
            })
            .then(() => {
                setIsLoggedIn(false);
                setUserName('');
                window.location.reload();
            })
            .catch((error) => {
                console.error('로그아웃 실패:', error.response || error.message);
                setIsLoggedIn(false);
                setUserName('');
                window.location.reload();
            });
    };

    // 초기화
    useEffect(() => {
        if (localStorage.getItem('accessToken')) {
            updateTokenRemainingTime();
            fetchUserName(); // 매개변수 없이 호출하여 기본값 처리
        }
    }, []);

    // 토큰 남은 시간 주기적 업데이트
    useEffect(() => {
        const interval = setInterval(updateTokenRemainingTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // 토큰 만료 시 로그아웃
    useEffect(() => {
        if (tokenRemainingTime === 0) {
            alert('토큰이 만료되었습니다. 다시 로그인하세요.');
            handleLogout();
        }
    }, [tokenRemainingTime]);

    // 관리자 로그인 버튼
    const handleAdminLoginRedirect = () => {
        setIsAdminLoginOpen(true);
    };

    return (
        <div className="w-full flex justify-end">
            <header className="header">
                <div className="header-content">
                    <div className="auth-buttons">
                        {isLoggedIn ? (
                            <>
                                <button onClick={() => navigate("/tosspayment")}>결제하기</button>
                                <button onClick={handleLogout}>로그아웃</button>
                                <div className="user-greeting">안녕하세요, {userName}님!</div>
                                <div className="token-timer">
                                    토큰 남은 시간: {tokenRemainingTime !== null ? formatRemainingTime(tokenRemainingTime) : '계산 중...'}
                                </div>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setIsSignInOpen(true)}>로그인</button>
                                <button onClick={() => setIsSignUpOpen(true)}>회원가입</button>
                            </>
                        )}
                        {!isAdminLoginOpen && (
                            <button onClick={handleAdminLoginRedirect}>관리자 로그인</button>
                        )}
                    </div>
                </div>
            </header>
            {isSignInOpen && (
                <MainSignIn setIsSignInOpen={setIsSignInOpen} setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />
            )}
            {isSignUpOpen && <MainSignUp setIsSignUpOpen={setIsSignUpOpen} setIsLoggedIn={setIsLoggedIn} />}
            {isAdminLoginOpen && (
                <AdminSignIn setIsAdminSignInOpen={setIsAdminLoginOpen} onLoginSuccess={() => navigate('/AdminMain')} />
            )}
        </div>
    );
}

export default Header;
