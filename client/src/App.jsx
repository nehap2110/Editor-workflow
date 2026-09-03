import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import EditorReview from "./pages/EditorReview";
import ArticleEditor from "./pages/ArticleEditor";
import MyArticles from "./pages/MyArticles";
import ArticleDetail from "./pages/ArticleDetail";
import EditorReviewArticle from "./pages/EditorReviewArticle";
import PublishedArticles from "./pages/PublishedArticles";
import RoleRoute from "./routes/RoleRoute.jsx";
import ApprovedArticles from "./pages/ApprovedArticles";

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

     <Route path="/editor/review"
         element={
          <ProtectedRoute>
          <RoleRoute allowedRoles={["editor"]}>
          <EditorReview />
          </RoleRoute>
          </ProtectedRoute>
         }
        />

     <Route path="/articles/new"
          element={
            <ProtectedRoute>
             <RoleRoute allowedRoles={["writer"]}>
             <ArticleEditor />
             </RoleRoute>
            </ProtectedRoute>
        }
      />

     <Route path="/articles/:id/edit"
           element={
            <ProtectedRoute>
             <RoleRoute allowedRoles={["writer"]}>
              <ArticleEditor />
             </RoleRoute>
            </ProtectedRoute>
          }
     />

      <Route path="/articles/my"
             element={
              <ProtectedRoute>
               <RoleRoute allowedRoles={["writer"]}>
               <MyArticles />
               </RoleRoute>
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

      <Route path="/editor/review/:id"
           element={
           <ProtectedRoute>
            <RoleRoute allowedRoles={["editor"]}>
             <EditorReviewArticle />
            </RoleRoute>
           </ProtectedRoute>
          }
       />

       <Route path="/editor/approved"
         element={
          <ProtectedRoute>
           <ApprovedArticles />
          </ProtectedRoute>
         }
        />

       <Route path="/published"
        element={
        <ProtectedRoute>
         <PublishedArticles />
        </ProtectedRoute>
       }
       />

    </Routes>
  );
}

export default App;