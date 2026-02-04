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
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Failed to load URLs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, u) => sum + u.clicks, 0);
  const mostClicked = urls.length
    ? Math.max(...urls.map((u) => u.clicks))
    : 0;

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <Navbar />

      <div className="p-6 space-y-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded">
            <h3>Total Links</h3>
            <p className="text-3xl font-bold">{totalLinks}</p>
          </div>

          <div className="bg-green-500 text-white p-4 rounded">
            <h3>Total Clicks</h3>
            <p className="text-3xl font-bold">{totalClicks}</p>
          </div>

          <div className="bg-purple-500 text-white p-4 rounded">
            <h3>Most Clicked</h3>
            <p className="text-3xl font-bold">{mostClicked}</p>
          </div>
        </div>

        {/* CREATE URL */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">
            Create Short URL
          </h2>

          <UrlForm onCreated={fetchUrls} />
        </div>

        {/* URL TABLE */}
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Original URL</th>
                <th className="p-3">Short</th>
                <th className="p-3">Clicks</th>
                <th className="p-3">Expires</th>
              </tr>
            </thead>

            <tbody>
              {urls.map((url) => (
                <tr key={url._id} className="border-t">
                  <td className="p-3 truncate max-w-xs">
                    {url.originalUrl}
                  </td>

                  <td className="p-3 text-blue-600">
                    <a
                      href={`http://localhost:5000/api/url/${url.shortId}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {url.shortId}
                    </a>
                  </td>

                  <td className="p-3">{url.clicks}</td>

                  <td className="p-3">
                    {url.expiresAt
                      ? new Date(url.expiresAt).toLocaleString()
                      : "Never"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
