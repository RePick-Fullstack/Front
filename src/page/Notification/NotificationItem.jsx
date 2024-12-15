function NotificationItem({ message, details, createdAt }) {
    return (
        <li className="p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition duration-200">
            <div className="font-semibold">{message}</div>
            <div className="text-sm text-gray-600">{details}</div>
            <div className="text-xs text-gray-500">
                {new Date(createdAt).toLocaleString()}
            </div>
        </li>
    );
}

export default NotificationItem;
