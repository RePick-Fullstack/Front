//import { useState } from 'react'
import './App.css'
import './css/sidebar.css'
import SideBar from "./layout/SideBar.jsx";
import MainScreen from "./page/MainScreen.jsx";
import Header from "./layout/Header.jsx";
import {Route, Routes} from "react-router-dom";
import Community from "./page/Community.jsx";
import PostDetail from "./page/PostDetail.jsx";
import {RecoilRoot} from "recoil";
import MyPage from "./page/MyPage.jsx";
import ReportPage from "./page/ReportPage.jsx";
import MainKakaoSignUp from "./page/mainuser/MainKakaoSignUp.jsx";
import {ChatRoom} from "./page/ChatRoom.jsx";
import {ChatRoomList} from "./page/ChatRoomList.jsx";
import CreatePost from "./page/CreatePost.jsx";
import {PaymentCheckoutPage} from "./page/tosspayment/PaymentCheckout.jsx";
import {PaymentSuccessPage} from "./page/tosspayment/PaymentSuccess.jsx";
import {PaymentFailPage} from "./page/tosspayment/PaymentFail.jsx";
import ChatBot from "./page/ChatBot.jsx";

//import {testCommunity} from "./assets/testCommunity.js";

function App() {

    return (<RecoilRoot>
        <div className="App w-full">
            <Header></Header>
            <SideBar></SideBar>

            <Routes>
                <Route path="/*" element={<MainKakaoSignUp/>}/>
                <Route path="/" element={<MainScreen/>}/>
                <Route path="/community" element={<Community/>}/>
                <Route path="/createpost" element={<CreatePost/>}/>
                <Route path="/posts/:id" element={<PostDetail/>}/>
                <Route path="/reportpage" element={<ReportPage/>}/>
                <Route path="/mypage" element={<MyPage/>}/>
                <Route path="/chatroom/" element={<ChatRoomList/>}/>
                <Route path="/chatroom/:id" element={<ChatRoom/>}/>
                <Route path="/chatbot" element={<ChatBot/>}/>
                <Route path="/tosspayment" element={<PaymentCheckoutPage/>}/>
                <Route path="/tosspayment/success" element={<PaymentSuccessPage/>}/>
                <Route path="/tosspayment/fail" element={<PaymentFailPage/>}/>
            </Routes>
        </div>
    </RecoilRoot>);
}

export default App
