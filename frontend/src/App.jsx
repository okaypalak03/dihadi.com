import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Workers from "./pages/Workers";
import Login from "./pages/Login";
import Register from "./pages/Register";
import WorkerDashboard from "./pages/WorkerDashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/worker-dashboard"
              element={
                <PrivateRoute roles={["Worker"]}>
                  <WorkerDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/user-dashboard"
              element={
                <PrivateRoute roles={["User"]}>
                  <UserDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <PrivateRoute roles={["Admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
