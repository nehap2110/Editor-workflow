import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import EditorReview from "./pages/EditorReview";
import ArticleEditor from "./pages/ArticleEditor";
import MyArticles from "./pages/MyArticles";
import ArticleDetail from "./pages/ArticleDetail";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      <Route
       path="/editor/review"
        element={
       <ProtectedRoute>
        <EditorReview />
       </ProtectedRoute>
        }
      />

      <Route path="/articles/new"
             element={
            <ProtectedRoute>
            <ArticleEditor />
            </ProtectedRoute>
           }
       />

      <Route path="/articles/:id/edit"
           element={
          <ProtectedRoute>
         <ArticleEditor />
         </ProtectedRoute>
          }
      />

      <Route  path="/articles/my"
             element={
             <ProtectedRoute>
             <MyArticles />
             </ProtectedRoute>
             }
        />

      <Route path="/articles/:id"
        element={
        <ProtectedRoute>
            <ArticleDetail />
       </ProtectedRoute>
       }
      />

    </Routes>
  );
}

export default App;