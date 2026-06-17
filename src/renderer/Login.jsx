import { useEffect, useState } from "react";
import { checkUserLogin, checkUser } from "./utils/checkLogin";
import { useNavigate } from "react-router";
import { validateLoginForm } from "./utils/validation";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateLoginForm(email, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    console.log(email, password);
    const res = await checkUserLogin(email, password);
    if (res) {
      console.log("Login success");
      navigate("/post");
    } else {
      console.log("Login failed");
      setError("Login failed: Incorrect email or password");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await checkUser();
      console.log("user: ", user);
      if (user) {
        navigate("/post");
      }
    };
    fetchUser();
  }, []);
  return (
    <div className="min-h-screen bg-neo-cyan flex items-center justify-center p-4">
      <div className="neo-card w-full max-w-md bg-white">
        <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter">
          Login
        </h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-bold text-lg">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="neo-input outline-none focus:bg-neo-yellow"
              placeholder="user@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-bold text-lg">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neo-input outline-none focus:bg-neo-yellow"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="neo-button bg-neo-pink py-4 text-xl mt-4"
          >
            Enter System
          </button>
          {error && (
            <div className="bg-red-400 neo-border p-3 font-bold shadow-sm">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
