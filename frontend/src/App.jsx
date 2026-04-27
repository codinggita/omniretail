import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './store/slices/authSlice';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import ProductDetail from './pages/ProductDetail';
import Negotiation from './pages/Negotiation';
import Orders from './pages/Orders';
import './index.css';

// Dashboard Layout Wrapper
const DashboardLayout = ({ children }) => (
  <div className="flex min-h-screen bg-[#131315]">
    <Sidebar />
    <div className="flex-1 flex flex-col md:ml-64 w-full h-screen overflow-y-auto relative">
      <div className="fixed top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
      <Header />
      <main className="p-8 pb-20 relative z-10 flex-1 flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Dashboard Route */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route path="/shop" element={<ProtectedRoute><DashboardLayout><Inventory /></DashboardLayout></ProtectedRoute>} />
        <Route path="/inventory" element={<ProtectedRoute><DashboardLayout><Inventory /></DashboardLayout></ProtectedRoute>} />
        <Route path="/product/:id" element={<ProtectedRoute><DashboardLayout><ProductDetail /></DashboardLayout></ProtectedRoute>} />
        <Route path="/negotiation/:id" element={<ProtectedRoute><DashboardLayout><Negotiation /></DashboardLayout></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><DashboardLayout><Orders /></DashboardLayout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
