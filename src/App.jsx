import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SidebarProvider } from './context/SidebarContext'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UsbProtection from './pages/Usbprotection.jsx'
import WebsiteProtection from './pages/WebsiteProtection.jsx'
import DLPSecurityDiagram from './pages/DLPSecurityDiagram.jsx'
import PrinterControl from './pages/PrinterControl.jsx'
import ActivePolicy from './pages/NetworkPolicy/ActivePolicy.jsx'
import NetworkPolicy from './pages/NetworkPolicy/NetworkPolicy.jsx'
import PublicRoute from './routes/PublicRoute.jsx'
import ViewDevice from './pages/ViewDevice/ViewDevice.jsx'
import ApplyNetworkPolicy from './pages/ApplyNetworkPolicy.jsx'
import DriveControl from './pages/DriveControl/DriveControl.jsx'
// import DriveControl from './pages/DriveControl.jsx'


function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-navy-950 bg-slate-100">
        <div className="w-6 h-6 border-2 border-[#7094ff] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* <Route path="/login" element={<Login />} /> */}
      <Route
    path="/login"
    element={
        
         <PublicRoute><Login></Login></PublicRoute>
    }
/>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <SidebarProvider>
              <Layout />
            </SidebarProvider>
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard"       element={<Dashboard />} />
        <Route path="usb"             element={<UsbProtection />} />
        {/* Placeholder routes — replace with real pages as built */}
        <Route path="devices"         element={<ViewDevice></ViewDevice>} />
        <Route path="app-control"     element={<PlaceholderPage title="Application Control" />} />
        <Route path="whitelisting"    element={<PlaceholderPage title="App Whitelisting" />} />
        <Route path="blacklisting"    element={<PlaceholderPage title="App Blacklisting" />} />
        <Route path="web"             element={<WebsiteProtection />} />
        <Route path="DriveControl"             element={<DriveControl></DriveControl>} />
        <Route path="self-protection" element={<PlaceholderPage title="Self Protection" />} />
        <Route path="PrinterControl"           element={<PrinterControl />} />
          <Route path="ActivePolicy"           element={<ActivePolicy />} />
           <Route path="NetworkPolicy"           element={<NetworkPolicy />} />
           <Route path="ApplyNetworkPolicy"           element={<ApplyNetworkPolicy></ApplyNetworkPolicy>} />
        <Route path="scan"            element={<PlaceholderPage title="Active Scan & Detection" />} />
        <Route path="remediation"     element={<PlaceholderPage title="File Remediation" />} />
        <Route path="rollback"        element={<PlaceholderPage title="Policy Roll Back" />} />
        <Route path="*"               element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

/* Reusable placeholder for unbuilt pages */
function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 opacity-40">
      <div className="w-12 h-12 rounded-2xl bg-[#7094ff]/10 border border-[#7094ff]/20
                      flex items-center justify-center">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="#7094ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="4"/>
          <path d="M9 9h6M9 12h6M9 15h4"/>
        </svg>
      </div>
      <p className="text-[13px] font-medium text-slate-400">{title}</p>
      <p className="text-[11px] text-slate-600">Page under construction</p>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}