import { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import UrlForm from "../components/UrlForm";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  // Save theme preference
  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const fetchUrls = async () => {
    try {
      const res = await api.get("/url/my-urls");
      setUrls(res.data);
      setError(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to load URLs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    fetchUrls();

    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      fetchUrls();
    }, 5000);

    // Refresh when user returns to tab
    const onFocus = () => {
      fetchUrls();
    };

    window.addEventListener("focus", onFocus);

    // Cleanup (VERY IMPORTANT)
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);
  const mostClicked = urls.length ? Math.max(...urls.map((u) => u.clicks)) : 0;
  const avgClicks = urls.length ? (totalClicks / totalLinks).toFixed(1) : 0;

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        isDark 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-slate-50 to-slate-100"
      }`}>
        <Navbar isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center animate-fade-in">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Loading dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        isDark 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-slate-50 to-slate-100"
      }`}>
        <Navbar isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className={`rounded-xl p-6 max-w-md animate-shake ${
            isDark 
              ? "bg-red-900/20 border border-red-500/30" 
              : "bg-red-50 border border-red-200"
          }`}>
            <div className="text-red-500 text-4xl mb-3 animate-bounce">⚠️</div>
            <p className={`font-medium ${isDark ? "text-red-400" : "text-red-700"}`}>
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-slate-50 to-slate-100"
    }`}>
      <Navbar isDark={isDark} onThemeToggle={() => setIsDark(!isDark)} />

      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        {/* HEADER */}
        <div className="pt-4 animate-slide-down">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            Dashboard
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Monitor and manage your shortened URLs
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Links"
            value={totalLinks}
            icon="🔗"
            gradient="from-blue-500 to-blue-600"
            lightBg="bg-blue-50"
            iconColor="text-blue-600"
            isDark={isDark}
            delay="0"
          />
          <StatCard
            title="Total Clicks"
            value={totalClicks}
            icon="👆"
            gradient="from-green-500 to-green-600"
            lightBg="bg-green-50"
            iconColor="text-green-600"
            isDark={isDark}
            delay="100"
          />
          <StatCard
            title="Most Clicked"
            value={mostClicked}
            icon="🔥"
            gradient="from-orange-500 to-orange-600"
            lightBg="bg-orange-50"
            iconColor="text-orange-600"
            isDark={isDark}
            delay="200"
          />
          <StatCard
            title="Avg. Clicks"
            value={avgClicks}
            icon="📊"
            gradient="from-purple-500 to-purple-600"
            lightBg="bg-purple-50"
            iconColor="text-purple-600"
            isDark={isDark}
            delay="300"
          />
        </div>

        {/* CREATE URL SECTION */}
        <div className={`rounded-2xl shadow-lg border overflow-hidden animate-slide-up transition-colors duration-500 ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`} style={{ animationDelay: "400ms" }}>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="animate-pulse">✨</span> Create Short URL
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Shorten your long URLs in seconds
            </p>
          </div>
          <div className="p-6">
            <UrlForm onCreated={fetchUrls} />
          </div>
        </div>

        {/* URL TABLE */}
        <div className={`rounded-2xl shadow-lg border overflow-hidden animate-fade-in transition-colors duration-500 ${
          isDark 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`} style={{ animationDelay: "500ms" }}>
          <div className={`p-6 border-b transition-colors duration-500 ${
            isDark 
              ? "border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900" 
              : "border-gray-200 bg-gradient-to-r from-gray-50 to-white"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`text-xl font-semibold flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  <span>📋</span> Your URLs
                </h2>
                <p className={`text-sm mt-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}>
                  {urls.length} {urls.length === 1 ? "link" : "links"} created
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b transition-colors duration-500 ${
                  isDark 
                    ? "bg-gray-900/50 border-gray-700" 
                    : "bg-gray-50 border-gray-200"
                }`}>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Original URL
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Short Link
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Clicks
                  </th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Expires
                  </th>
                </tr>
              </thead>

              <tbody className={`divide-y transition-colors duration-500 ${
                isDark ? "divide-gray-700" : "divide-gray-200"
              }`}>
                {urls.map((url, index) => (
                  <tr
                    key={url._id}
                    className={`transition-all duration-300 animate-fade-in-row ${
                      isDark 
                        ? "hover:bg-gray-700/50" 
                        : "hover:bg-gray-50"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={isDark ? "text-gray-500" : "text-gray-400"}>
                          🌐
                        </span>
                        <span className={`text-sm truncate max-w-xs lg:max-w-md ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {url.originalUrl}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <a
                        href={`http://localhost:5000/api/url/${url.shortId}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-2 font-medium text-sm px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 ${
                          isDark
                            ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
                            : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                        }`}
                      >
                        <span>{url.shortId}</span>
                        <span className="text-xs">↗</span>
                      </a>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-colors duration-500 ${
                        isDark
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        <span>👆</span>
                        {url.clicks}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        {url.expiresAt ? (
                          <span className="flex items-center gap-1.5">
                            <span>⏰</span>
                            {new Date(url.expiresAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className={`font-medium ${
                            isDark ? "text-green-400" : "text-green-600"
                          }`}>
                            ∞ Never
                          </span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}

                {urls.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 animate-bounce-slow">
                        <div className="text-6xl opacity-20">🔗</div>
                        <p className={`font-medium ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}>
                          No URLs created yet
                        </p>
                        <p className={`text-sm ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}>
                          Create your first shortened URL above
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Stat Card Component ---------- */
function StatCard({ title, value, icon, gradient, lightBg, iconColor, isDark, delay }) {
  return (
    <div 
      className={`rounded-xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 group animate-scale-in ${
        isDark 
          ? "bg-gray-800 border-gray-700 hover:border-gray-600" 
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium mb-2 ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            {title}
          </p>
          <p className={`text-3xl font-bold mb-1 transition-colors duration-500 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            {value}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
            isDark 
              ? "bg-gray-700/50" 
              : lightBg
          } ${iconColor}`}
        >
          {icon}
        </div>
      </div>
      <div className={`h-1 bg-gradient-to-r ${gradient} rounded-full mt-4 opacity-75 group-hover:opacity-100 transition-opacity duration-300`}></div>
    </div>
  );
}

/* ---------- Custom Animations CSS ---------- */
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  @keyframes bounceSlow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-slide-down {
    animation: slideDown 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-slide-up {
    animation: slideUp 0.6s ease-out forwards;
    opacity: 0;
  }

  .animate-scale-in {
    animation: scaleIn 0.5s ease-out forwards;
    opacity: 0;
  }

  .animate-shake {
    animation: shake 0.5s ease-in-out;
  }

  .animate-bounce-slow {
    animation: bounceSlow 2s ease-in-out infinite;
  }

  .animate-fade-in-row {
    animation: fadeIn 0.4s ease-out forwards;
    opacity: 0;
  }
`;
document.head.appendChild(style);