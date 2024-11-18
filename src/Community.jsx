/* eslint-disable */
import "./css/community.css"
import {testMainCommunity} from "./assets/testMainCommunity.js";
import {testCommunity} from "./assets/testCommunity.js";
import {useNavigate} from "react-router-dom";
import CommunityDetail from "./CommunityDetail.jsx";
import {Routes, Route} from "react-router-dom";
import {useRecoilValue} from "recoil";
import {useState} from "react";

function Community() {

    let categories =testMainCommunity;
    let [selectedCategory, setSelectedCategory] = useState('ENERGY');
    let data = useRecoilValue(testCommunity);
    let navigate = useNavigate();

      const handleCategoryChange = (categoryName)=>{
          setSelectedCategory(categoryName);
          console.log('선택한 카테고리 : ', categoryName);
      }


    return (
        <>
            <div className={"bg-gray-300 rounded-xl font-bold p-10"} style={{margin: "50px 100px -50px 100px"}}>
                <div style={{fontSize: "25px"}}>REPICK 커뮤니티</div>
                <div className={"rounded-xl bg-gray-400 mt-0"}>
                    <div className={"font-medium flex gap-12 ml-4"}>
                        {categories.map((category, index) => (
                            <button onClick={() => {
                                handleCategoryChange(category.title)
                            }} key={index}>{category.description}
                            </button>
                        ))}
                    </div>
                    {selectedCategory && <p>You selected: {selectedCategory}</p>}
                </div>
            </div>
            <div className="container">
                <div className="left-container">
                    <button className={"border-2 border-b-fuchsia bg-white mb-5"}>작성하기</button>

                    <div className={" rounded-xl border-black border-1 bg-white"} style={{
                        width: "auto",
                        height: "450px",
                        overflow: `auto`
                    }}>
                        <div className={"border-amber-100"}>
                            {}
                        </div>

                    </div>
                </div>
                <div className="right-container">
                    <p className={"text-3xl  font-bold"}>실시간 채팅</p>
                    <div className={"bg-white mt-5"}>
                        <div style={{
                            width: "auto",
                            height: "450px",
                            overflow: `auto`
                        }}>여기에 채팅 넣으삼
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

// function PostList(props) {
//     return (
//
//     )
// }

export default Community;