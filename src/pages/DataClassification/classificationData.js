// ======================================================
// HARDCODED CLASSIFICATION DATA
// Sample rows taken from data_classification_master.
// Replace with API data once the endpoint is ready.
// ======================================================

const HPCL_IMG =
  "J:\\BACKUP\\Handover - Poonam Bopche\\HPCL\\HPCL_Demo_Topology Related War & Database\\CISCO ACI\\SecureITNMSACI";
const LENDINGKART =
  "J:\\BACKUP\\Handover - Poonam Bopche\\ISRO\\ISRO_NMS_2022\\FINAL IP SCAN DATA\\Backup_30_NOV";
const ISRO_2023 = "J:\\BACKUP\\Handover - Poonam Bopche\\ISRO\\SecureITNMS_ISRO_2023";
const APEX_SCREENS = "J:\\DAM\\oracle\\apex\\images\\eba\\img\\app_screenshots";

// [SRNO, FILE_NAME, FILE_PATH, EXTENSION, LABEL, HOSTNAME]
const rows = [
  [611, "NMS.jpg", `${HPCL_IMG}\\img\\NMS.jpg`, "jpg", "Personal", "DESKTOP-4N96L1G"],
  [617, "red_logo.png", `${HPCL_IMG}\\img\\red_logo.png`, "png", "Business Documents", "DESKTOP-4N96L1G"],
  [634, "SecureIT_2New.png", `${HPCL_IMG}\\img\\SecureIT_2New.png`, "png", "General", "DESKTOP-4N96L1G"],
  [645, "CRF.jpg", `${HPCL_IMG}\\img\\slider\\CRF.jpg`, "jpg", "Personal", "DESKTOP-4N96L1G"],
  [649, "CRM_1.jpg", `${HPCL_IMG}\\img\\slider\\CRM_1.jpg`, "jpg", "Code", "DESKTOP-4N96L1G"],
  [651, "CyberSecurity.jpg", `${HPCL_IMG}\\img\\slider\\CyberSecurity.jpg`, "jpg", "Code", "DESKTOP-4N96L1G"],
  [700, "codesnippet.png", `${HPCL_IMG}\\resources\\bowercomponents\\ckeditor\\plugins\\codesnippet\\icons\\hidpi\\codesnippet.png`, "png", "Financial", "DESKTOP-4N96L1G"],
  [747, "icons.png", `${HPCL_IMG}\\resources\\bowercomponents\\ckeditor\\plugins\\icons.png`, "png", "Financial", "DESKTOP-4N96L1G"],
  [1678, "HPCL Defect List.xlsx", "J:\\BACKUP\\Handover - Poonam Bopche\\HPCL\\HPCL_old\\Docs\\HPCL Defect List.xlsx", "xlsx", "Business Documents", "DESKTOP-4N96L1G"],
  [1683, "All.xlsx", `${LENDINGKART}\\Lendingkart\\Excel\\All.xlsx`, "xlsx", "Personal", "DESKTOP-4N96L1G"],
  [1684, "EmailID.xlsx", `${LENDINGKART}\\Lendingkart\\Excel\\EmailID.xlsx`, "xlsx", "Personal", "DESKTOP-4N96L1G"],
  [1686, "MobileNumber.xlsx", `${LENDINGKART}\\Lendingkart\\Excel\\MobileNumber.xlsx`, "xlsx", "Personal", "DESKTOP-4N96L1G"],
  [1689, "Monitored_Lead 13 Entry.xlsx", `${LENDINGKART}\\Lendingkart\\Testing Upload file\\Monitored_Lead 13 Entry.xlsx`, "xlsx", "Financial", "DESKTOP-4N96L1G"],
  [1697, "Salary Keyword.png", `${LENDINGKART}\\LendingKartTestingData\\PNG\\Salary Keyword.png`, "png", "Financial", "DESKTOP-4N96L1G"],
  [1698, "AdharCard.png", `${LENDINGKART}\\LendingKartTestingData\\PNG2\\AdharCard.png`, "png", "Personal", "DESKTOP-4N96L1G"],
  [1702, "All_Less than 5_2003workbook.xls", `${LENDINGKART}\\LendingKartTestingData\\XLS\\All_Less than 5_2003workbook.xls`, "xls", "Personal", "DESKTOP-4N96L1G"],
  [1741, "How to create services _VLX Service.docx", "J:\\BACKUP\\Handover - Poonam Bopche\\ISRO\\ISRO_NMS_2022\\Working Agents\\How to create services _VLX Service.docx", "docx", "General", "DESKTOP-4N96L1G"],
  [1746, "ISRO_RFP_13feb23.xlsx", `${ISRO_2023}\\ISRO_3rd Round\\ISRO_RFP_13feb23.xlsx`, "xlsx", "Business Documents", "DESKTOP-4N96L1G"],
  [1755, "User Manual_NMS.docx", `${ISRO_2023}\\Other\\User Manual_NMS.docx`, "docx", "Code", "DESKTOP-4N96L1G"],
  [1756, "User Manual_NMS.pdf", `${ISRO_2023}\\Other\\User Manual_NMS.pdf`, "pdf", "Business Documents", "DESKTOP-4N96L1G"],
  [1765, "Summary Of Handover.xlsx", "J:\\BACKUP\\Handover - Poonam Bopche\\Summary Of Handover.xlsx", "xlsx", "Financial", "DESKTOP-4N96L1G"],
  [1769, "Compliance Sheet for UCO Bank.xlsx", "J:\\BACKUP\\Handover - Poonam Bopche\\UCO Bank\\Compliance Sheet for UCO Bank.xlsx", "xlsx", "Business Documents", "DESKTOP-4N96L1G"],
  [1773, "Technical Specification -Endpoint Management including Patch Management.xlsx", "J:\\BACKUP\\Patch\\Technical Specification -Endpoint Management including Patch Management.xlsx", "xlsx", "Financial", "DESKTOP-4N96L1G"],
  [1782, "41_basic.png", "J:\\BACKUP\\Software\\apache-tomcat-9.0.115-windows-x64\\apache-tomcat-9.0.115\\webapps\\docs\\architecture\\requestProcess\\41_basic.png", "png", "Legal", "DESKTOP-4N96L1G"],
  [1839, "SQLDeveloperDataModelerScripting.docx", "J:\\BACKUP\\Software\\sqldeveloper\\sqldeveloper\\extensions\\oracle.datamodeler\\xmlmetadata\\doc\\SQLDeveloperDataModelerScripting.docx", "docx", "Presentation", "DESKTOP-4N96L1G"],
  [1866, "TYPING LESSON (ENGLISH).pdf.pdf", "J:\\BACKUP\\TYPING LESSON (ENGLISH).pdf.pdf", "pdf", "Personal", "DESKTOP-4N96L1G"],
  [2324, "anyco_it.png", `${APEX_SCREENS}\\anyco_it.png`, "png", "Presentation", "DESKTOP-4N96L1G"],
  [2336, "custtrack.png", `${APEX_SCREENS}\\custtrack.png`, "png", "Legal", "DESKTOP-4N96L1G"],
  [2346, "go_live_checklist.png", `${APEX_SCREENS}\\go_live_checklist.png`, "png", "Legal", "DESKTOP-4N96L1G"],
  [3079, "odbc_ic_readme_win_seed.doc", "J:\\DAM\\oracle\\odbc\\doc\\odbc_ic_readme_win_seed.doc", "doc", "Personal", "DESKTOP-4N96L1G"],
  [3106, "ORAchk_and_EXAchk_User_Guide.pdf", "J:\\DAM\\oracle\\suptools\\orachk\\doc\\ORAchk_and_EXAchk_User_Guide.pdf", "pdf", "Legal", "DESKTOP-4N96L1G"],
  [3113, "test_contentBased.docx", "J:\\DLP\\0109\\test_contentBased.docx", "docx", "General", "DESKTOP-4N96L1G"],
  [3117, "ScreenShot_2513.jpg", "J:\\DLP\\Ankita\\RemoteV\\Screenshot\\ScreenShot_2513.jpg", "jpg", "Personal", "DESKTOP-4N96L1G"],
  [3126, "OCR _Screenshot.png", "J:\\DLP\\Content Aware Driver_2004\\Test\\OCR _Screenshot.png", "png", "Personal", "DESKTOP-4N96L1G"],
  [3131, "DLP User Manual.pdf", "J:\\DLP\\DLP User Manual.pdf", "pdf", "Business Documents", "DESKTOP-4N96L1G"],
  [3137, "DLP-3.0 _Indian Army Final_27-05.xlsx", "J:\\DLP\\Indian Army\\DLP-3.0 _Indian Army Final_27-05.xlsx", "xlsx", "Business Documents", "DESKTOP-4N96L1G"],
  [3148, "error1.PNG", "J:\\EDR saraswati\\error1.PNG", "PNG", "Legal", "DESKTOP-4N96L1G"],
  [3150, "error3.PNG", "J:\\EDR saraswati\\error3.PNG", "PNG", "Code", "DESKTOP-4N96L1G"],
  [3151, "DLP-Indian Army RFP 09-09-2025.xlsx", "J:\\EDR_RESTORE\\DLP-Indian Army RFP 09-09-2025.xlsx", "xlsx", "Business Documents", "DESKTOP-4N96L1G"],
  [3152, "EPS Test Cases.xlsx", "J:\\mohini\\EPS Test Cases.xlsx", "xlsx", "Financial", "DESKTOP-4N96L1G"],
  [3188, "Patch_Management_Version_Control_Backup.docx", "J:\\Patch Management\\Patch_Management_Version_Control_Backup.docx", "docx", "Presentation", "DESKTOP-4N96L1G"],
  [3242, "Compliance - EDR_Telegana.xlsx", "J:\\Telangana\\Compliance - EDR_Telegana.xlsx", "xlsx", "Business Documents", "DESKTOP-4N96L1G"],
  [3251, "JCDevKitUG-Connected-3_0_2.pdf", "K:\\Softwares\\NetBeans 8.2\\javacard\\JCDK3.0.2_ConnectedEdition\\docs\\JCDevKitUG-Connected-3_0_2.pdf", "pdf", "Code", "DESKTOP-4N96L1G"],
  [3285, "regex___regex_-_Notepad___2026-05-29_10-25-46.png", "D:\\Kiran\\SecureITDLP 3\\SecureITDLP\\Wtascreenshots\\regex___regex_-_Notepad___2026-05-29_10-25-46.png", "png", "Personal", "DESKTOP-U00UAUO"],
  [3290, "test.docx", "D:\\Kiran\\Test\\test.docx", "docx", "General", "DESKTOP-U00UAUO"],
  [3296, "headerbg.png", "D:\\Malware\\Vx Underground_files\\headerbg.png", "png", "Personal", "DESKTOP-U00UAUO"],
  [3302, "shelterproject.jpg", "D:\\Malware\\Vx Underground_files\\shelterproject.jpg", "jpg", "Financial", "DESKTOP-U00UAUO"],
  [4393, "dlp manual.docx", "J:\\DLP\\dlp manual.docx", "docx", "Presentation", "DESKTOP-4N96L1G"],
  [4394, "Ansari.jpg", "D:\\Saved Pictures\\Ansari.jpg", "jpg", "Financial", "DESKTOP-T1HBI0C"],
  [4396, "Chandrapal.jpg", "D:\\Saved Pictures\\Chandrapal.jpg", "jpg", "Financial", "DESKTOP-T1HBI0C"],
  [4398, "low_DPI_160.png", "D:\\Saved Pictures\\low_DPI_160.png", "png", "Other", "DESKTOP-T1HBI0C"],
  [4400, "low_DPI_360.jpg", "D:\\Saved Pictures\\low_DPI_360.jpg", "jpg", "Identity", "DESKTOP-T1HBI0C"],
  [4404, "pan.jpg", "D:\\Saved Pictures\\pan.jpg", "jpg", "Financial", "DESKTOP-T1HBI0C"],
  [4411, "SS_DPI_3.png", "D:\\Saved Pictures\\SS_DPI_3.png", "png", "Identity", "DESKTOP-T1HBI0C"],
  [4412, "SS_DPI_4.png", "D:\\Saved Pictures\\SS_DPI_4.png", "png", "Identity", "DESKTOP-T1HBI0C"],
  [4422, "Algoritham pvt Ltd Requirement .xlsx", "C:\\Users\\VELOX\\Desktop\\Algoritham pvt Ltd Requirement .xlsx", "xlsx", "Other", "PRATHAMESH-B"],
  [4423, "DLP_Team_TaskShet_24-09_26.xlsx", "C:\\Users\\VELOX\\Desktop\\DLP_Team_TaskShet_24-09_26.xlsx", "xlsx", "Other", "PRATHAMESH-B"],
  [4425, "QUID User-Manual.pdf", "C:\\Users\\VELOX\\Desktop\\QUID User-Manual.pdf", "pdf", "Other", "PRATHAMESH-B"],
  [6156, "Manage Application.pdf", "E:\\Manage Application.pdf", "pdf", "General", "DESKTOP-T1HBI0C"],
  [6157, "SecureIT DLP-USP.docx", "E:\\SecureIT DLP-USP.docx", "docx", "Code", "DESKTOP-T1HBI0C"],
  [6161, "Antivirus-Handover.xlsx", "E:\\Antivirus-Handover.xlsx", "xlsx", "Code", "DESKTOP-T1HBI0C"],
  [6162, "Ac_Chokshi_Share_Broker_Private_Limited_vs_Jatin_Pratap_Desai_on_10_February_2025_1.PDF", "E:\\Ac_Chokshi_Share_Broker_Private_Limited_vs_Jatin_Pratap_Desai_on_10_February_2025_1.PDF", "PDF", "Legal", "DESKTOP-T1HBI0C"],
];

