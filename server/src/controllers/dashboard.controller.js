const Article = require("../models/Article");
const Section = require("../models/Section");

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);

  return d;
};

const getDashboard = async (req, res, next) => {
  try {
    const now = new Date();

    let visibilityQuery = {};

    // Writers can only see articles from their assigned sections
    if (req.user.role === "writer") {
      const sections = await Section.find({
        writers: req.user._id,
        archived: false,
      }).select("_id");

      const sectionIds = sections.map((section) => section._id);

      visibilityQuery.section = { $in: sectionIds };
    }

    const weekStart = getWeekStart(now);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Last 8 weeks
    const eightWeeksAgo = new Date(weekStart);
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 49);

    const [
      inReview,
      scheduledThisWeek,
      publishedThisWeek,
      openDrafts,
      statusBreakdown,
      sectionBreakdown,
      publishedWeekly,
    ] = await Promise.all([
      // In Review
      Article.countDocuments({
        ...visibilityQuery,
        status: "SUBMITTED",
      }),

      // Scheduled this week
      Article.countDocuments({
        ...visibilityQuery,
        status: "SCHEDULED",
        scheduledAt: {
          $gte: weekStart,
          $lt: weekEnd,
        },
      }),

      // Published this week
      Article.countDocuments({
        ...visibilityQuery,
        status: "PUBLISHED",
        publishedAt: {
          $gte: weekStart,
          $lt: weekEnd,
        },
      }),

      // Open drafts
      Article.countDocuments({
        ...visibilityQuery,
        status: "DRAFT",
      }),

      // Status breakdown
      Article.aggregate([
        {
          $match: visibilityQuery,
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      // Section breakdown
      Article.aggregate([
        {
          $match: visibilityQuery,
        },
        {
          $group: {
            _id: "$section",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "sections",
            localField: "_id",
            foreignField: "_id",
            as: "section",
          },
        },
        {
          $unwind: {
            path: "$section",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            sectionId: "$_id",
            sectionName: {
              $ifNull: ["$section.name", "Unknown"],
            },
            count: 1,
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ]),

      // Published per week - last 8 weeks
      Article.aggregate([
        {
          $match: {
            ...visibilityQuery,
            status: "PUBLISHED",
            publishedAt: {
              $gte: eightWeeksAgo,
              $lt: now,
            },
          },
        },
        {
          $group: {
            _id: {
              $dateTrunc: {
                date: "$publishedAt",
                unit: "week",
                startOfWeek: "monday",
                timezone: "Asia/Kolkata",
              },
            },
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ]),
    ]);

    // Create all 8 week buckets, including weeks having 0 publications
    const publishedPerWeek = [];

for (let i = 0; i < 8; i++) {
  const date = new Date(eightWeeksAgo);

  date.setDate(date.getDate() + i * 7);

  const weekKey = date.toISOString().split("T")[0];

  const matchingWeek = publishedWeekly.find((item) => {
    const itemDate = new Date(item._id);
    return (
      itemDate.toISOString().split("T")[0] === weekKey
    );
  });

  publishedPerWeek.push({
    week: weekKey,
    count: matchingWeek ? matchingWeek.count : 0,
  });
}

    return res.status(200).json({
      stats: {
        inReview,
        scheduledThisWeek,
        publishedThisWeek,
        openDrafts,
      },

      statusBreakdown,

      sectionBreakdown,

      publishedPerWeek,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};