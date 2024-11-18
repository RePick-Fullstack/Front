import {atom, selector} from "recoil";

export const testCommunity = atom({
    //데이터 배열 -> 객체로 변경 ( find id하면 순차적 검사 , 객체는 id 바로 접근)
    key: "testCommunity",
    default: '',
});

export const testCommunitySelector = selector({
    key: 'testCommunitySelector',
    get: async ({get}) => {
        const categoryName = get(testCommunity);
        if(!categoryName) return [];
        try{
            const response = await axios.get(`http://localhost:9000/communities?category=${categoryName}`);
            return response.data;
        }catch(error){
            console.error("에러메시지 ", error);
            return [];
        }
    }
})