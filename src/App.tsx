import { Routes, Route } from 'react-router-dom'
import SettingsPage from './pages/settings/settings-page'
import { Toaster } from 'react-hot-toast';
import Orders from './pages/orders/orders';
import Layout from './components/layout';
import Dashboard from './pages/dashboard/dashboard'
import { ThemeProvider, useTheme } from './hooks/use-theme'
import AddressesPage from './pages/addresses/addresses-page';
import ShipmentsPage from './pages/shipments/shipments-page';
import { useEffect } from 'react';
import PickupPage from './pages/pickup/pickup-page';
import ShippingRulesPage from './pages/shipping-rules/shipping-rules-page';
import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';


function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shop = urlParams.get("shop");

    if (shop) {
      localStorage.setItem("shopify_shop_url", shop);

      const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
    }
  }, []);


  return (
    <ThemeProvider defaultTheme="system" storageKey="shadcn-ui-theme">
      <ThemedPolarisApp />
    </ThemeProvider>
  )
}

function ThemedPolarisApp() {
  const { theme } = useTheme()
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <AppProvider i18n={enTranslations} theme={isDark ? 'dark-experimental' : 'light'}>
      <div>
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
    </AppProvider>
  )
}

export default App
