// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./src/components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminProtectedRoute from "./components/layout/AdminProtectedRoute";

// 🧩 User Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/WishList"
import Profile from "./pages/Profile";
import ViewProducts from "./pages/ViewProducts"
import OrderDetails from "./pages/OrderDetails";

// ⚙️ Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import AdminCategories from "./pages/AdminCategories";
import AdminReports from "./pages/AdminReports";

export default function App() {
  return (
    <Router>
      {/* Global Layout */}
      <div className="flex flex-col min-h-screen">
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            {/* 🌍 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/products" element={<ViewProducts />} />

            {/* 🧍 Protected (User) Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* 🧰 Admin-Only Routes */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminProtectedRoute>
                  <AdminProducts />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <AdminProtectedRoute>
                  <AdminProductForm />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/products/:id/edit"
              element={
                <AdminProtectedRoute>
                  <AdminProductForm />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminProtectedRoute>
                  <AdminCategories />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <AdminProtectedRoute>
                  <AdminReports />
                </AdminProtectedRoute>
              }
            />

            {/* 🚫 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="text-center mt-20 text-gray-600 text-lg">
                  404 — Page Not Found
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
