import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { checkUser, logout } from "./utils/checkLogin";
import { validateUserForm } from "./utils/validation";

export default function User() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const fetchUsers = () => {
    window.api.getUsers().then((data) => setUsers(data));
  };

  useEffect(() => {
    const checkAuth = async () => {
      const user = await checkUser();
      if (!user || user.role !== "admin") {
        navigate("/post"); // Only admins can access this page
      }
      setCurrentUser(user);
    };
    checkAuth();
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateUserForm(
      form.name,
      form.email,
      form.password,
      !!form.id,
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      if (form.id) {
        await window.api.updateUser(form);
      } else {
        await window.api.createUser(form);
      }
      setForm({ id: "", name: "", email: "", password: "", role: "user" });
      fetchUsers();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = (user) => {
    setForm({ ...user, password: "" }); // Don't show old hash password
    setError("");
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await window.api.deleteUser({ id });
      fetchUsers();
    }
  };

  return (
    <div className="min-h-screen bg-neo-pink p-8">
      <div className="max-w-6xl mx-auto">
        <nav className="flex justify-between items-center bg-white neo-border p-4 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex gap-4 items-center">
            <Link
              to="/post"
              className="bg-neo-yellow px-4 py-2 neo-button text-sm"
            >
              ← Back to Posts
            </Link>
            <span className="font-black text-2xl uppercase tracking-widest ml-4">
              UserManager
            </span>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="bg-neo-cyan px-6 py-2 neo-button"
          >
            Exit
          </button>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1">
            <div className="neo-card bg-white sticky top-8">
              <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">
                {form.id ? "Edit Member" : "New Member"}
              </h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-black uppercase text-sm">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="neo-input focus:bg-neo-yellow outline-none"
                    placeholder="Full name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-black uppercase text-sm">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="neo-input focus:bg-neo-yellow outline-none"
                    placeholder="email@example.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-black uppercase text-sm">
                    Password {form.id && "(Optional)"}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="neo-input focus:bg-neo-yellow outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-black uppercase text-sm">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="neo-input focus:bg-neo-yellow outline-none appearance-none"
                  >
                    <option value="user">USER</option>
                    <option value="admin">ADMIN</option>
                  </select>
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  <button
                    type="submit"
                    className="neo-button bg-neo-green py-4 text-lg"
                  >
                    {form.id ? "Update User" : "Create User"}
                  </button>
                  {form.id && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          id: "",
                          name: "",
                          email: "",
                          password: "",
                          role: "user",
                        })
                      }
                      className="neo-button bg-white py-2"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
                {error && (
                  <div className="bg-red-400 neo-border p-3 font-bold text-sm">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h1 className="text-5xl font-black mb-8 uppercase tracking-tighter text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              Active Members
            </h1>
            <div className="neo-card bg-white overflow-hidden p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neo-cyan border-b-4 border-black">
                    <th className="p-4 font-black uppercase">Name</th>
                    <th className="p-4 font-black uppercase">Email</th>
                    <th className="p-4 font-black uppercase">Role</th>
                    <th className="p-4 font-black uppercase text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b-2 border-black hover:bg-gray-50 flex-none"
                    >
                      <td className="p-4 font-bold">{u.name}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 neo-border text-xs font-black uppercase ${u.role === "admin" ? "bg-neo-yellow" : "bg-neo-green"}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(u)}
                            className="bg-white px-3 py-1 neo-button text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="bg-red-400 px-3 py-1 neo-button text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
