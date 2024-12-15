const BASE_URL = "http://localhost:9000/api/v1/notifications";

export async function pollNotifications(userId) {
    const response = await fetch(`${BASE_URL}/${userId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch notifications");
    }
    return response.json();
}

export async function clearNotifications(userId) {
    const response = await fetch(`${BASE_URL}/${userId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to clear notifications");
    }
}
