import {useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export const ReportInfo = () => {
    const [companyReports, setCompanyReports] = useState([]);
    const [industryReports, setIndustryReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [companyView, setCompanyView] = useState(false);
    const [industryView, setIndustryView] = useState(false);
    const navigate = useNavigate();

    const handleCompanyReportView = async () => {
        setCompanyView(!companyView);
        setLoading(false);
        const {data: companyReport} = await axios.get("https://repick.site/api/v1/reports/user/viewcompanyreports",{
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`},
            params : {page: 0, size: 10}
        })
        console.log(companyReport.content);
        setCompanyReports(companyReport.content)
        setLoading(true);
    }

    const handleIndustryReportView = async () => {
        setIndustryView(!industryView);
        setLoading(false);
        const {data: industryReport} = await axios.get("https://repick.site/api/v1/reports/user/viewindustryreports",{
            headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`},
            params : {page: 0, size: 10}
        })
        console.log(industryReport.content);
        setIndustryReports(industryReport.content)
        setLoading(true);
    }

    return (
        <div>
            <div className={"font-bold text-2xl mb-2 mt-5"}>리포트정보</div>
            <hr className="border-t-[2.4px]"/>
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>종목 리포트</div>
                <div className={"w-64"}></div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                    onClick={handleCompanyReportView}>
                    보기
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
            {companyView &&
                <div>
                    {companyReports.length === 0 ? <div>
                            <div className="w-full h-16 flex items-center px-2 justify-center">
                                조회한 리포트가 없습니다.
                            </div>
                            <hr className="border-t-[2.4px]"/>
                        </div> :
                        companyReports.map((companyReport, index) => {
                            return (
                                <div key={index}>
                                    <div className="w-full py-2 px-2 h-16 flex items-center justify-between bg-gray-100">
                                        <div className={"w-48"}>{companyReport.company_name}</div>
                                        <div className={"w-64"}>{companyReport.report_title}</div>

                                        <div
                                            className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}>
                                            열기
                                        </div>
                                    </div>
                                    <hr className="border-t-[2.4px]"/>
                                </div>
                            )
                        })}
                </div>
            }
            <div className="w-full h-16 flex items-center px-2 justify-between">
                <div className={"w-48"}>산업 리포트</div>
                <div className={"w-64"}></div>
                <div
                    className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}
                    onClick={handleIndustryReportView}>
                    보기
                </div>
            </div>
            <hr className="border-t-[2.4px]"/>
            {industryView &&
                <div>
                    {industryReports.length === 0 ? <div>
                            <div className="w-full h-16 flex items-center px-2 justify-center">
                                조회한 리포트가 없습니다.
                            </div>
                            <hr className="border-t-[2.4px]"/>
                        </div> :
                        industryReports.map((industryReport, index) => {
                            return (
                                <div key={index}>
                                    <div className="w-full py-2 px-2 h-16 flex items-center justify-between bg-gray-100">
                                        <div className={"w-48"}>{industryReport.sector}</div>
                                        <div className={"w-64"}>{industryReport.report_title}</div>
                                        <div
                                            className={"border-y-[2.4px] border-x-0 h-7 min-w-10 flex items-center justify-center cursor-pointer"}>
                                            열기
                                        </div>
                                    </div>
                                    <hr className="border-t-[2.4px]"/>
                                </div>
                            )
                        })}
                </div>
            }
        </div>
    )
}