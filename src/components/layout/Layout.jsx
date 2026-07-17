import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useSidebar } from '../../context/SidebarContext'
import { useTheme } from '../../context/ThemeContext'
import AlertModal from '../ui/AlertModal'

export default function Layout() {
  const { collapsed } = useSidebar()
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen
                     ${isDark
                        ? 'bg-[#070614]'
                       : 'bg-slate-100'}`}>
      <AlertModal />
      <Header />
      <Sidebar />

      <main className={`pt-20 min-h-screen main-transition
                        ${collapsed ? 'main-collapsed' : 'main-expanded'}`}>
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  )
}