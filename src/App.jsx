//import { useState } from 'react'
import './App.css'
import './css/sidebar.css'
import SideBar from "./layouts/SideBar.jsx";
import MainScreen from "./MainScreen.jsx";
import Header from "./layouts/Header.jsx";

function App() {
    return (
        <div className="App" style={{width: `100%`}}>
            <MainScreen></MainScreen>
            <Header></Header>
            <SideBar></SideBar>



        </div>
    );
}

export default App
