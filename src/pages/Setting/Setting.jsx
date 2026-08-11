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
import { dashboardService } from "../../services/dashboardService";
import { alert as showAlert } from "../../components/ui/AlertModal";

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
  multiple = false,
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
  if (multiple) {
    const currentValues = value
      ? value.split(",").filter(Boolean)
      : [];

    if (currentValues.includes(val)) {
      // Remove value
      const updatedValues = currentValues.filter(
        (item) => item !== val
      );

      onChange(updatedValues.join(","));
    } else {
      // Add value
      onChange([...currentValues, val].join(","));
    }
  } else {
    // Normal single select
    onChange(val);
    setOpen(false);
  }
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
        {/* <span className={selected ? "text-slate-200" : "text-slate-500"}>
          {selected ? selected.label : placeholder}
        </span> */}
        <span className="text-slate-200">
          {multiple
            ? value
              ? normalised
                .filter((o) =>
                  value.split(",").includes(o.value)
                )
                .map((o) => o.label)
                .join(", ")
              : placeholder
            : selected
              ? selected.label
              : placeholder}
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
              const isSelected = multiple
                ? value
                  ?.split(",")
                  .filter(Boolean)
                  .includes(o.value)
                : o.value === value;
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
    scopedata:"",

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

  const handleCreateUser = async () => {
    const { userName, password, confirmPassword } = formData;
    if (!userName || !password || !confirmPassword) {
    showAlert({
      icon: 'error',
      title: 'Invalid fields',
      text: 'All fields are required',
      confirmButtonText: 'Cancel',
    });
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(formData.email)) {
    showAlert({
      icon: 'error',
      title: 'Invalid Email',
      text: 'Please enter a valid email address',
      confirmButtonText: 'Cancel',
    });
    return;
  }

  // Phone validation - exactly 10 digits
  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(formData.contactNumber)) {
    showAlert({
      icon: 'error',
      title: 'Invalid Contact Number',
      text: 'Please enter a valid 10-digit mobile number',
      confirmButtonText: 'Cancel',
    });
    return;
  }

  // Password validation
  if (password !== confirmPassword) {
    showAlert({
      icon: 'error',
      title: 'Incorrect Password',
      text: 'Password is not matching',
      confirmButtonText: 'Cancel',
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
              account_status:"ACTIVE",
              role: formData.userType,
              scope: formData.scopedata
          };

          
      try {
        // await dashboardService.CreateApplicationUser(userData);
        const response = await dashboardService.CreateApplicationUser(requestData);

        await showAlert({
          icon: 'success',
          title: 'User Saved',
          text: 'User Creation successful',
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

        console.log("API ERROR:", err);

        showAlert({
          icon: 'error',
          title: 'Username Unavailable',
          text: err.response?.data?.message || err.message || 'User already exists',
          confirmButtonText: 'Cancel',
        });
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
    { id: "create", label: "Create User", icon: <UserRound size={16} /> },
    { id: "list", label: "View User", icon: <Users size={16} /> },
  ];

  // ── Dropdown options ──
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
    ]


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

  const getPasswordStrength = (password) => {
  if (!password) {
    return {
      label: "",
      width: "w-0",
      color: "bg-slate-700",
      textColor: "text-slate-500",
    };
  }

  let score = 0;

  // Length
  if (password.length >= 8) score++;

  // Contains lowercase
  if (/[a-z]/.test(password)) score++;

  // Contains uppercase
  if (/[A-Z]/.test(password)) score++;

  // Contains number
  if (/[0-9]/.test(password)) score++;

  // Contains special character
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) {
    return {
      label: "Weak",
      width: "w-1/3",
      color: "bg-red-500",
      textColor: "text-red-400",
    };
  }

  if (score <= 4) {
    return {
      label: "Medium",
      width: "w-2/3",
      color: "bg-yellow-500",
      textColor: "text-yellow-400",
    };
  }

  return {
    label: "Strong",
    width: "w-full",
    color: "bg-green-500",
    textColor: "text-green-400",
  };
};

const passwordStrength = getPasswordStrength(formData.password);

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
                <span className="text-[11px] text-slate-500">
                  Password strength:
                </span>
                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${passwordStrength.width} ${passwordStrength.color}`}/>
                </div>

                <span
                  className={`text-[11px] ${passwordStrength.textColor}`}>
                  {passwordStrength.label}
                </span>
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
              <label className={labelClass}>Scope</label>
              {/* <Dropdown
                value={formData.scopedata}
                onChange={(val) => setFormData((prev) => ({ ...prev, scopedata: val }))}
                options={ScopeValue}
                placeholder="Select User scope"
              /> */}
              <Dropdown
                value={formData.scopedata}
                onChange={(val) =>
                  setFormData((prev) => ({
                    ...prev,
                    scopedata: val,
                  }))
                }
                options={ScopeValue}
                placeholder="Select User scope"
                multiple={true}
              />
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
        // ─── USER LIST PAGE – TABLE ──
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

    </div>
  );
}

export default Setting;