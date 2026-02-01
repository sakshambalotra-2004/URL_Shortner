import { useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

export default function UrlForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState(10);
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/url/shorten",
        { originalUrl, expiryMinutes }
      );

      setShortUrl(res.data.shortUrl);
    } catch (err) {
      setError("Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">
          URL Shortener + QR Expiry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            placeholder="Enter long URL"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="number"
            min="1"
            value={expiryMinutes}
            onChange={(e) => setExpiryMinutes(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder="Expiry in minutes"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded"
          >
            {loading ? "Creating..." : "Generate QR"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-600 text-sm">{error}</p>
        )}

        {shortUrl && (
          <div className="mt-6 text-center">
            <p className="text-sm mb-1">Short URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 break-all"
            >
              {shortUrl}
            </a>

            <div className="flex justify-center mt-4">
              <QRCodeCanvas value={shortUrl} size={160} />
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Expires in {expiryMinutes} minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
