// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from "react";
import {usersApi} from "../../../api/api.js";

export const DefaultInfo = () => {
    // 상태 관리
    const [userInfo, setUserInfo] = useState({
        name: "",
        nickname: "",
        birthDate: "",
        email: "",
    });

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태
    const [password, setPassword] = useState(""); // 비밀번호 입력 상태
    const [passwordError, setPasswordError] = useState(""); // 비밀번호 에러 메시지 상태

    // 데이터 호출
    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        usersApi.get('/users/mypage', {
            headers: {Authorization: `Bearer ${token}`}
        })
            .then((response) => {
                const {name, email, nickname, birthDay} = response.data;
                setUserInfo({
                    name: name || "",
                    nickname: nickname || "",
                    birthDate: birthDay || "",
                    email: email || ""
                });
            })
            .catch((error) => console.error("데이터 불러오기 실패:", error));
    }, []);

    // 모달 열기 함수
    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    // 비밀번호 확인 API 호출
    const handlePasswordCheck = () => {
        const token = localStorage.getItem("accessToken");
        console.log("Authorization Header:", `Bearer ${token}`);

        usersApi.post(
            "/users/check/password",
            {password},
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        )
    };

    return (
        <div>
            <div className={"font-bold text-2xl mb-2 mt-5"}>기본정보</div>
            <div>
                <button onClick={handleEditClick} className="border px-4 py-2 rounded bg-gray-200">수정</button>
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
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="font-bold mb-4">비밀번호 확인</h2>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordError(""); // 에러 초기화
                            }}
                            className="border px-2 py-1 w-full mb-4"
                        />
                        {passwordError && (
                            <div className="text-red-500 text-sm mb-2">{passwordError}</div>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={handlePasswordCheck}
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                                확인
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-400 px-4 py-2 rounded">
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};