import { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";
import UrlForm from "../components/UrlForm";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const mostClicked = urls.length
    ? Math.max(...urls.map((u) => u.clicks))
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="p-6 max-w-7xl mx-auto space-y-10">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Links"
            value={totalLinks}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Total Clicks"
            value={totalClicks}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="Most Clicked"
            value={mostClicked}
            color="bg-purple-100 text-purple-600"
          />
        </div>

        {/* CREATE URL */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">
            Create Short URL
          </h2>
          <UrlForm onCreated={fetchUrls} />
        </div>

        {/* URL TABLE */}
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="p-4 border-b font-semibold text-lg">
            Your URLs
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-4">Original URL</th>
                  <th className="p-4">Short</th>
                  <th className="p-4">Clicks</th>
                  <th className="p-4">Expires</th>
                </tr>
              </thead>

              <tbody>
                {urls.map((url, i) => (
                  <tr
                    key={url._id}
                    className={`border-t hover:bg-gray-50 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                    }`}
                  >
                    <td className="p-4 truncate max-w-xs text-gray-700">
                      {url.originalUrl}
                    </td>

                    <td className="p-4">
                      <a
                        href={`http://localhost:5000/api/url/${url.shortId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {url.shortId}
                      </a>
                    </td>

                    <td className="p-4 font-medium">
                      {url.clicks}
                    </td>

                    <td className="p-4 text-gray-600">
                      {url.expiresAt
                        ? new Date(url.expiresAt).toLocaleString()
                        : "Never"}
                    </td>
                  </tr>
                ))}

                {urls.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="p-6 text-center text-gray-500"
                    >
                      No URLs created yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Stat Card Component ---------- */
function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${color}`}
      >
        📊
      </div>
      <h3 className="text-gray-600">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
