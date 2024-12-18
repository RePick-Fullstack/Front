import {useEffect, useState} from "react";
import {eksApi} from "../../../api/api.js";

export const IndustryReport = ({handleSendRequest}) => {
    const [industryReports, setIndustryReports] = useState([]);

    useEffect(() => {
        if(localStorage.getItem("accessToken") === null) {handleReports("industry"); return; }
        handleRecommendedReports("industry");
    }, []);

    const handleReports = async (type) => {
        const {data: {content : reports}} = await eksApi.get(`/reports/${type}`,{params:{page: 0, size: 5}}).catch(() => {console.log("server is not running");});
        console.log(reports);
        setIndustryReports(reports);
    };

    const handleRecommendedReports = async (type) => {
        const {data: {content : reports}} = await eksApi.get(`/reports/user/${type}recommendedreports`,{
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`},
            params:{page: 0, size: 5}}
        ).catch(() => {console.log("server is not running");});
        console.log(reports);
        setIndustryReports(reports);
    };

    return(
        <div className="industryReport">
            <p className={"font-bold text-xl pl-5 p-3"}>산업분석 레포트</p>
            <ul className={"font-extrabold"}>
                <hr className={"border-whitesmoke border-[1px]"}/>
                <li className={"grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 font-black text-[13px] gap-5 px-4 py-2"}>
                    <span className="text-left ml-6">산업</span>
                    <span className="text-left">제목</span>
                    <span className="text-center ml-3">증권사</span>
                    <span className="text-center">발행 일자</span>
                </li>
            </ul>
            <hr className={"border-whitesmoke border-[1px]"}/>
            <div className="industry_scroll">
                <ul>       {/*    여기에 산업분석 레포트 나오는거 넣기  */}
                    {industryReports.map((report, index) =>
                        <li key={index}>
                            <div
                                className={"report_data grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4  gap-5 px-4 py-2 text-[black]"}>
                                            <span
                                                onClick={() => {
                                                    handleSendRequest(report.sector + " " + `현황 알려줘`);
                                                }}
                                                className={"text-left ml-4 hover:cursor-pointer hover:underline"}>{`${report.sector}`}</span>
                                <span>{report.report_title}</span>
                                <span className={"text-left ml-[52px]"}><a
                                    className={"ml-5 hover:underline"}
                                    href={report.pdf_link}>{report.securities_firm}</a></span>
                                <span className={"text-center ml-[20px]"}>{report.report_date}</span>
                                {/*여기에 리포트 내용의 요약이 들어가야됨*/}
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}