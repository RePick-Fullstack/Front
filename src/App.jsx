import './App.css';
import './css/sidebar.css';
import SideBar from "./layout/SideBar.jsx";
import MainScreen from "./page/MainScreen.jsx";
import Header from "./layout/Header.jsx";
import { Route, Routes, Navigate } from "react-router-dom"; // Navigate 추가
import Community from "./page/Community/Community.jsx";
import { RecoilRoot } from "recoil";
import MyPage from "./page/MyPage/MyPage.jsx";
import ReportPage from "./page/ReportPage.jsx";
import MainKakaoSignUp from "./page/mainuser/MainKakaoSignUp.jsx";
import { ChatRoom } from "./page/ChatRoom.jsx";
import { ChatRoomList } from "./page/ChatRoomList.jsx";
import CreatePost from "./page/CreatePost.jsx";
import { PaymentCheckoutPage } from "./page/tosspayment/PaymentCheckout.jsx";
import { PaymentSuccessPage } from "./page/tosspayment/PaymentSuccess.jsx";
import { PaymentFailPage } from "./page/tosspayment/PaymentFail.jsx";
import ChatBot from "./page/ChatBot.jsx";
import PostDetail from "./page/PostDetail.jsx";
import NoExistUrl from "./page/NoExistUrl.jsx";
import EditPost from "./page/EditPost.jsx";

function App() {


    return (
        <RecoilRoot>
            <div className="App w-full">
                {<Header />}
                {<SideBar />}

                <Routes>
                    {/* 명시된 라우트 */}
                    <Route path="/complete-profile" element={<MainKakaoSignUp />} />
                    <Route path="/" element={<MainScreen />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/createpost" element={<CreatePost />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/reportpage" element={<ReportPage />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/chatroom/" element={<ChatRoomList />} />
                    <Route path="/chatroom/:id" element={<ChatRoom />} />
                    <Route path="/chatbot/:id" element={<ChatBot />} />
                    <Route path="/chatbot" element={<ChatBot />} />
                    <Route path="/tosspayment" element={<PaymentCheckoutPage />} />
                    <Route path="/tosspayment/success" element={<PaymentSuccessPage />} />
                    <Route path="/tosspayment/fail" element={<PaymentFailPage />} />
                    <Route path="/editpost/:id" element={<EditPost/>}/>

                    {/* 잘못된 URL 접근 시 리다이렉트 */}
                    <Route path="*" element={<NoExistUrl/>} />
                </Routes>
            </div>
        </RecoilRoot>
    );
}

export default App;