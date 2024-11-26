//import { useState } from 'react'
import './App.css'
import './css/sidebar.css'
import SideBar from "./layouts/SideBar.jsx";
import MainScreen from "./MainScreen.jsx";
import Header from "./layouts/Header.jsx";
import {Route, Routes} from "react-router-dom";
import Community from "./Community.jsx";
import CommunityDetail from "./CommunityDetail.jsx";
import {RecoilRoot} from "recoil";
import MyPage from "./MyPage.jsx";
import ReportPage from "./ReportPage.jsx";
import CompleteProfile from "./layouts/CompleteProfile.jsx";
import {ChatRoom} from "./ChatRoom.jsx";
import {ChatRoomList} from "./ChatRoomList.jsx";
import CreatePost from "./CreatePost.jsx";

//import {testCommunity} from "./assets/testCommunity.js";

function App() {

    return (<RecoilRoot>
        <div className="App w-full">
            <Header></Header>
            <SideBar></SideBar>
            {/*<<MainScreen></MainScreen>> */}
            <Routes>
                <Route path="/*" element={<CompleteProfile/>}/>
                <Route path="/" element={<MainScreen/>}/>
                <Route path="/community" element={<Community/>}/>
                <Route path="/CreatePost" element={<CreatePost/>}/>
                <Route path="/community/:id" element={<CommunityDetail/>}/>
                <Route path="/ReportPage" element={<ReportPage/>}/>
                <Route path="/myPage" element={<MyPage/>}/>
                <Route path="/chatRoom/" element={<ChatRoomList/>}/>
                <Route path="/chatRoom/:id" element={<ChatRoom/>}/>
            </Routes>
        </div>
    </RecoilRoot>);
}

export default App
