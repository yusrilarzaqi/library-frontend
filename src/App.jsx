import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/Auth/PrivateRoute";
import AdminRoute from "./components/Auth/AdminRoute";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import DataList from "./components/Data/DataList";
import Navbar from "./components/Layout/Navbar";
import UsersList from "./components/Users/UsersList";
import Dashboard from "./components/Dashboard/Dashboard";
import Profile from "./components/Profile/Profile";
import Footer from "./components/Layout/Footer";
import Borrow from "./components/Borrow/Borrow";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-16">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/data"
                element={
                  <PrivateRoute>
                    <DataList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <AdminRoute>
                    <UsersList />
                  </AdminRoute>
                }
              />
              <Route
                path="/Dashboard"
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/Borrow"
                element={
                  <PrivateRoute>
                    <Borrow type="borrowed" />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Returned"
                element={
                  <PrivateRoute>
                    <Borrow type="returned" />
                  </PrivateRoute>
                }
              />
              <Route
                path="/Profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route path="/" element={<Navigate to="/Data" replace />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
