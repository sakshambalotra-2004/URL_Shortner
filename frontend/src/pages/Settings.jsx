import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Settings({ isDark, onThemeToggle }) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    clickNotifications: false,
    expiryReminders: true,
    weeklyReport: false,
    autoDelete: true,
    defaultExpiry: 60,
    qrCodeSize: "medium",
    analyticsTracking: true,
  });
  
  const [saved, setSaved] = useState(false);

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    // Here you would save settings to backend
    // await api.put("/user/settings", settings);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings({
      emailNotifications: true,
      clickNotifications: false,
      expiryReminders: true,
      weeklyReport: false,
      autoDelete: true,
      defaultExpiry: 60,
      qrCodeSize: "medium",
      analyticsTracking: true,
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
    }`}>
      <Navbar isDark={isDark} onThemeToggle={onThemeToggle} />

      <div className="max-w-4xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="animate-slide-down">
          <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            Settings
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Customize your LinkSnap experience
          </p>
        </div>

        {/* Save Success Message */}
        {saved && (
          <div className={`p-4 rounded-lg border-l-4 animate-slide-in ${
            isDark
              ? "bg-green-900/20 border-green-500 text-green-400"
              : "bg-green-50 border-green-500 text-green-700"
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">✅</span>
              <p className="font-medium">Settings saved successfully!</p>
            </div>
          </div>
        )}

        {/* Appearance Section */}
        <div className={`rounded-2xl shadow-lg border p-6 animate-scale-in ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}>
          <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            <span>🎨</span> Appearance
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  Dark Mode
                </p>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Toggle between light and dark theme
                </p>
              </div>
              <button
                onClick={onThemeToggle}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                  isDark ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
                  isDark ? "translate-x-7" : "translate-x-0"
                }`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className={`rounded-2xl shadow-lg border p-6 animate-scale-in ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`} style={{ animationDelay: "100ms" }}>
          <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            <span>🔔</span> Notifications
          </h2>

          <div className="space-y-4">
            <SettingToggle
              title="Email Notifications"
              description="Receive email updates about your links"
              checked={settings.emailNotifications}
              onChange={() => handleToggle("emailNotifications")}
              isDark={isDark}
            />

            <SettingToggle
              title="Click Notifications"
              description="Get notified when someone clicks your link"
              checked={settings.clickNotifications}
              onChange={() => handleToggle("clickNotifications")}
              isDark={isDark}
            />

            <SettingToggle
              title="Expiry Reminders"
              description="Remind me before links expire"
              checked={settings.expiryReminders}
              onChange={() => handleToggle("expiryReminders")}
              isDark={isDark}
            />

            <SettingToggle
              title="Weekly Report"
              description="Send weekly analytics summary"
              checked={settings.weeklyReport}
              onChange={() => handleToggle("weeklyReport")}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Link Management Section */}
        <div className={`rounded-2xl shadow-lg border p-6 animate-scale-in ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`} style={{ animationDelay: "200ms" }}>
          <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            <span>🔗</span> Link Management
          </h2>

          <div className="space-y-6">
            <SettingToggle
              title="Auto-delete Expired Links"
              description="Automatically remove links after they expire"
              checked={settings.autoDelete}
              onChange={() => handleToggle("autoDelete")}
              isDark={isDark}
            />

            <div>
              <label className={`block font-medium mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                Default Expiry Time
              </label>
              <p className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Set the default expiration time for new links
              </p>
              <select
                value={settings.defaultExpiry}
                onChange={(e) => setSettings({ ...settings, defaultExpiry: parseInt(e.target.value) })}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="1440">1 day</option>
                <option value="10080">1 week</option>
              </select>
            </div>

            <div>
              <label className={`block font-medium mb-2 ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                QR Code Size
              </label>
              <p className={`text-sm mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Default size for generated QR codes
              </p>
              <div className="grid grid-cols-3 gap-3">
                {["small", "medium", "large"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSettings({ ...settings, qrCodeSize: size })}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      settings.qrCodeSize === size
                        ? "bg-blue-500 text-white shadow-lg"
                        : isDark
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                    }`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Security Section */}
        <div className={`rounded-2xl shadow-lg border p-6 animate-scale-in ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`} style={{ animationDelay: "300ms" }}>
          <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
            isDark ? "text-white" : "text-gray-900"
          }`}>
            <span>🔒</span> Privacy & Security
          </h2>

          <div className="space-y-4">
            <SettingToggle
              title="Analytics Tracking"
              description="Track detailed analytics for your links"
              checked={settings.analyticsTracking}
              onChange={() => handleToggle("analyticsTracking")}
              isDark={isDark}
            />

            <div className={`p-4 rounded-lg border-l-4 ${
              isDark
                ? "bg-yellow-900/20 border-yellow-500 text-yellow-400"
                : "bg-yellow-50 border-yellow-500 text-yellow-700"
            }`}>
              <div className="flex items-start gap-2">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-medium mb-1">Data Privacy Notice</p>
                  <p className="text-sm">
                    We respect your privacy. Your data is encrypted and never shared with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className={`rounded-2xl shadow-lg border-2 p-6 animate-scale-in ${
          isDark
            ? "bg-red-900/10 border-red-500/30"
            : "bg-red-50/50 border-red-200"
        }`} style={{ animationDelay: "400ms" }}>
          <h2 className={`text-xl font-semibold mb-6 flex items-center gap-2 text-red-500`}>
            <span>⚠️</span> Danger Zone
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  Delete All Links
                </p>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Permanently delete all your shortened links
                </p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors">
                Delete All
              </button>
            </div>

            <div className={`border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}></div>

            <div className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                  Delete Account
                </p>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Permanently delete your account and all data
                </p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <button
            onClick={handleSave}
            className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            💾 Save Settings
          </button>
          <button
            onClick={handleReset}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
          >
            ↺ Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
}

// Toggle Component
function SettingToggle({ title, description, checked, onChange, isDark }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
          {title}
        </p>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
          checked ? "bg-blue-600" : isDark ? "bg-gray-700" : "bg-gray-300"
        }`}
      >
        <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform duration-300 ${
          checked ? "translate-x-7" : "translate-x-0"
        }`}></div>
      </button>
    </div>
  );
}
