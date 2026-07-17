/**
 * dashboardService.js
 * -------------------
 * All dashboard data fetching. Each method returns
 * the data payload directly (not the Axios response wrapper),
 * so components and hooks get clean data with no unwrapping.
 */

import axiosInstance from '../api/axiosInstance'
import { API_ENDPOINTS } from '../constants/api'
import { normaliseError } from '../utils/apiError'

// ── Mock flag ────────────────────────────────────────────────────
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const mockDelay = (ms = 400) => new Promise(r => setTimeout(r, ms))

// ── Mock data ────────────────────────────────────────────────────
const MOCK = {
  stats: {
    totalEndpoints:    7,
    connectedEndpoints:3,
    detectedMalware:   30,
    latestSignature:   27999,
    quarantinedFiles:  31,
    deletedFiles:      4,
    heldFiles:         12,
    upToDatePct:       23,
    criticalEndpoints: 9,
    iocBlockedApps:    1,
    activeScans:       2,
  },
  threatTrend: [
    { day: 'Mon', threats: 14, blocked: 12, cleaned: 9  },
    { day: 'Tue', threats: 22, blocked: 20, cleaned: 17 },
    { day: 'Wed', threats: 18, blocked: 17, cleaned: 15 },
    { day: 'Thu', threats: 31, blocked: 28, cleaned: 22 },
    { day: 'Fri', threats: 26, blocked: 24, cleaned: 20 },
    { day: 'Sat', threats: 9,  blocked: 9,  cleaned: 8  },
    { day: 'Sun', threats: 12, blocked: 11, cleaned: 10 },
  ],
  recentAttacks: [
    { id: 1, name: 'Win.Virus.Expiro-10015928-0', host: 'DESKTOP-VM8O1CP', branch: 'ISRO',   status: 'Quarantined', time: '5/11 7:34 PM',  severity: 'danger'  },
    { id: 2, name: 'Trojan.GenericKD.47291823',   host: 'DESKTOP-KJ9X2M',  branch: 'Mumbai', status: 'Deleted',     time: '5/11 3:12 PM',  severity: 'danger'  },
    { id: 3, name: 'Win.Adware.Amonetize-9811',   host: 'LAPTOP-PR3T5N',   branch: 'Delhi',  status: 'Quarantined', time: '5/10 11:45 AM', severity: 'warning' },
    { id: 4, name: 'PUA.Win.Packer.Upx-45',       host: 'DESKTOP-LK0P2C',  branch: 'Pune',   status: 'Detected',    time: '5/10 9:20 AM',  severity: 'info'    },
    { id: 5, name: 'Win.Trojan.Kovter-6701234-0',  host: 'LAPTOP-XD9M2P',  branch: 'ISRO',   status: 'Cleaned',     time: '5/9 4:15 PM',   severity: 'success' },
  ],
  deviceStatus: {
    os: [
      { name: 'Win 11 Pro',  value: 3, color: '#3b82f6' },
      { name: 'Win 10 Ent',  value: 1, color: '#06b6d4' },
      { name: 'Win 10 Pro',  value: 2, color: '#f59e0b' },
      { name: 'Win Server',  value: 1, color: '#8b5cf6' },
    ],
    connectivity: [
      { name: 'Up',   value: 3, color: '#10b981' },
      { name: 'Down', value: 4, color: '#ef4444' },
    ],
  },
  signatures: [
    { label: '3+ Behind',  count: 9, color: '#ef4444', pct: 69 },
    { label: '2 Behind',   count: 1, color: '#f59e0b', pct: 8  },
    { label: '1 Behind',   count: 0, color: '#3b82f6', pct: 0  },
    { label: 'Up to Date', count: 3, color: '#10b981', pct: 23 },
  ],
  branches: [
    { branch: 'ISRO',   endpoints: 3, threats: 12, status: 'At Risk'  },
    { branch: 'Mumbai', endpoints: 2, threats: 4,  status: 'Moderate' },
    { branch: 'Delhi',  endpoints: 1, threats: 8,  status: 'At Risk'  },
    { branch: 'Pune',   endpoints: 1, threats: 2,  status: 'Safe'     },
  ],
}

