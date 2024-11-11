//import { useState } from 'react'
import './App.css'
import './css/sidebar.css'
import SideBar from "./layouts/SideBar.jsx";
import MainScreen from "./MainScreen.jsx";
import Header from "./layouts/Header.jsx";

function App() {
    return (
        <div className="App">
            <Header></Header>
            <SideBar></SideBar>


            <MainScreen></MainScreen>
        </div>
    );
}

export default App