export const classificationFiles = rows.map(
  ([srNo, fileName, filePath, extension, label, hostName]) => ({
    srNo,
    fileName,
    filePath,
    extension,
    label,
    hostName,
  })
);

// ======================================================
// CARD CATEGORIES (hardcoded rules until the API decides)
// ======================================================
export const HIGH_RISK_LABELS = ["Personal", "Financial", "Identity", "Legal"];
export const BLOCKED_LABELS = ["Financial", "Identity"];

export const getFilesByCategory = (category) => {
  switch (category) {
    case "blocked":
      return classificationFiles.filter((file) => BLOCKED_LABELS.includes(file.label));
    case "highRisk":
      return classificationFiles.filter((file) => HIGH_RISK_LABELS.includes(file.label));
    default:
      return classificationFiles;
  }
};

// ======================================================
// CHART DATA (derived from the same rows so every count matches)
// ======================================================
const normalizeExtension = (extension) => String(extension || "").toLowerCase();

const countBy = (getKey) => {
  const counts = {};
  classificationFiles.forEach((file) => {
    const key = getKey(file);
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

// Sensitivity Levels chart: files per label
export const labelCounts = countBy((file) => file.label);

// File Type Distribution chart: files per extension (PNG and png are the same type)
export const extensionCounts = countBy((file) => normalizeExtension(file.extension));

export const getFilesByLabel = (label) =>
  classificationFiles.filter((file) => file.label === label);

export const getFilesByExtension = (extension) =>
  classificationFiles.filter(
    (file) => normalizeExtension(file.extension) === normalizeExtension(extension)
  );

export const getLabelColor = (label) => {
  switch (label) {
    case "Personal":
    case "Identity":
      return "bg-amber-500/20 text-amber-500";
    case "Financial":
      return "bg-blue-500/20 text-blue-500";
    case "Legal":
      return "bg-violet-500/20 text-violet-500";
    case "Code":
      return "bg-red-500/20 text-red-500";
    case "Business Documents":
      return "bg-emerald-500/20 text-emerald-500";
    case "Presentation":
      return "bg-cyan-500/20 text-cyan-500";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};
