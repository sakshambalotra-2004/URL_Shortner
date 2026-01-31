import { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

export default function UrlForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/url/shorten",
        { originalUrl }
      );

      setShortUrl(response.data.shortUrl);
    } catch (err) {
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          URL Shortener
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            placeholder="Enter long URL..."
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Shortening..." : "Shorten URL"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        {/* Result */}
        {shortUrl && (
          <div className="mt-4 bg-green-100 p-3 rounded">
            <p className="text-sm text-green-700 mb-1">Short URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-medium break-all hover:underline"
            >
              {shortUrl}
            </a>
            <div className="flex justify-center mt-4">
              <QRCodeCanvas
                value = {shortUrl}
                size = {160}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
              />
            </div>
            <p className="text-xs text-gray-500">
              Scan QR to open link
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
