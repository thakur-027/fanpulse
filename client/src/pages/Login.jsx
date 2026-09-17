import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "volunteer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate("/ops");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-ink)] px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-7">
        <Link to="/" className="text-xs text-neutral-400 hover:text-neutral-600">
          ← Back to fan site
        </Link>
        <h1 className="font-display text-2xl tracking-wide mt-3 mb-1">
          Ops<span className="text-[var(--color-turf)]">Control</span>
        </h1>
        <p className="text-xs text-neutral-500 mb-6">Volunteer & organizer access</p>

        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <>
              <input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-black/10 outline-none focus:border-[var(--color-turf)]"
                required
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full text-sm px-3 py-2.5 rounded-lg border border-black/10"
              >
                <option value="volunteer">Volunteer</option>
                <option value="organizer">Organizer</option>
              </select>
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full text-sm px-3 py-2.5 rounded-lg border border-black/10 outline-none focus:border-[var(--color-turf)]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full text-sm px-3 py-2.5 rounded-lg border border-black/10 outline-none focus:border-[var(--color-turf)]"
            required
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[var(--color-ink)] text-white text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-xs text-neutral-500 hover:text-[var(--color-ink)] mt-4"
        >
          {mode === "login" ? "New staff member? Register" : "Already registered? Log in"}
        </button>
      </div>
    </div>
  );
}
