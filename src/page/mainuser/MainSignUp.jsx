/* eslint-disable */
import React, { useState } from "react";
import { usersApi } from "../../api/api.js";

function MainSignUp({ setIsSignUpOpen }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        nickname: "",
        gender: "",
        birthDate: "",
    });

    const [errors, setErrors] = useState({}); // 오류 메시지 상태
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // 유효성 검사 함수
    const validateForm = () => {
        const newErrors = {};

        // 이메일 검증
        if (!formData.email) {
            newErrors.email = "이메일은 필수 항목입니다.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "올바른 이메일 형식이 아닙니다.";
        }

        // 비밀번호 검증
        if (!formData.password) {
            newErrors.password = "비밀번호는 필수 항목입니다.";
        } else if (formData.password.length < 8 || formData.password.length > 18) {
            newErrors.password = "비밀번호는 8자 이상, 18자 이하로 입력해주세요.";
        }

        // 비밀번호 확인 검증
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "비밀번호와 비밀번호 확인이 일치하지 않습니다.";
        }

        // 이름 검증
        if (!formData.name) {
            newErrors.name = "이름은 필수 항목입니다.";
        } else if (!/^[가-힣]+$/.test(formData.name)) {
            newErrors.name = "이름은 한글만 입력 가능합니다.";
        }

        // 성별 검증
        if (!formData.gender) {
            newErrors.gender = "성별을 선택해주세요.";
        }

        // 생년월일 검증
        if (!formData.birthDate) {
            newErrors.birthDate = "생년월일은 필수 항목입니다.";
        } else {
            const today = new Date();
            const birthDate = new Date(formData.birthDate);
            if (birthDate >= today) {
                newErrors.birthDate = "생년월일은 과거 날짜여야 합니다.";
            }
        }

        // 닉네임 검증 (선택)
        if (formData.nickname && !/^[가-힣\s]+$/.test(formData.nickname)) {
            newErrors.nickname = "닉네임은 한글과 띄어쓰기만 입력 가능합니다.";
        }

        return newErrors;
    };

    const handleSignUp = async () => {
        const formErrors = validateForm(); // 유효성 검사 실행

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors); // 오류 상태 업데이트
            return;
        }

        setIsLoading(true); // 로딩 시작

        try {
            // 서버로 회원가입 요청
            const response = await usersApi.post("/users/signup", formData);
            if (response.status === 200) {
                alert("회원가입 성공!");
                setIsSignUpOpen(false); // 모달 닫기
                setFormData({ // 폼 초기화
                    email: "",
                    password: "",
                    confirmPassword: "",
                    name: "",
                    nickname: "",
                    gender: "",
                    birthDate: "",
                });
                setErrors({});
            }
        } catch (error) {
            console.error("회원가입 실패:", error);
            alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    return (
        <div className="modal-overlay" onClick={() => setIsSignUpOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>회원가입</h2>
                <button className="close-modal" onClick={() => setIsSignUpOpen(false)}>
                    ⊗
                </button>
                <div className="input-container">
                    <label>이름*</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="이름"
                    />
                    {errors.name && <p className="error-message">{errors.name}</p>}
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
                    {errors.email && <p className="error-message">{errors.email}</p>}
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
                    {errors.password && <p className="error-message">{errors.password}</p>}
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
                    {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                </div>
                <div className="input-container">
                    <label>성별*</label>
                    <div className="gender-buttons">
                        <button
                            type="button"
                            className={`gender-button ${formData.gender === "MALE" ? "active" : ""}`}
                            onClick={() => setFormData({ ...formData, gender: "MALE" })}
                        >
                            남성
                        </button>
                        <button
                            type="button"
                            className={`gender-button ${formData.gender === "FEMALE" ? "active" : ""}`}
                            onClick={() => setFormData({ ...formData, gender: "FEMALE" })}
                        >
                            여성
                        </button>
                    </div>
                    {errors.gender && <p className="error-message">{errors.gender}</p>}
                </div>
                <div className="input-container">
                    <label>생년월일*</label>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={(e) => setFormData(e.target.value)}
                        max="2024-12-18"
                        required
                    />
                    {errors.birthDate && <p className="error-message">{errors.birthDate}</p>}
                </div>
                <div className="input-container">
                    <label>닉네임(선택)</label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        placeholder="닉네임"
                    />
                    {errors.nickname && <p className="error-message">{errors.nickname}</p>}
                </div>
                <button onClick={handleSignUp} disabled={isLoading}>
                    {isLoading ? "로딩 중..." : "회원가입"}
                </button>
            </div>
        </div>
    );
}

export default MainSignUp;