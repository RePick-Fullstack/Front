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

//import {testCommunity} from "./assets/testCommunity.js";

function App() {

    return (
        <RecoilRoot>
                <div className="App w-full">
                    <Header></Header>
                    <SideBar></SideBar>

                    {/*<<MainScreen></MainScreen>> */}
                    <Routes>
                        <Route path="/" element={<MainScreen/>}/>
                        <Route path="/community" element={<Community/>}/>
                        <Route path="/community/:id" element={<CommunityDetail/>}/>
                    </Routes>
                </div>
        </RecoilRoot>
    );
}

export default App
