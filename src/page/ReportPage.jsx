import '../css/report.css'
import axios from "axios";
import {useEffect, useState} from "react";
import {eksApi} from "../api/api.js";
import {LoadingSvg} from "../assets/LoadingSvg.jsx";
import Pdf from "../assets/pdf.svg"

//import {testReport} from "../data/testReport.js";

function ReportPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleCompanyReports = async () => {
        setLoading(true);
        const {data: {content: getReports}} = await eksApi.get("/reports/company",
            {params: {page: 0, size: 10}}).catch(err => console.log(err));
        setReports(getReports);
        setLoading(false);
    };

    const handleIndustryReports = async () => {
        setLoading(true);
        const {data: {content: getReports}} = await eksApi.get("/reports/industry",
            {params: {page: 0, size: 10}}).catch(err => console.log(err));
        setReports(getReports);
        setLoading(false);

    }

    useEffect(() => {
        handleCompanyReports()
    }, []);

    return (
        <>
            <div className={"report_container"}>
                <div>
                    <span className="report_repository">레포트 저장소</span>
                </div>
                <div className={"selected_report"}>
                    <div className="select_report_kind hover:cursor-pointer items-center">
                        <div tabIndex="0"
                             className={" w-[190px] h-[52px] focus:bg-[rgba(2,32,71,0.05)] text-center rounded-xl flex items-center justify-center"}
                            onClick={handleCompanyReports}
                        >
                            <p>종목분석 레포트</p>
                        </div>
                        <div tabIndex="0"
                             className={"px-18 py12 w-[190px] h-[52px] focus:bg-[rgba(2,32,71,0.05)] text-center rounded-xl flex items-center justify-center"}
                             onClick={handleIndustryReports}
                        >
                            <p>산업분석 레포트</p>
                        </div>
                    </div>
                    <div className="right_report_container">
                        <ul className={"font-black"}>
                            <li className={"grid grid-cols-[5fr_4fr_1fr] px-4 py-2"}>
                                <span className="text-left">레포트 제목</span>
                                <span className="text-left">발행 일자</span>
                                <span className="text-right">다운로드</span>
                            </li>
                            {!loading && reports.map((report, index) =>
                                    <li key={index}>
                                        <div
                                            className={"grid grid-cols-[5fr_4fr_1fr] px-4 py-2 border-t border-gray-300"}>
                                            <span className={"text-left"}>{report.report_title}</span>
                                            <span className={"text-left"}>{report.report_date}</span>
                                            <span className={"flex-col flex"}>
                                <a className={"ml-14"}
                                   href={report.pdf_link}>
                                    <img src={Pdf} alt="Pdf Logo"/>
                            </a>
                            </span>

                                            {/*여기에 리포트 내용의 요약이 들어가야됨*/}
                                        </div>

                                    </li>
                            )}
                        </ul>
                        {loading &&
                            <div className={"w-full h-full flex justify-center items-center"}><LoadingSvg w={64}
                                                                                                          h={64}/>
                            </div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReportPage;