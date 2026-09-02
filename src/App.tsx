import { Routes, Route } from 'react-router-dom'
import SettingsPage from './pages/settings/settings-page'
import { Toaster } from 'react-hot-toast'
import Orders from './pages/orders/orders'
import Layout from './components/layout'
import Dashboard from './pages/dashboard/dashboard'
import { ThemeProvider } from './hooks/use-theme'
import AddressesPage from './pages/addresses/addresses-page'
import ShipmentsPage from './pages/shipments/shipments-page'
import { useEffect } from 'react'
import PickupPage from './pages/pickup/pickup-page'
import ShippingRulesPage from './pages/shipping-rules/shipping-rules-page'

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const shop = urlParams.get('shop')

    if (shop) {
      localStorage.setItem('shopify_shop_url', shop)
      const cleanUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl)
    }
  }, [])

  return (
    <ThemeProvider defaultTheme="system" storageKey="shadcn-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/shipments" element={<ShipmentsPage />} />
            <Route path="/pickup" element={<PickupPage />} />
            <Route path="/addresses" element={<AddressesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/shipping-rules" element={<ShippingRulesPage />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
