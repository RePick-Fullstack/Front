import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 리다이렉트용
import PropTypes from 'prop-types';
import { usersApi } from '../../api/api.js'; // API 설정 사용

function AdminSignIn({ setIsAdminSignInOpen }) {
    const [adminCode, setAdminCode] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleAdminLogin = () => {
        if (!adminCode || !password) {
            alert('아이디와 비밀번호를 입력해주세요.');
            return;
        }

        usersApi
            .post('/admin/login', { adminCode, password }) // 관리자 로그인 API 호출
            .then((response) => {
                if (response.status === 200) {
                    const { accessToken, refreshToken } = response.data;

                    // 토큰 저장
                    localStorage.setItem('adminAccessToken', accessToken.token);
                    localStorage.setItem('adminRefreshToken', refreshToken.token);

                    alert('관리자 로그인 성공!');
                    setIsAdminSignInOpen(false);

                    navigate('/admin/main');
                }
            })
            .catch((error) => {
                console.error('관리자 로그인 실패:', error);
                alert(error.response?.data?.message || '로그인에 실패했습니다.');
            });
    };

    return (
        <div className="modal-overlay" onClick={() => setIsAdminSignInOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>관리자 로그인</h2>
                <button className="close-modal" onClick={() => setIsAdminSignInOpen(false)}>⊗</button>
                <div className="input-container">
                    <label>아이디</label>
                    <input
                        type="text"
                        value={adminCode}
                        onChange={(e) => setAdminCode(e.target.value)}
                    />
                </div>
                <div className="input-container">
                    <label>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleAdminLogin}>로그인</button>
            </div>
        </div>
    );
}

AdminSignIn.propTypes = {
    setIsAdminSignInOpen: PropTypes.func.isRequired,
};

export default AdminSignIn;