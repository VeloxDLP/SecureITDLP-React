import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useSidebar } from '../../context/SidebarContext'
import { useTheme } from '../../context/ThemeContext'

export default function Layout() {
  const { collapsed } = useSidebar()
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen
                     ${isDark
                       ? 'bg-[#060606] bg-grid-dark'
                       : 'bg-slate-100 bg-grid-light'}`}>
      <Header />
      <Sidebar />
      <main className={`pt-14 min-h-screen main-transition
                        ${collapsed ? 'main-collapsed' : 'main-expanded'}`}>
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  )
}