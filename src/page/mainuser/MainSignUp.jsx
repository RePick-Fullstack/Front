import {useState} from 'react';
import PropTypes from 'prop-types'; // PropTypes 추가
import {usersApi} from '../../api/api.js'; // usersApi 사용

function MainSignUp({setIsSignUpOpen}) {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', gender: '', birthDate: '', nickname: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSignUp = async () => {
        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            const response = await usersApi.post('/signup', formData);

            if (response.status === 200) {
                alert('회원가입 성공! 이제 로그인하세요.');
                setIsSignUpOpen(false); // 회원가입 모달 닫기
            }
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert(error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (<div className="modal-overlay" onClick={() => setIsSignUpOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>회원가입</h2>
            <button className="close-modal" onClick={() => setIsSignUpOpen(false)}>⊗</button>
            <div className="input-container">
                <label>이름*</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="이름"
                />
            </div>
            <div className="input-container">
                <label>Email*</label>
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="abc123@gmail.com"
                />
            </div>
            <div className="input-container">
                <label>Password*</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="*********"
                />
            </div>
            <div className="input-container">
                <label>Password 재확인*</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="*********"
                />
            </div>
            <div className="input-container">
                <label>성별*</label>
                <div className="gender-buttons">
                    <button
                        className={`gender-button ${formData.gender === 'MALE' ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, gender: 'MALE'})}
                    >
                        남성
                    </button>
                    <button
                        className={`gender-button ${formData.gender === 'FEMALE' ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, gender: 'FEMALE'})}
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
                    value={formData.birthDate}
                    onChange={handleChange}
                    max="2024-12-18"
                />
            </div>
            <div className="input-container">
                <label>닉네임(선택)</label>
                <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder="근면한 복어"
                />
            </div>
            <button onClick={handleSignUp}>회원가입</button>
        </div>
    </div>);
}

// PropTypes 선언
MainSignUp.propTypes = {
    setIsSignUpOpen: PropTypes.func.isRequired,
};

export default MainSignUp;