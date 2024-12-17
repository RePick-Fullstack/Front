import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {LoadingSvg} from "../../../assets/LoadingSvg.jsx";

export const PaymentInfo = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isView, setIsView] = useState(false);
    const [Remaining, setRemaining] = useState('');

    useEffect(() => {
        const handleRemaining = async () => {
            const {data: remaining} = await axios.get("https://repick.site/api/v1/tosspayments/remaining",{
                headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
            })
            if (remaining === null || new Date(remaining) < new Date().getTime()) {
                return;
            }

            setRemaining(remaining);
        }
        handleRemaining();
    })

    const formatDate = (isoString) => {
            const dateObj = new Date(isoString);
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth() + 1;
            const day = dateObj.getDate();
            return `${year}년 ${month}월 ${day}일`;
        };

    const handleView = async () => {
        if(!isView){
        setLoading(false);
        const {data: myPayments} = await axios.get("https://repick.site/api/v1/tosspayments/mypayments",{
            params: {page: 0, size: 10},
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`}
        })
        console.log(myPayments);
        setPayments(myPayments.content);
        setLoading(true);
        }
        setIsView(!isView);
    }


    return (
        <div className={"max-w-[600px] w-full"}>
            <div className={"font-bold text-lg mb-4 mt-5 "}>추가 정보</div>
            <div className={"border-b-[1px] border-black"}/>
            <div className="w-full h-16 flex items-center text-[14px]">
                <div className={"w-40 font-bold"}>구독정보</div>
                <div className={"w-[200px] flex justify-between"}>
                    <div
                        className={`w-14 h-10 flex justify-center items-center rounded text-white ${Remaining ? `bg-[#2c3e50]` : `bg-gray-500`}`}>{Remaining ? `구독중` : `미구독`}</div>
                    <div
                        className={`w-[71px] h-10 flex justify-center items-center rounded bg-[#2c3e50] text-white hover:cursor-pointer hover:bg-[#37afe1]`}
                        onClick={() => {
                            navigate("/tosspayment")
                        }}
                    >{Remaining ? `연장하기` : `구독하기`}</div>
                </div>
            </div>
            <div className={"border-b-[1px]"}/>
            <div className="w-full h-16 flex items-center text-[14px]">
                <div className={"w-40 font-bold"}>유효기간</div>
                <div>{Remaining ? `다음 결제 예정일은 ${formatDate(Remaining)} 입니다.` : `구독 정보가 없습니다.`}</div>
            </div>
            <div className={"border-b-[1px]"}/>
            <div className="w-full h-16 flex items-center text-[14px]">
                <div className={"w-40 font-bold"}>결제 내역</div>
                <div className={"w-[200px] flex gap-5"}>
                    <div
                        className={`w-14 h-10 flex justify-center items-center rounded bg-[#2c3e50] text-white hover:cursor-pointer hover:bg-[#37afe1]`}
                        onClick={handleView}>{isView ? `닫기` : `보기`}</div>
                    {!loading && <LoadingSvg h={40} w={40}/>}
                </div>
            </div>

            {isView && loading &&
                <div className="w-full mb-[17px] p-2 bg-[#F2F2F2] border-[1px] border-[#CCCCCC] rounded text-[14px]">
                    {payments.length === 0 ? <div>
                            <div className="w-full h-16 flex items-center px-2 justify-center">
                                결제 내역이 없습니다.
                            </div>
                            <div className={"border-b-[1px]"}/>
                        </div> :
                        payments.map((payment, index) => {
                            return (
                                <div key={index}>
                                    {index > 0 && <div className={"border-b-[1px] border-[#bbbbbb]"}/>}
                                    <div className="w-full py-2 px-2">
                                        <div>주문 번호 : {payment.orderId}</div>
                                        <div>결제 수단 : {payment.method}</div>
                                        <div>결제 일시 : {formatDate(payment.requestedAt)}</div>
                                        <div>결제 금액 : {payment.amount}</div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            }
            <div className={"border-b-[1px]"}/>
        </div>
    )
}