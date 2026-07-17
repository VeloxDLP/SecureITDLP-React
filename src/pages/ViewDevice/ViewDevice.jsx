import React, { useState, useEffect } from "react";
import { Settings, Eye, Search, Plus, Minus, Info } from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

export default function DeviceDashboard() {
  const [viewDeviceData, setViewDeviceData] = useState([]);
  const [mode, setMode] = useState("view");
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

  // Helper function to format date
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
  
  ];

  const styles = {
    page: {
      padding: "24px",
      fontFamily:
        "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: "#cbd5e1",
      backgroundColor: "#020617", // New background color
      minHeight: "100vh",
    },
    tabsRow: {
      display: "flex",
      gap: "12px",
      marginBottom: "10px",
    },
    tabBase: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      padding: "10px 18px",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: 500,
      cursor: "pointer",
      border: "1px solid #29304a",
      background: "#0a1628", // Darker card color
      color: "#8b95ad",
      transition: "all 0.15s ease",
    },
    tabActive: {
      background: "#0f1f3a", // Darker active tab
      color: "#ffffff",
      border: "1px solid #4f6cf7",
      boxShadow: "0 0 0 3px rgba(79,108,247,0.15)",
    },
    panel: {
      // background: "#020617", // Card background - darker
      border: "1px solid #1a2a4a",
      borderRadius: "15px",
      overflow: "hidden",
      padding: "10px",
    },
    panelHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "20px",
    },
    panelTitle: {
      fontSize: "22px",
      fontWeight: 500,
      color: "#cdd5e6",
      margin: 0,
    },
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    pillBtn: {
      background: "#020617",
      border: "1px solid #1a2a4a",
      color: "#b7c0d8",
      fontSize: "12px",
      fontWeight: 500,
      padding: "6px 12px",
      borderRadius: "8px",
      cursor: "pointer",
    },
    searchWrap: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
      background: "#020617",
      border: "1px solid #1a2a4a",
      borderRadius: "8px",
      padding: "6px 12px",
    },
    searchInput: {
      background: "transparent",
      border: "none",
      outline: "none",
      color: "#e2e8f0",
      fontSize: "14px",
      width: "150px",
    },
    tableWrap: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    headerRowCard: {
      display: "flex",
      alignItems: "center",
      background: "#0f1f3a", // Header card - darker
      borderRadius: "15px",
      padding: "16px 24px",
      gap: "20px",
    },
    headerCell: {
      fontSize: "16px",
      fontWeight: 600,
      color: "#aab3cc",
      flex: 1,
    },
    rowGroup: {
      background: "#020617", // Row group - darker
      borderRadius: "12px",
      overflow: "hidden",
    },
    rowCard: {
      display: "flex",
      alignItems: "center",
      padding: "12px 24px",
      gap: "20px",
      cursor: "pointer",
    },
    plusBtnUp: {
      width: "15px",
      height: "15px",
      borderRadius: "50%",
      background: "#22c55e",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      marginRight: "10px",
      flexShrink: 0,
      transition: "all 0.2s ease",
    },
    plusBtnDown: {
      width: "15px",
      height: "15px",
      borderRadius: "50%",
      background: "#ef4444",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      marginRight: "10px",
      flexShrink: 0,
      transition: "all 0.2s ease",
    },
    cell: {
      fontSize: "14px",
      color: "#e2e8f0",
      flex: 1,
    },
    hostLink: {
      color: "#5b8def",
      fontWeight: 500,
      letterSpacing: "0.10px",
      textDecoration: "none",
      cursor: "pointer",
    },
    detailsPanel: {
      background: "#020617", // Details panel - same as page background
      borderTop: "1px solid #1a2a4a",
      padding: "18px 24px 22px 64px",
    },
    detailsHeading: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
      fontWeight: 600,
      color: "#7bdc8f",
      marginBottom: "12px",
    },
    detailsDivider: {
      borderBottom: "1px solid #1a2a4a",
      marginBottom: "16px",
    },
    detailsGrid: {
      display: "flex",
      gap: "200px",
      flexWrap: "wrap",
      alignItems: "center",
    },
    detailLabel: {
      fontSize: "11px",
      fontWeight: 600,
      color: "#7c87a3",
      letterSpacing: "0.5px",
      marginBottom: "8px",
      textTransform: "uppercase",
    },
    detailValue: {
      fontSize: "14px",
      fontWeight: 600,
      color: "#e2e8f0",
    },
    detailItem: {
      display: "flex",
      flexDirection: "column",
    },
    detailItemRow: {
      display: "flex",
      alignItems: "center",
      gap: "120px",
    },
    eyeButton: {
      background: "transparent",
      border: "1px solid #1a2a4a",
      borderRadius: "6px",
      padding: "4px 8px",
      cursor: "pointer",
      color: "#8b95ad",
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "12px",
      transition: "all 0.2s ease",
      marginTop: "4px",
    },
    eyeButtonHover: {
      background: "#0f1f3a",
      borderColor: "#4f6cf7",
      color: "#ffffff",
    },
    statusPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: "rgba(34,197,94,0.12)",
      color: "#4ade80",
      border: "1px solid rgba(34,197,94,0.3)",
      borderRadius: "20px",
      padding: "3px 12px",
      fontSize: "13px",
      fontWeight: 600,
    },
    statusPillDown: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: "rgba(239, 68, 68, 0.12)",
      color: "#f87171",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      borderRadius: "20px",
      padding: "3px 12px",
      fontSize: "13px",
      fontWeight: 600,
    },
    statusDot: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: "#4ade80",
    },
    statusDotDown: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: "#f87171",
    },
    loading: {
      textAlign: "center",
      padding: "40px",
      color: "#8b95ad",
    },
    error: {
      textAlign: "center",
      padding: "40px",
      color: "#f87171",
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

  // Get status style based on agent status
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

  // Get plus button style based on agent status
  const getPlusButtonStyle = (status) => {
    if (status?.toLowerCase() === "up") {
      return styles.plusBtnUp;
    }
    return styles.plusBtnDown;
  };

  // Handle eye button click
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
      <div style={styles.tabsRow}>
        {/* <div style={styles.tabBase} onClick={() => setMode("set")}>
          <Settings size={15} />
          Set Mode
        </div> */}
        <div
          style={{
            ...styles.tabBase,
            ...(mode === "view" ? styles.tabActive : {}),
          }}
          onClick={() => setMode("view")}
        >
          <Eye size={15} />
          View Mode
        </div>
      </div>

      <div style={styles.panel}>
        <div style={styles.panelHeader}>
          <h2 style={styles.panelTitle}>View Devices</h2>
          <div style={styles.headerRight}>
            <button style={styles.pillBtn}>Excel</button>
            <button style={styles.pillBtn}>Copy</button>
            <button style={styles.pillBtn}>CSV</button>
            <button style={styles.pillBtn}>PDF</button>
            <div style={styles.searchWrap}>
              <Search size={13} color="#7c87a3" />
              <input
                style={styles.searchInput}
                placeholder="Search identities"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={styles.tableWrap}>
          {/* Header Row */}
          <div style={styles.headerRowCard}>
            <div style={{ ...styles.headerCell, flex: 0.5 }}>Branch Name</div>
            <div style={{ ...styles.headerCell, flex: 0.8 }}>Host Name</div>
            <div style={{ ...styles.headerCell, flex: 0.7 }}>Device IP</div>
            <div style={{ ...styles.headerCell, flex: 0.8 }}>User Name</div>
          </div>

          {/* Data Rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "#8b95ad" }}>
              No devices found
            </div>
          ) : (
            filtered.map((d, i) => (
              <div key={i} style={styles.rowGroup}>
                <div style={styles.rowCard} onClick={() => toggleExpand(i)}>
                  <button 
                    style={getPlusButtonStyle(d.agentStatus)} 
                    title="Toggle details"
                  >
                    {expanded === i ? (
                      <Minus size={14} color="#ffffff" strokeWidth={4} />
                    ) : (
                      <Plus size={14} color="#ffffff" strokeWidth={4} />
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
                      <Info size={15} />
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
                              e.stopPropagation(); // Prevent triggering the parent click
                              handleEyeClick(d);
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = styles.eyeButtonHover.background;
                              e.currentTarget.style.borderColor = styles.eyeButtonHover.borderColor;
                              e.currentTarget.style.color = styles.eyeButtonHover.color;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.borderColor = "#1a2a4a";
                              e.currentTarget.style.color = "#8b95ad";
                            }}
                          >
                            <Eye size={18} />
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
  );
}