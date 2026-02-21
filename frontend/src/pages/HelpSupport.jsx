import { useState } from "react";
import Navbar from "../components/Navbar";

export default function HelpSupport({ isDark, onThemeToggle }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { id: "all", name: "All Topics", icon: "📚" },
    { id: "getting-started", name: "Getting Started", icon: "🚀" },
    { id: "links", name: "Link Management", icon: "🔗" },
    { id: "qr", name: "QR Codes", icon: "📱" },
    { id: "account", name: "Account", icon: "👤" },
    { id: "billing", name: "Billing", icon: "💳" },
  ];

  const faqs = [
    {
      category: "getting-started",
      question: "How do I create my first short link?",
      answer: "Navigate to your dashboard and enter your long URL in the 'Create Short URL' section. Set your desired expiry time and click 'Generate Short URL'. Your shortened link will be created instantly along with a QR code!",
    },
    {
      category: "getting-started",
      question: "What is LinkSnap and how does it work?",
      answer: "LinkSnap is a powerful URL shortening service that creates compact, shareable links from long URLs. It also generates QR codes, tracks analytics, and allows you to set custom expiration times for your links.",
    },
    {
      category: "links",
      question: "How long do my shortened links last?",
      answer: "You can set custom expiration times for each link, ranging from 5 minutes to 1 week. Links are automatically removed after they expire if you have auto-delete enabled in settings.",
    },
    {
      category: "links",
      question: "Can I track how many people clicked my link?",
      answer: "Yes! Every link includes real-time click tracking. You can view the total clicks for each link in your dashboard. Upgrade to Pro for detailed analytics including location, device type, and referrer data.",
    },
    {
      category: "links",
      question: "Can I edit a link after creating it?",
      answer: "Currently, you cannot edit the destination URL of an existing short link for security reasons. However, you can create a new short link and delete the old one from your dashboard.",
    },
    {
      category: "qr",
      question: "How do I download my QR code?",
      answer: "After creating a short link, a QR code is automatically generated. Click the 'Download QR' button below the QR code to save it as a PNG image to your device.",
    },
    {
      category: "qr",
      question: "Can I customize the size of QR codes?",
      answer: "Yes! Go to Settings > Link Management and choose from Small (128px), Medium (180px), or Large (256px) QR code sizes. This will be the default size for all newly generated QR codes.",
    },
    {
      category: "account",
      question: "How do I change my password?",
      answer: "Go to Profile > Change Password section. Enter your current password, then your new password twice to confirm. Click 'Update Password' to save the changes.",
    },
    {
      category: "account",
      question: "How do I delete my account?",
      answer: "Visit Settings and scroll to the 'Danger Zone' section at the bottom. Click 'Delete Account' and confirm your decision. Note: This action is permanent and cannot be undone.",
    },
    {
      category: "billing",
      question: "Is LinkSnap free to use?",
      answer: "Yes! LinkSnap offers a free tier with all essential features including unlimited link creation, QR code generation, and basic analytics. Premium plans offer advanced features like custom domains and detailed analytics.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      (selectedCategory === "all" || faq.category === selectedCategory) &&
      (searchQuery === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would send the contact form to backend
    // await api.post("/support/contact", contactForm);
    
    setSubmitted(true);
    setContactForm({ name: "", email: "", subject: "", message: "" });
    
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" : "bg-gradient-to-br from-slate-50 to-slate-100"
    }`}>
      <Navbar isDark={isDark} onThemeToggle={onThemeToggle} />

      <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="text-center animate-slide-down">
          <h1 className={`text-4xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
            How can we help you?
          </h1>
          <p className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Find answers, get support, and learn more about LinkSnap
          </p>
        </div>

        {/* Search Bar */}
        <div className={`max-w-2xl mx-auto animate-scale-in`}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-6 py-4 pl-14 rounded-2xl border-2 text-lg transition-all shadow-lg focus:shadow-xl ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500"
              } focus:outline-none`}
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <QuickLink
            icon="📖"
            title="Documentation"
            description="Complete guides and tutorials"
            isDark={isDark}
          />
          <QuickLink
            icon="💬"
            title="Community"
            description="Join our Discord community"
            isDark={isDark}
          />
          <QuickLink
            icon="🎥"
            title="Video Tutorials"
            description="Watch step-by-step videos"
            isDark={isDark}
          />
        </div>

        {/* Categories */}
        <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-white hover:bg-gray-100 text-gray-700 shadow-sm"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
          <h2 className={`text-2xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}>
            Frequently Asked Questions
          </h2>
          
          {filteredFaqs.length === 0 ? (
            <div className={`text-center py-12 rounded-2xl ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}>
              <p className="text-4xl mb-3">🔍</p>
              <p className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                No results found for "{searchQuery}"
              </p>
              <p className={`text-sm mt-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                Try different keywords or browse by category
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isDark
                      ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <span className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                      {faq.question}
                    </span>
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        expandedFaq === index ? "rotate-180" : ""
                      } ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedFaq === index && (
                    <div className={`px-6 pb-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                      <p className={`mt-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact Form */}
        <div className={`rounded-2xl shadow-lg border p-8 animate-fade-in ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`} style={{ animationDelay: "400ms" }}>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            Still need help?
          </h2>
          <p className={`mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Send us a message and we'll get back to you as soon as possible
          </p>

          {submitted && (
            <div className={`p-4 rounded-lg border-l-4 mb-6 animate-slide-in ${
              isDark
                ? "bg-green-900/20 border-green-500 text-green-400"
                : "bg-green-50 border-green-500 text-green-700"
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">✅</span>
                <p className="font-medium">Message sent successfully! We'll respond within 24 hours.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:outline-none`}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                  } focus:outline-none`}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Subject
              </label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } focus:outline-none`}
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                Message
              </label>
              <textarea
                required
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all resize-none ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500"
                    : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                } focus:outline-none`}
                placeholder="Tell us more about your issue..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>✉️</span>
              <span>Send Message</span>
            </button>
          </form>
        </div>

        {/* Additional Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "500ms" }}>
          <SupportOption
            icon="📧"
            title="Email Support"
            description="support@linksnap.com"
            link="mailto:support@linksnap.com"
            isDark={isDark}
          />
          <SupportOption
            icon="💬"
            title="Live Chat"
            description="Available Mon-Fri, 9AM-5PM EST"
            link="#"
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
}

// Quick Link Component
function QuickLink({ icon, title, description, isDark }) {
  return (
    <button className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-105 ${
      isDark
        ? "bg-gray-800 border-gray-700 hover:border-blue-500"
        : "bg-white border-gray-200 hover:border-blue-500"
    } shadow-lg hover:shadow-xl`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
        {title}
      </h3>
      <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
        {description}
      </p>
    </button>
  );
}

// Support Option Component
function SupportOption({ icon, title, description, link, isDark }) {
  return (
    <a
      href={link}
      className={`p-6 rounded-xl border flex items-start gap-4 transition-all hover:scale-105 ${
        isDark
          ? "bg-gray-800 border-gray-700 hover:border-blue-500"
          : "bg-white border-gray-200 hover:border-blue-500"
      } shadow-lg hover:shadow-xl`}
    >
      <div className="text-3xl">{icon}</div>
      <div>
        <h3 className={`font-semibold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
          {title}
        </h3>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          {description}
        </p>
      </div>
    </a>
  );
}
