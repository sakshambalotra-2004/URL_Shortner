import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/auth";
// import Dashboard from "./components/Dashboard";
// import UrlForm from "./components/UrlForm";
// import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        {/* <Route path="/" element={<UrlForm />} /> */}
        {/* <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
