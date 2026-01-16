import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { notificationAPI } from "@/lib/api";
import { NotificationDropdown } from "./NotificationDropdown";

const TIMER_REFRESH_NOTIFICATION =
  Number(import.meta.env.NOTIFY_TIMER_INTERVAL_SECONDS) || 10;

export const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchUnreadCount = async () => {
    console.log("API NOTIFICATION CALL");
    try {
      const count = await notificationAPI.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await notificationAPI.getAll();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(
      fetchUnreadCount,
      TIMER_REFRESH_NOTIFICATION * 1000
    );
    return () => clearInterval(interval);
  }, []);

  const handleBellClick = async () => {
    if (!showDropdown) {
      await fetchNotifications();
    }
    setShowDropdown(!showDropdown);
  };

  const handleMarkAsRead = async (id: string) => {
    await notificationAPI.markAsRead(id);
    fetchUnreadCount();
    fetchNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await notificationAPI.markAllAsRead();
    fetchUnreadCount();
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setShowDropdown(false)}
          onMarkAsRead={handleMarkAsRead}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
      )}
    </div>
  );
};
