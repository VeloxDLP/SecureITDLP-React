/**
 * API_ENDPOINTS
 * -------------
 * Single source of truth for every backend route.
 * Never hardcode paths inside services or components.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login", // ← your actual endpoint: POST /user/login
    SIGNUP: "/auth/SignUp", // update if your backend has a logout route
    REFRESH: "/user/refresh", // update if your backend has a refresh route
    ME: "/user/me", // update if your backend has a /me route
  APPLICATIONUSERS: "/auth/GetApplicationUser",
  },

  DASHBOARD: {
    ENDPOINT_STATUS: "/DeviceManager/agentStatusCounts",
  EVENT_WISE_MODAL_DATA: '/NetworkDLP/EventWiseModalData',
    INCIDENT_SUMMARY: "/NetworkDLP/eventWiseCount",
    ORGANIZATION_INCIDENT: "/Dashboard/organizationIncident",
    FILE_TYPE_INCIDENT: "/NetworkDLP/extensionCounts",
    CLIPBOARD_INCIDENT: "/ClipboardControl/7DaysClipboardIncident",
    MAIL_INCIDENT: "/Dashboard/mailIncident",
    PRINTER_INCIDENT: "/PrinterDLP/printerIncidentcount",
    PREVENTED_APPLICATIONDATA: "/DashboardModal/PreventedApplication",
    ENDPOINT_TABLE: "/Dashboard/endpointTable",
    FILE_UPLOAD:"/NetworkDLP/getTodaysUploadCount",
    INCIDENT_BY_CHANNEL:"/incidents/by-channel",
    MAIL_INCIDENT:"/email-monitoring/emailwisecount",
    ORGANIZATION_INCIDENT:"/NetworkDLP/timeSlotHostCounts",
    LATEST_INCIDENT:"/NetworkDLP/latest-incidents",
    PREVENTED_APPLICATION:"/ApplicationControl/last7daysapplicationinfo-counts",
   INCIDENT_BY_CHANNEL_MODAL:"/DashboardModal/IncidentbyChannelModal",
   INCIDENT_BY_FILE_TYPE:"/DashboardModal/ExtensionModalData",
   FILE_UPLOAD_MODAL:"/DashboardModal/FileUploadModalData",
   CLIPBOARD_INCIDENT_MODAL:"/DashboardModal/ClipboardModalData",
   PRINTER_MODALINCIDENT:"/PrinterDLP/getPrinterIncident",
   EMAIL_INCIDENT_DATA: "/DashboardModal/EmailModalData",
   
  },

VIEWDEVICE:{
    VIEW_DEVICE:"/DeviceManager/allDevices",
    GET_BRANCH:"/UsbProtection/getBranches",
    GET_DEVICES_ON_BRANCH:"/DeviceManager/DevicesByBranch",
    GET_MODEACESS:"/UsbProtection/modeAccessCount",
    GET_DEVICEDETAIL:"/UsbProtection/deviceDetails",
    GET_DEVICENAME:"/UsbProtection/devices",
    GET_LIVE_POLICY_STATUS:"/DeviceManager/livePolicyStatus"
},

PRINTER_CONTROL:{
  ALL_PRINTER_POLICIES:"/PrinterDLP/getAllPrinterPolicy",
  ADD_PRINTER_POLICY:"/PrinterDLP/addPrinterPolicy"
},


APPLICATION_CONTROL:{
  SET_MODE:"/ApplicationControl/SetApplicationMode",
  APPLICATION_CONTROLDATA:"/ApplicationControl/getmodeall",
  VIEW_APPLICATION_COUNT: "/ApplicationControl/GetHostWiseApplicationCount",
  VIEW_APPLICATION_DETAILS:"/ApplicationControl/GetHostWiseApplicationDetail",
  APPLICATION_BLACKLISTED:"/ApplicationControl/ApplicationBlacklisted",
  APPLICATION_BY_HOST:"/ApplicationControl/GetApplicationByHost",
  APPLICATION_WHITELISTED: "/ApplicationControl/ApplicationWhitelisted",
},

// APPLICATION_CONTROL: {
//   APPLICATION_CONTROLDATA: "/ApplicationControl/getapplicationinfoall",
// },

USB_Policy: {
  USB_Policy: "/UsbProtection/getUsbPolicies",
  ADD_USB_POLICY:"/UsbProtection/addUsbPolicy",
},

Drive_Control: {
  Drive_Policy: "/DrivePolicy/getDrivePolicies",
  ADD_DRIVE_POLICY:"/DrivePolicy/addDrivePolicy"
},



NETWORK_POLICY: {
  GETNETWORKPOLICY: "/NetworkDLP/GetDistinctPolicy",
  GETPOLICYBYNAME: "/NetworkDLP/GetPolicy", 
  GETACTIVEDISTINCTPOLICY:"/NetworkDLP/GetActiveDistinctPolicy",
  GETACTIVE_DISTINCTPOLICY_MODAL:"/NetworkDLP/GetActiveDistinctPolicyModal"
},


REPORTS:{
  GET_REPORTS:"/reports/getReports",
},

DATA_CLASSIFICATION: {
  TOTAL_SCANNED_FILES: "/DataClassification/TotalScannedFiles",
  LABEL_COUNTS: "/DataClassification/LabelCounts",
    MASTER: "/DataClassification/DataClassificationMaster",
  FILES_BY_LABEL: "/DataClassification/files-by-label",
   EXTENSION_COUNTS: "/DataClassification/ExtensionCounts",
     FILES_BY_EXTENSION: "/DataClassification/files-by-extension",
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

  // REPORTS: {
  //   THREATS: "/reports/threats",
  //   DEVICES: "/reports/devices",
  //   EXPORT: (type) => `/reports/export/${type}`,
  // },
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