// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar"; // 사이드바 컴포넌트
import { usersApi } from "../../api/api.js";
import "./AdminUser.css";

function AdminUser() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const [selectedUser, setSelectedUser] = useState(null); // 선택된 유저 상태

    useEffect(() => {
        const adminAccessToken = localStorage.getItem("adminAccessToken");
        if (!adminAccessToken) {
            alert("관리자 인증이 필요합니다.");
            navigate("/");
        } else {
            fetchUsers(adminAccessToken, page);
        }
    }, [navigate, page]);

    // 유저 데이터를 가져오는 함수
    const fetchUsers = async (token, page) => {
        setLoading(true);
        try {
            const response = await usersApi.get("/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
                params: { page, size: 20 },
            });
            setUsers(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            setError("유저 데이터를 가져오는 데 실패했습니다.");
            console.error(err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    // 유저 활성화/비활성화 처리 함수
    const toggleUserStatus = async (userId, isActive) => {
        const adminAccessToken = localStorage.getItem("adminAccessToken");
        if (!adminAccessToken) {
            alert("관리자 인증이 필요합니다.");
            navigate("/");
            return;
        }

        try {
            const endpoint = isActive
                ? `/admin/users/deactivate/${userId}`
                : `/admin/users/activate/${userId}`;
            await usersApi.put(endpoint, null, {
                headers: { Authorization: `Bearer ${adminAccessToken}` },
            });
            alert(`유저가 성공적으로 ${isActive ? "비활성화" : "활성화"}되었습니다.`);
            // 유저 목록 새로고침
            fetchUsers(adminAccessToken, page);
        } catch (err) {
            setError("상태 변경 실패. 다시 시도해주세요.");
            console.error(err.response?.data || err.message);
        }
    };

    // 페이지네이션 핸들러
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    // 모달 닫기 핸들러
    const closeModal = () => {
        setSelectedUser(null);
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />
            <div className="admin-content">
                <h1>유저 관리</h1>
                {error && <p className="error-message">{error}</p>}

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>데이터를 불러오는 중...</p>
                    </div>
                ) : (
                    <>
                        <div className="table-container">
                            <table className="custom-table">
                                <thead>
                                <tr>
                                    <th>이름</th>
                                    <th>닉네임</th>
                                    <th>성별</th>
                                    <th>이메일</th>
                                    <th>가입일</th>
                                    <th>상태</th>
                                    <th>작업</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        onClick={() => setSelectedUser(user)} // 행 클릭 시 유저 선택
                                    >
                                        <td>{user.name}</td>
                                        <td>{user.nickname}</td>
                                        <td>{user.gender === "FEMALE" ? "여성" : "남성"}</td>
                                        <td>{user.email}</td>
                                        <td>{new Date(user.createDate).toLocaleDateString()}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${
                                                    user.deleteDate ? "inactive" : "active"
                                                }`}
                                            >
                                                {user.deleteDate ? "비활성화" : "활성화"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className={`toggle-status-button ${
                                                    user.deleteDate ? "activate" : "deactivate"
                                                }`}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 모달 열림 방지
                                                    toggleUserStatus(user.id, !user.deleteDate);
                                                }}>
                                                {user.deleteDate ? "활성화" : "비활성화"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="pagination">
                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 0}
                            >
                                이전
                            </button>
                            <span className="pagination-info">
                                {page + 1} / {totalPages}
                            </span>
                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page + 1 >= totalPages}
                            >
                                다음
                            </button>
                        </div>
                    </>
                )}

                {selectedUser && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>유저 상세 정보</h2>
                            <button className="close-button" onClick={closeModal}>
                                닫기
                            </button>
                            <div className="user-details">
                                <p>
                                    <strong>이름:</strong> {selectedUser.name}
                                </p>
                                <p>
                                    <strong>닉네임:</strong> {selectedUser.nickname}
                                </p>
                                <p>
                                    <strong>성별:</strong>{" "}
                                    {selectedUser.gender === "FEMALE" ? "여성" : "남성"}
                                </p>
                                <p>
                                    <strong>이메일:</strong> {selectedUser.email}
                                </p>
                                <p>
                                    <strong>가입일:</strong>{" "}
                                    {new Date(selectedUser.createDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <strong>상태:</strong>{" "}
                                    {selectedUser.deleteDate ? "비활성화" : "활성화"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminUser;
