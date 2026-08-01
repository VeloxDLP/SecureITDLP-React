import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useSidebar } from '../../context/SidebarContext'
import { useTheme } from '../../context/ThemeContext'
import {
  LayoutDashboard, Monitor, AppWindow, ShieldCheck, ShieldOff,
  Usb, Globe, Lock, Shield, ScanSearch, FolderSearch, RotateCcw,
  ChevronRight, ChevronLeft, LogOut, Settings,
  ClipboardMinus,
} from 'lucide-react'

// Define navigation with role-based access
const NAV = [
  { 
    label: 'Dashboards', 
    icon: LayoutDashboard, 
    path: '/dashboard',
    roles: ['admin', 'superadmin'] // Both can see
  },
  { 
    label: 'Application Control', 
    icon: AppWindow, 
    path: '/ApplicationControl',
    roles: ['superadmin'] // Only superadmin
  },
  { 
    label: 'USB Protection', 
    icon: Usb, 
    path: '/usb',
    roles: ['superadmin'] // Only superadmin
  },
  { 
    label: 'Website Control', 
    icon: Globe, 
    path: '/web',
    roles: ['superadmin'] // Only superadmin
  },
  { 
    label: 'Printer Control', 
    icon: Shield, 
    path: '/PrinterControl',
    roles: ['superadmin'] // Only superadmin
  },
  { 
    label: 'Data Classification', 
    icon: ScanSearch, 
    path: '/DataClassification',
    roles: ['superadmin'] // Only superadmin
  },
  { 
    label: 'Drive Control', 
    icon: FolderSearch, 
    path: '/DriveControl',
    roles: ['superadmin'] // Only superadmin
  },
  {
    label: 'Network Policy',
    icon: FolderSearch,
    roles: ['superadmin'], // Only superadmin
    children: [
      {
        label: 'Create Network Policy',
        icon: FolderSearch,
        path: '/NetworkPolicy',
        roles: ['superadmin']
      },
      {
        label: 'Apply Network Policy',
        icon: FolderSearch,
        path: '/ApplyNetworkPolicy',
        roles: ['superadmin']
      },
      {
        label: 'Active Policy',
        icon: FolderSearch,
        path: '/ActivePolicy',
        roles: ['superadmin']
      },
    ],
  },
  { 
    label: 'View Devices', 
    icon: Monitor, 
    path: '/devices',
    roles: ['admin', 'superadmin'] // Both can see
  },
]

const ACTIVE = 'bg-[#7094ff] text-white shadow-lg shadow-[#7094ff]/20'
const INACTIVE = `
  text-[#888] hover:text-[#e0e0e0]
  hover:bg-white/[0.06]
  dark:text-[#888] dark:hover:text-[#e0e0e0] dark:hover:bg-white/[0.06]
`

// Helper function to check if user has access
const hasAccess = (userRole, itemRoles) => {
  if (!itemRoles) return true // If no roles specified, everyone can see
  return itemRoles.includes(userRole)
}

