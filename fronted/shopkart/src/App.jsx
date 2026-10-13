import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./Pages/Login"
import Signup from "./Pages/Signup"
import Home from "./Pages/Home"
import RootRedirect from "./components/RootRedirect"
import Products from "./Pages/Products"
import ProductDetails from "./Pages/ProductDetails"
import Wishlist from "./Pages/Wishlist"
import Cart from "./Pages/Cart"
import Checkout from "./Pages/Checkout"
import OrderSuccess from "./Pages/OrderSuccess"
import Orders from "./Pages/Orders"
import OrderDetails from "./Pages/OrderDetails"
import Navbar from "./components/Navbar"
import { AuthProvider } from "./context/AuthContext"
import { CartProvider } from "./context/CartContext"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicRoute from "./components/PublicRoute"

function App() {

  return (
    <>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
              <Route path="/home" element={<ProtectedRoute><><Navbar /><Home /></></ProtectedRoute>} />
              <Route path="/products" element={<ProtectedRoute><><Navbar /><Products /></></ProtectedRoute>} />
              <Route path="/products/:id" element={<ProtectedRoute><><Navbar /><ProductDetails /></></ProtectedRoute>} />
              <Route path="/wishlist" element={<ProtectedRoute><Navbar /><Wishlist /></ProtectedRoute>} />
              <Route path="/cart" element={<ProtectedRoute><Navbar /><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/order-success/:id" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  )
}

export default App