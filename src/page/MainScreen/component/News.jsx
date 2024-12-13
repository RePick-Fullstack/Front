import {useEffect, useState} from "react";
import {eksApi} from "../../../api/api.js";

export const News = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        handleNews();
    },[])

    const handleNews = async () => {
        try {
            const getNews = await eksApi.get("/news");
            console.log(getNews.data);
            !getNews.data.isEmpty && setNews(getNews.data);
        } catch {
            console.log("server is not running");
        }
    };

    return (
        <div className="newsCrawling">     {/*뉴스 컴포넌트*/}
            <div>
                <p className={"news_title font-bold text-xl p-3 ml-2"}>뉴스</p>
                {news.map((item, index) => (
                    <div className={"w-[20vw] hover:bg-gray-200 text-[12.5px] font-semibold rounded-xl p-3 ml-4"}
                         key={index}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer"
                           style={{color: `black`}}>{item.title}</a>

                    </div>
                ))}
            </div>
        </div>
    )
}