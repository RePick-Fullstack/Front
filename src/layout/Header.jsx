import {useEffect, useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {tosspaymentsApi, usersApi} from '../api/api.js'; // API 연결
import {decodeJWT, formatRemainingTime} from '../page/mainuser/MainUtils.jsx'; // 유틸리티 함수

import '../css/header.css'
import {LoadingSvg} from "../assets/LoadingSvg.jsx";
import MainSignIn from "../page/mainuser/MainSignIn.jsx";
import MainSignUp from "../page/mainuser/MainSignUp.jsx";
import Logo from "../assets/logo_black.png";

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [modalState, setModalState] = useState({signIn: false, signUp: false});
    const [userName, setUserName] = useState('');
    const [tokenRemainingTime, setTokenRemainingTime] = useState(null);

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
                navigate("/", {replace: true}); // 기본 경로로 이동
            }
        }
    }, [location, navigate]);


    // 사용자 이름 가져오기
    const fetchUserName = async (accessToken) => {
        const token = accessToken || localStorage.getItem('accessToken');
        if (!token) return;

        try {
            const {data} = await usersApi.get('/users/name', {
                headers: {Authorization: `Bearer ${token}`},
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
            if (data) {
                localStorage.setItem('accessToken', data.accessToken.token);
                localStorage.setItem('refreshToken', data.refreshToken.token);

                updateTokenRemainingTime();
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

    const handleLogout = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            usersApi.get('/users/logout', {
                headers: {Authorization: `Bearer ${refreshToken}`},
            })
        }
        localStorage.clear();
        setIsLoggedIn(false);
        setUserName('');
        window.location.reload();
    };
    const handleNavigation = (path) => {
        navigate(path);
        window.location.reload();
    }

    useEffect(() => {
        if (tokenRemainingTime === 0) {
            alert('토큰이 만료되었습니다. 다시 로그인하세요.');
            handleLogout();
        }
    }, [tokenRemainingTime]);


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


    // 관리자 페이지 접근 제어
    useEffect(() => {
        if (location.pathname === '/admin' && !isLoggedIn) {
            alert('관리자 권한이 없습니다. 로그인 후 다시 시도하세요.');
            navigate('/');
        }
    }, [location, isLoggedIn, navigate]);

    return (
        <div className="w-full">
            <header className={"py-[10px] px-5 flex justify-between items-center m-0"}>
                <div className="flex w-full justify-between items-center">
                        {localStorage.getItem("accessToken") !== null ? (
                            <>
                                    <div className={"flex items-center caret-transparent"}>
                                        <img src={Logo} alt="Logo" width="200px"/>
                                    </div>
                                    <div className={"flex items-center gap-3"}>
                                        <div className={"text-[#2c3e50] text-[9px]"}>
                                            로그인 남은
                                            시간: {tokenRemainingTime !== null ? formatRemainingTime(tokenRemainingTime) : '계산 중...'}
                                        </div>
                                        <button className="token-extend" onClick={handleTokenRefresh}>토큰연장</button>
                                        <div className="user-greeting">안녕하세요, {userName}님!</div>
                                        <button className={"w-[82px] h-[30px]"} onClick={handleLogout}>로그아웃</button>
                                        <button className={"w-[82px] h-[30px]"} onClick={() => handleNavigation("mypage")}>마이페이지
                                        </button>
                                    </div>
                                    {/* 토큰 연장 버튼 */}

                            </>
                        ) : (
                            <>
                                    <div className={"flex items-center caret-transparent"}>
                                        <img className={"float-left"} src={Logo} alt="Logo" width="200px"/>
                                    </div>
                                    <div className={"float-right"}>
                                        {!localStorage.getItem("accessToken") ? (<>
                                            <button className={"w-[82px] h-[30px]"}
                                                    onClick={() => setModalState({signIn: true, signUp: false})}>로그인
                                            </button>
                                            <button className={"w-[82px] h-[30px]"}
                                                    onClick={() => setModalState({signIn: false, signUp: true})}>회원가입
                                            </button>

                                        </>) : (<>

                                        </>)}
                                    </div>
                            </>
                        )}
                </div>
            </header>
            {modalState.signIn && (<MainSignIn
                setIsSignInOpen={(isOpen) => setModalState({...modalState, signIn: isOpen})}
                setIsLoggedIn={setIsLoggedIn}
                setUserName={setUserName}
            />)}
            {modalState.signUp && (<MainSignUp
                setIsSignUpOpen={(isOpen) => setModalState({...modalState, signUp: isOpen})}
                setIsLoggedIn={setIsLoggedIn}/>)}

        </div>
    );
}

export default Header;