// ── Service methods ───────────────────────────────────────────────
export const dashboardService = {
  getStats: async () => {
    try {
      if (USE_MOCK) {
        await mockDelay();
        return MOCK.stats;
      }
      const { data } = await axiosInstance.get(API_ENDPOINTS.DASHBOARD.STATS);
      return data;
    } catch (err) {
      throw normaliseError(err);
    }
  },

  getThreatTrend: async () => {
    try {
      if (USE_MOCK) {
        await mockDelay();
        return MOCK.threatTrend;
      }
      const { data } = await axiosInstance.get(
        API_ENDPOINTS.DASHBOARD.THREAT_TREND,
      );
      return data;
    } catch (err) {
      throw normaliseError(err);
    }
  },

  getRecentAttacks: async () => {
    try {
      if (USE_MOCK) {
        await mockDelay();
        return MOCK.recentAttacks;
      }
      const { data } = await axiosInstance.get(
        API_ENDPOINTS.DASHBOARD.RECENT_ATTACKS,
      );
      return data;
    } catch (err) {
      throw normaliseError(err);
    }
  },

  getDeviceStatus: async () => {
    try {
      if (USE_MOCK) {
        await mockDelay();
        return MOCK.deviceStatus;
      }
      const { data } = await axiosInstance.get(
        API_ENDPOINTS.DASHBOARD.DEVICE_STATUS,
      );
      return data;
    } catch (err) {
      throw normaliseError(err);
    }
  },

  getSignatureInfo: async () => {
    try {
      if (USE_MOCK) {
        await mockDelay();
        return MOCK.signatures;
      }
      const { data } = await axiosInstance.get(
        API_ENDPOINTS.DASHBOARD.SIGNATURE_INFO,
      );
      return data;
    } catch (err) {
      throw normaliseError(err);
    }
  },

  getBranchStatus: async () => {
    try {
      if (USE_MOCK) {
        await mockDelay();
        return MOCK.branches;
      }
      const { data } = await axiosInstance.get(
        API_ENDPOINTS.DASHBOARD.BRANCH_STATUS,
      );
      return data;
    } catch (err) {
      throw normaliseError(err);
    }
  },

  getEndpointStatus: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.ENDPOINT_STATUS,
    );

    return data;
  },

  getFileTypeIncident: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.FILE_TYPE_INCIDENT,
    );

    return data;
  },

  getIncidentSummary: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.INCIDENT_SUMMARY,
    );

    return data;
  },

 getTodaysFileUploadIncidents: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.FILE_UPLOAD,
    );

    return data;
  },

    getClipboardIncidents: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.CLIPBOARD_INCIDENT,
    );

    return data;
  },

    getPrinterIncidents: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.PRINTER_INCIDENT,
    );

    return data;
  },

      getIncidentsByChannel: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.INCIDENT_BY_CHANNEL,
    );

    return data;
  },

    getMailIncident: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.MAIL_INCIDENT,
    );

    return data;
  },

      getOrganizationIncident: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.ORGANIZATION_INCIDENT,
    );

    return data;
  },

        getLatestIncident: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.LATEST_INCIDENT,
    );

    return data;
  },

          getPreventedApplication: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.DASHBOARD.PREVENTED_APPLICATION,
    );

    return data;
  },
  getViewDevice: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.VIEWDEVICE.VIEW_DEVICE,
    );

    return data;
  },

  getBranch: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.VIEWDEVICE.GET_BRANCH,
    );

    return data;
  },

    getModeAcess: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.VIEWDEVICE.GET_MODEACESS,
    );

    return data;
  },

  
    getdevicedetail: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.VIEWDEVICE.GET_DEVICEDETAIL,
    );

    return data;
  },

      getdevicename: async () => {
    const { data } = await axiosInstance.get(
      API_ENDPOINTS.VIEWDEVICE.GET_DEVICENAME,
    );

    return data;
  },

  
  //[Post APIS]//




};