import User from '../models/User.js';
import Subject from '../models/Subject.js';
import VideoLesson from '../models/VideoLesson.js';
import Progress from '../models/Progress.js';

// @desc    Get platform stats
// @route   GET /api/analytics/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalSubjects = await Subject.countDocuments();
    const totalVideos = await VideoLesson.countDocuments();
    
    // Most watched videos (requires aggregation on progress table)
    const mostWatched = await Progress.aggregate([
      { $match: { watched: true } },
      { $group: { _id: '$videoId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: 'videolessons',
          localField: '_id',
          foreignField: '_id',
          as: 'video'
        }
      },
      { $unwind: '$video' },
      { $project: { title: '$video.title', count: 1 } }
    ]);

    // Active users: Users who have active progress records in the last 7 days.
    // Progress doesn't update 'lastWatchedTime' as a Date but as a duration, but wait...
    // Progress has 'updatedAt' from timestamps! We can use that.
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsersList = await Progress.distinct('userId', {
      updatedAt: { $gte: sevenDaysAgo },
    });
    
    res.json({
      totalStudents,
      totalSubjects,
      totalVideos,
      mostWatchedVideos: mostWatched,
      activeUsers: activeUsersList.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};
