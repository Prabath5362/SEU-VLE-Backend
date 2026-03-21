import Announcement from '../models/Announcement.js';

export const getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({}).sort({ createdAt: -1 });
  res.json(announcements);
};

export const getLatestAnnouncements = async (req, res) => {
  const announcements = await Announcement.find({}).sort({ createdAt: -1 }).limit(5);
  res.json(announcements);
};

export const createAnnouncement = async (req, res) => {
  const { title, imageUrl } = req.body;
  if (!title || !imageUrl) return res.status(400).json({ message: 'Title and imageUrl are required' });
  const announcement = await Announcement.create({ title, imageUrl });
  res.status(201).json(announcement);
};

export const deleteAnnouncement = async (req, res) => {
  const announcement = await Announcement.findById(req.params.id);
  if (announcement) {
    await Announcement.deleteOne({ _id: announcement._id });
    res.json({ message: 'Announcement removed' });
  } else {
    res.status(404).json({ message: 'Announcement not found' });
  }
};