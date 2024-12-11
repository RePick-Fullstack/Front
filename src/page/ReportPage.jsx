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

    const handleReports = async () => {
        try {
            const getReports = await eksApi.get("/reports");
            console.log(getReports.data);
            getReports.data && setReports(getReports.data);
            setLoading(true);
        } catch {
            console.log("server is not running");
        }
    };

    useEffect(() => {
        handleReports()
    }, []);

    return (
        <div className="report_container">
            <ul className={"font-semibold"}>
                <li className={"grid grid-cols-[4fr_3fr_3fr_3fr] px-4 py-2 bg-gray-100"}>
                    <span className="text-left">기업</span>
                    <span className="text-center">회사</span>
                    <span className="text-right">발행 일자</span>
                    <span className="text-right">다운로드</span>
                </li>
                {reports.map((report, index) =>
                    <li key={index}>
                        <div className={"grid grid-cols-[4fr_3fr_3fr_3fr] px-4 py-2 border-t border-gray-300"}>
                            <span className={"text-left"}>{`${index + 1}. ${report.company_name}`}</span>
                            <span className={"text-center"}><a className={"ml-5"}
                                                               href={report.pdf_link}>{report.sector_name}</a></span>
                            <span className={"text-right"}>{report.report_date}</span>
                            <span className={"flex flex-col items-center"}>
                                <a className={"ml-20"}
                                   href={report.pdf_link}>
                                    <img src={Pdf} alt="Pdf Logo"/>
                            </a>
                            </span>

                            {/*여기에 리포트 내용의 요약이 들어가야됨*/}
                        </div>

                    </li>
                )}
            </ul>
            {loading && <div className={"w-full h-full flex justify-center items-center"}><LoadingSvg w={64} h={64}/></div>}
        </div>
    )
}

export default ReportPage;