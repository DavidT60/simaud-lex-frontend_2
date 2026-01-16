import { useNavigate } from "react-router-dom";
import { X, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotificationDropdownProps {
  notifications: any[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDropdown = ({
  notifications,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) => {
  const navigate = useNavigate();

  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    
    // Navigate to related case if available
    if (notification.relatedEntityId) {
      navigate(`/casos/${notification.relatedEntityId}`);
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-[100]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Notificaciones
          </h3>
          <div className="flex items-center gap-2">
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                Marcar todas
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No tienes notificaciones
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1" />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString("es-ES")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
