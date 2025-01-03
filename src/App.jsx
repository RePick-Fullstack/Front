import './App.css';
import './css/sidebar.css';
import SideBar from "./layout/SideBar.jsx";
import MainScreen from "./page/MainScreen/MainScreen.jsx";
import Header from "./layout/Header.jsx";
import {Route, Routes} from "react-router-dom"; // Navigate 추가
import Community from "./page/Community/Community.jsx";
import {RecoilRoot} from "recoil";
import MyPage from "./page/MyPage/MyPage.jsx";
import ReportPage from "./page/ReportPage.jsx";
import MainKakaoSignUp from "./page/mainuser/MainKakaoSignUp.jsx";
import {ChatRoom} from "./page/ChatRoom/ChatRoom.jsx";
import {ChatRoomList} from "./page/ChatRoom/ChatRoomList.jsx";
import CreatePost from "./page/CreatePost.jsx";
import {PaymentCheckoutPage} from "./page/tosspayment/PaymentCheckout.jsx";
import {PaymentSuccessPage} from "./page/tosspayment/PaymentSuccess.jsx";
import {PaymentFailPage} from "./page/tosspayment/PaymentFail.jsx";
import ChatBot from "./page/ChatBot.jsx";
import PostDetail from "./page/PostDetail.jsx";
import NoExistUrl from "./page/NoExistUrl.jsx";
import EditPost from "./page/EditPost.jsx";
import {PaymentLoading} from "./page/tosspayment/PaymentLoading.jsx";
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import {QueryClient} from "@tanstack/react-query";

function App() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60 * 5,
                cacheTime: 1000 * 60 * 10,
            },
        },
    })

    const persister = createSyncStoragePersister({
        storage: window.localStorage,
    })

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
        >
        <RecoilRoot>
            <div className="App w-full h-full">
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
                    <Route path="/tosspayment/loading" element={<PaymentLoading />} />
                    <Route path="/tosspayment/success" element={<PaymentSuccessPage />} />
                    <Route path="/tosspayment/fail" element={<PaymentFailPage />} />
                    <Route path="/editpost/:postId" element={<EditPost/>}/>

                    {/* 잘못된 URL 접근 시 리다이렉트 */}
                    <Route path="*" element={<NoExistUrl/>} />
                </Routes>
            </div>
        </RecoilRoot>
        </PersistQueryClientProvider>
    );
}

export default App;