import React from 'react'
import { Sun, Moon, RefreshCw, Shield } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import logo from '../../assets/DLP-Logo.png'

export default function Header() {
  const { toggleTheme, isDark } = useTheme()
  const { user } = useAuth()

  const iconBtn = isDark
    ? 'text-slate-400 hover:text-slate-200 hover:bg-white/8'
    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'

  const headerGlass = isDark ? 'glass-dark' : 'glass-light'

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 h-20
      flex items-center gap-0 
      ${headerGlass}
    `}>

      {/* ── Logo — static, never moves ── */}
      {/* <div className="flex items-center gap-2.5 px-4 flex-shrink-0 w-[235px]
                      border-r dark:border-white/[0.06] border-slate-200 h-full">
        <Shield size={20} className="text-azure-400 flex-shrink-0" />
        <span className="font-display font-bold text-base tracking-wide whitespace-nowrap flex items-center">
          <span className="text-azure-400">Planet</span>
          <span className="text-gold-500">Guard</span>
          <span className={`text-xs align-super ml-0.5
                            ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>™</span>
        </span>
      </div> */}
      <div
        className="flex items-center justify-center
             px-25 py-5 pl-1
             w-[235px] h-full
          "
      >
        <img
          src={logo}
          alt="SecureIT DLP"
          className="h-20 w-auto object-contain"
        />
      </div>

      {/* ── Title ── */}
      <div className="flex-1 flex items-center px-4 min-w-0">
        {/* <h1 className={`font-display text-lg font-bold tracking-wide truncate
                        ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
          Data Loss Protection
        </h1> */}

        <div className="flex items-center gap-3 ml-4">
          <Button
            className="px-6 py-3 rounded-lg bg-blue-450 hover:bg-blue-300 text-white"
          >
            Dashboard
          </Button>

          <Button
            variant="secondary"
            onClick={() => console.log("Reports")}
            className="px-6 py-3 rounded-lg text-base"
          >
            Reports
          </Button>
        </div>


      </div>


      {/* ── Right actions ── */}
      <div className="flex items-center gap-1.5 px-4 flex-shrink-0">
        {/* <Button variant="ghost" size="sm" icon={<RefreshCw size={13} />}>Refresh</Button> */}

        {/* <div className={`w-px h-5 mx-1 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} /> */}

        <button
          onClick={toggleTheme}
          className={`w-8 h-8 rounded-lg flex items-center justify-center
                      transition-all duration-150 ${iconBtn}`}
          title="Toggle theme"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {user && (
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-azure-500 to-cyan-500
                            flex items-center justify-center text-white text-xs font-bold font-display">
              {user.username[0].toUpperCase()}
            </div>
            <span className={`text-xs font-medium hidden sm:block
                              ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {user.username}
            </span>
          </div>
        )}
      </div>
    </header>
  )
}