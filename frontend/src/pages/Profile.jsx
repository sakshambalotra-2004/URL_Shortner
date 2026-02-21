import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import api from "../utils/api";

export default function Profile({ isDark, onThemeToggle }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    joinedDate: "",
    totalLinks: 0,
    totalClicks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch user profile from API
      const res = await api.get("/dashboard/profile");
      
      setUser({
        name: res.data.name || "User",
        email: res.data.email || "",
        username: res.data.username || res.data.email?.split('@')[0] || "user",
        joinedDate: new Date(res.data.createdAt).toLocaleDateString(),
        totalLinks: res.data.totalLinks || 0,
        totalClicks: res.data.totalClicks || 0,
      });

      setFormData({
        name: res.data.name || "",
        email: res.data.email || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setMessage({ type: "error", text: "Failed to load profile data" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      await api.put("/dashboard/profile", { 
        name: formData.name, 
        email: formData.email 
      });
      
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setEditing(false);
      
      // Update local state
      setUser({ ...user, name: formData.name, email: formData.email });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Failed to update profile" });
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match!" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    try {
      await api.put("/dashboard/password", { 
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword 
      });
      
      setMessage({ type: "success", text: "Password changed successfully!" });
      setFormData({ ...formData, currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.error || "Failed to change password" });
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-500 ${
        isDark ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
      }`}>
        <Navbar isDark={isDark} onThemeToggle={onThemeToggle} />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
    }`}>
      <Navbar isDark={isDark} onThemeToggle={onThemeToggle} />

      <div className="max-w-5xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="animate-slide-down">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            Profile Settings
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Manage your account information and preferences
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`p-4 rounded-lg border-l-4 animate-slide-in ${
            message.type === "success"
              ? isDark
                ? "bg-green-900/20 border-green-500 text-green-400"
                : "bg-green-50 border-green-500 text-green-700"
              : isDark
                ? "bg-red-900/20 border-red-500 text-red-400"
                : "bg-red-50 border-red-500 text-red-700"
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{message.type === "success" ? "✅" : "⚠️"}</span>
              <p className="font-medium">{message.text}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className={`rounded-2xl shadow-lg border p-6 text-center animate-scale-in ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}>
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>

              <h2 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                {user.name || user.username}
              </h2>
              <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                @{user.username}
              </p>

              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                isDark ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
              }`}>
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Active Account
              </div>

              <div className={`mt-6 pt-6 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center justify-center gap-2 text-sm mb-2">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>📅</span>
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Joined {user.joinedDate}
                  </span>
                </div>
                <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                  Member since creation
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className={`rounded-2xl shadow-lg border p-6 animate-scale-in ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`} style={{ animationDelay: "100ms" }}>
              <h3 className={`font-semibold mb-4 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                <span>📊</span> Your Stats
              </h3>
              
              <div className="space-y-4">
                <div className={`flex justify-between items-center p-3 rounded-lg ${
                  isDark ? "bg-gray-700/50" : "bg-gray-50"
                }`}>
                  <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Total Links
                  </span>
                  <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {user.totalLinks}
                  </span>
                </div>
                
                <div className={`flex justify-between items-center p-3 rounded-lg ${
                  isDark ? "bg-gray-700/50" : "bg-gray-50"
                }`}>
                  <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    Total Clicks
                  </span>
                  <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {user.totalClicks}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className={`rounded-2xl shadow-lg border p-6 animate-fade-in ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`} style={{ animationDelay: "200ms" }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-semibold flex items-center gap-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}>
                  <span>👤</span> Personal Information
                </h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      editing
                        ? isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        : isDark
                          ? "bg-gray-900/50 border-gray-700 text-gray-400"
                          : "bg-gray-100 border-gray-200 text-gray-600"
                    } focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!editing}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      editing
                        ? isDark
                          ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                        : isDark
                          ? "bg-gray-900/50 border-gray-700 text-gray-400"
                          : "bg-gray-100 border-gray-200 text-gray-600"
                    } focus:outline-none`}
                  />
                </div>

                {editing && (
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          ...formData,
                          name: user.name,
                          email: user.email,
                        });
                      }}
                      className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${
                        isDark
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password */}
            <div className={`rounded-2xl shadow-lg border p-6 animate-fade-in ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`} style={{ animationDelay: "300ms" }}>
              <h3 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                <span>🔒</span> Change Password
              </h3>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                        : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                    } focus:outline-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all"
                >
                  Update Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
