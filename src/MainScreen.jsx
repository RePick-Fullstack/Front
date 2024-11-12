import './css/Main.css'

function MainScreen() {
    return (
        <>
            <div className="container">
                <div className="hotReport">
                    <p>인기 리포트 ㅇㅇ</p>
                    <div>모크 데이터</div>
                    <p>만들어서</p>
                    <p>map으로</p>
                    <p>반복문 돌리기</p>
                    <p>내용길면</p>
                    <p>스크롤 되게 만들거임</p>
                </div>
                <div className="right-column">
                    <div className="newsCrawling">
                        <p>똑같ㅇㅇ</p>
                        <p>뉴스 크롤링</p>
                        <div>1111</div>
                        <div>asda</div>
                        <div>asda</div>
                        <div>asda</div>
                    </div>
                    <div className="community">
                        <p>내용 삐져나오는거는 내일 스크롤 되게 만들겠으요</p>
                        <p>커뮤니티</p>
                        <div>asda</div>
                        <div>asda</div>
                        <div>asda</div>
                        <div>asda</div>
                    </div>
                </div>
            </div>
            <div className="inputContainer">
                <input className="chatInput" placeholder="챗봇에게 질문" ></input>
                <button className="inputButton">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="input-svg">
                        <path
                            d="M1.94607 9.31543C1.42353 9.14125 1.4194 8.86022 1.95682 8.68108L21.043 2.31901C21.5715 2.14285 21.8746 2.43866 21.7265 2.95694L16.2733 22.0432C16.1223 22.5716 15.8177 22.59 15.5944 22.0876L11.9999 14L17.9999 6.00005L9.99992 12L1.94607 9.31543Z"></path>
                    </svg>
                </button>

            </div>
        </>
    )

}

export default MainScreen