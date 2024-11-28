const sample = {
    title: "",
    content: "",
    category: ""
}


const categories = [
    "ENERGY",
    "MATERIALS",
    "INDUSTRIALS",
    "CONSUMER_DISCRETIONARY",
    "CONSUMER_STAPLES",
    "HEALTHCARE",
    "FINANCIAL",
    "IT",
    "COMMUNICATION_SERVICES",
    "UTILITIES",
    "SECURITIES_FIRMS"
];

function getRandomCategories(length, categories) {
    const selectedCategories = new Set();
    while (selectedCategories.size < length) {
        const randomIndex = Math.floor(Math.random() * categories.length);
        selectedCategories.add(categories[randomIndex]);
    }
    return Array.from(selectedCategories);
}

function randomString() {
    const length = Math.floor(Math.random() * 46) + 5; // 5~50 사이 랜덤 길이
    let result = '';
    for (let i = 0; i < length; i++) {
        const isUppercase = Math.random() < 0.5; // 50% 확률로 대소문자 선택
        const charCode = isUppercase
            ? Math.floor(Math.random() * 26) + 65 // 대문자
            : Math.floor(Math.random() * 26) + 97; // 소문자
        result += String.fromCharCode(charCode);
    }
    return result;
}


export const randomPostGenerator = (category) => {
    sample.title = randomString()
    sample.content = randomString()
    sample.category = category
    return sample;
}