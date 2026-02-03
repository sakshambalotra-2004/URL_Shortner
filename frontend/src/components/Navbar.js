export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  return (
    <div className="flex justify-between items-center p-4 bg-black text-white">
      <h1 className="text-xl font-bold">🔗 URL Dashboard</h1>
      <button
        onClick={logout}
        className="bg-red-500 px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}
