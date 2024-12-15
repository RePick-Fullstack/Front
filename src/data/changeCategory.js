const changeCategory = {
    ENERGY : "에너지",
    MATERIALS : "소재",
    INDUSTRIALS : "산업재",
    CONSUMER_DISCRETIONARY : "경기 관련 소비재",
    CONSUMER_STAPLES : "필수 소비재",
    HEALTHCARE : "건강관리",
    FINANCIAL : "금융",
    IT : "IT",
    COMMUNICATION_SERVICES : "커뮤니케이션 서비스",
    UTILITIES : "유틸리티",
    SECURITIES_FIRMS : "증권사",
    HOLDING_COMPANY : "지주회사",
    ETC : "기타"
}
// 영어 -> 한글 변환
export const translateToKorean = (englishCategory) => changeCategory[englishCategory];

// 한글 -> 영어 변환
const reverseChangeCategory = Object.fromEntries(
    Object.entries(changeCategory).map(([key, value]) => [value, key])
);

export const translateToEnglish = (koreanCategory) =>{
   return reverseChangeCategory[koreanCategory];
}