import {loadTossPayments} from "@tosspayments/tosspayments-sdk";
import {useEffect, useState} from "react";
import './Payment.css'
import {useNavigate} from "react-router-dom";
import {OrderSelect} from "./component/OrderSelect.jsx";
import {PaymentSelect} from "./component/PaymentSelect.jsx";

// ------  SDK 초기화 ------
// TODO: clientKey는 개발자센터의 API 개별 연동 키 > 결제창 연동에 사용하려할 MID > 클라이언트 키로 바꾸세요.
// TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = "test_ck_Ba5PzR0ArnykXNxdPY9vVvmYnNeD";
const customerKey = generateRandomString();

export function PaymentCheckoutPage() {
  const [payment, setPayment] = useState(null);
  const [amount, setAmount] = useState({currency: "KRW", value: 5900,});
  const [isSelected, setIsSelected] = useState(false);
  const [isPaySelected, setIsPaySelected] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const navigate = useNavigate();

  function selectPaymentMethod(method) {
    setSelectedPaymentMethod(method);
  }

  function handleIsSelected(value) {
    setIsSelected(true);
    setAmount({currency: "KRW", value: value,});
  }

  useEffect(() => {
    if(localStorage.getItem("accessToken") === null){
      alert("결제기능을 이용하기 위해 로그인 하여 주시기 바랍니다.")
      navigate("/");
    }
  })

  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
        const payment = tossPayments.payment({
          customerKey,
        });
        // 비회원 결제
        // const payment = tossPayments.payment({ customerKey: ANONYMOUS });

        setPayment(payment);
      } catch (error) {
        console.error("Error fetching payment:", error);
      }
    }

    fetchPayment();
    console.log(window.location.origin);
  }, [clientKey, customerKey]);

  // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
  // @docs https://docs.tosspayments.com/sdk/v2/js#paymentrequestpayment
  async function requestPayment() {
    // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
    // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
    if(selectedPaymentMethod === null){alert(`결제 수단을 선택하여 주시기 바랍니다.`)}
    switch (selectedPaymentMethod) {
      case "CARD":
        await payment.requestPayment({
          method: "CARD", // 카드 및 간편결제
          amount,
          orderId: generateRandomString(), // 고유 주문번호
          orderName: `리픽 구독 결제 ${amount.value === 5900 ? `1개월` : `12개월`}`,
          successUrl: window.location.origin + "/tosspayment/success", // 결제 요청이 성공하면 리다이렉트되는 URL
          failUrl: window.location.origin + "/tosspayment/fail", // 결제 요청이 실패하면 리다이렉트되는 URL
          customerEmail: "customer123@gmail.com",
          customerName: "김토스",
          // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
          // customerMobilePhone: "01012341234",
          card: {
            useEscrow: false,
            flowMode: "DEFAULT",
            useCardPoint: false,
            useAppCardOnly: false,
          },
        });
      case "TRANSFER":
        await payment.requestPayment({
          method: "TRANSFER", // 계좌이체 결제
          amount,
          orderId: generateRandomString(),
          orderName: `리픽 구독 결제 ${amount.value === 5900 ? `1개월` : `12개월`}`,
          successUrl: window.location.origin + "/tosspayment/success",
          failUrl: window.location.origin + "/tosspayment/fail",
          customerEmail: "customer123@gmail.com",
          customerName: "김토스",
          // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
          // customerMobilePhone: "01012341234",
          transfer: {
            cashReceipt: {
              type: "소득공제",
            },
            useEscrow: false,
          },
        });
      case "VIRTUAL_ACCOUNT":
        await payment.requestPayment({
          method: "VIRTUAL_ACCOUNT", // 가상계좌 결제
          amount,
          orderId: generateRandomString(),
          orderName: `리픽 구독 결제 ${amount.value === 5900 ? `1개월` : `12개월`}`,
          successUrl: window.location.origin + "/tosspayment/success",
          failUrl: window.location.origin + "/tosspayment/fail",
          customerEmail: "customer123@gmail.com",
          customerName: "김토스",
          // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
          // customerMobilePhone: "01012341234",
          virtualAccount: {
            cashReceipt: {
              type: "소득공제",
            },
            useEscrow: false,
            validHours: 24,
          },
        });
      case "MOBILE_PHONE":
        await payment.requestPayment({
          method: "MOBILE_PHONE", // 휴대폰 결제
          amount,
          orderId: generateRandomString(),
          orderName: `리픽 구독 결제 ${amount.value === 5900 ? `1개월` : `12개월`}`,
          successUrl: window.location.origin + "/tosspayment/success",
          failUrl: window.location.origin + "/tosspayment/fail",
          customerEmail: "customer123@gmail.com",
          customerName: "김토스",
          // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
          // customerMobilePhone: "01012341234",
        });
      case "CULTURE_GIFT_CERTIFICATE":
        await payment.requestPayment({
          method: "CULTURE_GIFT_CERTIFICATE", // 문화상품권 결제
          amount,
          orderId: generateRandomString(),
          orderName: `리픽 구독 결제 ${amount.value === 5900 ? `1개월` : `12개월`}`,
          successUrl: window.location.origin + "/tosspayment/success",
          failUrl: window.location.origin + "/tosspayment/fail",
          customerEmail: "customer123@gmail.com",
          customerName: "김토스",
          // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
          // customerMobilePhone: "01012341234",
        });
      case "FOREIGN_EASY_PAY":
        await payment.requestPayment({
          method: "FOREIGN_EASY_PAY", // 해외 간편결제
          amount: {
            value: 100,
            currency: "USD",
          },
          orderId: generateRandomString(),
          orderName: `리픽 구독 결제 ${amount.value === 5900 ? `1개월` : `12개월`}`,
          successUrl: window.location.origin + "/tosspayment/success",
          failUrl: window.location.origin + "/tosspayment/fail",
          customerEmail: "customer123@gmail.com",
          customerName: "김토스",
          // 가상계좌 안내, 퀵계좌이체 휴대폰 번호 자동 완성에 사용되는 값입니다. 필요하다면 주석을 해제해 주세요.
          // customerMobilePhone: "01012341234",
          foreignEasyPay: {
            provider: "PAYPAL", // PayPal 결제
            country: "KR",
          },
        });
    }
  }

  return (
      <div className="w-full ml-[50px] flex items-center"
           style={{minHeight: `calc(100vh - 78px)`, maxWidth: `calc(100% - 50px)`}}>
        <div className="flex px-2 w-full">
          {!isSelected && <OrderSelect handleIsSelected={handleIsSelected}/>}
          {isSelected && isPaySelected === 0 && <PaymentSelect setIsPaySelected={setIsPaySelected} amount={amount}/>}
          {isSelected && isPaySelected !== 0 &&
              <div className="flex items-center justify-center h-full gap-5 flex-col w-full">
                  <div
                      className="border-[3px] border-solid border-[#f5f5f5] rounded-[25px] w-[800px] h-20 shadow-[2px_2px_2px_2px_#f5f5f5] text-[30px] font-bold flex items-center justify-center">
                    토스페이먼츠 일반결제
                  </div>
                <div className="border-[3px] border-solid border-[#f5f5f5] rounded-[25px] w-[800px] h-[278px] gap-5 shadow-[2px_2px_2px_2px_#f5f5f5] p-5 text-2xl font-bold flex flex-col justify-center items-center">
                  <div className="w-full px-10">
                    <div className="flex justify-between text-[17px] w-full">
                      <strong>상품명 :</strong><p> {` 리픽 구독 결제 ${amount.value === 5900 ? `1개월` : `12개월`}`}</p>
                    </div>
                    <div className="flex justify-between text-[17px] w-full">
                      <strong>결제 금액 :</strong><p>{` ${amount.value === 5900 ? `5,900 원` : `59,000원`}`}</p>
                    </div>
                  </div>
                  <div className="flex px-10">
                  <div className="grid grid-cols-3"
                       style={{placeItems: "center"}}>
                    <button id="CARD" className={`button2 ${selectedPaymentMethod === "CARD" ? "active" : ""}`}
                            onClick={() => selectPaymentMethod("CARD")}>
                      카드
                    </button>
                    <button id="TRANSFER"
                            className={`button2 ${selectedPaymentMethod === "TRANSFER" ? "active" : ""}`}
                            onClick={() => selectPaymentMethod("TRANSFER")}>
                      계좌이체
                    </button>
                    <button id="VIRTUAL_ACCOUNT"
                            className={`button2 ${selectedPaymentMethod === "VIRTUAL_ACCOUNT" ? "active" : ""}`}
                            onClick={() => selectPaymentMethod("VIRTUAL_ACCOUNT")}>
                      가상계좌
                    </button>
                    <button id="MOBILE_PHONE"
                            className={`button2 ${selectedPaymentMethod === "MOBILE_PHONE" ? "active" : ""}`}
                            onClick={() => selectPaymentMethod("MOBILE_PHONE")}>
                      휴대폰
                    </button>
                    <button
                        id="CULTURE_GIFT_CERTIFICATE"
                        className={`button2 ${selectedPaymentMethod === "CULTURE_GIFT_CERTIFICATE" ? "active" : ""}`}
                        onClick={() => selectPaymentMethod("CULTURE_GIFT_CERTIFICATE")}
                    >
                      문화상품권
                    </button>
                    <button id="FOREIGN_EASY_PAY"
                            className={`button2 ${selectedPaymentMethod === "FOREIGN_EASY_PAY" ? "active" : ""}`}
                            onClick={() => selectPaymentMethod("FOREIGN_EASY_PAY")}>
                      해외간편결제
                    </button>
                  </div>
                  <div className="flex items-center justify-center">
                  <button className="rounded-[12.5px] bg-[#303e4f] text-white w-[175px] h-[106px] flex flex-col justify-center items-center p-5 cursor-pointer gap-5 hover:bg-[#37AFE1] "
                          onClick={() => requestPayment()}>
                    결제하기
                  </button>
                  </div>
                  </div>
                </div>
              </div>}
        </div>
      </div>
  );
}

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}
