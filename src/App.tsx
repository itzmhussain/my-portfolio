import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GalleryPage } from './gallery/GalleryPage'
import { ChannelOperationsPage } from './templates/channel-operations/ChannelOperationsPage'
import { EcommerceSalesPage } from './templates/ecommerce-sales/EcommerceSalesPage'
import { MarketingAnalyticsPage } from './templates/marketing-analytics/MarketingAnalyticsPage'
import { SocialMediaPage } from './templates/social-media/SocialMediaPage'
import { TelecomOperationsPage } from './templates/telecom-operations/TelecomOperationsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/templates/ecommerce-sales" element={<EcommerceSalesPage />} />
        <Route
          path="/templates/marketing-analytics"
          element={<MarketingAnalyticsPage />}
        />
        <Route
          path="/templates/telecom-operations"
          element={<TelecomOperationsPage />}
        />
        <Route path="/templates/social-media" element={<SocialMediaPage />} />
        <Route
          path="/templates/channel-operations"
          element={<ChannelOperationsPage />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
