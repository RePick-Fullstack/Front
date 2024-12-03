import { useState } from 'react';
import PropTypes from 'prop-types';
import { usersApi } from '../../api/api.js'; // usersApi 사용

function MainSignIn({ setIsSignInOpen, setIsLoggedIn, setUserName }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태 추가

    const fetchUserName = async (accessToken) => {
        try {
            const response = await usersApi.get('/users/name', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const userName = response.data.userName || '사용자';
            setUserName(userName); // 사용자 이름 업데이트
        } catch (error) {
            console.error('사용자 이름 가져오기 실패:', error);
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMessage('이메일과 비밀번호를 입력해주세요.');
            return;
        }

        try {
            const response = await usersApi.post('/login', { email, password });

            if (response.status === 200) {
                const { accessToken, refreshToken } = response.data;

                // 토큰 저장
                localStorage.setItem('accessToken', accessToken.token);
                localStorage.setItem('refreshToken', refreshToken.token);

                setIsSignInOpen(false); // 로그인 모달 닫기
                setIsLoggedIn(true); // 로그인 상태 업데이트

                fetchUserName(accessToken.token); // 사용자 이름 가져오기
                setErrorMessage(''); // 에러 메시지 초기화
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const { errorCode, message } = error.response.data;

                switch (errorCode) {
                    case 'USER_DELETED':
                        setErrorMessage('정지된 사용자입니다. 관리자에게 문의하세요.');
                        break;
                    case 'INVALID_CREDENTIALS':
                        setErrorMessage('잘못된 이메일 또는 비밀번호입니다.');
                        break;
                    default:
                        setErrorMessage(message || '알 수 없는 오류가 발생했습니다.');
                        break;
                }
            } else {
                setErrorMessage('서버와 통신할 수 없습니다. 네트워크 상태를 확인하세요.');
            }
        }
    };

    return (
        <div className="modal-overlay" onClick={() => setIsSignInOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>로그인
                    <button
                        className="absolute w-20 h-5 top-5 left-50 text-center p-0 flex justify-center items-center"
                        onClick={() => {
                            setEmail('example2@gmail.com');
                            setPassword('password123');
                        }}
                    >
                        테스트
                    </button>
                </h2>

                <button className="close-modal" onClick={() => setIsSignInOpen(false)}>⊗</button>
                <div className="input-container">
                    <label>Email</label>
                    <input
                        type="text"
                        placeholder="abc123@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="input-container">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="*********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {errorMessage && (
                    <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                        {errorMessage}
                    </div>
                )}
                <h6>소셜 미디어 로그인</h6>
                <h6 className="hr" style={{ paddingBottom: '20px' }}>SNS LOGIN</h6>
                <div className="oauth-buttons" style={{marginBottom: '20px'}}>
                    <button className="oauth-button kakao" onClick={handleKakaoLogin}>
                        {/* 카카오 버튼 */}
                    </button>
                    <button className="oauth-button naver" onClick={handleNaverLogin}>
                        {/* 네이버 버튼 */}
                    </button>
                </div>
                <button onClick={handleLogin}>로그인</button>
            </div>
        </div>
    );
}

// PropTypes를 사용한 props 검증
MainSignIn.propTypes = {
    setIsSignInOpen: PropTypes.func.isRequired,
    setIsLoggedIn: PropTypes.func.isRequired,
    setUserName: PropTypes.func.isRequired,
};

// 카카오 로그인
const handleKakaoLogin = () => {
    const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=425177266f9081ed665e51bd34048cc9&redirect_uri=http://localhost:8080/api/v1/oauth/kakao/callback';
    window.location.href = kakaoAuthUrl;
};

const handleNaverLogin = () => {
    const naverAuthUrl = 'https://nid.naver.com/oauth2.0/authorize?client_id=A_aQx4dtFzTavl7L6lVf&response_type=code&redirect_uri=http://localhost:8080/api/v1/oauth/naver/callback';
    window.location.href = naverAuthUrl;
};

export default MainSignIn;