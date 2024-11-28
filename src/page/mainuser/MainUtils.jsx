export const decodeBase64Url = (base64Url) => {
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
        base64 += '=';
    }
    return atob(base64);
};

export const decodeJWT = (token) => {
    try {
        const base64Payload = token.split('.')[1];
        const decodedPayload = decodeBase64Url(base64Payload);
        return JSON.parse(decodedPayload);
    } catch (error) {
        console.error('JWT 디코딩 실패:', error);
        return null;
    }
};

export const formatRemainingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
