export const changeCategory = {
    TOTAL : "에너지",
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

export const uuidCategory = {
    TOTAL : "38e05c99-d5c7-41bd-ae84-4c7f2d0de160",
    ENERGY : "866e2656-010d-49b4-ada7-e98c18832945",
    MATERIALS : "40d287ed-70ee-4799-a387-6e13662bbb8e",
    INDUSTRIALS : "ac370ef1-9b64-4efc-a3eb-2ca4cdf1c99e",
    CONSUMER_DISCRETIONARY : "720b61aa-75b0-4cd2-8b8f-f2d366d79b4b",
    CONSUMER_STAPLES : "e4b0695f-6956-4e42-9caa-247bc71b1706",
    HEALTHCARE : "59aa1d50-1ea6-4b87-aa6f-876d4862f812",
    FINANCIAL : "8e258401-3f5a-4f97-98c7-f03241d5fcbd",
    IT : "e28f83e5-69f7-4edc-9c52-e06b4300590a",
    COMMUNICATION_SERVICES : "096141a3-f282-40cc-a692-6af7e60c6c97",
    UTILITIES : "deb884a2-7e66-4367-af1c-fd549b9f4eb4",
    SECURITIES_FIRMS : "6f18b34f-d081-417b-98a4-bedba287b45d",
    HOLDING_COMPANY : "e4b5ed8a-e6dd-414c-aa3b-7de74defc75a",
    ETC : "39170b8b-a74f-41cb-b09f-eb9a94833a02"
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