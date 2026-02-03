import { useEffect, useState } from "react";
import api from "../utils/api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await api.get("/url/my-urls");
        setUrls(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="p-6 space-y-6">
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
            <p className="text-2xl font-bold">
              {urls[0]?.clicks || 0}
            </p>
          </div>
        </div>

        {/* URL TABLE */}
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Original URL</th>
                <th className="p-3">Short URL</th>
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
