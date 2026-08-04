import React, { useState, useRef, useEffect } from "react";
import {
  UserRound,
  Users,
  Mail,
  Phone,
  ChevronDown,
  Lock,
  Building,
  Shield,
  X,
  Search,
  Edit,
  Trash2,
  Check,
} from "lucide-react";

// ─── GlassButton ────────────────────────────────────────────────
const GlassButton = ({ children, onClick, variant, className = "" }) => {
  const baseClasses =
    "flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition-all duration-200 border";

  const variants = {
    default: {
      className:
        "text-slate-300 hover:text-white border-white/[0.10] hover:border-white/[0.20]",
      style: {
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
    },
    primary: {
      className: "text-white border-[#7094ff]/40 hover:border-[#7094ff]/60",
      style: {
        background: "rgba(112, 148, 255, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 4px 20px rgba(112,148,255,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
      },
    },
    tab_active: {
      className: "text-white border-[#7094ff]/40 hover:border-[#7094ff]/60",
      style: {
        background: "rgba(112, 148, 255, 0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 6px 24px rgba(112,148,255,0.35), inset 0 1px 0 rgba(255,255,255,0.20)",
      },
    },
    tab_inactive: {
      className: "text-slate-400 hover:text-slate-100 border-transparent hover:border-white/[0.08]",
      style: { background: "transparent", backdropFilter: "none" },
    },
  };

  const v = variants[variant] || variants.default;

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${v.className} ${className}`}
      style={v.style}
    >
      {children}
    </button>
  );
};

// ─── Custom Dropdown ──────────────────────────────────────────
function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
  error = false,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const normalised = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  const selected = normalised.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  const triggerBorder = error
    ? "border-rose-500/60"
    : open
    ? "border-[#7094ff]/60"
    : "border-slate-700";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={`
          w-full flex items-center justify-between gap-2
          px-4 py-2.5 rounded-xl text-[13px] text-left
          border transition-all duration-200 outline-none
          disabled:opacity-40 disabled:cursor-not-allowed
          ${triggerBorder}
          ${open ? "ring-2 ring-[#7094ff]/20" : ""}
          text-slate-200 bg-[#111827]
        `}
      >
        <span className={selected ? "text-slate-200" : "text-slate-500"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition-transform duration-200
                      ${open ? "rotate-180" : ""}
                      text-slate-500`}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 z-[200]
                     rounded-xl border border-slate-700 overflow-hidden
                     shadow-[0_16px_48px_rgba(0,0,0,0.35)] animate-slide-up
                     bg-[#111827]"
        >
          <div className="max-h-52 overflow-y-auto py-1">
            {normalised.map((o) => {
              const isSelected = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => handleSelect(o.value)}
                  className={`
                    w-full text-left px-4 py-2.5 text-[13px]
                    flex items-center justify-between gap-2
                    transition-colors duration-100
                    ${isSelected
                      ? "text-[#7094ff] bg-[#7094ff]/10"
                      : "text-[#888] hover:bg-white/[0.06] hover:text-[#e0e0e0]"}
                  `}
                >
                  {o.label}
                  {isSelected && <Check size={13} className="text-[#7094ff] flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Setting Component ────────────────────────────────────
function Setting() {
  const [view, setView] = useState("create");
  const [showScopeModal, setShowScopeModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    contactNumber: "",
    userType: "",
    password: "",
    confirmPassword: "",
    customerName: "",
    branchName: "",
    oem: "",
  });

  const [scopes, setScopes] = useState({
    arpm: {
      checked: false,
      children: {
        createPatchTask: false,
        createPatchProfile: false,
        assignTask: false,
      },
    },
    atmInventory: {
      checked: false,
      children: {
        assignATMStatus: false,
        runCommand: false,
      },
    },
  });

  const usersData = [
    {
      id: 1,
      username: "pratham",
      firstName: "Pratham",
      lastName: "User",
      type: "Admin",
      contact: "9876543210",
      email: "pratham@example.com",
    },
    {
      id: 2,
      username: "prathamesh",
      firstName: "Prathamesh",
      lastName: "User",
      type: "Admin",
      contact: "9876543211",
      email: "prathamesh@example.com",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = () => {
    const { userName, password, confirmPassword } = formData;
    if (!userName || !password || !confirmPassword) {
      setShowErrorModal(true);
    } else {
      console.log("Creating user...", formData);
    }
  };

  // ── Scope logic ──
  const countSelected = () => {
    let total = 0;
    Object.values(scopes).forEach((mod) => {
      Object.values(mod.children).forEach((val) => {
        if (val) total++;
      });
    });
    return total;
  };

  const toggleChild = (moduleKey, childKey) => {
    setScopes((prev) => {
      const newScopes = { ...prev };
      const mod = newScopes[moduleKey];
      mod.children[childKey] = !mod.children[childKey];
      const allChecked = Object.values(mod.children).every((v) => v);
      const anyChecked = Object.values(mod.children).some((v) => v);
      mod.checked = allChecked;
      if (!anyChecked) mod.checked = false;
      return newScopes;
    });
  };

  const toggleModule = (moduleKey) => {
    setScopes((prev) => {
      const newScopes = { ...prev };
      const mod = newScopes[moduleKey];
      const newChecked = !mod.checked;
      mod.checked = newChecked;
      Object.keys(mod.children).forEach((key) => {
        mod.children[key] = newChecked;
      });
      return newScopes;
    });
  };

  const toggleSelectAll = () => {
    const totalChildren = Object.values(scopes).reduce(
      (acc, mod) => acc + Object.keys(mod.children).length,
      0
    );
    const selected = countSelected();
    const allSelected = selected === totalChildren;
    setScopes((prev) => {
      const newScopes = { ...prev };
      const newValue = !allSelected;
      Object.keys(newScopes).forEach((modKey) => {
        const mod = newScopes[modKey];
        mod.checked = newValue;
        Object.keys(mod.children).forEach((childKey) => {
          mod.children[childKey] = newValue;
        });
      });
      return newScopes;
    });
  };

  const selectedCount = countSelected();

  // ── Tabs ──
  const tabs = [
    { id: "create", label: "Create App User", icon: <UserRound size={16} /> },
    { id: "list", label: "View App User", icon: <Users size={16} /> },
  ];

  // ── Dropdown options ──
  const userTypeOptions = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "user", label: "User" },
  ];
  const branchOptions = [
    { value: "branch1", label: "Branch 1" },
    { value: "branch2", label: "Branch 2" },
    { value: "branch3", label: "Branch 3" },
  ];

  // ── Common input styles ──
  const inputClass = `
    w-full h-11 px-4 py-2.5 rounded-xl text-[13px] text-slate-200
    border border-slate-700 bg-[#111827]
    placeholder:text-slate-500
    focus:border-[#7094ff]/60 focus:ring-2 focus:ring-[#7094ff]/20
    outline-none transition-all duration-200
  `;
  const inputWithIconClass = `${inputClass} pl-10`;
  const labelClass = "block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5";

  return (
    <div className="min-h-screen p-6">
      {/* Top Buttons */}
      <div className="mb-6 rounded-2xl border border-slate-700 bg-[#020617] p-4">
        <div className="flex flex-wrap gap-3">
          {tabs.map((t) => (
            <GlassButton
              key={t.id}
              onClick={() => setView(t.id)}
              variant={view === t.id ? "tab_active" : "tab_inactive"}
            >
              {t.icon}
              {t.label}
            </GlassButton>
          ))}
        </div>
      </div>

      {/* Conditional Content */}
      {view === "create" ? (
        // ─── CREATE FORM ──────────────────────────────────────
        <div className="rounded-2xl border border-slate-700 bg-[#020617] p-6">
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className={labelClass}>First Name</label>
              <div className="relative">
                <UserRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  className={inputWithIconClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <div className="relative">
                <UserRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  className={inputWithIconClass}
                />
              </div>
            </div>
          </div>

          {/* Row 2: Email, Username, Contact, User Type */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={inputWithIconClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>User Name</label>
              <div className="relative">
                <UserRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  className={inputWithIconClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Contact Number</label>
              <div className="relative">
                <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Enter contact number"
                  className={inputWithIconClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>User Type</label>
              <Dropdown
                value={formData.userType}
                onChange={(val) => setFormData((prev) => ({ ...prev, userType: val }))}
                options={userTypeOptions}
                placeholder="Select user type"
              />
            </div>
          </div>

          {/* Row 3: Password, Confirm Password, Customer Name, Branch Name */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className={inputWithIconClass}
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-slate-500">Password strength:</span>
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-red-500 rounded-full" />
                </div>
                <span className="text-[11px] text-red-400">Weak</span>
              </div>
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className={inputWithIconClass}
                />
              </div>
            </div>
    
     
          </div>

          {/* Row 4: Manage Scopes */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Manage Scopes</label>
              <button
                onClick={() => setShowScopeModal(true)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#111827] px-4 text-[13px] font-medium text-white transition hover:border-[#7094ff]/40 hover:bg-[#1a2a4a]"
              >
                <Shield size={18} />
                Manage Application Scopes
              </button>
            </div>
          </div>

          {/* Action Buttons – using GlassButton */}
          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-slate-700 pt-6">
            <GlassButton
              onClick={() => {
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  userName: "",
                  contactNumber: "",
                  userType: "",
                  password: "",
                  confirmPassword: "",
                  customerName: "",
                  branchName: "",
                  oem: "",
                });
              }}
              variant="default"
              className="px-6 py-2.5"
            >
              Reset
            </GlassButton>

            <GlassButton
              onClick={handleCreateUser}
              variant="primary"
              className="px-6 py-2.5 font-semibold"
            >
              Create User
            </GlassButton>
          </div>
        </div>
      ) : (
        // ─── USER LIST PAGE – TABLE EXACTLY LIKE PRINTER POLICIES ──
        <div className="rounded-2xl border border-slate-700 bg-[#020617] p-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Application Users</h2>
              <p className="text-sm text-slate-400">
                Manage enterprise application users and permissions.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search user..."
                  className={inputWithIconClass}
                />
              </div>
              <span className="text-sm font-medium text-white">
                {usersData.length} Users
              </span>
            </div>
          </div>

          {/* Table – Printer Policies style */}
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-700 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-2.5 py-1.5">SR NO</th>
                  <th className="px-2.5 py-1.5">USERNAME</th>
                  <th className="px-2.5 py-1.5">FIRST NAME</th>
                  <th className="px-2.5 py-1.5">LAST NAME</th>
                  <th className="px-2.5 py-1.5">TYPE</th>
                  <th className="px-2.5 py-1.5">CONTACT</th>
                  <th className="px-2.5 py-1.5">EMAIL</th>
                  <th className="px-2.5 py-1.5 text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-700/40 transition-colors hover:bg-slate-800/30"
                  >
                    <td className="px-2.5 py-1.5 text-[11px] text-slate-500">{index + 1}</td>
                    <td className="px-2.5 py-1.5 text-[11px] text-slate-300">{user.username}</td>
                    <td className="px-2.5 py-1.5 text-[11px] text-slate-300">{user.firstName}</td>
                    <td className="px-2.5 py-1.5 text-[11px] text-slate-300">{user.lastName}</td>
                    <td className="px-2.5 py-1.5 text-[11px] text-slate-300">{user.type}</td>
                    <td className="px-2.5 py-1.5 text-[11px] text-slate-300">{user.contact}</td>
                    <td className="px-2.5 py-1.5 text-[11px] text-slate-300">{user.email}</td>
                    <td className="px-2.5 py-1.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="rounded p-1 text-blue-400 transition hover:bg-blue-500/20">
                          <Edit size={13} />
                        </button>
                        <button className="rounded p-1 text-red-400 transition hover:bg-red-500/20">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-700 pt-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <select className="rounded-lg border border-slate-700 bg-[#111827] px-2 py-1 text-white focus:border-[#7094ff]/60 focus:outline-none">
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
            <div>Showing 1 to {usersData.length} of {usersData.length}</div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg border border-slate-700 px-3 py-1 text-white hover:bg-slate-700 transition disabled:opacity-50">
                Prev
              </button>
              <span className="px-2 py-1 text-white">1/1</span>
              <button className="rounded-lg border border-slate-700 px-3 py-1 text-white hover:bg-slate-700 transition disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Scope Manager Modal ────────────────────────────── */}
      {showScopeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setShowScopeModal(false)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-[#020617] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowScopeModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:text-white transition"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-white">
              Application Scope Manager
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Assign modules and submodules access permissions.
            </p>

            <div className="relative mt-4">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search modules or permissions..."
                className={inputWithIconClass}
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-b border-slate-700 pb-3">
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={
                    selectedCount ===
                    Object.values(scopes).reduce(
                      (acc, mod) => acc + Object.keys(mod.children).length,
                      0
                    )
                  }
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                />
                Select All Permissions
              </label>
              <span className="text-sm text-slate-400">
                {selectedCount} Selected
              </span>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-white">
                    <input
                      type="checkbox"
                      checked={scopes.arpm.checked}
                      onChange={() => toggleModule("arpm")}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                    />
                    ARPM
                  </label>
                  <span className="text-xs text-slate-400">
                    {Object.values(scopes.arpm.children).filter(Boolean).length}/
                    {Object.keys(scopes.arpm.children).length}
                  </span>
                </div>
                <div className="ml-6 mt-1 space-y-1">
                  {Object.keys(scopes.arpm.children).map((key) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-white">
                      <input
                        type="checkbox"
                        checked={scopes.arpm.children[key]}
                        onChange={() => toggleChild("arpm", key)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                      />
                      {key === "createPatchTask" && "Create Patch Task"}
                      {key === "createPatchProfile" && "Create Patch Profile"}
                      {key === "assignTask" && "Assign Task"}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-medium text-white">
                    <input
                      type="checkbox"
                      checked={scopes.atmInventory.checked}
                      onChange={() => toggleModule("atmInventory")}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                    />
                    ATM Inventory
                  </label>
                  <span className="text-xs text-slate-400">
                    {Object.values(scopes.atmInventory.children).filter(Boolean).length}/
                    {Object.keys(scopes.atmInventory.children).length}
                  </span>
                </div>
                <div className="ml-6 mt-1 space-y-1">
                  {Object.keys(scopes.atmInventory.children).map((key) => (
                    <label key={key} className="flex items-center gap-2 text-sm text-white">
                      <input
                        type="checkbox"
                        checked={scopes.atmInventory.children[key]}
                        onChange={() => toggleChild("atmInventory", key)}
                        className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                      />
                      {key === "assignATMStatus" && "Assign ATM Status"}
                      {key === "runCommand" && "Run Command"}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-700 pt-4">
              <p className="text-sm text-slate-400">
                Assigning enterprise-level access permissions for application user.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setScopes({
                      arpm: {
                        checked: false,
                        children: {
                          createPatchTask: false,
                          createPatchProfile: false,
                          assignTask: false,
                        },
                      },
                      atmInventory: {
                        checked: false,
                        children: {
                          assignATMStatus: false,
                          runCommand: false,
                        },
                      },
                    });
                  }}
                  className="rounded-lg border border-slate-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowScopeModal(false)}
                  className="rounded-lg border border-slate-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log("Scopes applied:", scopes);
                    setShowScopeModal(false);
                  }}
                  className="rounded-lg border border-blue-500 bg-blue-600/20 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-600/30"
                >
                  Apply Permissions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Error Modal ────────────────────────────────────── */}
      {showErrorModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={() => setShowErrorModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-red-500/30 bg-[#020617] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 border border-red-500/30">
                <span className="text-3xl font-bold text-red-500">!</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Fail !</h2>
              <p className="mt-2 text-sm text-slate-300">
                Username, password and confirm password are required
              </p>
              <button
                onClick={() => setShowErrorModal(false)}
                className="mt-6 w-full rounded-lg border border-blue-500 bg-blue-600/20 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600/30"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Setting;