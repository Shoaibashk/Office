import { create } from 'zustand';
import type { Notification, NotificationType } from '../types';
import { v4 as uuid } from 'uuid';

interface NotificationState {
    notifications: Notification[];
    maxNotifications: number;

    // Actions
    addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => string;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;

    // Convenience methods
    info: (title: string, message: string, duration?: number) => string;
    success: (title: string, message: string, duration?: number) => string;
    warning: (title: string, message: string, duration?: number) => string;
    error: (title: string, message: string, duration?: number) => string;
}

const createNotification = (
    type: NotificationType,
    title: string,
    message: string,
    duration?: number
): Omit<Notification, 'id' | 'createdAt'> => ({
    type,
    title,
    message,
    duration: duration ?? (type === 'error' ? undefined : 5000),
});

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    maxNotifications: 5,

    addNotification: (notification) => {
        const id = uuid();
        const newNotification: Notification = {
            ...notification,
            id,
            createdAt: new Date(),
        };

        set((state) => {
            const notifications = [newNotification, ...state.notifications].slice(
                0,
                state.maxNotifications
            );
            return { notifications };
        });

        // Auto-remove after duration
        if (notification.duration) {
            setTimeout(() => {
                get().removeNotification(id);
            }, notification.duration);
        }

        return id;
    },

    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    clearAllNotifications: () => set({ notifications: [] }),

    info: (title, message, duration) =>
        get().addNotification(createNotification('info', title, message, duration)),

    success: (title, message, duration) =>
        get().addNotification(createNotification('success', title, message, duration)),

    warning: (title, message, duration) =>
        get().addNotification(createNotification('warning', title, message, duration)),

    error: (title, message, duration) =>
        get().addNotification(createNotification('error', title, message, duration)),
}));
