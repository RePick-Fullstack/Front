import '../css/report.css'
import axios from "axios";
import {useEffect, useState} from "react";
import {eksApi} from "../api/api.js";
import {LoadingSvg} from "../assets/LoadingSvg.jsx";
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
                    <span className="text-left">리포트 제목</span>
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
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="30" viewBox="0 0 24 24"><g
                                    fill="none" stroke="currentColor"><path
                                    d="m11.79 10.673l-.058.265a9.8 9.8 0 0 1-1.368 3.286m1.425-3.551l.467-2.136c.162-.738-.556-1.316-1.11-.894c-.297.226-.407.665-.26 1.037l.246.617q.286.719.657 1.376Zm0 0a10.4 10.4 0 0 0 2.064 2.596m0 0l2.255-.286c.632-.08 1.09.671.806 1.32c-.207.474-.721.649-1.121.382l-.851-.568a9.4 9.4 0 0 1-1.089-.848Zm0 0l-.095.013a12.3 12.3 0 0 0-3.394.942m0 0q-.626.274-1.228.618l-1.706.975c-.475.271-.577.994-.202 1.423c.332.379.88.338 1.165-.087l1.91-2.837z"/><path
                                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                                    d="M7.792 21.25h8.416a3.5 3.5 0 0 0 3.5-3.5v-5.53a3.5 3.5 0 0 0-1.024-2.475l-5.969-5.97A3.5 3.5 0 0 0 10.24 2.75H7.792a3.5 3.5 0 0 0-3.5 3.5v11.5a3.5 3.5 0 0 0 3.5 3.5"/></g></svg>
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