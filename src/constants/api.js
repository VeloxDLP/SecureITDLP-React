/**
 * API_ENDPOINTS
 * -------------
 * Single source of truth for every backend route.
 * Never hardcode paths inside services or components.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login", // ← your actual endpoint: POST /user/login
    LOGOUT: "/user/logout", // update if your backend has a logout route
    REFRESH: "/user/refresh", // update if your backend has a refresh route
    ME: "/user/me", // update if your backend has a /me route
  },

  DASHBOARD: {
    ENDPOINT_STATUS: "/DeviceManager/agentStatusCounts",
    INCIDENT_SUMMARY: "/NetworkDLP/eventWiseCount",
    ORGANIZATION_INCIDENT: "/Dashboard/organizationIncident",
    FILE_TYPE_INCIDENT: "/NetworkDLP/extensionCounts",
    CLIPBOARD_INCIDENT: "/ClipboardControl/7DaysClipboardIncident",
    MAIL_INCIDENT: "/Dashboard/mailIncident",
    PRINTER_INCIDENT: "/PrinterDLP/printerIncidentcount",
    PREVENTED_APPLICATION: "/Dashboard/preventedApplication",
    ENDPOINT_TABLE: "/Dashboard/endpointTable",
    FILE_UPLOAD:"/NetworkDLP/getTodaysUploadCount",
    INCIDENT_BY_CHANNEL:"/incidents/by-channel",
    MAIL_INCIDENT:"/email-monitoring/emailwisecount",
    ORGANIZATION_INCIDENT:"/NetworkDLP/timeSlotHostCounts",
    LATEST_INCIDENT:"/NetworkDLP/latest-incidents",
    PREVENTED_APPLICATION:"/application-info/last7daysapplicationinfo-counts"

  },

VIEWDEVICE:{
    VIEW_DEVICE:"/DeviceManager/allDevices",
    GET_BRANCH:"/UsbProtection/getBranches",
    GET_DEVICES_ON_BRANCH:"/UsbProtection/devices",
    GET_MODEACESS:"/UsbProtection/modeAccessCount",
    GET_DEVICEDETAIL:"/UsbProtection/deviceDetails",
    GET_DEVICENAME:"/UsbProtection/devices"
},



  DEVICES: {
    LIST: "/devices",
    BY_ID: (id) => `/devices/${id}`,
    UPDATE: (id) => `/devices/${id}`,
    DELETE: (id) => `/devices/${id}`,
    SCAN: (id) => `/devices/${id}/scan`,

  },

  APP_CONTROL: {
    LIST: "/app-control",
    WHITELIST: "/app-control/whitelist",
    BLACKLIST: "/app-control/blacklist",
    BLOCK: (id) => `/app-control/${id}/block`,
    ALLOW: (id) => `/app-control/${id}/allow`,
  },

  USB: {
    POLICIES: "/UsbProtection/deviceDetails",
    LOGS: "/usb/logs",
    BLOCK: (deviceId) => `/usb/${deviceId}/block`,
  },

  POLICY: {
    LIST: "/policy",
    BY_ID: (id) => `/policy/${id}`,
    CREATE: "/policy",
    UPDATE: (id) => `/policy/${id}`,
    DELETE: (id) => `/policy/${id}`,
    ROLLBACK: (id) => `/policy/${id}/rollback`,
  },

  SCAN: {
    START: "/scan/start",
    STOP: (id) => `/scan/${id}/stop`,
    RESULTS: (id) => `/scan/${id}/results`,
    LIST: "/scan",
  },

  REPORTS: {
    THREATS: "/reports/threats",
    DEVICES: "/reports/devices",
    EXPORT: (type) => `/reports/export/${type}`,
  },
};

export const HTTP_STATUS = {
  OK:           200,
  CREATED:      201,
  NO_CONTENT:   204,
  BAD_REQUEST:  400,
  UNAUTHORIZED: 401,
  FORBIDDEN:    403,
  NOT_FOUND:    404,
  SERVER_ERROR: 500,
}