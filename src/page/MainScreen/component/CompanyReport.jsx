import {useEffect, useState} from "react";
import {eksApi} from "../../../api/api.js";
import {useQuery} from "@tanstack/react-query";

export const CompanyReport = ({handleSendRequest}) => {
    const [reports, setReports] = useState([]);
    const [isLogin, setIsLogin] = useState(true);
    const { data } = useQuery({
        queryKey: ['company'],
        queryFn: async () => {
            const {data: {content : reports}} = await eksApi.get(`/reports/company`,{params:{page: 0, size: 5}});
            return reports;
        },
    });

    useEffect(() => {
        if(localStorage.getItem("accessToken") === null) {setIsLogin(false);  return; }
        handleRecommendedReports("company");
    }, []);

    const handleRecommendedReports = async (type) => {
        const {data: {content : reports}} = await eksApi.get(`/reports/user/${type}recommendedreports`,{
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`},
            params:{page: 0, size: 5}}
        ).catch(() => {console.log("server is not running");});
        console.log(reports);
        setReports(reports);
    };

    const CompanyReport = (report,index) => {
        return (
            <li key={index}>
                <div
                    className={"report_data grid grid-cols-4 gap-4 px-4 py-2 text-[black]"}>
                                            <span
                                                className={"text-left ml-4 hover:cursor-pointer hover:underline"}
                                                onClick={() => {
                                                    handleSendRequest(report.company_name + " " + `재무제표 요약해줘`);
                                                }}
                                            >{`${report.company_name}`}</span>
                    <span>{report.report_title}</span>
                    <span className={"text-left ml-[75px]"}>{report.securities_firm}</span>
                    <span className={"text-center ml-[25px]"}>{report.report_date}</span>
                    {/*여기에 리포트 내용의 요약이 들어가야됨*/}
                </div>
            </li>
        )
    }

    return (
        <div className="hotReport">
            <p className={"font-bold text-xl pl-5 p-3"}>{isLogin && "추천 "}종목분석 레포트</p>
            <ul className={"font-extrabold"}>
                <hr className={"border-whitesmoke border-[0.5px]"}/>
                <li className={"grid grid-cols-4 font-black text-[13px] gap-4 px-4 py-2"}>
                    <span className="text-left ml-6">기업</span>
                    <span className="text-left">제목</span>
                    <span className="text-center ml-3">증권사</span>
                    <span className="text-center ml-2">발행 일자</span>
                </li>
            </ul>
            <hr className={"border-whitesmoke border-[0.5px]"}/>
            <div className="report_scroll">
                <ul> {/*     종목분석 레포트     */}
                    {!isLogin && data && data.map((report, index) => CompanyReport(report, index))}
                    {isLogin && reports.map((report, index) => CompanyReport(report, index))}
                </ul>
            </div>
        </div>
    )
}