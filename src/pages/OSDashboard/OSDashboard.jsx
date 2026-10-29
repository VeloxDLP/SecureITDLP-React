import React, { useState, useEffect } from "react";
import {
  Monitor,
  Laptop,
  MonitorSmartphone,
  Building2,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { dashboardService } from "../../services/dashboardService";

// ⚠️ Must match DB `os_type` values exactly
const OS_TO_BACKEND = {
  "Mac - OS":   "macOS",
  "Linux - OS": "LinuxOS",
  "Windows":    "Windows",
};

const DEFAULT_BRANCHES = ["Mumbai", "Vashi", "Pune"];

export default function OSDashboard() {
  const { isDark } = useTheme();

  const [branches, setBranches]               = useState(DEFAULT_BRANCHES);
  const [selectedBranches, setSelectedBranches] = useState({}); // { osName: branch }
  const [devicesData, setDevicesData]         = useState({});   // { osName: [ips] }
  const [loadingDevices, setLoadingDevices]   = useState({});   // { osName: bool }
  const [errors, setErrors]                   = useState({});   // { osName: msg }

  /* =========================================================
     Load real branches (optional — falls back to defaults)
  ========================================================= */
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const res = await dashboardService.getBranch();
        const list = res?.data?.branches || res?.data || res?.branches || [];
        if (Array.isArray(list) && list.length > 0) {
          const names = list
            .map((b) => (typeof b === "string" ? b : b?.branchName || b?.branch || b?.name))
            .filter(Boolean);
          if (names.length > 0) setBranches(names);
        }
      } catch (err) {
        console.warn("Branch fetch failed, using defaults:", err);
      }
    };
    loadBranches();
  }, []);

  /* =========================================================
     Click handler — POST /ipAddressesByBranchAndOs
  ========================================================= */
  const handleBranchClick = async (osName, branch) => {
    // Toggle off
    if (selectedBranches[osName] === branch) {
      setSelectedBranches((prev) => {
        const next = { ...prev };
        delete next[osName];
        return next;
      });
      setErrors((prev) => ({ ...prev, [osName]: null }));
      return;
    }

    setSelectedBranches((prev) => ({ ...prev, [osName]: branch }));
    setLoadingDevices((prev) => ({ ...prev, [osName]: true }));
    setErrors((prev) => ({ ...prev, [osName]: null }));
    setDevicesData((prev) => ({ ...prev, [osName]: [] }));

    try {
      const res = await dashboardService.getIpAddressesByBranchAndOs({
        BRANCH_NAME: branch,
        OS_TYPE: OS_TO_BACKEND[osName] || osName,
      });

      setDevicesData((prev) => ({
        ...prev,
        [osName]: Array.isArray(res?.data) ? res.data : [],
      }));
    } catch (err) {
      console.error("Fetch IPs failed:", err);
      setErrors((prev) => ({
        ...prev,
        [osName]: err?.message || "Failed to fetch",
      }));
    } finally {
      setLoadingDevices((prev) => ({ ...prev, [osName]: false }));
    }
  };

  /* =========================================================
     STYLES
  ========================================================= */
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
      background: isDark ? "#020617" : "#ffffff",
      border: isDark ? "1px solid #1a2a4a" : "1px solid #e2e8f0",
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "16px",
    },
    panelTitle: {
      fontSize: "16px",
      fontWeight: 600,
      color: isDark ? "#e2e8f0" : "#1e293b",
      margin: 0,
    },
    panelSubtitle: {
      fontSize: "12px",
      color: isDark ? "#7c87a3" : "#64748b",
      marginTop: "4px",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "16px",
      alignItems: "start", // 👈 THE FIX: Prevents all cards from stretching to the tallest card's height
    },
    columnCard: {
      background: isDark ? "#020617" : "#ffffff",
      border: isDark ? "1px solid #1a2a4a" : "1px solid #e2e8f0",
      borderRadius: "10px",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      // Removed align-self: stretch if it existed
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
      color: isDark ? "#e2e8f0" : "#1e293b",
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
      background: isDark ? "#0a101d" : "#ffffff",
      border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
      color: isDark ? "#cbd5e1" : "#475569",
      boxSizing: "border-box",
    },
    branchBtnActive: {
      background: isDark ? "#0a101d" : "#eff6ff",
      border: "1px solid #4f6cf7",
      color: isDark ? "#ffffff" : "#1e293b",
    },
    branchIcon: { color: isDark ? "#64748b" : "#94a3b8" },
    branchIconActive: { color: "#4f6cf7" },

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
      background: isDark ? "#1a2a4a" : "#cbd5e1",
      zIndex: 0,
    },
    treeRow: {
      display: "flex",
      alignItems: "center",
      position: "relative",
      zIndex: 1,
      paddingLeft: "16px",
    },
    treeHorizontalLine: {
      position: "absolute",
      left: "0px",
      top: "50%",
      width: "16px",
      height: "1px",
      background: isDark ? "#1a2a4a" : "#cbd5e1",
    },
    deviceItem: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 12px",
      borderRadius: "6px",
      background: isDark ? "#0a101d" : "#ffffff",
      border: isDark ? "1px solid #1e293b" : "1px solid #e2e8f0",
      fontSize: "12px",
      color: isDark ? "#cbd5e1" : "#475569",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    },
    emptyText: {
      fontSize: "12px",
      color: isDark ? "#64748b" : "#94a3b8",
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
    { name: "Mac - OS",   icon: <Monitor          size={16} color={isDark ? "#5b8def" : "#4f6cf7"} /> },
    { name: "Linux - OS", icon: <Laptop           size={16} color={isDark ? "#5b8def" : "#4f6cf7"} /> },
    { name: "Windows",    icon: <MonitorSmartphone size={16} color={isDark ? "#5b8def" : "#4f6cf7"} /> },
  ];

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.headerCard}>
        <h2 style={styles.panelTitle}>OS Dashboard</h2>
        <div style={styles.panelSubtitle}>
          Configure policy, source, destination control details.
        </div>
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {osTypes.map((os) => {
          const activeBranch = selectedBranches[os.name];
          const isLoading    = loadingDevices[os.name];
          const currentIps   = devicesData[os.name] || [];
          const errorMsg     = errors[os.name];

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
                      {/* BRANCH BUTTON */}
                      <div
                        style={{
                          ...styles.branchBtn,
                          ...(isActive ? styles.branchBtnActive : {}),
                        }}
                        onClick={() => handleBranchClick(os.name, branch)}
                        onMouseEnter={(e) => {
                          if (!isActive)
                            e.currentTarget.style.background = isDark ? "#0f1f3a" : "#f8fafc";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive)
                            e.currentTarget.style.background = isDark ? "#0a101d" : "#ffffff";
                        }}
                      >
                        <Building2
                          size={18}
                          style={isActive ? styles.branchIconActive : styles.branchIcon}
                        />
                        <span>{branch}</span>
                      </div>

                      {/* TREE OF IPs */}
                      {isActive && (
                        <div style={styles.treeContainer}>
                          {!isLoading && !errorMsg && currentIps.length > 0 && (
                            <div style={styles.treeVerticalLine}></div>
                          )}

                          {isLoading ? (
                            <div style={styles.emptyText}>Loading IPs...</div>
                          ) : errorMsg ? (
                            <div style={styles.errorText}>
                              <AlertCircle size={14} /> {errorMsg}
                            </div>
                          ) : currentIps.length === 0 ? (
                            <div style={styles.emptyText}>No devices found.</div>
                          ) : (
                            currentIps.map((ip, i) => (
                              <div key={i} style={styles.treeRow}>
                                <div style={styles.treeHorizontalLine}></div>
                                <div style={styles.deviceItem}>
                                  <Monitor
                                    size={14}
                                    color={isDark ? "#5b8def" : "#4f6cf7"}
                                  />
                                  <span>{ip}</span>
                                </div>
                              </div>
                            ))
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
    </div>
  );
}