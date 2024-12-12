// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import {usersApi} from "../../../api/api.js";

export const DefaultInfo = () => {
    // 상태 관리
    const [userInfo, setUserInfo] = useState({
        name: "", nickname: "", gender: "", birthDate: "", email: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(false); // 비밀번호 확인 모달 상태
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
    const [password, setPassword] = useState(""); // 비밀번호 입력 상태
    const [passwordError, setPasswordError] = useState(""); // 비밀번호 에러 메시지 상태

    // 데이터 호출
    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        usersApi.get('/users/mypage', {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then((response) => {
                const {name, email, nickname, gender, birthDay} = response.data;
                setUserInfo({
                    name: name || "",
                    nickname: nickname || "",
                    gender: gender || "",
                    birthDate: birthDay || "",
                    email: email || ""
                });
            })
            .catch((error) => console.error("데이터 불러오기 실패:", error));
    }, []);

    const handleSaveChanges = () => {
        const token = localStorage.getItem("accessToken");

        usersApi.put("/users/update", {
            name: userInfo.name, nickname: userInfo.nickname, gender: userInfo.gender, birthDate: userInfo.birthDate,
        }, {
            headers: {Authorization: `Bearer ${token}`},
        })
            .then(() => {
                alert("사용자 정보가 성공적으로 수정되었습니다.");
                setIsEditModalOpen(false); // 수정 모달 닫기
            })
            .catch((error) => {
                console.error("정보 수정 실패:", error);
                alert("정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
            });
    };


    // 모달 열기 함수
    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handlePasswordCheck = () => {
        setPassword(""); // 비밀번호 초기화
        setPasswordError(""); // 에러 초기화
        const token = localStorage.getItem("accessToken");

        usersApi.post("/users/check/password", {password}, {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then((response) => {
                if (response.data === "OK") {
                    // 비밀번호 확인 성공: 수정 모달 열기
                    setIsModalOpen(false); // 비밀번호 모달 닫기
                    setIsEditModalOpen(true); // 수정 모달 열기
                    setPasswordError(""); // 에러 초기화
                }
                if (response.data === "UNAUTHORIZED") {
                    setPasswordError("비밀번호가 일치하지 않습니다.");
                } else {
                    setPasswordError("서버 오류가 발생했습니다. 다시 시도해 주세요.");
                }
            })

    };

    const handleDeleteAccount = () => {
        const token = localStorage.getItem("accessToken");
ㅎ
        if (window.confirm("탈퇴 시 3개월 후 삭제 처리 됩니다.")) {
            usersApi.delete("/users/delete", {
                headers: {Authorization: `Bearer ${token}`},
            })
                .then(() => {
                    alert("회원 탈퇴가 완료되었습니다.");
                    localStorage.removeItem("accessToken"); // 토큰 삭제
                    window.location.href = "/"; // 메인 페이지로 리다이렉트
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
                <div className={"font-bold text-2xl mb-2 "}>기본정보</div>
                <div>
                    <button onClick={handleEditClick} className="border px-3 py-2 rounded bg-gray-200 ml-3">수정</button>
                </div>
                <div>
                    <button
                        onClick={handleDeleteAccount}
                        className="bg-red-500 text-white px-3 py-2 rounded ml-3"
                    >
                        회원 탈퇴
                    </button>
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
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
                    {userInfo.gender === "MALE" ? "남성" : userInfo.gender === "FEMALE" ? "여성" : ""}
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

            {/* 비밀번호 확인 모달 */}
            {isModalOpen && (<div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg">
                    <h2 className="font-bold mb-4">비밀번호 확인</h2>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        className="border px-2 py-1 w-full mb-4"
                    />
                    {passwordError && (<div className="text-red-500 text-sm mb-2">{passwordError}</div>)}
                    <div className="flex justify-end">
                        <button
                            onClick={handlePasswordCheck}
                            className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                            확인
                        </button>
                        <button
                            onClick={() => {
                                setIsModalOpen(false);
                                setPassword(""); // 비밀번호 초기화
                                setPasswordError(""); // 에러 초기화
                            }}
                            className="bg-gray-400 px-4 py-2 rounded"
                        >
                            취소
                        </button>

                    </div>
                </div>
            </div>)}

            {/* 수정 모달 */}
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
                        </div>

                        {/* 닉네임 */}
                        <div className="mb-4">
                            <label>닉네임</label>
                            <input
                                type="text"
                                value={userInfo.nickname}
                                onChange={(e) => setUserInfo({...userInfo, nickname: e.target.value})}
                                className="border px-2 py-1 w-full"
                            />
                        </div>

                        {/* 성별 */}
                        <div className="mb-4">
                            <label>성별</label>
                            <select
                                value={userInfo.gender}
                                onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}
                                className="border px-2 py-1 w-full"
                            >
                                <option value="MALE">남성</option>
                                <option value="FEMALE">여성</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label>생년월일</label>
                            <input
                                type="date"
                                value={userInfo.birthDate}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                                    if (dateRegex.test(value)) {
                                        setUserInfo({...userInfo, birthDate: value});
                                    } else {
                                        alert("생년월일은 YYYY-MM-DD 형식으로 입력해야 합니다.");
                                    }
                                }}
                                className="border px-2 py-1 w-full"
                            />
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
                </div>)}
        </div>);
};
