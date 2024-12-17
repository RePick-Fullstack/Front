import {useEffect, useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import './Payment.css'

const url = `https://repick.site/api/v1/tosspayments`;

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    async function confirm() {
      const requestData = {
        orderId: searchParams.get("orderId"),
        amount: searchParams.get("amount"),
        paymentKey: searchParams.get("paymentKey"),
      };

      const response = await fetch(`${url}/confirm/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        throw { message: json.message, code: json.code };
      }

      return json;
    }
if(searchParams.get("paymentKey")) {
  confirm()
      .then((data) => {
        setResponseData(data);
      })
      .catch((error) => {
        navigate(`/tosspayment/fail?code=${error.code}&message=${error.message}`);
      });
}
  }, [searchParams]);

  return (
      <div className="w-full ml-[50px] flex items-center"
           style={{minHeight: `calc(100vh - 78px)`, maxWidth: `calc(100% - 50px)`}}>
        <div className="flex px-2 w-full">
          <div className="flex flex-col items-center justify-center h-full gap-5 w-full">
            <div
                className="border-[3px] border-solid border-[#f5f5f5] rounded-[25px] w-[800px] h-20 shadow-[2px_2px_2px_2px_#f5f5f5] text-[30px] font-bold flex items-center justify-center">
              결제를 완료했어요
            </div>
            <div
                className="border-[3px] border-solid border-[#f5f5f5] rounded-[25px] w-[800px] h-[278px] shadow-[2px_2px_2px_2px_#f5f5f5] p-5 text-2xl font-bold flex flex-col px-48">
              <div className="flex justify-center">
                <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"/>
              </div>
              <div className="p-grid typography--p" style={{marginTop: "50px"}}>
                <div className="p-grid-col text--left">
                  <b>결제금액</b>
                </div>
                <div className="p-grid-col text--right" id="amount">
                  {`${Number(searchParams.get("amount")).toLocaleString()}원`}
                </div>
              </div>
              <div className="p-grid typography--p" style={{marginTop: "10px"}}>
                <div className="p-grid-col text--left">
                  <b>주문번호</b>
                </div>
                <div className="p-grid-col text--right" id="orderId">
                  {`${searchParams.get("orderId")}`}
                </div>
              </div>
              <div className="p-grid-col">
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
