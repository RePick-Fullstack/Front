import '../../css/myPage.css'
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {DefaultInfo} from "./component/DefaultInfo.jsx";
import {PaymentInfo} from "./component/PaymentInfo.jsx";
import {PostInfo} from "./component/PostInfo.jsx";
import {CommentInfo} from "./component/CommentInfo.jsx";

function MyPage() {
    const navigate = useNavigate();
    useEffect(() => {
        if(localStorage.getItem("accessToken") === null){
            alert("마이페이지를 이용하기 위해 로그인 하여 주시기 바랍니다.")
            navigate("/");
        }
    })

    return (
        <>
            <div className="ml-[50px] px-12" style={{maxWidth: "696px"}}>
                <DefaultInfo/>
                <PaymentInfo/>
                <PostInfo/>
                <CommentInfo/>


            </div>
            <div className="retrieveReport">
                <div>adfasdfa</div>
                <div>adfasdfa</div>
                <div>adfasdfa</div>
            </div>
            <div className="saveKeyword">

            </div>
        </>
    )
}

export default MyPage;