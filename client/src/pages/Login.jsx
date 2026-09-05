import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import FormInput from "../components/FormInput.jsx";
import Button from "../components/Button.jsx";

const Login = () => {
const { login } = useAuth();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setIsSubmitting(true);

```
try {
  await login(email, password);
} catch (err) {
  const message =
    err.response?.data?.message ||
    "Something went wrong. Please try again.";
  setError(message);
} finally {
  setIsSubmitting(false);
}
```

};

return ( <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-10"> <div className="w-full max-w-md">

```
    {/* Back to Home */}
    <Link
      to="/"
      className="inline-flex items-center gap-2 mb-5 text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-200"
    >
      <span className="text-lg">←</span>
      Back to Home
    </Link>

    {/* Login Card */}
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xl p-8 sm:p-10">

      {/* Logo / Brand */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-sm">EW</span>
        </div>

        <div>
          <h1 className="text-lg font-bold text-gray-900">
            Editorial Workflow
          </h1>
          <p className="text-xs text-gray-500">
            Content management platform
          </p>
        </div>
      </div>

      {/* Heading */}
      <div className="mb-7">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to continue to your workspace.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="editor@example.com"
        />

        <FormInput
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Register Link */}
      <div className="mt-7 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition duration-200"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>

    <p className="mt-5 text-center text-xs text-gray-400">
      Secure access to your editorial workspace
    </p>
  </div>
</div>


);
};

export default Login;
