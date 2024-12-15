import { useEffect, useState } from "react";

function Notifications({ token }) {
    const [notifications, setNotifications] = useState([]);

    // 알림 데이터 가져오기
    const fetchNotifications = async () => {
        try {
            const response = await fetch("http://localhost:9000/api/v1/notifications/1", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications((prev) => [...data, ...prev]); // 새 알림 추가
            } else {
                console.error("알림 데이터를 가져오지 못했습니다.");
            }
        } catch (error) {
            console.error("알림 요청 중 에러 발생:", error);
        }
    };

    // 5초마다 알림 요청
    useEffect(() => {
        const interval = setInterval(fetchNotifications, 5000);

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
    }, []);

    return (
        <div className="max-w-md mx-auto mt-8">
            <h2 className="text-xl font-bold mb-4">Notifications</h2>
            <ul className="space-y-4">
                {notifications.map((notification, index) => (
                    <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200">
                        <div className="font-semibold">{notification.message}</div>
                        <div className="text-sm text-gray-600">{notification.details}</div>
                        <div className="text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Notifications;
