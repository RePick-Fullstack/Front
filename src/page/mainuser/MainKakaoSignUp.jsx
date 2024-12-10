import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {usersApi} from '../../api/api.js'; // usersApi 사용

const MainKakaoSignUp = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 쿼리 파라미터에서 email과 name을 추출
    const email = new URLSearchParams(location.search).get('email');
    const name = new URLSearchParams(location.search).get('name');

    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [nickname, setNickname] = useState('');

    // 이메일이나 이름이 없으면 로그인 페이지로 리다이렉트
    useEffect(() => {
        if (!email || !name) {
            navigate('/');
        }
    }, [email, name, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const additionalInfo = {email, name, gender, birthDate, nickname};

        try {
            // '/oauth/kakao/login'으로 추가 정보를 전송
            const response = await usersApi.post('/oauth/kakao/login', additionalInfo);

            // 응답 데이터에서 accessToken, refreshToken을 추출
            const { accessToken, refreshToken } = response.data;

            // 실제 토큰 값을 추출하여 저장
            const accessTokenValue = accessToken.token; // accessToken에서 token 값 추출
            const refreshTokenValue = refreshToken.token; // refreshToken에서 token 값 추출

            // 토큰이 없으면 오류 처리
            if (!accessTokenValue || !refreshTokenValue) {
                alert('토큰을 받지 못했습니다. 다시 시도해주세요.');
                return;
            }

            // 토큰을 localStorage에 저장
            localStorage.setItem('accessToken', accessTokenValue);
            localStorage.setItem('refreshToken', refreshTokenValue);

            // URL을 인코딩하여 리다이렉트
            window.location.href = encodeURI('https://repick.site/'); // 리다이렉트할 URL
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert(`회원가입에 실패했습니다: ${error.response?.data?.message || error.message}`);
        }
    };

    return (<div className="modal-overlay" onClick={() => navigate('/')}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>추가 정보 입력</h2>
            <button className="close-modal" onClick={() => navigate('/')}>⊗</button>

            <div className="input-container">
                <label>이메일</label>
                <input type="email" name="email" value={email} disabled/>
            </div>

            <div className="input-container">
                <label>이름</label>
                <input type="text" name="name" value={name} disabled/>
            </div>

            <div className="input-container">
                <label>성별*</label>
                <div className="gender-buttons">
                    <button
                        className={`gender-button ${gender === 'MALE' ? 'active' : ''}`}
                        onClick={() => setGender('MALE')}
                    >
                        남성
                    </button>
                    <button
                        className={`gender-button ${gender === 'FEMALE' ? 'active' : ''}`}
                        onClick={() => setGender('FEMALE')}
                    >
                        여성
                    </button>
                </div>
            </div>

            <div className="input-container">
                <label>생년월일*</label>
                <input
                    type="date"
                    name="birthDate"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max="2024-12-18"
                    required
                />
            </div>

            <div className="input-container">
                <label>닉네임(선택)</label>
                <input
                    type="text"
                    name="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임"
                />
            </div>

            <button onClick={handleSubmit}>완료</button>
        </div>
    </div>);
};

export default MainKakaoSignUp;
