const Article = require("../models/Article");
const ArticleRevision = require("../models/ArticleRevision");

const publishScheduledContent = async () => {
  try {
    const now = new Date();

    // -----------------------------------------
    // 1. Publish scheduled normal articles
    // -----------------------------------------

    const scheduledArticles = await Article.find({
      status: "SCHEDULED",
      scheduledAt: { $lte: now },
    });

    for (const article of scheduledArticles) {
      article.status = "PUBLISHED";
      article.publishedAt = now;

      await article.save();
    }

    // -----------------------------------------
    // 2. Publish scheduled revisions
    // -----------------------------------------

    const scheduledRevisions = await ArticleRevision.find({
      status: "SCHEDULED",
      publishAt: { $lte: now },
    });

    for (const revision of scheduledRevisions) {
      const article = await Article.findById(revision.article);

      if (!article) {
        continue;
      }

      // Replace original article only when
      // revision is actually published
      article.title = revision.title;
      article.content = revision.content;
      article.section = revision.section;

      article.status = "PUBLISHED";
      article.publishedAt = now;

      await article.save();

      revision.status = "PUBLISHED";
      revision.published = true;
      revision.publishedAt = now;

      await revision.save();
    }

    if (
      scheduledArticles.length > 0 ||
      scheduledRevisions.length > 0
    ) {
      console.log(
        `Published ${scheduledArticles.length} article(s) and ${scheduledRevisions.length} revision(s)`
      );
    }
  } catch (error) {
    console.error(
      "Scheduled publishing error:",
      error.message
    );
  }
};

module.exports = {
  publishScheduledContent,
};