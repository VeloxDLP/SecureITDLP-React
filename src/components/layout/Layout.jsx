import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useSidebar } from '../../context/SidebarContext'
import { useTheme } from '../../context/ThemeContext'
import AlertModal from '../ui/AlertModal'

import veloxlogo from '../../assets/veloxlogo.png'
import veloxlogodark from '../../assets/veloxlogodark.png'

export default function Layout() {
  const { collapsed } = useSidebar()
  const { isDark } = useTheme()

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'bg-[#070614]'
          : 'bg-slate-100'
      }`}
    >
      {/* ================= ALERT MODAL ================= */}
      <AlertModal />

      {/* ================= HEADER ================= */}
      <Header />

      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}
      <main
        className={`
          pt-20
          min-h-screen
          flex
          flex-col
          main-transition
          ${collapsed ? 'main-collapsed' : 'main-expanded'}
        `}
      >

        {/* ================= PAGE CONTENT ================= */}
        <div className="flex-1 p-5">
          <Outlet />
        </div>

        {/* ================= FOOTER ================= */}
        <footer className="w-full px-50 pb-15">
          <div
            className={`
              relative
              w-full
              h-[75px]
              overflow-hidden
              border
              shadow-lg
              ${
                isDark
                  ? 'bg-[#070614] border-[rgba(255,255,255,0.07)]'
                  : 'bg-white border-[rgba(0,0,0,0.07)]'
              }
            `}
          >

            {/* ================= VELOX LOGO ================= */}
            <div
              className="
                absolute
                left-6
                top-0
                flex
                items-center
              "
            >
              <img
                src={isDark ? veloxlogo : veloxlogodark}
                alt="VELOX"
                className="
                  h-[60px]
                  w-auto
                  object-contain
                "
              />
            </div>

            {/* ================= COPYRIGHT + VERSION ================= */}
            <div
              className={`
                absolute
                left-[60%]
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                text-center
                whitespace-nowrap
                ${
                  isDark
                    ? 'text-white'
                    : 'text-slate-700'
                }
              `}
            >

              {/* Copyright */}
              <div className="text-[12px] font-normal tracking-wide">
                Copyright C 2012-2026 | Solution Developed By Velox | www.velox.co.in
              </div>

              {/* Version */}
              <div className="mt-1 text-[11px] tracking-wide">
                Version 18.0.11.26
              </div>

            </div>

          </div>
        </footer>

      </main>
    </div>
  )
}