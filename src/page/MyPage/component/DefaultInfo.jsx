// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import {usersApi} from "../../../api/api.js";

export const DefaultInfo = () => {
    // 상태 관리
    const [userInfo, setUserInfo] = useState({
        name: "",
        nickname: "",
        gender: "",
        birthDate: "",
        email: "",
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
    const [errors, setErrors] = useState({}); // 에러 상태 추가

    const validateForm = () => {
        const newErrors = {};

        if (!userInfo.name) newErrors.name = "이름은 필수 항목입니다.";
        else if (!/^[가-힣]+$/.test(userInfo.name)) newErrors.name = "이름은 한글만 입력 가능합니다.";

        if (userInfo.nickname && !/^[가-힣\s]+$/.test(userInfo.nickname))
            newErrors.nickname = "닉네임은 한글과 띄어쓰기만 입력 가능합니다.";

        if (!userInfo.gender) newErrors.gender = "성별을 선택해주세요.";

        if (!userInfo.birthDate) newErrors.birthDate = "생년월일은 필수 항목입니다.";
        else {
            const today = new Date();
            const birthDate = new Date(userInfo.birthDate);
            if (birthDate >= today) newErrors.birthDate = "생년월일은 과거 날짜여야 합니다.";
        }

        return newErrors;
    };

    // 데이터 호출
    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        usersApi
            .get("/users/mypage", {
                headers: {Authorization: `Bearer ${token}`},
            })
            .then((response) => {
                const {name, email, nickname, gender, birthDay} = response.data;
                setUserInfo({
                    name: name || "",
                    nickname: nickname || "",
                    gender: gender || "",
                    birthDate: birthDay || "",
                    email: email || "",
                });
            })
            .catch((error) => console.error("데이터 불러오기 실패:", error));
    }, []);

    // 사용자 정보 수정 요청
    const handleSaveChanges = () => {
        const validationErrors = validateForm(); // 유효성 검사 실행
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors); // 에러 상태 업데이트
            return; // 에러가 있으면 API 호출 중단
        }

        const token = localStorage.getItem("accessToken");

        usersApi
            .put(
                "/users/update",
                {
                    name: userInfo.name,
                    nickname: userInfo.nickname,
                    gender: userInfo.gender,
                    birthDate: userInfo.birthDate,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                alert("사용자 정보가 성공적으로 수정되었습니다.");
                setIsEditModalOpen(false);
                setErrors({}); // 에러 상태 초기화
                window.location.reload();
            })
            .catch((error) => {
                console.error("정보 수정 실패:", error);
                alert("정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
            });
    };

    // 수정 모달 열기
    const handleEditClick = () => {
        setIsEditModalOpen(true); // 바로 수정 모달 열기
    };

    // 회원 탈퇴 처리
    const handleDeleteAccount = () => {
        const token = localStorage.getItem("accessToken");
        if (window.confirm("탈퇴 시 되돌릴 수 없습니다.")) {
            usersApi
                .delete("/users/delete", {
                    headers: {Authorization: `Bearer ${token}`},
                    "Content-Type": "application/json"
                })
                .then(() => {
                    alert("회원 탈퇴가 완료되었습니다.");
                    localStorage.clear();
                    window.location.href = "/";
                })
                .catch((error) => {
                    console.error("회원 탈퇴 실패:", error);
                    alert("탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
                });
        }
    };

    return (
        <div>
            <div className={"flex flex-row mb-5"}>
                <div className={"font-bold text-2xl mb-2 mt-5 "}>기본정보</div>
                <div>
                    <button
                        onClick={handleEditClick}
                        className="border px-3 text-white py-2 rounded bg-gray-500 ml-3 mt-2"
                    >
                        수정
                    </button>
                </div>
                <div>
                    <button
                        onClick={handleDeleteAccount}
                        className="bg-[#2c3e50] text-white px-3 py-2 rounded ml-3 mt-2"
                    >
                        회원 탈퇴
                    </button>
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>

            {/* 사용자 정보 표시 */}
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>이름</div>
                <div className={"w-64"}>{userInfo.name}</div>
            </div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>닉네임</div>
                <div className={"w-64"}>{userInfo.nickname}</div>
            </div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>성별</div>
                <div className={"w-64"}>
                    {userInfo.gender === "MALE"
                        ? "남성"
                        : userInfo.gender === "FEMALE"
                            ? "여성"
                            : ""}
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>생년월일</div>
                <div className={"w-64"}>{userInfo.birthDate}</div>
            </div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>이메일</div>
                <div className={"w-64"}>{userInfo.email}</div>
            </div>
            <hr className="border-t-[2.4px]"/>

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="font-bold mb-4">정보 수정</h2>

                        {/* 이름 */}
                        <div className="mb-4">
                            <label>이름</label>
                            <input
                                type="text"
                                value={userInfo.name}
                                onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                                className="border px-2 py-1 w-full"
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}
                        </div>

                        {/* 닉네임 */}
                        <div className="mb-4">
                            <label>닉네임</label>
                            <input
                                type="text"
                                value={userInfo.nickname}
                                onChange={(e) =>
                                    setUserInfo({...userInfo, nickname: e.target.value})
                                }
                                className="border px-2 py-1 w-full"
                            />
                            {errors.nickname && <p className="text-red-500">{errors.nickname}</p>}
                        </div>

                        {/* 성별 */}
                        <div className="mb-4">
                            <label>성별</label>
                            <select
                                value={userInfo.gender}
                                onChange={(e) =>
                                    setUserInfo({...userInfo, gender: e.target.value})
                                }
                                className="border px-2 py-1 w-full"
                            >
                                <option value="">선택</option>
                                <option value="MALE">남성</option>
                                <option value="FEMALE">여성</option>
                            </select>
                            {errors.gender && <p className="text-red-500">{errors.gender}</p>}
                        </div>

                        {/* 생년월일 */}
                        <div className="mb-4">
                            <label>생년월일</label>
                            <input
                                type="date"
                                value={userInfo.birthDate}
                                onChange={(e) =>
                                    setUserInfo({...userInfo, birthDate: e.target.value})
                                }
                                max="2024-12-18"
                                className="border px-2 py-1 w-full"
                            />
                            {errors.birthDate && <p className="text-red-500">{errors.birthDate}</p>}
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveChanges}
                                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                            >
                                저장
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-gray-400 px-4 py-2 rounded"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};