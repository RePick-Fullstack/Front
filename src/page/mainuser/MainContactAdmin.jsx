// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {usersApi} from "../../api/api.js";

// eslint-disable-next-line react/prop-types
function MainContactAdmin({ setIsContactUsOpen }) {
    const [name, setName] = useState(""); // 이름 상태
    const [message, setMessage] = useState(""); // 내용 상태
    const [errors, setErrors] = useState({ name: "", message: "" }); // 에러 상태
    const [successMessage, setSuccessMessage] = useState(""); // 제출 성공 메시지
    const [loading, setLoading] = useState(false); // 제출 중 상태

    const validateForm = () => {
        const newErrors = { name: "", message: "" };

        if (!name.trim()) newErrors.name = "이름을 입력하세요.";
        if (!message.trim()) newErrors.message = "문의 내용을 입력하세요.";

        setErrors(newErrors);
        return !newErrors.name && !newErrors.message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 폼 유효성 검사
        if (!validateForm()) return;

        setLoading(true);
        setErrors({}); // 기존 에러 초기화

        try {
            // 백엔드에 맞는 요청 형식으로 수정
            const response = await usersApi.post("/users/suggestions", {
                name: name, // 이름 필드
                content: message // 메시지 필드 (백엔드에서는 content로 처리)
            });

            if (response.status !== 200) {
                throw new Error("문의사항 접수 중 오류가 발생했습니다.");
            }

            // 성공 메시지 표시
            setSuccessMessage("문의사항이 접수되었습니다.");
            setName(""); // 입력 필드 초기화
            setMessage("");

        } catch (error) {
            setErrors({ message: error.message || "알 수 없는 오류가 발생했습니다." });
        } finally {
            setLoading(false); // 로딩 상태 해제
        }
    };

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-modal-title">
            <style>
                {`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: white;
                    padding: 20px;
                    border-radius: 8px;
                    width: 400px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    font-size: 20px;
                    margin-bottom: 20px;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                .input, .textarea {
                    width: 100%;
                    padding: 10px;
                    margin-top: 5px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 14px;
                    transition: border-color 0.3s;
                }

                .input:focus, .textarea:focus {
                    border-color: #007bff;
                    outline: none;
                }

                .input-error, .textarea-error {
                    border-color: #dc3545;
                }

                .textarea {
                    height: 150px; /* 텍스트 영역 높이 확대 */
                    resize: vertical; /* 사용자가 세로 크기를 조정할 수 있도록 설정 */
                }

                .error-message {
                    color: #dc3545;
                    font-size: 12px;
                    margin-top: 5px;
                }

                .modal-actions {
                    display: flex;
                    justify-content: space-between;
                }

                .submit-button, .cancel-button {
                    padding: 10px 15px;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                }

                .submit-button {
                    background-color: #007bff;
                    color: white;
                }

                .cancel-button {
                    background-color: #6c757d;
                    color: white;
                }

                .success-message {
                    text-align: center;
                    padding: 20px;
                    background: #d4edda;
                    border: 1px solid #c3e6cb;
                    color: #155724;
                    border-radius: 8px;
                }

                .close-button {
                    margin-top: 20px;
                    padding: 10px 15px;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    background-color: #28a745;
                    color: white;
                }
                `}
            </style>

            <div className="modal-content">
                <h2 id="contact-modal-title">문의사항</h2>

                {successMessage && (
                    <div className="success-message">
                        <p>{successMessage}</p>
                        <button
                            className="close-button"
                            onClick={() => setIsContactUsOpen(false)}
                        >
                            닫기
                        </button>
                    </div>
                )}

                {!successMessage && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">이름</label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="이름을 입력하세요."
                                aria-describedby="name-error"
                                className={`input ${errors.name ? "input-error" : ""}`}
                            />
                            {errors.name && (
                                <p id="name-error" className="error-message">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">문의 내용</label>
                            <textarea
                                id="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="문의사항을 입력하세요."
                                aria-describedby="message-error"
                                className={`textarea ${errors.message ? "textarea-error" : ""}`}
                            />
                            {errors.message && (
                                <p id="message-error" className="error-message">
                                    {errors.message}
                                </p>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button type="submit" className="submit-button" disabled={loading}>
                                {loading ? "제출 중..." : "제출하기"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsContactUsOpen(false)}
                                className="cancel-button"
                            >
                                닫기
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default MainContactAdmin;