function NavItem({ item, collapsed, userRole }) {
  const Icon = item.icon;
  const [open, setOpen] = useState(false);

  // Check if user has access to this item
  if (!hasAccess(userRole, item.roles)) {
    return null;
  }

  // Parent menu with children
  if (item.children) {
    // Filter children based on role
    const accessibleChildren = item.children.filter(child => 
      hasAccess(userRole, child.roles)
    );

    if (accessibleChildren.length === 0) {
      return null; // Hide parent if no accessible children
    }

    return (
      <div className="mx-2">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl
                     text-[13px] font-medium text-[#888]
                     hover:text-[#e0e0e0] hover:bg-white/[0.06]"
        >
          <div className="flex items-center gap-3">
            <Icon size={16} />
            {!collapsed && <span>{item.label}</span>}
          </div>

          {!collapsed && (
            <ChevronRight
              size={14}
              className={`transition-transform ${
                open ? "rotate-90" : ""
              }`}
            />
          )}
        </button>

        {!collapsed && open && (
          <div className="ml-6 mt-1 flex flex-col gap-1">
            {accessibleChildren.map((child) => {
              const ChildIcon = child.icon;

              return (
                <NavLink
                  key={child.label}
                  to={child.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-[13px]
                    ${
                      isActive
                        ? "bg-[#7094ff] text-white"
                        : "text-[#888] hover:text-[#e0e0e0] hover:bg-white/[0.06]"
                    }`
                  }
                >
                  <ChildIcon size={14} />
                  <span>{child.label}</span>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Normal menu item
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `relative group flex items-center gap-3 ml-2 mr-5 px-3 py-2 rounded-xl
        text-[13px] font-medium transition-all duration-200
        ${isActive ? ACTIVE : INACTIVE}`
      }
    >
      <Icon size={16} />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

function FooterBtn({ icon: Icon, label, collapsed, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`
        relative group flex items-center gap-3 rounded-xl text-[13px]
        transition-all duration-200
        ${collapsed ? 'justify-center w-10 mx-auto px-0 py-2' : 'w-[calc(100%-16px)] mx-2 px-3 py-2'}
        ${danger
          ? 'text-[#888] hover:text-rose-400 hover:bg-rose-500/10'
          : 'text-[#888] hover:text-[#e0e0e0] hover:bg-white/[0.06]'}
      `}
    >
      <Icon size={15} className="flex-shrink-0" />
      <span className={`nav-label ${collapsed ? 'nav-label-hidden' : 'nav-label-visible'}`}>
        {label}
      </span>
      {collapsed && (
        <span className="
          pointer-events-none absolute left-full ml-3 z-[200]
          flex items-center gap-1.5 px-2.5 py-1 rounded-lg
          text-[12px] font-semibold whitespace-nowrap
          opacity-0 -translate-x-1 scale-95
          group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100
          transition-all duration-150 ease-out shadow-xl
          bg-[#2a2a2a] text-[#e0e0e0] border border-white/[0.08]
        ">
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#555]" />
          {label}
        </span>
      )}
    </button>
  )
}

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar()
  const { user, logout } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  // Get user role (assuming user object has a role property)
  const userRole = user?.role?.toLowerCase() || 'admin';

  return (
    <aside
      className={`
        fixed left-0 top-14 bottom-0 z-40 flex flex-col
        border-r sidebar-transition pt-8
        ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}
      `}
      style={{
        backgroundColor: isDark ? '#020617' : '#f0f4f7',
        borderColor: isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0',
        overflow: collapsed ? 'visible' : 'hidden',
      }}
    >
      {/* Nav */}
      <nav className="flex-1 py-3 flex flex-col gap-0.5"
        style={{ overflowY: 'auto', overflow: 'visible' }}>
        {NAV.map(item => (
          <NavItem 
            key={item.label} 
            item={item} 
            collapsed={collapsed}
            userRole={userRole}
          />
        ))}
      </nav>

      <div className={`
        flex flex-shrink-0 h-10 border-b
        ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}
        ${collapsed ? 'justify-center items-center' : 'items-center px-3'}
      `}>
        {collapsed ? (
          <button onClick={toggle} title="Expand sidebar"
            className="w-8 h-8 rounded-lg flex items-center justify-center
                       text-[#666] hover:text-[#ccc] hover:bg-white/[0.08]
                       transition-all duration-150">
            <ChevronRight size={14} />
          </button>
        ) : (
          <button onClick={toggle} title="Collapse sidebar"
            className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center
                       text-[#666] hover:text-[#ccc] hover:bg-white/[0.08]
                       transition-all duration-150">
            <ChevronLeft size={14} />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className={`mx-3 border-t ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}`} />

      {/* Footer */}
      <div className="flex-shrink-0 py-2">
          <FooterBtn icon={ClipboardMinus} label="Reports" collapsed={collapsed} />
        <FooterBtn icon={Settings} label="Settings" collapsed={collapsed} />
        <FooterBtn icon={LogOut} label="Logout" collapsed={collapsed} onClick={handleLogout} danger />

        {!collapsed && user && (
          <div className={`mx-2 mt-2 px-3 py-2 rounded-xl flex items-center gap-2.5 border
                           ${isDark
              ? 'bg-white/[0.04] border-white/[0.07]'
              : 'bg-slate-50 border-slate-200'}`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7094ff] to-cyan-500
                            flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-semibold truncate
                             ${isDark ? 'text-[#e0e0e0]' : 'text-slate-800'}`}>
                {user.username || 'User'}
              </p>
              <p className={`text-[10px] uppercase tracking-wider
                             ${isDark ? 'text-[#555]' : 'text-slate-400'}`}>
                {user.role || 'Admin'}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}