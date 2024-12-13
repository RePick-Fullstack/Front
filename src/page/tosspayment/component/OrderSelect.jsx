export const OrderSelect = ({handleIsSelected}) => {
    return (
        <div className="flex items-center justify-center h-full gap-5 flex-wrap">
            <div
                className="rounded-[25px] w-[800px] h-20 shadow text-[30px] font-bold flex items-center justify-center">
                상품 선택
            </div>
            <div
                className="rounded-[25px] w-[800px] h-[278px] shadow flex p-5 justify-around items-center text-2xl font-bold text-white">
                <button
                    className={"rounded-[25px] bg-[#303e4f] w-64 h-48 " +
                        "flex flex-col justify-center items-center " +
                        "p-5 cursor-pointer gap-5 hover:bg-[#37AFE1] "}
                    onClick={() => handleIsSelected(5900)}>
                    <div>리픽 1개월 구독</div>
                    <div>5,900원</div>
                </button>
                <button
                    className={"rounded-[25px] bg-[#303e4f] w-64 h-48 flex flex-col justify-center items-center p-5 cursor-pointer gap-5 hover:bg-[#37AFE1] "}
                    onClick={() => handleIsSelected(59000)}>
                    <div>리픽 12개월 구독</div>
                    <div><del>70,800원</del> 59,000원</div>
                </button>
            </div>
        </div>
    )
}