import '../css/report.css'
import axios from "axios";
import {useEffect, useState} from "react";
import {eksApi} from "../api/api.js";
import {LoadingSvg} from "../assets/LoadingSvg.jsx";
import Pdf from "../assets/pdf.svg"

function ReportPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [companyOrSector, setCompanyOrSector] = useState("기업");
    const [activeIndex, setActiveIndex] = useState(null);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const handleCompanyReports = async (searchPage) => {
        setIsSearching(false);
        if(!searchPage) {setPage(0)}
        setLoading(true);
        setCompanyOrSector("기업");
        setActiveIndex(0);
        const {data: getReports} = await eksApi.get("/reports/company",
            {params: {page: searchPage-1 || 0, size: 10}}).catch(err => console.log(err));
        setReports(getReports.content);
        setPageSize(Array.from({ length: getReports.totalPages}));
        console.log(getReports);
        setLoading(false);
    };

    const handleIndustryReports = async (searchPage) => {
        setIsSearching(false);
        if(!searchPage) {setPage(0)}
        setLoading(true);
        setCompanyOrSector("산업");
        setActiveIndex(1);
        const {data: getReports} = await eksApi.get("/reports/industry",
            {params: {page: searchPage-1 || 0, size: 10}}).catch(err => console.log(err));
        setReports(getReports.content);
        setPageSize(Array.from({ length: getReports.totalPages}));
        setLoading(false);
    };

    const handleSearch = async (searchPage) => {
        setIsSearching(true);
        if(!searchPage) {setPage(0)}
        setLoading(true);
        const type = companyOrSector === "기업" ? "company" : "industry";
        console.log(type);
        const {data: getReports} = await axios.get(`https://repick.site/api/v1/reports/${type}keyword`,{
            params: {keyword: keyword, page: searchPage-1 || 0, size: 10}}).catch(err => console.log(err));
        console.log(getReports);
        setReports(getReports.content);
        setPageSize(Array.from({ length: getReports.totalPages}));
        setLoading(false);
    }

    const handleReset = () => {
        handleCompanyReports();
    }

    useEffect(() => {
        handleCompanyReports();
    }, []);

    const handleEnterKey = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <>
            <div className={"report_container"}>
                <div>
                    <span className="report_repository">레포트 저장소</span>
                </div>
                <div className={"selected_report"}>
                    <div className="select_report_kind items-center">
                        <div tabIndex="0"
                             className={` w-[190px] h-[52px] text-center rounded-xl flex items-center justify-center hover:cursor-pointer ${activeIndex === 0 ? "bg-[rgba(2,32,71,0.15)]" : "bg-transparent"}`}
                             onClick={() => handleCompanyReports()}
                        >
                            <p>종목분석 레포트</p>
                        </div>
                        <div tabIndex="0"
                             className={` w-[190px] h-[52px] text-center rounded-xl flex items-center justify-center hover:cursor-pointer ${activeIndex === 1 ? "bg-[rgba(2,32,71,0.15)]" : "bg-transparent"}`}
                             onClick={() => handleIndustryReports()}
                        >
                            <p>산업분석 레포트</p>
                        </div>
                    </div>
                    <div className="right_report_container">
                        <ul className={"font-black"}>
                            <li className={"min-w-[830px] grid grid-cols-[1fr_4fr_1fr_2fr_1fr] px-4 py-2"}>
                                <span></span>
                                <span></span>
                                <span></span>
                                <input
                                    className={"border text-center"}
                                    value={keyword}
                                    onChange={(e)=>setKeyword(e.target.value)}
                                    onKeyPress={handleEnterKey}
                                ></input>
                                <div>
                                    <button
                                        className="text-right"
                                        onClick={() => handleSearch()}
                                    >검색
                                    </button>
                                    <button
                                        onClick={handleReset}
                                    >초기화</button>
                                </div>

                            </li>
                            <li className={"min-w-[830px] grid grid-cols-[1fr_4fr_1fr_2fr_1fr] px-4 py-2"}>
                            <span className="text-left">{companyOrSector}</span>
                                <span className="text-left">레포트 제목</span>
                                <span className="text-left">증권사</span>
                                <span className="text-center">발행 일자</span>
                                <span className="text-right">다운로드</span>
                            </li>
                            {!loading && reports.map((report, index) =>
                                    <li key={index}>
                                        <div
                                            className={"min-w-[830px] text-[14px] font-medium grid grid-cols-[1fr_4fr_1fr_2fr_1fr] px-4 py-2 border-t border-gray-300"}>
                                                <span
                                                    className={"text-left"}>{companyOrSector === "기업" ? report.company_name : report.sector}</span>
                                            <span className={"text-left"}>{report.report_title}</span>
                                            <span className={"text-left"}>{report.securities_firm}</span>
                                            <span className={"text-center"}>{report.report_date}</span>
                                            <span className={"flex-col flex"}>
                                <a className={"ml-14"}
                                   href={report.pdf_link}>
                                    <img src={Pdf} alt="Pdf Logo"/>
                            </a>
                            </span>

                                            {/*여기에 리포트 내용의 요약이 들어가야됨*/}
                                        </div>

                                    </li>
                            )
                            }
                            {!loading && <div className={"min-w-830"}>
                                <div className={"flex justify-center items-center"}>
                                    <div className={"-rotate-90 hover:cursor-pointer"}
                                         onClick={() => setPage(page === 0 ? 0 : page - 1)}
                                    >▲
                                    </div>
                                    {pageSize
                                        .filter((_, index) => {
                                            const startIndex = page * 10;
                                            const endIndex = startIndex + 10;
                                            return index >= startIndex && index < endIndex;
                                        })
                                        .map((report, index) => {
                                            const pageIndex = page * 10 + index + 1;
                                            return (
                                                <div key={index}
                                                     className={"w-5 hover:cursor-pointer"}
                                                     onClick={() => {
                                                        isSearching ? handleSearch(pageIndex) : companyOrSector === "기업" ? handleCompanyReports(pageIndex) : handleIndustryReports(pageIndex);
                                                     }}
                                                >
                                                    {pageIndex}
                                                </div>
                                            );
                                        })}
                                    <div className={"rotate-90 hover:cursor-pointer"}
                                         onClick={() => setPage(page === Math.floor(pageSize.length / 10) ? Math.floor(pageSize.length / 10) : page + 1)}
                                    >▲
                                    </div>
                                </div>
                            </div>}
                        </ul>

                        {loading &&
                            <div className={"w-full h-full flex justify-center items-center"}>
                                <LoadingSvg w={64} h={64}/>
                            </div>}
                    </div>

                </div>
            </div>
        </>
    )
}

export default ReportPage;