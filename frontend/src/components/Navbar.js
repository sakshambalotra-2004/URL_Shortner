import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Navbar({ isDark, onThemeToggle }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userName, setUserName] = useState("");

  // Get user info from token or localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode JWT to get user info (basic decode, not verified)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.email?.split('@')[0] || payload.username || "User");
      } catch (err) {
        setUserName("User");
      }
    }
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? isDark 
          ? "bg-gray-900/95 backdrop-blur-lg shadow-xl border-b border-gray-800" 
          : "bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200"
        : isDark
          ? "bg-gray-900/80 backdrop-blur-md"
          : "bg-white/80 backdrop-blur-md"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              {/* Animated Logo Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
              
              {/* Logo Icon */}
              <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl transition-transform duration-300 group-hover:scale-110 ${
                isDark 
                  ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white" 
                  : "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
              } shadow-lg`}>
                🔗
              </div>
            </div>
            
            <div className="flex flex-col">
              <h1 className={`text-lg font-bold transition-colors ${
                isDark ? "text-white" : "text-gray-900"
              }`}>
                LinkSnap
              </h1>
              <p className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                URL Management
              </p>
            </div>
          </Link>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Stats Quick View */}
            <div className={`hidden md:flex items-center gap-4 px-4 py-2 rounded-lg transition-colors ${
              isDark 
                ? "bg-gray-800/50 border border-gray-700" 
                : "bg-gray-100/50 border border-gray-200"
            }`}>
              <div className="text-center">
                <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  Status
                </p>
                <p className="text-sm font-semibold text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Active
                </p>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className={`relative p-2.5 rounded-lg transition-all duration-300 hover:scale-110 group ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
              aria-label="Toggle theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <div className="relative w-5 h-5">
                {/* Sun Icon */}
                <span className={`absolute inset-0 transition-all duration-500 ${
                  isDark 
                    ? "opacity-0 rotate-180 scale-0" 
                    : "opacity-100 rotate-0 scale-100"
                }`}>
                  ☀️
                </span>
                {/* Moon Icon */}
                <span className={`absolute inset-0 transition-all duration-500 ${
                  isDark 
                    ? "opacity-100 rotate-0 scale-100" 
                    : "opacity-0 -rotate-180 scale-0"
                }`}>
                  🌙
                </span>
              </div>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                } ${showUserMenu ? 'ring-2 ring-blue-500' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                  isDark
                    ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white"
                    : "bg-gradient-to-br from-blue-400 to-purple-400 text-white"
                } shadow-md`}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                
                {/* Username (hidden on mobile) */}
                <span className="hidden sm:block font-medium text-sm">
                  {userName}
                </span>
                
                {/* Dropdown Arrow */}
                <svg 
                  className={`w-4 h-4 transition-transform duration-300 ${
                    showUserMenu ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowUserMenu(false)}
                  ></div>
                  
                  {/* Menu */}
                  <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border overflow-hidden z-20 animate-dropdown ${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}>
                    {/* User Info */}
                    <div className={`px-4 py-3 border-b ${
                      isDark ? "border-gray-700 bg-gray-900/50" : "border-gray-200 bg-gray-50"
                    }`}>
                      <p className={`font-semibold ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}>
                        {userName}
                      </p>
                      <p className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}>
                        URL Manager
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/profile');
                        }}
                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${
                          isDark
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span className="text-lg">👤</span>
                        <span className="text-sm font-medium">Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/settings');
                        }}
                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${
                          isDark
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span className="text-lg">⚙️</span>
                        <span className="text-sm font-medium">Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/help');
                        }}
                        className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors ${
                          isDark
                            ? "hover:bg-gray-700 text-gray-300"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span className="text-lg">❓</span>
                        <span className="text-sm font-medium">Help & Support</span>
                      </button>

                      {/* Divider */}
                      <div className={`my-2 border-t ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      }`}></div>

                      {/* Logout Button */}
                      <button
                        onClick={logout}
                        className="w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors text-red-500 hover:bg-red-500/10 font-medium"
                      >
                        <span className="text-lg">🚪</span>
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inline Styles for Animations */}
      <style jsx>{`
        @keyframes dropdown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-dropdown {
          animation: dropdown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}