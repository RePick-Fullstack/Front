import '../../css/myPage.css'
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {DefaultInfo} from "./component/DefaultInfo.jsx";
import {PaymentInfo} from "./component/PaymentInfo.jsx";
import {PostInfo} from "./component/PostInfo.jsx";
import {CommentInfo} from "./component/CommentInfo.jsx";
import {ReportInfo} from "./component/ReportInfo.jsx";

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
            <div className="ml-[50px] px-10 flex flex-wrap gap-5">
                <DefaultInfo/>
                <PaymentInfo/>
                <PostInfo/>
                <CommentInfo/>
                <ReportInfo/>
            </div>
        </>
    )
}

export default MyPage;