import appLogo from "../../../assets/appLogo.svg"
import tosslogo from "../../../assets/TossPayments_Logo_Simple_Primary.png"

export const PaymentSelect = ({setIsPaySelected}) => {
    return (
        <div className="flex items-center justify-center h-full gap-5 flex-wrap">
            <div
                className="rounded-[25px] w-[800px] h-20 shadow text-[30px] font-bold flex items-center justify-center">
                결재 수단 선택
            </div>
            <div
                className="rounded-[25px] w-[800px] h-[278px] shadow flex p-5 justify-around items-center text-2xl font-bold ">
                <div className="w-64 flex flex-col items-center justify-center">
                        <img  className={"w-36 h-36 cursor-pointer"} src={appLogo}
                        onClick={() => setIsPaySelected(1)}
                         alt={'applogo'}></img>
                    <div className={"h-12 flex justify-center items-center"}>PlantiPay</div>
                </div>
                <div>
                <button
                        className={"rounded-[25px] shadow w-64 h-36 flex flex-col border-black justify-center items-center cursor-pointer gap-5"}
                        onClick={() => setIsPaySelected(2)}
                >
                        <img src={tosslogo} alt={"토스로고"}></img>

                    </button>
                    <div className={"h-12 flex justify-center items-center"}>토스페이먼츠</div>
                </div>

            </div>
        </div>
    )
}