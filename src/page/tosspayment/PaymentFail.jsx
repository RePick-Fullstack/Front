import { Link, useSearchParams } from "react-router-dom";
import './Payment.css'

export function PaymentFailPage() {
  const [searchParams] = useSearchParams();

  return (
      <div className="w-full ml-[50px] flex items-center"
           style={{minHeight: `calc(100vh - 78px)`, maxWidth: `calc(100% - 50px)`}}>
          <div className="flex px-2 w-full">
              <div className="flex flex-col items-center justify-center h-full gap-5 w-full">
                  <div
                      className="border-[3px] border-solid border-[#f5f5f5] rounded-[25px] w-[800px] h-20 shadow-[2px_2px_2px_2px_#f5f5f5] text-[30px] font-bold flex items-center justify-center">
                      결제를 실패했어요
                  </div>
                  <div className="border-[3px] border-solid border-[#f5f5f5] rounded-[25px] w-[800px] h-[278px] shadow-[2px_2px_2px_2px_#f5f5f5] p-5 text-2xl font-bold flex flex-col gap-5">
                      <div className={"flex justify-center"}>
                          <img width="100px" src="https://static.toss.im/lotties/error-spot-no-loop-space-apng.png"
                               alt="에러 이미지"/>
                      </div>
                          <div className="text-center"><b>에러메시지</b></div>
                          <div className="font-normal text-center">{`${searchParams.get("message")}`}</div>
                  </div>
              </div>
          </div>
      </div>
  );
}
