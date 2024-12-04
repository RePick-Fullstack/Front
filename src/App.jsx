import './App.css';
import './css/sidebar.css';
import SideBar from "./layout/SideBar.jsx";
import MainScreen from "./page/MainScreen.jsx";
import Header from "./layout/Header.jsx";
import { Route, Routes, useLocation, Navigate } from "react-router-dom"; // Navigate 추가
import Community from "./page/Community.jsx";
import { RecoilRoot } from "recoil";
import MyPage from "./page/MyPage.jsx";
import ReportPage from "./page/ReportPage.jsx";
import MainKakaoSignUp from "./page/mainuser/MainKakaoSignUp.jsx";
import { ChatRoom } from "./page/ChatRoom.jsx";
import { ChatRoomList } from "./page/ChatRoomList.jsx";
import CreatePost from "./page/CreatePost.jsx";
import { PaymentCheckoutPage } from "./page/tosspayment/PaymentCheckout.jsx";
import { PaymentSuccessPage } from "./page/tosspayment/PaymentSuccess.jsx";
import { PaymentFailPage } from "./page/tosspayment/PaymentFail.jsx";
import ChatBot from "./page/ChatBot.jsx";
import AdminMain from "./page/admin/AdminMain.jsx";
import AdminSuper from "./page/admin/AdminSuper.jsx";
import AdminUser from "./page/admin/AdminUser.jsx";
import PostDetail from "./page/PostDetail.jsx";
import AdminSignIn from "./page/admin/AdminSignIn.jsx";

function App() {
    const location = useLocation(); // 현재 경로 가져오기

    // 특정 경로에서 사이드바 숨기기
    const hiddenSidebarPaths = ['/admin/login-xXx', '/admin/super', '/admin/main', '/admin/user'];
    const shouldHideSidebar = hiddenSidebarPaths.includes(location.pathname);

    return (
        <RecoilRoot>
            <div className="App w-full">
                {!shouldHideSidebar && <Header />} {/* 사이드바 조건부 렌더링 */}
                {!shouldHideSidebar && <SideBar />} {/* 사이드바 조건부 렌더링 */}

                <Routes>
                    {/* 명시된 라우트 */}
                    <Route path="/admin/login-xXx" element={<AdminSignIn />} />
                    <Route path="/admin/super" element={<AdminSuper />} />
                    <Route path="/admin/main" element={<AdminMain />} />
                    <Route path="/admin/user" element={<AdminUser />} />
                    <Route path="/complete-profile" element={<MainKakaoSignUp />} />
                    <Route path="/" element={<MainScreen />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/createpost" element={<CreatePost />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/reportpage" element={<ReportPage />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/chatroom/" element={<ChatRoomList />} />
                    <Route path="/chatroom/:id" element={<ChatRoom />} />
                    <Route path="/chatbot" element={<ChatBot />} />
                    <Route path="/tosspayment" element={<PaymentCheckoutPage />} />
                    <Route path="/tosspayment/success" element={<PaymentSuccessPage />} />
                    <Route path="/tosspayment/fail" element={<PaymentFailPage />} />

                    {/* 잘못된 URL 접근 시 리다이렉트 */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </RecoilRoot>
    );
}

export default App;