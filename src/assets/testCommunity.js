import {atom} from "recoil";

export const testCommunity = atom({
    //데이터 배열 -> 객체로 변경 ( find id하면 순차적 검사 , 객체는 id 바로 접근)
    key:"testCommunity",
    default: {
    1: {
        "id": 1,
        "title": "혹시 보건계열로 일 하다가~~",
        "content": "저는 내년에 8년차~~~",
        "nickname": "또니이잉",
        "good": 0,
        "comment": 1,
        "check": 7
    },
    2: {
        "id": 2,
        "title": "간호사로 미국비자 대기중인데",
        "content": "중환자실에 일을 하고싶은데~~~",
        "nickname": "쪼이이잉",
        "good": 2,
        "comment": 3,
        "check": 5
    }
    ,
    3: {
        "id": 3,
        "title": "다른계열에서 보건계열로 ~~~",
        "content": "올해 3년차구요~~",
        "nickname": "뽀이이잉",
        "good": 3,
        "comment": 2,
        "check": 4
    }
    ,
    4: {
        "id": 4,
        "title": "한국에서 간호사~~~~~",
        "content": "신입으로 들어갑니다~~~",
        "nickname": "꼬이이잉",
        "good": 1,
        "comment": 1,
        "check": 9
    }
    ,
    5: {
        "id": 5,
        "title": "5번째 스크롤 만들기",
        "content": "스크롤만들기 content",
        "nickname": "로이이잉",
        "good": 100,
        "comment": 100,
        "check": 100
    },
},
});