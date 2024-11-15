//import { useState } from 'react'
import './App.css'
import './css/sidebar.css'
import SideBar from "./layouts/SideBar.jsx";
import MainScreen from "./MainScreen.jsx";
import Header from "./layouts/Header.jsx";
import {Route, Routes} from "react-router-dom";
import Community from "./Community.jsx";

function App() {
    return (
        <div className="App w-full">
            <Header></Header>
            <SideBar></SideBar>

            {/*<<MainScreen></MainScreen>> */}
            <Routes>
                <Route path="/" element={ <MainScreen/> }/>
                <Route path="/community" element={ <Community/> }/>
            </Routes>
        </div>
    );
}

export default App
