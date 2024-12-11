import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

export const PaymentInfo = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isView, setIsView] = useState(false);
    const [Remaining, setRemaining] = useState('2024-12-11T12:27:05+09:00');

    useEffect(() => {
        const handleRemaining = async () => {
            const {data: remaining} = await axios.get("https://repick.site/api/v1/tosspayments/remaining",{
                headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
            })
            if(remaining === null){
                setRemaining("결재 정보가 없습니다.")
                return;
            }
            setRemaining(remaining);
        }
        handleRemaining();
    })

    const handleView = async () => {
        setIsView(!isView);
        setLoading(false);
        const {data: myPayments} = await axios.get("https://repick.site/api/v1/tosspayments/mypayments",{
            params: {page: 0, size: 10},
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        })
        console.log(myPayments);
        setPayments(myPayments.content);
        setLoading(true);
    }


    return (
        <div>
            <div className={"font-bold text-2xl mb-2 mt-5"}>구독정보</div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>구독 여부</div>
                <div className={"w-64"}>완료</div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                    onClick={() => {
                        navigate("/tosspayment")
                    }}>
                    결재
                </div>
            </div>
            <hr className="border-t-[2.4px]" style={{borderColor: "rgb(229, 231, 235)"}}/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>구독 유효 기간</div>
                <div className={"w-64"}>{Remaining}까지</div>
                <div className={"h-8 min-w-14 flex items-center justify-center"}/>
            </div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>결재 내역</div>
                <div className={"w-64"}></div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                    onClick={handleView}>
                    {isView ? `닫기` : `보기`}
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
            {isView &&
                <div>
                    {payments.length === 0 ? <div>
                        <div className="w-full h-16 flex items-center px-2 justify-center">
                            결재 내역이 없습니다.
                        </div>
                        <hr className="border-t-[2.4px]"/>
                    </div> :
                    payments.map((payment, index) => {
                        return (
                            <div key={index}>
                                <div className="w-full py-2 px-2">
                                    <div>주문 번호 : {payment.orderId}</div>
                                    <div>결재 수단 : {payment.method}</div>
                                    <div>결재 일시 : {payment.requestedAt}</div>
                                    <div>결재 금액 : {payment.amount}</div>
                                </div>
                                <hr className="border-t-[2.4px]"/>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}