import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Categories from './pages/Categories'
import AddEditCategory from './pages/AddEditCategory'
import Products from './pages/Products'
import AddEditProduct from './pages/AddEditProduct'
import Stores from './pages/Stores'
import AddEditStore from './pages/AddEditStore'
import UGCVideos from './pages/UGCVideos'
import PartnerRequests from './pages/PartnerRequests'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/new" element={<AddEditCategory />} />
        <Route path="categories/:id/edit" element={<AddEditCategory />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<AddEditProduct />} />
        <Route path="products/:id/edit" element={<AddEditProduct />} />
        <Route path="stores" element={<Stores />} />
        <Route path="stores/new" element={<AddEditStore />} />
        <Route path="stores/:id/edit" element={<AddEditStore />} />
        <Route path="partner-requests" element={<PartnerRequests />} />
        <Route path="ugc" element={<UGCVideos />} />
      </Route>
    </Routes>
  )
}

