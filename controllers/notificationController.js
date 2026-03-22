import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ clearedBy: { $ne: req.user._id } }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get notifications' });
  }
};

export const markNotificationsAsRead = async (req, res) => {
  try {
    // Mark all notifications not yet read by this user as read by pushing user ID
    await Notification.updateMany(
      { readBy: { $ne: req.user._id } },
      { $push: { readBy: req.user._id } }
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to mark notifications as read' });
  }
};

export const clearNotificationForUser = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (notification) {
      if (!notification.clearedBy.includes(req.user._id)) {
        notification.clearedBy.push(req.user._id);
        await notification.save();
      }
      res.json({ message: 'Notification cleared for user' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear notification' });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { title, message, link } = req.body;
    const notification = await Notification.create({ title, message, link });
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create notification' });
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { title, message, link } = req.body;
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      notification.title = title || notification.title;
      notification.message = message || notification.message;
      notification.link = link !== undefined ? link : notification.link;

      const updatedNotification = await notification.save();
      res.json(updatedNotification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update notification' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      await Notification.deleteOne({ _id: notification._id });
      res.json({ message: 'Notification removed' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete notification' });
  }
};
