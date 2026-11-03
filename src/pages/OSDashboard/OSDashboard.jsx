
import React, { useState, useEffect } from "react";
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

  const getRequestKey = (osName, branch) => `${osName}::${branch}`;

  // --------------------------------------------------
  // LOAD BRANCHES
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadBranches = async () => {
      try {
        const res = await dashboardService.getBranch();

        const list =
          res?.data?.branches ||
          res?.data ||
          res?.branches ||
          [];

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

    // Use already loaded data if available
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
      const res =
        await dashboardService.getIpAddressesByBranchAndOs({
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

  const handleOpenModify = (osName, branch, ip) => {
    setSelectedDevice({
      osName,
      branch,
      ip,
    });

    setNewBranch(branch);
    setModalError("");
    setOpenMenu(null);
    setShowModifyModal(true);
  };

  // --------------------------------------------------
  // SAVE MODIFIED BRANCH
  // --------------------------------------------------

  const handleSaveBranch = async () => {
    if (!selectedDevice || !newBranch) {
      setModalError("Please select a branch.");
      return;
    }

    const { osName, branch: oldBranch, ip } = selectedDevice;

    if (oldBranch === newBranch) {
      setShowModifyModal(false);
      return;
    }

    const oldKey = getRequestKey(osName, oldBranch);
    const newKey = getRequestKey(osName, newBranch);

    try {
      setSaving(true);
      setModalError("");

      // Optional backend callback.
      // Pass an API update function through onUpdateDeviceBranch.
      if (onUpdateDeviceBranch) {
        await onUpdateDeviceBranch({
          deviceIp: ip,
          osType: OS_TO_BACKEND[osName] || osName,
          oldBranch,
          newBranch,
        });
      }

      // Update the dashboard data locally
      setDevicesData((prev) => {
        const oldDevices = prev[oldKey] || [];
        const newDevices = prev[newKey] || [];

        return {
          ...prev,
          [oldKey]: oldDevices.filter((device) => device !== ip),
          [newKey]: newDevices.includes(ip)
            ? newDevices
            : [...newDevices, ip],
        };
      });

      // Show the destination branch after modification
      setSelectedBranches((prev) => ({
        ...prev,
        [osName]: newBranch,
      }));

      // If destination branch has not been loaded, fetch it next time
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
  // STYLES
  // --------------------------------------------------

  const cardBackground = isDark ? "#020617" : "#ffffff";
  const innerBackground = isDark ? "#0a101d" : "#ffffff";
  const borderColor = isDark ? "#1e293b" : "#e2e8f0";
  const textColor = isDark ? "#e2e8f0" : "#1e293b";
  const mutedColor = isDark ? "#94a3b8" : "#64748b";

  const styles = {
    page: {
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
      border: "1px solid #4f6cf7",
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
    {
      name: "Mac - OS",
      icon: <Monitor size={16} color="#4f6cf7" />,
    },
    {
      name: "Linux - OS",
      icon: <Laptop size={16} color="#4f6cf7" />,
    },
    {
      name: "Windows",
      icon: <MonitorSmartphone size={16} color="#4f6cf7" />,
    },
  ];

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.headerCard}>
        <h2 style={styles.panelTitle}>OS Dashboard</h2>

        <div style={styles.panelSubtitle}>
          Configure policy, source, destination control details.
        </div>
      </div>

      {/* OS GRID */}
      <div style={styles.grid}>
        {osTypes.map((os) => {
          const activeBranch = selectedBranches[os.name];

          const requestKey = activeBranch
            ? getRequestKey(os.name, activeBranch)
            : "";

          const isLoading = loadingDevices[requestKey];
          const currentIps = devicesData[requestKey] || [];
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

                  const branchKey = getRequestKey(os.name, branch);
                  const branchIps = devicesData[branchKey] || [];

                  return (
                    <div
                      key={branch}
                      style={{ display: "flex", flexDirection: "column" }}
                    >
                      {/* BRANCH BUTTON */}
                      <div
                        style={{
                          ...styles.branchBtn,
                          ...(isActive ? styles.branchBtnActive : {}),
                        }}
                        onClick={() => handleBranchClick(os.name, branch)}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = isDark
                              ? "#0f1f3a"
                              : "#f8fafc";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = innerBackground;
                          }
                        }}
                      >
                        <Building2
                          size={18}
                          color={isActive ? "#4f6cf7" : mutedColor}
                        />

                        <span>{branch}</span>
                      </div>

                      {/* DEVICE TREE */}
                      {isActive && (
                        <div style={styles.treeContainer}>
                          {!isLoading &&
                            !errorMsg &&
                            currentIps.length > 0 && (
                              <div style={styles.treeVerticalLine} />
                            )}

                          {isLoading ? (
                            <div style={styles.emptyText}>
                              Loading devices...
                            </div>
                          ) : errorMsg ? (
                            <div style={styles.errorText}>
                              <AlertCircle size={14} />
                              {errorMsg}
                            </div>
                          ) : currentIps.length === 0 ? (
                            <div style={styles.emptyText}>
                              No devices found.
                            </div>
                          ) : (
                            currentIps.map((ip, index) => {
                              const menuId = `${os.name}-${branch}-${ip}`;

                              return (
                                <div
                                  key={`${ip}-${index}`}
                                  style={styles.treeRow}
                                >
                                  <div style={styles.treeHorizontalLine} />

                                  <div style={styles.deviceItem}>
                                    <Monitor
                                      size={14}
                                      color={isDark ? "#5b8def" : "#4f6cf7"}
                                    />

                                    <span
                                      style={{
                                        flex: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                      title={ip}
                                    >
                                      {ip}
                                    </span>

                                    {/* THREE DOT MENU */}
                                    <div
                                      style={{
                                        position: "relative",
                                        flexShrink: 0,
                                      }}
                                    >
                                      <button
                                        type="button"
                                        title="Device options"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenMenu(
                                            openMenu === menuId ? null : menuId
                                          );
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

                                      {/* DROPDOWN MENU */}
                                      {openMenu === menuId && (
                                        <div
                                          style={{
                                            position: "absolute",
                                            right: 0,
                                            top: "28px",
                                            width: "155px",
                                            zIndex: 50,
                                            background: cardBackground,
                                            border: `1px solid ${borderColor}`,
                                            borderRadius: "7px",
                                            padding: "5px",
                                            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                                          }}
                                        >
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleOpenModify(
                                                os.name,
                                                branch,
                                                ip
                                              )
                                            }
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
                                              e.currentTarget.style.background =
                                                isDark ? "#1e293b" : "#f1f5f9";
                                            }}
                                            onMouseLeave={(e) => {
                                              e.currentTarget.style.background =
                                                "transparent";
                                            }}
                                          >
                                            <Pencil size={13} color="#4f6cf7" />
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
              background: cardBackground,
              border: `1px solid ${borderColor}`,
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
            }}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div>
                <h3
                  style={{
                    color: textColor,
                    fontSize: "15px",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  Modify Device Branch
                </h3>

                <p
                  style={{
                    color: mutedColor,
                    fontSize: "11px",
                    margin: "5px 0 0",
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
                  border: "none",
                  background: "transparent",
                  color: mutedColor,
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <X size={19} />
              </button>
            </div>

            {/* DEVICE DETAILS */}
            <div
              style={{
                background: innerBackground,
                border: `1px solid ${borderColor}`,
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  fontSize: "10px",
                  color: mutedColor,
                  marginBottom: "5px",
                }}
              >
                DEVICE IP ADDRESS
              </div>

              <div
                style={{
                  color: textColor,
                  fontSize: "13px",
                  fontWeight: 600,
                  wordBreak: "break-all",
                }}
              >
                {selectedDevice.ip}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  marginTop: "9px",
                  fontSize: "11px",
                  color: mutedColor,
                }}
              >
                <span>{selectedDevice.osName}</span>
                <span>•</span>
                <span>{selectedDevice.branch}</span>
              </div>
            </div>

            {/* BRANCH SELECT */}
            <label
              style={{
                display: "block",
                color: textColor,
                fontSize: "12px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Select New Branch
            </label>

            <div style={{ position: "relative" }}>
              <select
                value={newBranch}
                onChange={(e) => setNewBranch(e.target.value)}
                disabled={saving}
                style={{
                  width: "100%",
                  padding: "11px 35px 11px 12px",
                  borderRadius: "7px",
                  border: `1px solid ${borderColor}`,
                  background: innerBackground,
                  color: textColor,
                  fontSize: "12px",
                  outline: "none",
                  appearance: "none",
                  cursor: "pointer",
                }}
              >
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={15}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: mutedColor,
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* MODAL ERROR */}
            {modalError && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "11px",
                  marginTop: "10px",
                }}
              >
                {modalError}
              </div>
            )}

            {/* MODAL ACTIONS */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "9px",
                marginTop: "22px",
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
                  padding: "9px 15px",
                  borderRadius: "7px",
                  border: `1px solid ${borderColor}`,
                  background: "transparent",
                  color: textColor,
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
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
                  gap: "7px",
                  padding: "9px 16px",
                  borderRadius: "7px",
                  border: "1px solid #4f6cf7",
                  background: "#4f6cf7",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.65 : 1,
                }}
              >
                {saving ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Save size={13} />
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
