const { notification } = require('../../models');

const notificationController = {
    getNotifications: async (req, res, next) => {
        try {
            const { userId } = req.params;
            // find all notifications for the user
            const notifications = await notification.find({ user: userId })
                .populate('userBy', 'username')
                .populate('post', 'title')
                .sort({ date: -1 });
            res.json({
                data: notifications,
                statusCode: 200,
            });
        } catch (error) {
            next(error);
        }
    },

    markAsRead: async (req, res, next) => {
        try {
            const { notificationId } = req.params;

            // find the notification by ID and mark it as read
            const notificationDb = await notification.findByIdAndUpdate(
                notificationId,
                { isRead: true },
                { new: true }
            );

            res.json({
                data: notification,
                statusCode: 200,
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = notificationController;