import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import useDesktopStore from '../store/useDesktopStore';

const NotificationCenter = () => {
    const { notifications, removeNotification } = useDesktopStore();

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        info: <Info size={20} />,
    };

    const colors = {
        success: { bg: 'bg-green-500/90', border: 'border-green-400' },
        error: { bg: 'bg-red-500/90', border: 'border-red-400' },
        info: { bg: 'bg-blue-500/90', border: 'border-blue-400' },
    };

    return (
        <div className="fixed top-20 right-6 z-[9999] flex flex-col gap-2 max-w-sm">
            <AnimatePresence>
                {notifications.map((notif) => (
                    <Notification
                        key={notif.id}
                        notification={notif}
                        icon={icons[notif.type] || icons.info}
                        colors={colors[notif.type] || colors.info}
                        onClose={() => removeNotification(notif.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

const Notification = ({ notification, icon, colors, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, notification.duration || 3000);
        return () => clearTimeout(timer);
    }, [notification.duration, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`${colors.bg} backdrop-blur-md border ${colors.border} rounded-lg shadow-2xl p-4 flex items-start gap-3 min-w-[300px]`}
        >
            <div className="flex-shrink-0 text-white mt-0.5">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                {notification.title && (
                    <div className="font-bold text-white text-sm mb-1">{notification.title}</div>
                )}
                <div className="text-white/90 text-xs">{notification.message}</div>
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
};

export default NotificationCenter;
