import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

const [creatingRevision, setCreatingRevision] = useState(false);
const [revisionError, setRevisionError] = useState("");

const [comment, setComment] = useState("");
const [commentLoading, setCommentLoading] = useState(false);
const [commentError, setCommentError] = useState("");
const [commentSuccess, setCommentSuccess] = useState("");

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
const [historyLoading, setHistoryLoading] = useState(true);
const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/articles/${id}`);

        setArticle(response.data.article);
      } catch (err) {
        console.error("Fetch article error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load article."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  useEffect(() => {
  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError("");

      const response = await api.get(`/articles/${id}/history`);

      setHistory(response.data.history || []);
    } catch (err) {
      console.error("Fetch history error:", err);

      setHistoryError(
        err.response?.data?.message ||
          "Failed to load article history."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  fetchHistory();
}, [id]);

  const handleCreateRevision = async () => {
  try {
    setCreatingRevision(true);
    setRevisionError("");

    const response = await api.post(
      `/articles/${article._id}/revision`
    );

    const revision = response.data.revision;

    navigate(`/articles/revisions/${revision._id}/edit`);
  } catch (err) {
    console.error("Create revision error:", err);

    setRevisionError(
      err.response?.data?.message ||
        "Failed to create revision."
    );
  } finally {
    setCreatingRevision(false);
  }
};

const handleAddComment = async (e) => {
  e.preventDefault();

  if (!comment.trim()) {
    setCommentError("Comment cannot be empty.");
    return;
  }

  try {
    setCommentLoading(true);
    setCommentError("");
    setCommentSuccess("");

    await api.post(`/articles/${article._id}/comments`, {
      comment: comment.trim(),
    });

    setComment("");
    setCommentSuccess("Comment added successfully.");

    // Refresh timeline
    const response = await api.get(
      `/articles/${article._id}/history`
    );

    setHistory(response.data.history || []);
  } catch (err) {
    console.error("Add comment error:", err);

    setCommentError(
      err.response?.data?.message ||
        "Failed to add comment."
    );
  } finally {
    setCommentLoading(false);
  }
};




  const getStatusClass = (status) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-700";

      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-700";

      case "CHANGES_REQUESTED":
        return "bg-orange-100 text-orange-700";

      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "PUBLISHED":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading article...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Article
            </h1>

            <p className="text-sm text-gray-500">
              Editorial Workflow
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
              article.status
            )}`}
          >
            {article.status}
          </span>
        </div>
      </header>

      {/* Article */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        <article className="rounded-xl border bg-white p-8 shadow-sm">
          {/* Section */}
          <div className="mb-4 text-sm font-medium text-gray-500">
          {article.section?.name || "Unknown Section"}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <span>
              Author:{" "}
              <strong className="font-medium text-gray-700">
                {article.author?.name ||
                  article.author?.email ||
                  "Unknown"}
              </strong>
            </span>

            {article.createdAt && (
              <span>
                Created:{" "}
                {new Date(
                  article.createdAt
                ).toLocaleDateString()}
              </span>
            )}

            {article.submittedAt && (
              <span>
                Submitted:{" "}
                {new Date(
                  article.submittedAt
                ).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Summary */}
          {article.summary && (
            <div className="mt-8 rounded-lg bg-gray-50 p-5">
              <h2 className="mb-2 text-sm font-semibold text-gray-700">
                Summary
              </h2>

              <p className="text-sm leading-6 text-gray-600">
                {article.summary}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="mt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Article Content
            </h2>

            <div className="whitespace-pre-wrap text-base leading-8 text-gray-800">
              {article.content}
            </div>

{/* Add Comment */}
<div className="mt-8 rounded-lg border bg-gray-50 p-5">
  <h3 className="text-lg font-semibold text-gray-900">
    Add Comment
  </h3>

  <p className="mt-1 text-sm text-gray-500">
    Add a comment to this article's history.
  </p>

  <form onSubmit={handleAddComment} className="mt-4">
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="Write your comment..."
      rows={4}
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500"
    />

    {commentError && (
      <p className="mt-2 text-sm text-red-600">
        {commentError}
      </p>
    )}

    {commentSuccess && (
      <p className="mt-2 text-sm text-green-600">
        {commentSuccess}
      </p>
    )}

    <button
      type="submit"
      disabled={commentLoading}
      className="mt-3 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {commentLoading ? "Adding..." : "Add Comment"}
    </button>
  </form>
</div>



            {/* History */}
<div className="mt-10 border-t pt-8">
  <h2 className="text-xl font-semibold text-gray-900">
    Article History
  </h2>

  <p className="mt-1 text-sm text-gray-500">
    Timeline of article activity and status changes.
  </p>

  {historyLoading && (
    <p className="mt-6 text-sm text-gray-500">
      Loading history...
    </p>
  )}

  {historyError && (
    <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {historyError}
    </div>
  )}

  {!historyLoading &&
    !historyError &&
    history.length === 0 && (
      <p className="mt-6 text-sm text-gray-500">
        No history available.
      </p>
    )}

  {!historyLoading &&
    !historyError &&
    history.length > 0 && (
      <div className="mt-6 space-y-4">
        {history.map((item) => (
          <div
            key={item._id}
            className="relative border-l-2 border-gray-200 pl-5"
          >
            <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-gray-500" />

            <div className="rounded-lg border bg-gray-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900">
                  {item.type === "CREATED" && "Article Created"}

                  {item.type === "STATUS_CHANGE" &&
                    "Status Changed"}

                  {item.type === "REVISION_CREATED" &&
                    "Revision Created"}

                  {item.type === "REVISION_STATUS_CHANGE" &&
                    "Revision Status Changed"}

                  {item.type === "COMMENT" &&
                    "Comment Added"}
                </h3>

                <span className="text-xs text-gray-500">
                  {item.createdAt &&
                    new Date(item.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                By{" "}
                <span className="font-medium text-gray-800">
                  {item.actor?.name ||
                    item.actor?.email ||
                    "Unknown user"}
                </span>
              </p>

              {item.type === "STATUS_CHANGE" && (
                <p className="mt-2 text-sm text-gray-700">
                  Status:{" "}
                  <span className="font-medium">
                    {item.oldStatus || "—"}
                  </span>
                  {" → "}
                  <span className="font-medium">
                    {item.newStatus || "—"}
                  </span>
                </p>
              )}

              {item.type === "REVISION_STATUS_CHANGE" && (
                <p className="mt-2 text-sm text-gray-700">
                  Revision status:{" "}
                  <span className="font-medium">
                    {item.oldStatus || "—"}
                  </span>
                  {" → "}
                  <span className="font-medium">
                    {item.newStatus || "—"}
                  </span>
                </p>
              )}

              {item.type === "COMMENT" && item.comment && (
                <div className="mt-3 rounded-md border bg-white p-3 text-sm text-gray-700">
                  {item.comment}
                </div>
              )}

              {item.type === "REVISION_CREATED" &&
                item.revision && (
                  <p className="mt-2 text-sm text-gray-600">
                    Revision created for this article.
                  </p>
                )}
            </div>
          </div>
        ))}
      </div>
    )}
</div>


          </div>
        
        //revision
          {user?.role === "writer" &&
  article.status === "PUBLISHED" &&
  article.author?._id === user?._id && (
    <div className="mb-6 border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-900">
        Create New Revision
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Create a new revision of this published article.
      </p>

      {revisionError && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {revisionError}
        </div>
      )}

      <button
        onClick={handleCreateRevision}
        disabled={creatingRevision}
        className="mt-4 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {creatingRevision
          ? "Creating Revision..."
          : "Create New Revision"}
      </button>
    </div>
  )}

          {/* Back */}
          <div className="mt-10 border-t pt-6">
            <button
              onClick={() => navigate(-1)}
              className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Go Back
            </button>
          </div>
        </article>
      </main>
    </div>
  );
};

export default ArticleDetail;