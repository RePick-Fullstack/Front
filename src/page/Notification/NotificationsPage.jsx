import Notifications from "../Notification/Notifications";

function NotificationsPage() {
    // 로컬스토리지에서 토큰 가져오기
    const token = localStorage.getItem("accessToken");

    if (!token) {
        console.error("로그인이 필요합니다.");
        return <div>로그인이 필요합니다.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <Notifications token={token} />
        </div>
    );
}

export default NotificationsPage;
