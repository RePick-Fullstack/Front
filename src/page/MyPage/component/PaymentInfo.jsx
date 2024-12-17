import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";

export const PaymentInfo = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isView, setIsView] = useState(false);
    const [Remaining, setRemaining] = useState('');

    useEffect(() => {
        const handleRemaining = async () => {
            const {data: remaining} = await axios.get("https://repick.site/api/v1/tosspayments/remaining",{
                headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
            })
            if(remaining === null){
                setRemaining("결제 정보가 없습니다.")
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
        <div className={"max-w-[600px] w-full"}>
            <div className={"font-bold text-lg mb-4 mt-5 "}>추가 정보</div>
            <div className={"border-b-[1px] border-black"}/>
            <div className="w-full h-16 flex items-center justify-between text-[14px]">
                <div className={"w-48"}>구독정보</div>
                <div className={"w-64"}>{Remaining ? `구독` : `미구독`}</div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                    onClick={() => {
                        navigate("/tosspayment")
                    }}>
                    결제
                </div>
            </div>
            <div className={"border-b-[1px]"}/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>구독 유효 기간</div>
                <div className={"w-64"}>{Remaining}</div>
                <div className={"h-8 min-w-14 flex items-center justify-center"}/>
            </div>
            <div className={"border-b-[1px]"}/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>결제 내역</div>
                <div className={"w-64"}></div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                    onClick={handleView}>
                    {isView ? `닫기` : `보기`}
                </div>
            </div>
            <div className={"border-b-[1px]"}/>
            {isView &&
                <div>
                    {payments.length === 0 ? <div>
                            <div className="w-full h-16 flex items-center px-2 justify-center">
                                결제 내역이 없습니다.
                            </div>
                            <div className={"border-b-[1px]"}/>
                        </div> :
                        payments.map((payment, index) => {
                            return (
                                <div key={index}>
                                    <div className="w-full py-2 px-2">
                                        <div>주문 번호 : {payment.orderId}</div>
                                        <div>결제 수단 : {payment.method}</div>
                                        <div>결제 일시 : {payment.requestedAt}</div>
                                        <div>결제 금액 : {payment.amount}</div>
                                    </div>
                                    <div className={"border-b-[1px]"}/>
                                </div>
                            )
                        })}
                </div>
            }
        </div>
    )
}