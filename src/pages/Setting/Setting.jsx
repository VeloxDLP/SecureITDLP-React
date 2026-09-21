import React, { useState, useRef, useEffect } from "react";

import {
  UserRound,
  Users,
  Mail,
  Phone,
  ChevronDown,
  Lock,
  X,
  Search,
  Check,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Monitor,
  Usb,
  Globe,
  Printer,
  FileText,
  HardDrive,
  Network,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { dashboardService } from "../../services/dashboardService";
import { alert as showAlert } from "../../components/ui/AlertModal";
import { useTheme } from "../../context/ThemeContext";

/* ─────────────────────────────────────────────────────────────
   GLASS BUTTON
───────────────────────────────────────────────────────────── */
const GlassButton = ({ children, onClick, variant, className = "" }) => {
  const { isDark } = useTheme();

  const baseClasses =
    "flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition-all duration-200 border";

  const variants = {
    default: {
      className: isDark
        ? "text-slate-300 hover:text-white border-white/[0.10] hover:border-white/[0.20]"
        : "text-slate-700 hover:text-slate-900 border-slate-300/50 hover:border-slate-400",
      style: isDark
        ? {
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }
        : {
            background: "rgba(255,255,255,0.70)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
          },
    },
    primary: {
      className: "text-white border-[#7094ff]/40 hover:border-[#7094ff]/60",
      style: {
        background: "rgba(112, 148, 255, 0.90)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow:
          "0 4px 20px rgba(112,148,255,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
      },
    },
    tab_active: {
      className: "text-white border-[#7094ff]/40 hover:border-[#7094ff]/60",
      style: isDark
        ? {
            background: "rgba(112, 148, 255, 0.82)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 6px 24px rgba(112,148,255,0.35), inset 0 1px 0 rgba(255,255,255,0.20)",
          }
        : {
            background: "rgba(112, 148, 255, 0.90)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow:
              "0 6px 24px rgba(112,148,255,0.30), inset 0 1px 0 rgba(255,255,255,0.25)",
          },
    },
    tab_inactive: {
      className: isDark
        ? "text-slate-400 hover:text-slate-100 border-transparent hover:border-white/[0.08]"
        : "text-slate-500 hover:text-slate-800 border-transparent hover:border-slate-300/50",
      style: { background: "transparent", backdropFilter: "none" },
    },
  };

  const v = variants[variant] || variants.default;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${v.className} ${className}`}
      style={v.style}
    >
      {children}
    </button>
  );
};

/* ─────────────────────────────────────────────────────────────
   CUSTOM DROPDOWN
───────────────────────────────────────────────────────────── */
function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
  error = false,
  multiple = false,
}) {
  const { isDark } = useTheme();
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
    if (multiple) {
      const currentValues = value ? value.split(",").filter(Boolean) : [];
      if (currentValues.includes(val)) {
        onChange(currentValues.filter((item) => item !== val).join(","));
      } else {
        onChange([...currentValues, val].join(","));
      }
    } else {
      onChange(val);
      setOpen(false);
    }
  };

  const triggerBorder = error
    ? "border-rose-500/60"
    : open
    ? "border-[#7094ff]/60"
    : isDark
    ? "border-slate-700"
    : "border-slate-300";

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
          ${isDark ? "text-slate-200 bg-[#111827]" : "text-slate-800 bg-white"}
        `}
      >
        <span>
          {multiple
            ? value
              ? normalised
                  .filter((o) => value.split(",").includes(o.value))
                  .map((o) => o.label)
                  .join(", ")
              : placeholder
            : selected
            ? selected.label
            : placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${isDark ? "text-slate-500" : "text-slate-400"}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full left-0 right-0 mt-1.5 z-[300]
            rounded-xl border overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.35)]
            ${isDark ? "border-slate-700 bg-[#111827]" : "border-slate-200 bg-white"}`}
        >
          <div className="max-h-52 overflow-y-auto py-1">
            {normalised.map((o) => {
              const isSelected = multiple
                ? value?.split(",").filter(Boolean).includes(o.value)
                : o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => handleSelect(o.value)}
                  className={`w-full text-left px-4 py-2.5 text-[13px]
                    flex items-center justify-between gap-2
                    transition-colors duration-100
                    ${
                      isSelected
                        ? "text-[#7094ff] bg-[#7094ff]/10"
                        : isDark
                        ? "text-[#888] hover:bg-white/[0.06] hover:text-[#e0e0e0]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  {o.label}
                  {isSelected && (
                    <Check size={13} className="text-[#7094ff] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN SETTING
───────────────────────────────────────────────────────────── */
function Setting() {
  const { isDark } = useTheme();

  const [view, setView] = useState("create");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    contactNumber: "",
    userType: "",
    password: "",
    confirmPassword: "",
    scopedata: "",
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ─── Edit modal state ───
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState([]);

  // ─── LOCK SCREEN WHEN MODAL IS OPEN ───
  useEffect(() => {
    if (editModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = "0";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
    };
  }, [editModalOpen]);

  // ─── FETCH USERS ───
  useEffect(() => {
    if (view !== "list") return;
    let isCancelled = false;

    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await dashboardService.GetApplicationUser();

        let data = [];
        if (Array.isArray(res)) data = res;
        else if (Array.isArray(res?.data)) data = res.data;
        else if (Array.isArray(res?.data?.data)) data = res.data.data;
        else if (Array.isArray(res?.data?.users)) data = res.data.users;
        else if (Array.isArray(res?.data?.result)) data = res.data.result;
        else if (Array.isArray(res?.users)) data = res.users;
        else if (Array.isArray(res?.result)) data = res.result;

        if (!isCancelled) setUsers(data);
      } catch (err) {
        if (!isCancelled) {
          showAlert({
            icon: "error",
            title: "Failed to load users",
            text:
              err.response?.data?.message ||
              err.message ||
              "Something went wrong",
            confirmButtonText: "OK",
          });
        }
      } finally {
        if (!isCancelled) setLoadingUsers(false);
      }
    };

    fetchUsers();
    return () => {
      isCancelled = true;
    };
  }, [view]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ─── CREATE USER ───
  const handleCreateUser = async () => {
    const { userName, password, confirmPassword } = formData;
    if (!userName || !password || !confirmPassword) {
      showAlert({
        icon: "error",
        title: "Invalid fields",
        text: "All fields are required",
        confirmButtonText: "Cancel",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showAlert({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
        confirmButtonText: "Cancel",
      });
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      showAlert({
        icon: "error",
        title: "Invalid Contact Number",
        text: "Please enter a valid 10-digit mobile number",
        confirmButtonText: "Cancel",
      });
      return;
    }

    if (password !== confirmPassword) {
      showAlert({
        icon: "error",
        title: "Incorrect Password",
        text: "Password is not matching",
        confirmButtonText: "Cancel",
      });
      return;
    }

    const requestData = {
      name: formData.firstName,
      last_name: formData.lastName,
      username: formData.userName,
      email: formData.email,
      contact_no: formData.contactNumber,
      password: formData.password,
      account_status: "ACTIVE",
      role: formData.userType,
      scope: formData.scopedata,
    };

    try {
      await dashboardService.CreateApplicationUser(requestData);

      await showAlert({
        icon: "success",
        title: "User Saved",
        text: "User Creation successful",
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: true,
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        contactNumber: "",
        userType: "",
        password: "",
        confirmPassword: "",
        scopedata: "",
      });
    } catch (err) {
      showAlert({
        icon: "error",
        title: "Username Unavailable",
        text:
          err.response?.data?.message ||
          err.message ||
          "User already exists",
        confirmButtonText: "Cancel",
      });
    }
  };

  // ─── EDIT: open empty modal ───
  const handleEditUser = () => {
    setSelectedScopes([]);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedScopes([]);
  };

  // ─── SCOPE toggles ───
  const toggleScope = (value) => {
    setSelectedScopes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const toggleSelectAllScopes = () => {
    setSelectedScopes((prev) =>
      prev.length === ModuleScope.length ? [] : ModuleScope.map((s) => s.value)
    );
  };

  // ─── DELETE USER ───
  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Delete user "${user.username || user.name || ""}"?`
    );
    if (!confirmed) return;

    try {
      setUsers((prev) =>
        prev.filter((u) => (u.id ?? u._id) !== (user.id ?? user._id))
      );
      await showAlert({
        icon: "success",
        title: "User Deleted",
        text: "User removed successfully",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (err) {
      showAlert({
        icon: "error",
        title: "Delete Failed",
        text: err.message || "Could not delete user",
        confirmButtonText: "OK",
      });
    }
  };

  // ─── OPTIONS ───
  const userTypeOptions = [
    { value: "ADMIN", label: "ADMIN" },
    { value: "SUPERADMIN", label: "SUPERADMIN" },
    { value: "USER", label: "USER" },
  ];

  const ScopeValue = [
    { value: "/app-control", label: "Application Control" },
    { value: "/DriveControl", label: "Drive Control" },
    { value: "/DataClassification", label: "Data Classification" },
    { value: "/NetworkPolicy", label: "Network Control" },
    { value: "/PrinterControl", label: "Printer Control" },
    { value: "/usb", label: "USB Control" },
    { value: "/devices", label: "View Device" },
    { value: "/web", label: "Website Control" },
    { value: "/Reports", label: "Reports" },
    { value: "/Setting", label: "Setting" },
  ];

  // ─── Module tiles for the modal ───
  const ModuleScope = [
    { value: "/dashboard", label: "Dashboard", desc: "View system overview and analytics", icon: LayoutDashboard },
    { value: "/app-control", label: "Application Control", desc: "Manage application permissions", icon: Monitor },
    { value: "/usb", label: "USB Protection", desc: "Control USB device access", icon: Usb },
    { value: "/web", label: "Website Control", desc: "Block or allow websites", icon: Globe },
    { value: "/PrinterControl", label: "Printer Control", desc: "Manage printer access and usage", icon: Printer },
    { value: "/DataClassification", label: "Data Classification", desc: "Classify and protect sensitive data", icon: FileText },
    { value: "/DriveControl", label: "Drive Control", desc: "Manage drive access and permissions", icon: HardDrive },
    { value: "/NetworkPolicy", label: "Network Policy", desc: "Configure network access rules", icon: Network },
    { value: "/devices", label: "View Device", desc: "Monitor and manage devices", icon: Monitor },
    { value: "/Reports", label: "Report", desc: "View and manage system reports", icon: FileText },
    { value: "/Setting", label: "Setting", desc: "Configure system settings", icon: Settings },
  ];

  // ─── STYLES ───
  const inputClass = `
    w-full h-11 px-4 py-2.5 rounded-xl text-[13px]
    border outline-none transition-all duration-200
    ${
      isDark
        ? "text-slate-200 border-slate-700 bg-[#111827] placeholder:text-slate-500 focus:border-[#7094ff]/60 focus:ring-2 focus:ring-[#7094ff]/20"
        : "text-slate-800 border-slate-300 bg-white placeholder:text-slate-400 focus:border-[#7094ff]/60 focus:ring-2 focus:ring-[#7094ff]/20"
    }`;
  const inputWithIconClass = `${inputClass} pl-10`;
  const labelClass = `block text-[11px] font-semibold uppercase tracking-wider mb-1.5
    ${isDark ? "text-slate-500" : "text-slate-600"}`;

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      String(u.username || "").toLowerCase().includes(q) ||
      String(u.firstName || u.first_name || u.name || "").toLowerCase().includes(q) ||
      String(u.lastName || u.last_name || "").toLowerCase().includes(q) ||
      String(u.role || "").toLowerCase().includes(q) ||
      String(u.account_status || u.status || "").toLowerCase().includes(q)
    );
  });

  const tabs = [
    { id: "create", label: "Create User", icon: <UserRound size={16} /> },
    { id: "list", label: "View User", icon: <Users size={16} /> },
  ];

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <div className="min-h-screen p-6">

      {/* TOP TABS */}
      <div
        className={`mb-6 rounded-2xl border p-4 ${
          isDark ? "border-slate-700 bg-[#020617]" : "border-slate-200 bg-white"
        }`}
      >
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

      {/* CREATE USER */}
      {view === "create" ? (
        <div
          className={`rounded-2xl border p-6 ${
            isDark ? "border-slate-700 bg-[#020617]" : "border-slate-200 bg-white"
          }`}
        >
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className={labelClass}>First Name</label>
              <div className="relative">
                <UserRound size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Enter first name" className={inputWithIconClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Last Name</label>
              <div className="relative">
                <UserRound size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Enter last name" className={inputWithIconClass} />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <Mail size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email address" className={inputWithIconClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>User Name</label>
              <div className="relative">
                <UserRound size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input type="text" name="userName" value={formData.userName} onChange={handleInputChange} placeholder="Enter username" className={inputWithIconClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Contact Number</label>
              <div className="relative">
                <Phone size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} placeholder="Enter contact number" className={inputWithIconClass} />
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

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Password</label>
              <div className="relative">
                <Lock size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Enter password" className={inputWithIconClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Confirm Password</label>
              <div className="relative">
                <Lock size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm password" className={inputWithIconClass} />
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Scope</label>
              <Dropdown
                value={formData.scopedata}
                onChange={(val) => setFormData((prev) => ({ ...prev, scopedata: val }))}
                options={ScopeValue}
                placeholder="Select User scope"
                multiple={true}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <GlassButton
              onClick={() =>
                setFormData({
                  firstName: "",
                  lastName: "",
                  email: "",
                  userName: "",
                  contactNumber: "",
                  userType: "",
                  password: "",
                  confirmPassword: "",
                  scopedata: "",
                })
              }
              variant="default"
              className="px-6 py-2.5"
            >
              Reset
            </GlassButton>
            <GlassButton onClick={handleCreateUser} variant="primary" className="px-6 py-2.5 font-semibold">
              Create User
            </GlassButton>
          </div>
        </div>
      ) : (

        /* VIEW USER */
        <div
          className={`rounded-2xl border p-6 ${
            isDark ? "border-slate-700 bg-[#020617]" : "border-slate-200 bg-white"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
              Application Users
            </h2>
            <div className="relative">
              <Search size={18} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
              <input
                type="text"
                placeholder="Search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={inputWithIconClass}
              />
            </div>
          </div>

          <div className="mt-6 overflow-hidden" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0" }}>
            <div className="overflow-x-auto">
              <div className="overflow-y-auto" style={{ maxHeight: "320px" }}>
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className={isDark ? "bg-[#020617] border-b border-white/[0.06]" : "bg-white border-b border-slate-100"}>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">SR NO</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">ACCOUNT STATUS</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">USERNAME</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">FIRST NAME</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">LAST NAME</th>
                      <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">ROLE</th>
                      <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={7} className={`px-4 py-6 text-center text-[13px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          Loading users…
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className={`px-4 py-6 text-center text-[13px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <tr
                          key={user.id ?? user._id ?? index}
                          className={`border-b last:border-b-0 transition-colors duration-150 ${
                            isDark ? "border-white/[0.04] hover:bg-[#2e2e2e]" : "border-slate-50 hover:bg-slate-50/60"
                          }`}
                        >
                          <td className={`px-4 py-3 text-[11px] whitespace-nowrap ${isDark ? "text-slate-600" : "text-slate-400"}`}>{index + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                              String(user.account_status || user.status || "").toUpperCase() === "ACTIVE"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}>
                              {user.account_status || user.status}
                            </span>
                          </td>
                          <td className={`px-4 py-3 text-[11px] font-mono whitespace-nowrap ${isDark ? "text-slate-400" : "text-slate-500"}`}>{user.username}</td>
                          <td className={`px-4 py-3 text-[12px] whitespace-nowrap ${isDark ? "text-slate-300" : "text-slate-700"}`}>{user.firstName || user.first_name || user.name}</td>
                          <td className={`px-4 py-3 text-[12px] whitespace-nowrap ${isDark ? "text-slate-300" : "text-slate-700"}`}>{user.lastName || user.last_name}</td>
                          <td className={`px-4 py-3 text-[12px] whitespace-nowrap ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                            <span className="inline-flex items-center gap-1.5">
                              <UserRound size={12} className="text-[#7094ff]" />
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={handleEditUser}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#7094ff] hover:bg-[#7094ff]/10 transition-all duration-150"
                                title="Edit"
                              >
                                <Edit size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-150"
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────── POLICY CONTROLLER MODAL (light opacity backdrop + locked screen) ───────────── */}
      {editModalOpen && (
 <div
  className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
  style={{
    background: isDark
      ? "rgba(2, 6, 23, 0.75)"
      : "rgba(15, 23, 42, 0.60)",
    backdropFilter: "blur(1.5px)",
    WebkitBackdropFilter: "blur(6px)",
  }}
  onClick={handleCloseEditModal}
>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-5xl rounded-2xl p-5 my-6"
            style={{
              background: isDark ? "#0A1020" : "#ffffff",
              border: isDark
                ? "1px solid rgba(148,163,184,0.15)"
                : "1px solid #e2e8f0",
              boxShadow: isDark
                ? "0 24px 80px rgba(0,0,0,0.75)"
                : "0 24px 80px rgba(0,0,0,0.20)",
            }}
          >

            {/* ── Section 1: Policy Controller ── */}
            <div
              className="rounded-2xl p-5 mb-4"
              style={{
                background: isDark ? "#0F172A" : "#ffffff",
                border: isDark
                  ? "1px solid rgba(148,163,184,0.18)"
                  : "1px solid #e2e8f0",
              }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(112,148,255,0.12)",
                      border: "1px solid rgba(112,148,255,0.30)",
                    }}
                  >
                    <ShieldCheck size={18} className="text-[#7094ff]" />
                  </div>
                  <div>
                    <h3 className={`text-[14px] font-semibold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                      Policy Controller
                    </h3>
                    <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                      Configure and manage security policies and controls
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                    Step 1 of 2
                  </span>
                  <GlassButton
                    onClick={toggleSelectAllScopes}
                    variant="tab_active"
                    className="px-3 py-1 text-[11px] font-semibold"
                  >
                    Select All
                  </GlassButton>
                </div>
              </div>

              {/* Module tiles - first 9 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {ModuleScope.slice(0, 9).map((opt) => {
                  const Icon = opt.icon;
                  const isChecked = selectedScopes.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleScope(opt.value)}
                      className="rounded-xl p-3 text-left transition-all duration-200"
                      style={{
                        background: isDark ? "rgba(15,23,42,0.4)" : "transparent",
                        border: isChecked
                          ? "1px solid rgba(112,148,255,0.55)"
                          : isDark
                          ? "1px solid rgba(148,163,184,0.18)"
                          : "1px solid #e2e8f0",
                        boxShadow: isChecked
                          ? "0 0 0 2px rgba(112,148,255,0.12)"
                          : "none",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "rgba(112,148,255,0.12)",
                            border: "1px solid rgba(112,148,255,0.25)",
                          }}
                        >
                          <Icon size={15} className="text-[#7094ff]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[12px] font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            {opt.label}
                          </p>
                          <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                            {opt.desc}
                          </p>
                        </div>
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            border: isChecked
                              ? "1px solid #7094ff"
                              : isDark
                              ? "1px solid rgba(148,163,184,0.4)"
                              : "1px solid #cbd5e1",
                            background: isChecked ? "#7094ff" : "transparent",
                          }}
                        >
                          {isChecked && <Check size={12} className="text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Section 2: Incident and User Control ── */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: isDark ? "#0F172A" : "#ffffff",
                border: isDark
                  ? "1px solid rgba(148,163,184,0.18)"
                  : "1px solid #e2e8f0",
              }}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(112,148,255,0.12)",
                      border: "1px solid rgba(112,148,255,0.30)",
                    }}
                  >
                    <Users size={18} className="text-[#7094ff]" />
                  </div>
                  <div>
                    <h3 className={`text-[14px] font-semibold ${isDark ? "text-slate-100" : "text-slate-800"}`}>
                      Incident and User Control
                    </h3>
                    <p className={`text-[11px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                      Manage users, incidents and reports
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[11px] ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                    Step 2 of 2
                  </span>
                  {/* <GlassButton
                    onClick={toggleSelectAllScopes}
                    variant="tab_active"
                    className="px-3 py-1 text-[11px] font-semibold"
                  >
                    Select All
                  </GlassButton> */}
                </div>
              </div>

              {/* Module tiles - last 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {ModuleScope.slice(9).map((opt) => {
                  const Icon = opt.icon;
                  const isChecked = selectedScopes.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleScope(opt.value)}
                      className="rounded-xl p-3 text-left transition-all duration-200"
                      style={{
                        background: isDark ? "rgba(15,23,42,0.4)" : "transparent",
                        border: isChecked
                          ? "1px solid rgba(112,148,255,0.55)"
                          : isDark
                          ? "1px solid rgba(148,163,184,0.18)"
                          : "1px solid #e2e8f0",
                        boxShadow: isChecked
                          ? "0 0 0 2px rgba(112,148,255,0.12)"
                          : "none",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: "rgba(112,148,255,0.12)",
                            border: "1px solid rgba(112,148,255,0.25)",
                          }}
                        >
                          <Icon size={15} className="text-[#7094ff]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[12px] font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                            {opt.label}
                          </p>
                          <p className={`text-[10px] mt-0.5 ${isDark ? "text-slate-500" : "text-slate-500"}`}>
                            {opt.desc}
                          </p>
                        </div>
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{
                            border: isChecked
                              ? "1px solid #7094ff"
                              : isDark
                              ? "1px solid rgba(148,163,184,0.4)"
                              : "1px solid #cbd5e1",
                            background: isChecked ? "#7094ff" : "transparent",
                          }}
                        >
                          {isChecked && <Check size={12} className="text-white" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer buttons */}
              <div className="mt-5 flex items-center justify-end gap-3">
                <GlassButton
                  onClick={handleCloseEditModal}
                  variant="default"
                  className="px-4 py-1.5 text-[12px]"
                >
                  <ChevronLeft size={13} /> Previous
                </GlassButton>

                <GlassButton
                  onClick={() => {
                    console.log("Selected scopes:", selectedScopes);
                    handleCloseEditModal();
                  }}
                  variant="primary"
                  className="px-4 py-1.5 text-[12px] font-semibold"
                >
                  Next <ChevronRight size={13} />
                </GlassButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Setting;










