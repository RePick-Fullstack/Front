import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../api/api.js'; // usersApi 임포트
import { decodeJWT, formatRemainingTime } from '../page/mainuser/MainUtils.jsx'; // 유틸리티 함수
import MainSignIn from '../page/mainuser/MainSignIn.jsx'; // 로그인 컴포넌트
import MainSignUp from '../page/mainuser/MainSignUp.jsx'; // 회원가입 컴포넌트
import '../css/header.css';

function Header() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [tokenRemainingTime, setTokenRemainingTime] = useState(null);

    // 남은 토큰 시간 업데이트
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

    // 로그아웃 핸들러
    const handleLogout = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('@tosspayments/merchant-browser-id');

        usersApi
            .get('/users/logout', {
                headers: { Authorization: `Bearer ${refreshToken}` },
            })
            .then(() => window.location.reload())
            .catch((error) => {
                console.error('로그아웃 실패:', error.response || error.message);
                window.location.reload();
            });
    };

    // 로그인 연장
    const handleExtendLogin = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            alert('리프레시 토큰이 없습니다. 다시 로그인하세요.');
            return;
        }

        usersApi
            .post('/users/refresh-token', {}, {
                headers: { Authorization: `Bearer ${refreshToken}` },
            })
            .then((response) => {
                const accessToken = response?.data?.accessToken?.token || response?.data?.accessToken;
                const newRefreshToken = response?.data?.refreshToken?.token || response?.data?.refreshToken;

                if (accessToken && newRefreshToken) {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);
                    alert('로그인 세션이 연장되었습니다!');
                } else {
                    throw new Error('유효한 액세스 토큰 또는 리프레시 토큰이 응답되지 않았습니다.');
                }
            })
            .catch((error) => {
                console.error('로그인 연장 실패:', error);
                if (error.response?.status === 401) {
                    alert('인증이 만료되었습니다. 다시 로그인하세요.');
                    handleLogout();
                } else {
                    alert('로그인 연장에 실패했습니다. 다시 시도해주세요.');
                }
            });
    };

    // 사용자 이름 가져오기
    const fetchUserName = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return;

        usersApi
            .get('/users/name', {
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((response) => setUserName(response.data.userName || '사용자'))
            .catch((error) => console.error('사용자 이름 가져오기 실패:', error));
    };

    // 쿼리 파라미터 확인
    const checkQueryParams = () => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setIsLoggedIn(true);
            fetchUserName();
            window.history.replaceState({}, document.title, '/');
        } else if (localStorage.getItem('accessToken')) {
            setIsLoggedIn(true);
        }
    };

    // Hooks
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

        if (tokenRemainingTime === 30) {
            const userConfirmed = window.confirm('로그인 세션이 곧 만료됩니다. 연장하시겠습니까?');
            if (userConfirmed) {
                handleExtendLogin();
            } else {
                handleLogout();
            }
        }
    }, [tokenRemainingTime]);

    useEffect(checkQueryParams, []);

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
                    </div>
                </div>
            </header>
            {isSignInOpen && <MainSignIn setIsSignInOpen={setIsSignInOpen} setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />}
            {isSignUpOpen && <MainSignUp setIsSignUpOpen={setIsSignUpOpen} setIsLoggedIn={setIsLoggedIn}/>}
        </div>
    );
}

export default Header;
