import React, { useState, useEffect, useRef } from "react";
import {
  Monitor,
  Laptop,
  MonitorSmartphone,
  Building2,
  AlertCircle,
  MoreVertical,
  Pencil,
  X,
  Save,
  ChevronDown,
  Loader2,
  Search,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";
import { dashboardService } from "../../services/dashboardService";

const OS_TO_BACKEND = {
  "Mac - OS": "macOS",
  "Linux - OS": "LinuxOS",
  Windows: "Windows",
};

const DEFAULT_BRANCHES = ["Mumbai", "Vashi", "Pune"];

export default function OSDashboard({ onUpdateDeviceBranch }) {
  const { isDark } = useTheme();

  const [branches, setBranches] = useState(DEFAULT_BRANCHES);
  const [selectedBranches, setSelectedBranches] = useState({});
  const [devicesData, setDevicesData] = useState({});
  const [loadingDevices, setLoadingDevices] = useState({});
  const [errors, setErrors] = useState({});

  // Three-dot menu and modal states
  const [openMenu, setOpenMenu] = useState(null);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [newBranch, setNewBranch] = useState("");
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  
  // Custom Dropdown States
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const getRequestKey = (osName, branch) => `${osName}::${branch}`;

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --------------------------------------------------
  // LOAD BRANCHES
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadBranches = async () => {
      try {
        const res = await dashboardService.getBranch();

        const list = res?.data?.branches || res?.data || res?.branches || [];

        if (Array.isArray(list) && list.length > 0) {
          const names = list
            .map((b) =>
              typeof b === "string"
                ? b
                : b?.branchName || b?.branch || b?.name
            )
            .filter(Boolean);

          if (mounted && names.length > 0) {
            setBranches(names);
          }
        }
      } catch (err) {
        console.warn("Branch fetch failed, using defaults:", err);
      }
    };

    loadBranches();

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------
  // FETCH DEVICES BY BRANCH AND OS
  // --------------------------------------------------

  const handleBranchClick = async (osName, branch) => {
    if (selectedBranches[osName] === branch) {
      setSelectedBranches((prev) => {
        const next = { ...prev };
        delete next[osName];
        return next;
      });
      return;
    }

    setSelectedBranches((prev) => ({
      ...prev,
      [osName]: branch,
    }));

    const requestKey = getRequestKey(osName, branch);

    if (devicesData[requestKey]) {
      return;
    }

    setLoadingDevices((prev) => ({
      ...prev,
      [requestKey]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [requestKey]: null,
    }));

    try {
      const res = await dashboardService.getIpAddressesByBranchAndOs({
        BRANCH_NAME: branch,
        OS_TYPE: OS_TO_BACKEND[osName] || osName,
      });

      const responseData = res?.data;
      const ips = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.data)
        ? responseData.data
        : [];

      setDevicesData((prev) => ({
        ...prev,
        [requestKey]: ips,
      }));
    } catch (err) {
      console.error("Fetch IPs failed:", err);
      setErrors((prev) => ({
        ...prev,
        [requestKey]: err?.message || "Failed to fetch devices",
      }));
    } finally {
      setLoadingDevices((prev) => ({
        ...prev,
        [requestKey]: false,
      }));
    }
  };

  // --------------------------------------------------
  // OPEN MODIFY BRANCH MODAL
  // --------------------------------------------------

  const handleOpenModify = (osName, branch, device) => {
    const deviceId = typeof device === "object" ? (device.ip || device.id) : device;
    const deviceName = typeof device === "object" ? (device.hostname || device.name || device.ip) : device;

    setSelectedDevice({
      osName,
      branch,
      ip: deviceId,
      name: deviceName,
    });

    setNewBranch(branch);
    setModalError("");
    setSearchQuery("");
    setIsDropdownOpen(false);
    setOpenMenu(null);
    setShowModifyModal(true);
  };

  // --------------------------------------------------
  // SAVE MODIFIED BRANCH & SHOW ALERT
  // --------------------------------------------------

  const handleSaveBranch = async () => {
    if (!selectedDevice || !newBranch) {
      setModalError("Please select a branch.");
      return;
    }

    const { osName, branch: oldBranch, ip, name } = selectedDevice;

    if (oldBranch === newBranch) {
      setShowModifyModal(false);
      return;
    }

    const payload = {
      deviceName: name,
      deviceIp: ip,
      osType: OS_TO_BACKEND[osName] || osName,
      currentBranch: oldBranch,
      newBranch: newBranch,
    };

    alert(`Payload being sent:\n\n${JSON.stringify(payload, null, 2)}`);

    const oldKey = getRequestKey(osName, oldBranch);
    const newKey = getRequestKey(osName, newBranch);

    try {
      setSaving(true);
      setModalError("");

      if (onUpdateDeviceBranch) {
        await onUpdateDeviceBranch(payload);
      }

      setDevicesData((prev) => {
        const oldDevices = prev[oldKey] || [];
        const newDevices = prev[newKey] || [];

        return {
          ...prev,
          [oldKey]: oldDevices.filter((d) => {
            const dId = typeof d === "object" ? (d.ip || d.id) : d;
            return dId !== ip;
          }),
          [newKey]: newDevices.some((d) => {
            const dId = typeof d === "object" ? (d.ip || d.id) : d;
            return dId === ip;
          })
            ? newDevices
            : [...newDevices, typeof name !== 'undefined' ? { ip: ip, hostname: name } : ip],
        };
      });

      setSelectedBranches((prev) => ({
        ...prev,
        [osName]: newBranch,
      }));

      if (!devicesData[newKey]) {
        setDevicesData((prev) => ({
          ...prev,
          [newKey]: [ip],
        }));
      }

      setShowModifyModal(false);
      setSelectedDevice(null);
    } catch (err) {
      console.error("Modify branch failed:", err);
      setModalError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to modify device branch."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // THEME STYLES (DYNAMIC BASED ON isDark)
  // --------------------------------------------------

  const cardBackground = isDark ? "#020617" : "#ffffff";
  const innerBackground = isDark ? "#0a101d" : "#f8fafc";
  const borderColor = isDark ? "#1e293b" : "#e2e8f0";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";
  const activeBlue = "#4f6cf7";
  const modalBackground = isDark ? "rgb(2, 6, 23)" : "#ffffff"; // Fixed for Light Mode

  const styles = {
    page: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: isDark ? "#cbd5e1" : "#1e293b",
      padding: "20px",
      margin: 0,
      minHeight: "100vh",
      boxSizing: "border-box",
    },
    headerCard: {
      background: cardBackground,
      border: `1px solid ${borderColor}`,
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "16px",
    },
    panelTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: textColor,
      margin: 0,
    },
    panelSubtitle: {
      fontSize: "12px",
      color: mutedColor,
      marginTop: "4px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "16px",
      alignItems: "start",
    },
    columnCard: {
      background: cardBackground,
      border: `1px solid ${borderColor}`,
      borderRadius: "10px",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    columnHeader: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "4px",
    },
    columnTitle: {
      fontSize: "14px",
      fontWeight: 600,
      color: textColor,
      margin: 0,
    },
    branchList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    branchBtn: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: 600,
      transition: "all 0.2s ease",
      background: innerBackground,
      border: `1px solid ${borderColor}`,
      color: isDark ? "#cbd5e1" : "#475569",
      boxSizing: "border-box",
    },
    branchBtnActive: {
      background: innerBackground,
      border: `1px solid ${activeBlue}`,
      color: textColor,
    },
    treeContainer: {
      marginTop: "8px",
      paddingLeft: "20px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    treeVerticalLine: {
      position: "absolute",
      left: "20px",
      top: "0px",
      bottom: "16px",
      width: "1px",
      background: borderColor,
      zIndex: 0,
    },
    treeRow: {
      display: "flex",
      alignItems: "center",
      position: "relative",
      zIndex: 1,
      paddingLeft: "16px",
      minWidth: 0,
    },
    treeHorizontalLine: {
      position: "absolute",
      left: "0px",
      top: "50%",
      width: "16px",
      height: "1px",
      background: borderColor,
    },
    deviceItem: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 12px",
      borderRadius: "6px",
      background: innerBackground,
      border: `1px solid ${borderColor}`,
      fontSize: "12px",
      color: isDark ? "#cbd5e1" : "#475569",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    },
    emptyText: {
      fontSize: "12px",
      color: mutedColor,
      padding: "8px 0",
      paddingLeft: "16px",
    },
    errorText: {
      fontSize: "12px",
      color: "#ef4444",
      padding: "8px 0",
      paddingLeft: "16px",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
  };

  const osTypes = [
    { name: "Mac - OS", icon: <Monitor size={16} color={activeBlue} /> },
    { name: "Linux - OS", icon: <Laptop size={16} color={activeBlue} /> },
    { name: "Windows", icon: <MonitorSmartphone size={16} color={activeBlue} /> },
  ];

  const filteredBranches = branches.filter(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={styles.page}>
      <div style={styles.headerCard}>
        <h2 style={styles.panelTitle}>OS Dashboard</h2>
        <div style={styles.panelSubtitle}>
          Configure policy, source, destination control details.
        </div>
      </div>

      <div style={styles.grid}>
        {osTypes.map((os) => {
          const activeBranch = selectedBranches[os.name];
          const requestKey = activeBranch ? getRequestKey(os.name, activeBranch) : "";
          const isLoading = loadingDevices[requestKey];
          const currentDevices = devicesData[requestKey] || [];
          const errorMsg = errors[requestKey];

          return (
            <div key={os.name} style={styles.columnCard}>
              <div style={styles.columnHeader}>
                {os.icon}
                <h3 style={styles.columnTitle}>{os.name}</h3>
              </div>

              <div style={styles.branchList}>
                {branches.map((branch) => {
                  const isActive = activeBranch === branch;
                  
                  return (
                    <div key={branch} style={{ display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          ...styles.branchBtn,
                          ...(isActive ? styles.branchBtnActive : {}),
                        }}
                        onClick={() => handleBranchClick(os.name, branch)}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = isDark ? "#0f1f3a" : "#f1f5f9";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = innerBackground;
                        }}
                      >
                        <Building2 size={18} color={isActive ? activeBlue : mutedColor} />
                        <span>{branch}</span>
                      </div>

                      {isActive && (
                        <div style={styles.treeContainer}>
                          {!isLoading && !errorMsg && currentDevices.length > 0 && (
                            <div style={styles.treeVerticalLine} />
                          )}

                          {isLoading ? (
                            <div style={styles.emptyText}>Loading devices...</div>
                          ) : errorMsg ? (
                            <div style={styles.errorText}>
                              <AlertCircle size={14} />
                              {errorMsg}
                            </div>
                          ) : currentDevices.length === 0 ? (
                            <div style={styles.emptyText}>No devices found.</div>
                          ) : (
                            currentDevices.map((device, index) => {
                              const deviceId = typeof device === "object" ? (device.ip || device.id) : device;
                              const deviceName = typeof device === "object" ? (device.hostname || device.name || device.ip) : device;
                              const menuId = `${os.name}-${branch}-${deviceId}`;

                              return (
                                <div 
                                  key={`${deviceId}-${index}`} 
                                  style={{
                                    ...styles.treeRow,
                                    zIndex: openMenu === menuId ? 100 : 1 
                                  }}
                                >
                                  <div style={styles.treeHorizontalLine} />

                                  <div style={styles.deviceItem}>
                                    <Monitor size={14} color={isDark ? "#5b8def" : activeBlue} />
                                    <span
                                      style={{
                                        flex: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                      title={deviceName}
                                    >
                                      {deviceName}
                                    </span>

                                    <div style={{ position: "relative", flexShrink: 0 }}>
                                      <button
                                        type="button"
                                        title="Device options"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenMenu(openMenu === menuId ? null : menuId);
                                        }}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          border: "none",
                                          background: "transparent",
                                          color: mutedColor,
                                          cursor: "pointer",
                                          padding: "4px",
                                          borderRadius: "5px",
                                        }}
                                      >
                                        <MoreVertical size={17} />
                                      </button>

                                      {openMenu === menuId && (
                                        <div
                                          style={{
                                            position: "absolute",
                                            right: 0,
                                            top: "100%",
                                            marginTop: "4px",
                                            width: "155px",
                                            zIndex: 9999,
                                            background: cardBackground,
                                            border: `1px solid ${borderColor}`,
                                            borderRadius: "7px",
                                            padding: "5px",
                                            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                                          }}
                                        >
                                          <button
                                            type="button"
                                            onClick={() => handleOpenModify(os.name, branch, device)}
                                            style={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: "9px",
                                              width: "100%",
                                              padding: "9px 10px",
                                              border: "none",
                                              borderRadius: "5px",
                                              background: "transparent",
                                              color: textColor,
                                              cursor: "pointer",
                                              fontSize: "12px",
                                              textAlign: "left",
                                            }}
                                            onMouseEnter={(e) => {
                                              e.currentTarget.style.background = isDark ? "#1e293b" : "#f1f5f9";
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.background = "transparent";
                                            }}
                                          >
                                            <Pencil size={13} color={activeBlue} />
                                            Modify Branch
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODIFY BRANCH MODAL */}
      {showModifyModal && selectedDevice && (
        <div
          onClick={() => {
            if (!saving) {
              setShowModifyModal(false);
              setSelectedDevice(null);
            }
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(3px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              background: modalBackground, 
              border: `1px solid ${borderColor}`,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div>
                <h3
                  style={{
                    color: textColor,
                    fontSize: "18px",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Modify Device Branch
                </h3>
                <p
                  style={{
                    color: mutedColor,
                    fontSize: "12px",
                    margin: "6px 0 0",
                  }}
                >
                  Change the branch assigned to this device.
                </p>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setShowModifyModal(false);
                  setSelectedDevice(null);
                }}
                style={{
                  border: `1px solid ${borderColor}`,
                  background: "transparent",
                  color: textColor,
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div
              style={{
                background: innerBackground,
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: mutedColor,
                  marginBottom: "8px",
                  fontWeight: 600,
                  letterSpacing: "0.5px"
                }}
              >
                DEVICE IP ADDRESS
              </div>

              <div
                style={{
                  color: textColor,
                  fontSize: "15px",
                  fontWeight: 600,
                  wordBreak: "break-all",
                }}
              >
                {selectedDevice.name}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  marginTop: "8px",
                  fontSize: "13px",
                  color: mutedColor,
                }}
              >
                <span>{selectedDevice.osName}</span>
                <span>•</span>
                <span>{selectedDevice.branch}</span>
              </div>
            </div>

            <label
              style={{
                display: "block",
                color: mutedColor,
                fontSize: "11px",
                fontWeight: 600,
                marginBottom: "8px",
                letterSpacing: "0.5px"
              }}
            >
              SELECT NEW BRANCH
            </label>

            <div style={{ position: "relative", marginBottom: "20px" }} ref={dropdownRef}>
              <div
                onClick={() => !saving && setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  border: `1px solid ${isDropdownOpen ? activeBlue : borderColor}`,
                  background: innerBackground,
                  color: textColor,
                  fontSize: "13px",
                  cursor: saving ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: isDropdownOpen ? `0 0 0 2px ${activeBlue}33` : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                  <Search size={16} color={mutedColor} />
                  <input
                    type="text"
                    value={isDropdownOpen ? searchQuery : newBranch}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDropdownOpen) setIsDropdownOpen(true);
                    }}
                    placeholder={newBranch || "Select Branch"}
                    disabled={saving}
                    style={{
                      border: "none",
                      background: "transparent",
                      color: textColor,
                      fontSize: "13px",
                      outline: "none",
                      width: "100%",
                      cursor: isDropdownOpen ? "text" : "pointer",
                    }}
                  />
                </div>
                <ChevronDown
                  size={16}
                  color={mutedColor}
                  style={{
                    transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </div>

              {isDropdownOpen && !saving && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    background: innerBackground,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    zIndex: 50,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ maxHeight: "160px", overflowY: "auto" }}>
                    {filteredBranches.length === 0 ? (
                      <div style={{ padding: "12px", fontSize: "13px", color: mutedColor, textAlign: "center" }}>
                        No branches found.
                      </div>
                    ) : (
                      filteredBranches.map((branch) => (
                        <div
                          key={branch}
                          onClick={() => {
                            setNewBranch(branch);
                            setIsDropdownOpen(false);
                            setSearchQuery("");
                          }}
                          style={{
                            padding: "12px 16px",
                            cursor: "pointer",
                            fontSize: "13px",
                            color: textColor,
                            background: newBranch === branch ? (isDark ? "#1e293b" : "#f1f5f9") : "transparent",
                            borderBottom: `1px solid ${borderColor}`,
                          }}
                          onMouseEnter={(e) => {
                            if (newBranch !== branch) {
                              e.currentTarget.style.background = isDark ? "#1e293b" : "#f1f5f9";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (newBranch !== branch) {
                              e.currentTarget.style.background = "transparent";
                            }
                          }}
                        >
                          {branch}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {modalError && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "12px",
                  marginBottom: "16px",
                }}
              >
                {modalError}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                marginTop: "10px",
              }}
            >
              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setShowModifyModal(false);
                  setSelectedDevice(null);
                }}
                style={{
                  padding: "10px 18px",
                  borderRadius: "7px",
                  border: `1px solid ${borderColor}`,
                  background: "transparent",
                  color: textColor,
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={saving || !newBranch}
                onClick={handleSaveBranch}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  borderRadius: "7px",
                  border: `1px solid ${activeBlue}`,
                  background: activeBlue,
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.65 : 1,
                }}
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}