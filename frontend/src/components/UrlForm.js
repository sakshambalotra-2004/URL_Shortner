import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import api from "../utils/api";

export default function UrlForm({ onCreated, isDark }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState(10);
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setShowSuccess(false);
    setLoading(true);

    try {
      const res = await api.post("/url/shorten", {
        originalUrl,
        expiryMinutes,
      });

      setShortUrl(res.data.shortUrl);
      setShowSuccess(true);
      
      // Call parent callback to refresh list
      if (onCreated) {
        setTimeout(() => onCreated(), 500);
      }

      // Reset form after success
      setTimeout(() => {
        setOriginalUrl("");
        setExpiryMinutes(10);
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const downloadQR = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `qr-code-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className={`text-sm font-medium flex items-center gap-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            <span>🔗</span> Original URL
          </label>
          <div className="relative group">
            <input
              type="url"
              placeholder="https://example.com/very-long-url..."
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:bg-gray-600"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:bg-gray-50"
              }`}
            />
            <div className={`absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10 blur-xl`}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className={`text-sm font-medium flex items-center gap-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              <span>⏱️</span> Expiry (minutes)
            </label>
            <input
              type="number"
              min="1"
              value={expiryMinutes}
              onChange={(e) => setExpiryMinutes(e.target.value)}
              placeholder="10"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium flex items-center gap-2 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}>
              <span>🎯</span> Quick Select
            </label>
            <select
              value={expiryMinutes}
              onChange={(e) => setExpiryMinutes(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="5">5 min</option>
              <option value="10">10 min</option>
              <option value="30">30 min</option>
              <option value="60">1 hour</option>
              <option value="1440">1 day</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl"
          }`}
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Magic...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Generate Short URL</span>
            </>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className={`p-4 rounded-lg border-l-4 border-red-500 animate-shake ${
          isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-700"
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {showSuccess && (
        <div className={`p-4 rounded-lg border-l-4 border-green-500 animate-slide-in ${
          isDark ? "bg-green-900/20 text-green-400" : "bg-green-50 text-green-700"
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce">✅</span>
            <p className="font-medium">URL shortened successfully!</p>
          </div>
        </div>
      )}

      {/* QR Code Result Section */}
      {shortUrl && (
        <div className={`p-6 rounded-xl border-2 space-y-4 animate-fade-scale-in ${
          isDark
            ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200"
        }`}>
          {/* Short URL Display */}
          <div className="space-y-2">
            <p className={`text-sm font-medium ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}>
              🎉 Your shortened URL:
            </p>
            <div className={`p-3 rounded-lg flex items-center gap-2 ${
              isDark ? "bg-gray-700/50" : "bg-white/80"
            }`}>
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className={`flex-1 text-sm font-mono break-all hover:underline transition-colors ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {shortUrl}
              </a>
              <button
                onClick={copyToClipboard}
                className={`px-3 py-1.5 rounded-md transition-all duration-300 flex items-center gap-1.5 text-sm font-medium ${
                  copied
                    ? isDark
                      ? "bg-green-600 text-white"
                      : "bg-green-500 text-white"
                    : isDark
                    ? "bg-gray-600 hover:bg-gray-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {copied ? (
                  <>
                    <span>✓</span>
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-4 rounded-xl shadow-lg ${
              isDark ? "bg-white" : "bg-white"
            }`}>
              <QRCodeCanvas 
                value={shortUrl} 
                size={180}
                level="H"
                includeMargin={true}
                className="animate-fade-in"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } shadow-md hover:shadow-lg`}
              >
                <span>📋</span>
                <span>Copy Link</span>
              </button>

              <button
                onClick={downloadQR}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                  isDark
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                } shadow-md hover:shadow-lg`}
              >
                <span>⬇️</span>
                <span>Download QR</span>
              </button>

              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 ${
                  isDark
                    ? "bg-purple-600 hover:bg-purple-500 text-white"
                    : "bg-purple-500 hover:bg-purple-600 text-white"
                } shadow-md hover:shadow-lg`}
              >
                <span>🚀</span>
                <span>Test Link</span>
              </a>
            </div>

            {/* Expiry Info */}
            <div className={`text-center text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
              isDark
                ? "bg-gray-700 text-gray-400"
                : "bg-white/60 text-gray-600"
            }`}>
              <span>⏰</span>
              <span>Expires in {expiryMinutes} minutes</span>
            </div>
          </div>
        </div>
      )}

      {/* Inline Styles for Animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeScaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }

        .animate-fade-scale-in {
          animation: fadeScaleIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}