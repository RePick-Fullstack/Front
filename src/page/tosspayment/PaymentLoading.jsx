import {LoadingSvg} from "../../assets/LoadingSvg.jsx";
import {useEffect} from "react";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router-dom";

export const PaymentLoading = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const amount = searchParams.get("amount");
    const orderId = searchParams.get("orderId");

    const handlePlantiPayRedirect = async () => {
        const response = await axios.post("https://repick.site/api/v1/tosspayments/plantipay", {}, {
            params:{amount: amount}
        }).catch((err)=> {
            console.log(err)
            navigate("/tosspayment/fail?message=Plantipay 서버에러");
        });
        console.log(response.data);
        window.location.href = `https://payments-client-seven.vercel.app/payment?token=${response.data.token}`;
    }

    const handlePlantiPay = async () => {
        const response = await axios.get("https://repick.site/api/v1/tosspayments/plantipay", {
            params:{orderId: orderId},
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).catch((err)=> {
            console.log(err)
            navigate("/tosspayment/fail?message=Plantipay 서버에러");
        });
        if(response.data === 0){navigate("/tosspayment/fail?message=Plantipay 서버에러"); return;}
        navigate(`/tosspayment/success?orderId=${orderId}&amount=${response.data}`);
    }

    useEffect(() => {
        if(amount){handlePlantiPayRedirect(); return;}
        if(orderId){handlePlantiPay();}
    }, []);

    return (
        <div className={"pl-[50px] w-full h-full flex items-center justify-center"}
        style={{maxHeight: `calc(100% - 55px)`}}>
            <LoadingSvg w={64} h={64}></LoadingSvg>
        </div>
    )
}