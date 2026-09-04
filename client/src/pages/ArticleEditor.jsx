import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";
import BackButton from "../components/BackButton.jsx";

const ArticleEditor = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);
  const isEditor = user?.role === "editor";
  const isWriter = user?.role === "writer";

  const [sections, setSections] = useState([]);
  const [writers, setWriters] = useState([]);

  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [writersLoading, setWritersLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    section: "",
    content: "",
    author: "",
  });

  const [status, setStatus] = useState("DRAFT");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH ARTICLE WHEN EDITING
  // ==========================================

  useEffect(() => {
    if (!isEditing) return;

    const fetchArticle = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await api.get(`/articles/${id}`);

        const article = response.data.article;

        // Only Draft and Changes Requested can be edited
        if (
          article.status !== "DRAFT" &&
          article.status !== "CHANGES_REQUESTED"
        ) {
          setError(
            `This article cannot be edited because its status is ${article.status}.`
          );
          return;
        }

        setFormData({
          title: article.title || "",
          summary: article.summary || "",
          section:
            typeof article.section === "object"
              ? article.section?._id
              : article.section || "",
          content: article.content || "",
          author:
            typeof article.author === "object"
              ? article.author?._id
              : article.author || "",
        });

        setStatus(article.status);
      } catch (err) {
        console.error("Fetch article error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load article."
        );
      } finally {
        setFetching(false);
      }
    };

    fetchArticle();
  }, [id, isEditing]);


  // ==========================================
  // FETCH SECTIONS
  // ==========================================

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setSectionsLoading(true);

        const response = await api.get("/sections");

        setSections(response.data.sections || []);
      } catch (err) {
        console.error("Fetch sections error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load sections."
        );
      } finally {
        setSectionsLoading(false);
      }
    };

    if (user?.role) {
      fetchSections();
    }
  }, [user]);


  // ==========================================
  // FETCH WRITERS
  // EDITOR CREATE FLOW
  // ==========================================

  useEffect(() => {
    if (!isEditor || isEditing) return;

    const fetchWriters = async () => {
      try {
        setWritersLoading(true);

        const response = await api.get("/users/writers");

        setWriters(response.data.users || []);
      } catch (err) {
        console.error("Fetch writers error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load writers."
        );
      } finally {
        setWritersLoading(false);
      }
    };

    fetchWriters();
  }, [isEditor, isEditing]);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };


  // ==========================================
  // VALIDATE FORM
  // ==========================================

  const validateForm = () => {
    if (!formData.title.trim()) {
      return "Title is required.";
    }

    if (!formData.content.trim()) {
      return "Content is required.";
    }

    if (!formData.section) {
      return "Section is required.";
    }

    // Editor must select writer while creating
    if (isEditor && !isEditing && !formData.author) {
      return "Please select a writer.";
    }

    return null;
  };


  // ==========================================
  // CREATE / UPDATE ARTICLE
  // ==========================================

  const handleSave = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      let response;

      if (isEditing) {
        // Don't send author while editing
        // Existing article author should remain unchanged.
        const updateData = {
          title: formData.title,
          summary: formData.summary,
          section: formData.section,
          content: formData.content,
        };

        response = await api.patch(
          `/articles/${id}`,
          updateData
        );
      } else {
        // New article
        const createData = {
          title: formData.title,
          summary: formData.summary,
          section: formData.section,
          content: formData.content,
        };

        // Editor must send selected writer
        if (isEditor) {
          createData.author = formData.author;
        }

        response = await api.post(
          "/articles",
          createData
        );
      }

      const article = response.data.article;

      if (!article || !article._id) {
        throw new Error(
          "Article was saved but no article ID was returned."
        );
      }

      setStatus(article.status);

      setSuccess(
        isEditing
          ? "Article updated successfully."
          : "Article saved as draft successfully."
      );

      // After creating, move to real edit URL
      if (!isEditing) {
        navigate(
          `/articles/${article._id}/edit`,
          {
            replace: true,
          }
        );
      }
    } catch (err) {
      console.error("Save article error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save article."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // SUBMIT ARTICLE
  // ONLY WRITER SHOULD SUBMIT
  // ==========================================

  const handleSubmit = async () => {
    // Editor should not submit article
    if (isEditor) {
      setError(
        "Editors create and manage articles, but only the article writer can submit it for review."
      );
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    // New article
    if (!id) {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const createResponse = await api.post(
          "/articles",
          {
            title: formData.title,
            summary: formData.summary,
            section: formData.section,
            content: formData.content,
          }
        );

        const article = createResponse.data.article;

        const submitResponse = await api.post(
          `/articles/${article._id}/submit`
        );

        setStatus(
          submitResponse.data.article.status
        );

        setSuccess(
          "Article submitted for review successfully."
        );

        setTimeout(() => {
          navigate("/articles/my");
        }, 800);

      } catch (err) {
        console.error(
          "Submit article error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to submit article."
        );
      } finally {
        setLoading(false);
      }

      return;
    }


    // Existing article
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Save latest changes
      await api.patch(
        `/articles/${id}`,
        {
          title: formData.title,
          summary: formData.summary,
          section: formData.section,
          content: formData.content,
        }
      );

      // Submit
      const response = await api.post(
        `/articles/${id}/submit`
      );

      setStatus(
        response.data.article.status
      );

      setSuccess(
        "Article submitted for review successfully."
      );

      setTimeout(() => {
        navigate("/articles/my");
      }, 800);

    } catch (err) {
      console.error(
        "Submit article error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to submit article."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading article...
        </p>
      </div>
    );
  }


  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEditing
                ? "Edit Article"
                : "Create Article"}
            </h1>

            <p className="text-sm text-gray-500">
              Editorial Workflow
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              status === "DRAFT"
                ? "bg-gray-100 text-gray-700"
                : status === "CHANGES_REQUESTED"
                ? "bg-orange-100 text-orange-700"
                : status === "SUBMITTED"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status}
          </span>

        </div>
      </header>


      <main className="mx-auto max-w-5xl px-6 py-8">

        <BackButton />


        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}


        {/* Success */}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}


        <div className="rounded-xl border bg-white p-6 shadow-sm">


          {/* ==================================
              TITLE
          ================================== */}

          <div className="mb-6">

            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter article title"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />

          </div>


          {/* ==================================
              WRITER
              EDITOR CREATE ONLY
          ================================== */}

          {isEditor && !isEditing && (
            <div className="mb-6">

              <label
                htmlFor="author"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Writer / Author
              </label>

              <select
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                disabled={writersLoading}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
              >

                <option value="">
                  {writersLoading
                    ? "Loading writers..."
                    : "Select writer"}
                </option>

                {writers.map((writer) => (
                  <option
                    key={writer._id}
                    value={writer._id}
                  >
                    {writer.name} ({writer.email})
                  </option>
                ))}

              </select>

            </div>
          )}


          {/* ==================================
              SECTION
          ================================== */}

          <div className="mb-6">

            <label
              htmlFor="section"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Section
            </label>

            <select
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              disabled={sectionsLoading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:opacity-50"
            >

              <option value="">
                {sectionsLoading
                  ? "Loading sections..."
                  : "Select section"}
              </option>

              {sections.map((section) => (
                <option
                  key={section._id}
                  value={section._id}
                >
                  {section.name}
                </option>
              ))}

            </select>

          </div>


          {/* ==================================
              SUMMARY
          ================================== */}

          <div className="mb-6">

            <label
              htmlFor="summary"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Summary
            </label>

            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Write a short summary..."
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />

          </div>


          {/* ==================================
              CONTENT
          ================================== */}

          <div className="mb-6">

            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Article Content
            </label>

            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your article..."
              rows={16}
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />

          </div>


          {/* ==================================
              ACTIONS
          ================================== */}

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>


            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Save Draft */}

              {(status === "DRAFT" ||
                status === "CHANGES_REQUESTED") && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : "Save Draft"}
                </button>
              )}


              {/* Submit - WRITER ONLY */}

              {isWriter &&
                (status === "DRAFT" ||
                  status === "CHANGES_REQUESTED") && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Submitting..."
                      : "Submit for Review"}
                  </button>
                )}

            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;