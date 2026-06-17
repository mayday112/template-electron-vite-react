import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { checkUser, logout } from "./utils/checkLogin";

import { validatePostForm } from "./utils/validation";

export default function Post() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({
    id: "",
    title: "",
    content: "",
  });
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const id = e.target.id.value;
    const title = e.target.title.value;
    const content = e.target.content.value;

    const validationError = validatePostForm(title, content);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (id) {
      window.api
        .updatePost({ id, title, content })
        .then(() => {
          window.api.getPosts().then((posts) => {
            setPosts(posts);
            setForm({ id: "", title: "", content: "" });
          });
        })
        .catch((e) => setError(e.message));
    } else {
      window.api
        .createPost({ title, content })
        .then(() => {
          window.api.getPosts().then((posts) => {
            setPosts(posts);
            setForm({ id: "", title: "", content: "" });
          });
        })
        .catch((e) => setError(e.message));
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const user = await checkUser();
      if (!user) {
        navigate("/");
      }
      setUser(user);
    };
    fetchUser();

    window.api.getPosts().then((posts) => {
      setPosts(posts);
    });
  }, []);

  return (
    <div className="min-h-screen bg-neo-yellow p-8">
      <div className="max-w-4xl mx-auto">
        <nav className="flex justify-between items-center bg-white neo-border p-4 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex gap-4 items-center">
            <span className="font-black text-2xl uppercase tracking-widest">
              PostMaster
            </span>
            {user?.role === "admin" && (
              <Link
                to="/user"
                className="bg-neo-cyan px-4 py-2 neo-button text-sm"
              >
                Manage Users
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-sm tracking-tight">{user?.name}</p>
              <p className="text-xs uppercase font-black opacity-60">
                {user?.role}
              </p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-neo-pink px-6 py-2 neo-button"
            >
              Exit
            </button>
          </div>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {user?.role === "admin" && (
            <div className="md:col-span-1">
              <div className="neo-card bg-white sticky top-8">
                <h2 className="text-2xl font-black mb-6 uppercase">
                  {form.id ? "Edit Post" : "New Post"}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input type="hidden" name="id" value={form.id} />
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm uppercase">Title</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Catchy title..."
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      className="neo-input"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-sm uppercase">
                      Content
                    </label>
                    <textarea
                      name="content"
                      placeholder="Tell your story..."
                      value={form.content}
                      onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                      }
                      className="neo-input h-32 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="neo-button bg-neo-green py-3"
                  >
                    {form.id ? "Apply Changes" : "Post It!"}
                  </button>
                  {error && (
                    <p className="text-white bg-black p-2 neo-border text-xs font-bold">
                      {error}
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}

          <div
            className={
              user?.role === "admin" ? "md:col-span-2" : "md:col-span-3"
            }
          >
            <h1 className="text-5xl font-black mb-8 uppercase tracking-tighter">
              Latest Posts
            </h1>
            <div className="grid gap-6">
              {posts.map((post) => (
                <div key={post.id} className="neo-card flex flex-col gap-4">
                  <div>
                    <h3 className="text-2xl font-black">{post.title}</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                  {user?.role === "admin" && (
                    <div className="flex gap-4 mt-2 border-t-2 border-black pt-4">
                      <button
                        onClick={() => setForm(post)}
                        className="bg-neo-cyan px-4 py-2 neo-button text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Burn this post?")) {
                            window.api
                              .deletePost({ id: post.id })
                              .then(() =>
                                window.api
                                  .getPosts()
                                  .then((posts) => setPosts(posts)),
                              );
                          }
                        }}
                        className="bg-red-400 px-4 py-2 neo-button text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {posts.length === 0 && (
                <div className="neo-card bg-neo-cyan/20 border-dashed">
                  <p className="italic font-bold">No posts found yet...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
