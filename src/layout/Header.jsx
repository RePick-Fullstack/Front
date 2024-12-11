import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {tosspaymentsApi, usersApi} from '../api/api.js'; // API 연결
import { decodeJWT, formatRemainingTime } from '../page/mainuser/MainUtils.jsx'; // 유틸리티 함수

import '../css/header.css'

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [tokenRemainingTime, setTokenRemainingTime] = useState(null);
    const [isBilling, setIsBilling] = useState(false);

    const handleUserIsBilling = async () => {
        const token = localStorage.getItem('accessToken')
        if(token === null ) {return;}
        const {data: data } = await tosspaymentsApi.get("/remaining",
            {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        setIsBilling(data);
    }

    // URL에서 토큰 추출 및 처리
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const accessToken = queryParams.get('accessToken');
        const refreshToken = queryParams.get('refreshToken');

        if (accessToken && refreshToken) {
            // 토큰 저장
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            // 토큰 처리 로직
            updateTokenRemainingTime();
            fetchUserName(accessToken);

            // 저장된 state로 리다이렉션
            const redirectUrl = localStorage.getItem("state");
            if (redirectUrl) {
                window.location.href = redirectUrl; // 리다이렉트
            } else {
                navigate("/", { replace: true }); // 기본 경로로 이동
            }
        }
    }, [location, navigate]);




    // 사용자 이름 가져오기
    const fetchUserName = async (accessToken) => {
        const token = accessToken || localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const { data } = await usersApi.get('/users/name', {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(data);
            const name = data.userNickName || data.username || data.name || '사용자';
            setUserName(name);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('사용자 이름 가져오기 실패:', error);
            setUserName('사용자');
        }
    };
    // 토큰 연장 처리
    const handleTokenRefresh = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            console.error('Refresh Token이 없습니다.');
            return;
        }

        try {
            const {data} = await usersApi.post(
                '/users/refresh-token',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`,
                    },
                }
            );
            console.log(data)
            if (data) {
                localStorage.setItem('accessToken', data.accessToken.token);
                localStorage.setItem('refreshToken', data.refreshToken.token);

                updateTokenRemainingTime();
                alert('토큰이 연장되었습니다.');
            } else {
                throw new Error('서버로부터 유효한 accessToken을 받지 못했습니다.');
            }
        } catch (error) {
            console.error('토큰 연장 실패:', error);
            alert('토큰 연장에 실패했습니다. 다시 로그인하세요.');
            handleLogout();
        }
    };
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

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await usersApi.get('/users/logout', {
                    headers: {Authorization: `Bearer ${refreshToken}`},
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
        handleUserIsBilling()
    }, []);

    useEffect(() => {
        const interval = setInterval(updateTokenRemainingTime, 1000);
        return () => clearInterval(interval);

    }, []);



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
                        {localStorage.getItem("accessToken") !== null ? (
                            <>
                                <div>결제여부 : {isBilling ? `결제` : `미결제`}</div>
                                <button onClick={() => navigate('/tosspayment')}>결제하기</button>
                                <button onClick={handleTokenRefresh}>토큰 연장</button>
                                {/* 토큰 연장 버튼 */}
                                <div className="user-greeting">안녕하세요, {userName}님!</div>
                                <div className="token-timer">
                                    로그인 남은 시간: {tokenRemainingTime !== null ? formatRemainingTime(tokenRemainingTime) : '계산 중...'}
                                </div>
                            </>
                        ) : (
                            <>
                                <div>로그인 후 이용해 주세요</div>
                            </>
                        )}
                    </div>
                </div>
            </header>


        </div>
    );
}

export default Header;