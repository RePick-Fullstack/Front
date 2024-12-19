export const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);

    // 한국 시간으로 맞추기 위해 9시간을 더함
    date.setHours(date.getHours() + 9);

    // 시간이 24시를 넘을 경우, 날짜를 1일 증가시키고 시간을 00시로 설정
    if (date.getHours() >= 24) {
        date.setHours(0);  // 00시로 설정
        date.setDate(date.getDate() + 1);  // 날짜를 하루 증가시킴
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}.${month}.${day}. ${hours}:${minutes}`;
};