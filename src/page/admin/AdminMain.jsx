// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Bar } from "react-chartjs-2";
import { usersApi } from "../../api/api.js";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "./AdminMain.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminMain() {
    const navigate = useNavigate();

    // States for data
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [monthlyData, setMonthlyData] = useState([]);
    const [totalUsers, setTotalUsers] = useState(null);

    // States for loading and errors
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const adminAccessToken = localStorage.getItem("adminAccessToken");
        if (!adminAccessToken) {
            alert("관리자 인증이 필요합니다.");
            navigate("/");
        } else {
            initializePage(adminAccessToken);
        }
    }, [navigate]);

    // Initialize page data
    const initializePage = async (token) => {
        try {
            await Promise.all([
                fetchTotalUsers(token),
                fetchAvailableYears(token),
                fetchMonthlyData(token, selectedYear),
            ]);
        } catch (err) {
            console.error("페이지 초기화 실패:", err);
        }
    };

    // Fetch total users count
    const fetchTotalUsers = async (token) => {
        try {
            setIsLoadingUsers(true);
            const response = await usersApi.get("/admin/users/count", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTotalUsers(response.data.totalCount);
        } catch (err) {
            setError("총 유저 수를 가져오는 데 실패했습니다.");
            console.error(err);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    // Fetch available years
    const fetchAvailableYears = async (token) => {
        try {
            const response = await usersApi.get("/admin/users/month", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const years = Object.keys(response.data)
                .map((key) => key.split("-")[0])
                .filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates
            years.sort();
            setAvailableYears(years);
        } catch (err) {
            setError("연도 데이터를 가져오는 데 실패했습니다.");
            console.error(err);
        }
    };

    // Fetch monthly data
    const fetchMonthlyData = async (token, year) => {
        try {
            setIsLoadingUsers(true);
            const response = await usersApi.get("/admin/users/month", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const dataForYear = Array.from({ length: 12 }, (_, i) => {
                const month = String(i + 1).padStart(2, "0");
                return response.data[`${year}-${month}`] || 0;
            });
            setMonthlyData(dataForYear);
            setSelectedYear(year);
        } catch (err) {
            setError("월별 데이터를 가져오는 데 실패했습니다.");
            console.error(err);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const barChartData = {
        labels: Array.from({ length: 12 }, (_, i) => `${i + 1}월`),
        datasets: [
            {
                label: `${selectedYear} 월별 유저 가입 수`,
                data: monthlyData,
                backgroundColor: "rgba(75, 192, 192, 0.6)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="layout">
            <AdminSidebar className="sidebar" />
            <div className="content">
                <h1>관리자 페이지</h1>
                <p>유저 통계를 확인하세요.</p>

                {error && <p className="error-message">{error}</p>}

                <div className="stats-overview">
                    <h2>총 유저 수</h2>
                    {isLoadingUsers ? (
                        <p>총 유저 수를 불러오는 중...</p>
                    ) : (
                        <p className="total-users">총 {totalUsers}명</p>
                    )}
                </div>

                {isLoadingUsers ? (
                    <p>데이터를 불러오는 중...</p>
                ) : (
                    <>
                        <div className="yearly-stats">
                            <h2>연도별 유저 통계</h2>
                            <div className="year-buttons">
                                {availableYears.map((year) => (
                                    <button
                                        key={year}
                                        className={`button ${selectedYear === year ? "active" : ""}`}
                                        onClick={() => {
                                            const token = localStorage.getItem("adminAccessToken");
                                            fetchMonthlyData(token, year);
                                        }}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="monthly-stats">
                            <h2>{selectedYear} 월별 유저 가입 수</h2>
                            <Bar data={barChartData} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AdminMain;