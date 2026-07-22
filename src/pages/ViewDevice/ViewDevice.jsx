import React, { useState, useEffect } from "react";
import { Settings, Eye, Search, Plus, Minus, Info } from "lucide-react";
import { dashboardService } from "../../services/dashboardService";
import { useTheme } from '../../context/ThemeContext';

export default function DeviceDashboard() {
  const { isDark } = useTheme();
  const [viewDeviceData, setViewDeviceData] = useState([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDeviceData();
  }, []);

  const fetchDeviceData = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getViewDevice();
      console.log("Viewdevice", response.data);
      
      const mappedData = response.data.map(item => ({
        branch: item.branchName,
        host: item.ipAddress,
        ip: item.deviceIp,
        user: item.userName,
        agentStatus: item.agentStatus,
        lastComm: formatDate(item.agentCommunication),
        zone: item.zoneName,
        serverIp: item.fixedUser
      }));
      
      setViewDeviceData(mappedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching device data:", err);
      setError("Failed to load device data. Please try again.");
      setViewDeviceData(getFallbackData());
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch {
      return dateString;
    }
  };

  const getFallbackData = () => [
    {
      branch: "PALGHAR",
      host: "DESKTOP-4N96LIG",
      ip: "10.30.13.60",
      user: "S1ANBY95",
      agentStatus: "Up",
      lastComm: "2026-05-15 15:39:40.251",
      zone: "Low",
      serverIp: "28.11.22.5",
    },
    {
      branch: "MUMBAI",
      host: "DESKTOP-7K82MNP",
      ip: "10.30.13.61",
      user: "S1ANBY96",
      agentStatus: "Down",
      lastComm: "2026-05-15 14:39:40.251",
      zone: "High",
      serverIp: "28.11.22.6",
    },
    {
      branch: "DELHI",
      host: "DESKTOP-3L54QRS",
      ip: "10.30.13.62",
      user: "S1ANBY97",
      agentStatus: "Up",
      lastComm: "2026-05-15 16:39:40.251",
      zone: "Medium",
      serverIp: "28.11.22.7",
    },
  ];

  const styles = {
    page: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: isDark ? "#cbd5e1" : "#1e293b",
      padding: "0",
      margin: "0",
      height: "100vh",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box",
    },
    panel: {
      background: isDark ? "#020617" : "#ffffff",
      border: isDark ? "1px solid #1a2a4a" : "1px solid #e2e8f0",
      borderRadius: "12px",
      overflow: "hidden",
      padding: "16px 20px",
      width: "100%",
      maxWidth: "1400px",
      height: "calc(100vh - 40px)", // Fixed height with padding
      display: "flex",
      flexDirection: "column",
    },
    panelHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "16px",
      flexWrap: "wrap",
      gap: "8px",
      flexShrink: 0, // Prevent header from shrinking
    },
    panelTitle: {
      fontSize: "18px",
      fontWeight: 600,
      color: isDark ? "#cdd5e6" : "#1e293b",
      margin: 0,
    },
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      flexWrap: "wrap",
    },
    pillBtn: {
      background: isDark ? "#020617" : "#f8fafc",
      border: isDark ? "1px solid #1a2a4a" : "1px solid #e2e8f0",
      color: isDark ? "#b7c0d8" : "#475569",
      fontSize: "11px",
      fontWeight: 500,
      padding: "5px 10px",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.15s ease",
      whiteSpace: "nowrap",
    },
    searchWrap: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      background: isDark ? "#020617" : "#f8fafc",
      border: isDark ? "1px solid #1a2a4a" : "1px solid #e2e8f0",
      borderRadius: "6px",
      padding: "4px 10px",
    },
    searchInput: {
      background: "transparent",
      border: "none",
      outline: "none",
      color: isDark ? "#e2e8f0" : "#1e293b",
      fontSize: "12px",
      width: "120px",
    },
    tableWrap: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minHeight: 0, // Critical for flex child scrolling
      gap: "6px",
    },
    headerRowCard: {
      display: "flex",
      alignItems: "center",
      background: isDark ? "#0f1f3a" : "#f1f5f9",
      borderRadius: "10px",
      padding: "10px 16px",
      gap: "12px",
      flexShrink: 0, // Keep header fixed
    },
    headerCell: {
      fontSize: "13px",
      fontWeight: 600,
      color: isDark ? "#aab3cc" : "#475569",
      flex: 1,
    },
    scrollableRows: {
      flex: 1,
      overflowY: "auto", // Enable vertical scrolling
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      paddingRight: "4px", // Space for scrollbar
      // Custom scrollbar styling
      scrollbarWidth: "thin",
      scrollbarColor: isDark ? "#1a2a4a transparent" : "#e2e8f0 transparent",
    },
    rowGroup: {
      background: isDark ? "#020617" : "#ffffff",
      borderRadius: "10px",
      overflow: "hidden",
      border: isDark ? "1px solid #1a2a4a" : "1px solid #e2e8f0",
      flexShrink: 0,
    },
    rowCard: {
      display: "flex",
      alignItems: "center",
      padding: "10px 16px",
      gap: "12px",
      cursor: "pointer",
      transition: "background 0.15s ease",
    },
    plusBtnUp: {
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      background: "#22c55e",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      marginRight: "6px",
      flexShrink: 0,
    },
    plusBtnDown: {
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      background: "#ef4444",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      marginRight: "6px",
      flexShrink: 0,
    },
    cell: {
      fontSize: "13px",
      color: isDark ? "#e2e8f0" : "#1e293b",
      flex: 1,
    },
    hostLink: {
      color: isDark ? "#5b8def" : "#4f6cf7",
      fontWeight: 500,
      textDecoration: "none",
      cursor: "pointer",
      fontSize: "13px",
    },
    detailsPanel: {
      background: isDark ? "#020617" : "#f8fafc",
      borderTop: isDark ? "1px solid #1a2a4a" : "1px solid #e2e8f0",
      padding: "14px 16px 16px 50px",
    },
    detailsHeading: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "13px",
      fontWeight: 600,
      color: isDark ? "#7bdc8f" : "#16a34a",
      marginBottom: "10px",
    },
    detailsDivider: {
      borderBottom: isDark ? "1px solid #1a2a4a" : "1px solid #e2e8f0",
      marginBottom: "12px",
    },
    detailsGrid: {
      display: "flex",
      gap: "80px",
      flexWrap: "wrap",
      alignItems: "center",
    },
    detailLabel: {
      fontSize: "10px",
      fontWeight: 600,
      color: isDark ? "#7c87a3" : "#64748b",
      letterSpacing: "0.5px",
      marginBottom: "4px",
      textTransform: "uppercase",
    },
    detailValue: {
      fontSize: "13px",
      fontWeight: 500,
      color: isDark ? "#e2e8f0" : "#1e293b",
    },
    detailItem: {
      display: "flex",
      flexDirection: "column",
    },
    detailItemRow: {
      display: "flex",
      alignItems: "center",
      gap: "60px",
    },
    eyeButton: {
      background: "transparent",
      border: isDark ? "1px solid #1a2a4a" : "1px solid #e2e8f0",
      borderRadius: "6px",
      padding: "3px 8px",
      cursor: "pointer",
      color: isDark ? "#8b95ad" : "#64748b",
      display: "flex",
      alignItems: "center",
      gap: "3px",
      fontSize: "11px",
      transition: "all 0.2s ease",
      marginTop: "4px",
    },
    statusPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      background: isDark ? "rgba(34,197,94,0.12)" : "rgba(34,197,94,0.1)",
      color: isDark ? "#4ade80" : "#16a34a",
      border: isDark ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(34,197,94,0.2)",
      borderRadius: "20px",
      padding: "2px 10px",
      fontSize: "12px",
      fontWeight: 600,
    },
    statusPillDown: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      background: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.1)",
      color: isDark ? "#f87171" : "#dc2626",
      border: isDark ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(239,68,68,0.2)",
      borderRadius: "20px",
      padding: "2px 10px",
      fontSize: "12px",
      fontWeight: 600,
    },
    statusDot: {
      width: "5px",
      height: "5px",
      borderRadius: "50%",
      background: isDark ? "#4ade80" : "#16a34a",
    },
    statusDotDown: {
      width: "5px",
      height: "5px",
      borderRadius: "50%",
      background: isDark ? "#f87171" : "#dc2626",
    },
    loading: {
      textAlign: "center",
      padding: "30px",
      color: isDark ? "#8b95ad" : "#64748b",
      fontSize: "14px",
    },
    error: {
      textAlign: "center",
      padding: "30px",
      color: isDark ? "#f87171" : "#dc2626",
      fontSize: "14px",
    },
    noData: {
      padding: "30px",
      textAlign: "center",
      color: isDark ? "#8b95ad" : "#94a3b8",
      fontSize: "13px",
    },
  };

  const filtered = viewDeviceData.filter((d) =>
    [d.branch, d.host, d.ip, d.user].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const toggleExpand = (i) => {
    setExpanded(expanded === i ? null : i);
  };

  const getStatusStyle = (status) => {
    if (status?.toLowerCase() === "up") {
      return styles.statusPill;
    }
    return styles.statusPillDown;
  };

  const getStatusDot = (status) => {
    if (status?.toLowerCase() === "up") {
      return styles.statusDot;
    }
    return styles.statusDotDown;
  };

  const getPlusButtonStyle = (status) => {
    if (status?.toLowerCase() === "up") {
      return styles.plusBtnUp;
    }
    return styles.plusBtnDown;
  };

  const handleEyeClick = (device) => {
    console.log("Eye button clicked for device:", device);
    alert(`Viewing details for device: ${device.host}`);
  };

  if (loading) {
    return <div style={styles.loading}>Loading devices...</div>;
  }

  if (error && viewDeviceData.length === 0) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.panel}>
        {/* Header Section - Always visible */}
        <div style={styles.panelHeader}>
          <h2 style={styles.panelTitle}>View Devices</h2>
          <div style={styles.headerRight}>
            <button style={styles.pillBtn}>Excel</button>
            <button style={styles.pillBtn}>Copy</button>
            <button style={styles.pillBtn}>CSV</button>
            <button style={styles.pillBtn}>PDF</button>
            <div style={styles.searchWrap}>
              <Search size={12} color={isDark ? "#7c87a3" : "#94a3b8"} />
              <input
                style={styles.searchInput}
                placeholder="Search identities"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Section - Flexible height */}
        <div style={styles.tableWrap}>
          {/* Header Row - Fixed */}
          <div style={styles.headerRowCard}>
            <div style={{ ...styles.headerCell, flex: 0.5 }}>Branch Name</div>
            <div style={{ ...styles.headerCell, flex: 0.8 }}>Host Name</div>
            <div style={{ ...styles.headerCell, flex: 0.7 }}>Device IP</div>
            <div style={{ ...styles.headerCell, flex: 0.8 }}>User Name</div>
          </div>

          {/* Scrollable Rows Container */}
          <div 
            style={styles.scrollableRows}
            className="custom-scrollbar"
          >
            {filtered.length === 0 ? (
              <div style={styles.noData}>
                No devices found
              </div>
            ) : (
              filtered.map((d, i) => (
                <div key={i} style={styles.rowGroup}>
                  <div 
                    style={{
                      ...styles.rowCard,
                      ...(expanded === i && {
                        background: isDark ? "rgba(79,108,247,0.05)" : "rgba(79,108,247,0.03)",
                      }),
                    }} 
                    onClick={() => toggleExpand(i)}
                  >
                    <button 
                      style={getPlusButtonStyle(d.agentStatus)} 
                      title="Toggle details"
                    >
                      {expanded === i ? (
                        <Minus size={12} color="#ffffff" strokeWidth={4} />
                      ) : (
                        <Plus size={12} color="#ffffff" strokeWidth={4} />
                      )}
                    </button>
                    <div style={{ ...styles.cell, flex: 0.5 }}>{d.branch || "N/A"}</div>
                    <div style={{ flex: 0.8 }}>
                      <span style={styles.hostLink}>{d.host || "N/A"}</span>
                    </div>
                    <div style={{ ...styles.cell, flex: 0.7 }}>{d.ip || "N/A"}</div>
                    <div style={{ ...styles.cell, flex: 0.8 }}>{d.user || "N/A"}</div>
                  </div>

                  {expanded === i && (
                    <div style={styles.detailsPanel}>
                      <div style={styles.detailsHeading}>
                        <Info size={13} />
                        Device Details
                      </div>
                      <div style={styles.detailsDivider} />
                      <div style={styles.detailsGrid}>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Agent Status</div>
                          <span style={getStatusStyle(d.agentStatus)}>
                            <span style={getStatusDot(d.agentStatus)} />
                            {d.agentStatus || "N/A"}
                          </span>
                        </div>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>
                            Last Agent Communication
                          </div>
                          <div style={styles.detailValue}>{d.lastComm || "N/A"}</div>
                        </div>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Zone</div>
                          <div style={styles.detailValue}>{d.zone || "N/A"}</div>
                        </div>
                        <div style={styles.detailItem}>
                          <div style={styles.detailLabel}>Server IP</div>
                          <div style={styles.detailItemRow}>
                            <div style={styles.detailValue}>{d.serverIp || "N/A"}</div>
                            <button 
                              style={styles.eyeButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEyeClick(d);
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = isDark ? "#0f1f3a" : "#eff6ff";
                                e.currentTarget.style.borderColor = "#4f6cf7";
                                e.currentTarget.style.color = isDark ? "#ffffff" : "#1e293b";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.borderColor = isDark ? "#1a2a4a" : "#e2e8f0";
                                e.currentTarget.style.color = isDark ? "#8b95ad" : "#64748b";
                              }}
                            >
                              <Eye size={16} />
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}