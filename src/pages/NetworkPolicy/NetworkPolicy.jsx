import React, { useState } from "react";
import {
  FileText,
  Package,
  FolderOpen,
  FileCode,
  Clock3,
  PlayCircle,
  ClipboardCheck,
  ChevronDown,
  ChevronLeft,
  Settings2,
  Server,
  Shield,
  Users,
  GitBranch,
  AlertCircle,
  Image,
  File,
  FileJson,
  FileSpreadsheet,
  FileArchive,
  CheckCircle,
  Plus,
  X,
  Search,
  AlertTriangle,
  AlertCircle as AlertCircleIcon,
  Info,
  Globe,
  Upload,
  Share2,
  Network,
  Copy,
  Mail,
  Monitor,
  Database,
} from "lucide-react";

const CreateNetworkPolicy = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFileType, setSelectedFileType] = useState("");
  const [selectedFileTypes, setSelectedFileTypes] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [policyName, setPolicyName] = useState("");
  const [description, setDescription] = useState("");
  const [fileExtension, setFileExtension] = useState("");
  const [appVersion, setAppVersion] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [protocol, setProtocol] = useState("TCP");
  const [port, setPort] = useState("");
  const [channelType, setChannelType] = useState("Public");
  const [priority, setPriority] = useState("P1 - High");
  const [keyword, setKeyword] = useState("");
  const [regularExpression, setRegularExpression] = useState("");
  const [regularExpressions, setRegularExpressions] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [selectedSeverityLevels, setSelectedSeverityLevels] = useState([]);

  const steps = [
    { title: "General Info", icon: FileText },
    { title: "File Type", icon: Package },
    { title: "Application", icon: FolderOpen },
    { title: "Conditions", icon: FileCode },
    { title: "Channels", icon: Clock3 },
    { title: "Severity", icon: PlayCircle },
    { title: "Summary", icon: ClipboardCheck },
  ];

  const fileTypes = [
    { name: "Png", description: "Lossless raster image", icon: Image },
    { name: "Jpeg", description: "Compressed photo image", icon: Image },
    { name: "Txt", description: "Plain text file", icon: FileText },
    { name: "Docx", description: "Word document", icon: File },
    { name: "Doc", description: "Legacy Word document", icon: File },
    { name: "Pdf", description: "Portable document format", icon: File },
    { name: "Csv", description: "Comma separated values", icon: FileCode },
    { name: "Excel", description: "Spreadsheet workbook", icon: FileSpreadsheet },
    { name: "Zip", description: "Compressed archive", icon: FileArchive },
  ];

  const applicationGroups = [
    { name: "Google", description: "Google Search browser", icon: "🌐" },
    { name: "Chrome", description: "Chromium-based browser", icon: "🌐" },
    { name: "Firefox", description: "Mozilla Firefox browser", icon: "🌐" },
    { name: "Edge", description: "Microsoft Edge browser", icon: "🌐" },
    { name: "Excel", description: "Microsoft spreadsheet app", icon: "🌐" },
    { name: "Word", description: "Microsoft Word processor", icon: "🌐" },
    { name: "Outlook", description: "Microsoft email client", icon: "🌐" },
    { name: "Google Drive", description: "Cloud file storage", icon: "🌐" },
    { name: "OneDrive", description: "Microsoft cloud storage", icon: "🌐" }
  ];

  const channelControls = [
    { name: "Browser Upload", description: "Google Search browser", icon: Upload },
    { name: "FTP Transfer", description: "Chromium-based browser", icon: Share2 },
    { name: "Peripheral Transfer", description: "Mozilla Firefox browser", icon: Monitor },
    { name: "Network Share", description: "Microsoft Edge browser", icon: Network },
    { name: "Clipboard Copy", description: "Microsoft spreadsheet app", icon: Copy },
    { name: "Email Shares", description: "Microsoft Word processor", icon: Mail },
  ];

  const severityLevels = [
    { name: "Critical", description: "Critical severity level", icon: AlertTriangle, color: "red" },
    { name: "High", description: "High severity level", icon: AlertCircleIcon, color: "orange" },
    { name: "Medium", description: "Medium severity level", icon: AlertCircle, color: "yellow" },
    { name: "Low", description: "Low severity level", icon: Info, color: "blue" },
  ];

  const channels = ["Production", "Staging", "Development", "QA", "Testing"];
  const severities = ["Critical", "High", "Medium", "Low", "Info"];

  const toggleFileType = (fileName) => {
    setSelectedFileTypes(prev => {
      if (prev.includes(fileName)) {
        return prev.filter(name => name !== fileName);
      } else {
        return [...prev, fileName];
      }
    });
  };

  const selectAllFileTypes = () => {
    if (selectedFileTypes.length === fileTypes.length) {
      setSelectedFileTypes([]);
    } else {
      setSelectedFileTypes(fileTypes.map(file => file.name));
    }
  };

  const toggleApplication = (appName) => {
    setSelectedApplications(prev => {
      if (prev.includes(appName)) {
        return prev.filter(name => name !== appName);
      } else {
        return [...prev, appName];
      }
    });
  };

  const selectAllApplications = () => {
    if (selectedApplications.length === applicationGroups.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applicationGroups.map(app => app.name));
    }
  };

  const toggleChannel = (channelName) => {
    setSelectedChannels(prev => {
      if (prev.includes(channelName)) {
        return prev.filter(name => name !== channelName);
      } else {
        return [...prev, channelName];
      }
    });
  };

  const selectAllChannels = () => {
    if (selectedChannels.length === channelControls.length) {
      setSelectedChannels([]);
    } else {
      setSelectedChannels(channelControls.map(channel => channel.name));
    }
  };

  const toggleSeverityLevel = (severityName) => {
    setSelectedSeverityLevels(prev => {
      if (prev.includes(severityName)) {
        return prev.filter(name => name !== severityName);
      } else {
        return [...prev, severityName];
      }
    });
  };

  const selectAllSeverityLevels = () => {
    if (selectedSeverityLevels.length === severityLevels.length) {
      setSelectedSeverityLevels([]);
    } else {
      setSelectedSeverityLevels(severityLevels.map(level => level.name));
    }
  };

  const addRegularExpression = () => {
    if (regularExpression.trim()) {
      setRegularExpressions([...regularExpressions, regularExpression.trim()]);
      setRegularExpression("");
    }
  };

  const removeRegularExpression = (index) => {
    setRegularExpressions(regularExpressions.filter((_, i) => i !== index));
  };

  const addKeyword = () => {
    if (keyword.trim()) {
      setKeywords([...keywords, keyword.trim()]);
      setKeyword("");
    }
  };

  const removeKeyword = (index) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  // Helper function to check if a step has selections
  const hasSelections = (stepIndex) => {
    switch(stepIndex) {
      case 0:
        return policyName || description;
      case 1:
        return selectedFileTypes.length > 0;
      case 2:
        return selectedApplications.length > 0;
      case 3:
        return keywords.length > 0 || regularExpressions.length > 0;
      case 4:
        return selectedChannels.length > 0;
      case 5:
        return selectedSeverityLevels.length > 0;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="grid grid-cols-3 gap-10 items-end">
            <div>
              <label className="text-sm text-slate-600 dark:text-gray-300 mb-2 block">Policy Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  placeholder="Enter Policy Name"
                  className={`w-full border rounded-md px-4 py-3 outline-none text-slate-800 dark:text-gray-300 placeholder-slate-400 dark:placeholder-gray-500 transition-all ${
                    policyName 
                      ? 'bg-blue-50 border-blue-400 dark:bg-[#1a2744] dark:border-[#5A7BFF]' 
                      : 'bg-white border-slate-200 focus:border-blue-400 dark:bg-[#111827] dark:border-[#2d3748] dark:focus:border-[#5A7BFF]'
                  }`}
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-600 dark:text-gray-300 mb-2 block">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className={`w-full border rounded-md px-4 py-3 outline-none text-slate-800 dark:text-gray-300 placeholder-slate-400 dark:placeholder-gray-500 transition-all ${
                  description 
                    ? 'bg-blue-50 border-blue-400 dark:bg-[#1a2744] dark:border-[#5A7BFF]' 
                    : 'bg-white border-slate-200 focus:border-blue-400 dark:bg-[#111827] dark:border-[#2d3748] dark:focus:border-[#5A7BFF]'
                }`}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-end mb-4">
              <button
                onClick={selectAllFileTypes}
                className="px-4 py-2 bg-blue-50 border border-blue-400 text-blue-600 dark:bg-[#1a2744] dark:border-[#5A7BFF] dark:text-[#5A7BFF] rounded-md hover:bg-blue-100 dark:hover:bg-[#243b6b] transition text-sm font-medium flex items-center gap-2"
              >
                {selectedFileTypes.length === fileTypes.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {fileTypes.map((file) => {
                const Icon = file.icon;
                const isSelected = selectedFileTypes.includes(file.name);
                return (
                  <div
                    key={file.name}
                    onClick={() => toggleFileType(file.name)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-400 bg-blue-50 dark:border-[#5A7BFF] dark:bg-[#1a2744]"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-[#2d3748] dark:bg-[#111827] dark:hover:border-[#4a5568]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? "bg-blue-100 dark:bg-[#2d3748]" : "bg-slate-100 dark:bg-[#1a202c]"
                      }`}>
                        <Icon size={20} className={isSelected ? "text-blue-600 dark:text-[#5A7BFF]" : "text-slate-400 dark:text-gray-400"} />
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-medium ${isSelected ? "text-blue-600 dark:text-[#5A7BFF]" : "text-slate-700 dark:text-gray-200"}`}>
                          {file.name}
                        </h5>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{file.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#5A7BFF] flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-end mb-4">
              <button
                onClick={selectAllApplications}
                className="px-4 py-2 bg-blue-50 border border-blue-400 text-blue-600 dark:bg-[#1a2744] dark:border-[#5A7BFF] dark:text-[#5A7BFF] rounded-md hover:bg-blue-100 dark:hover:bg-[#243b6b] transition text-sm font-medium flex items-center gap-2"
              >
                {selectedApplications.length === applicationGroups.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {applicationGroups.map((app) => {
                const isSelected = selectedApplications.includes(app.name);
                return (
                  <div
                    key={app.name}
                    onClick={() => toggleApplication(app.name)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-400 bg-blue-50 dark:border-[#5A7BFF] dark:bg-[#1a2744]"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-[#2d3748] dark:bg-[#111827] dark:hover:border-[#4a5568]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? "bg-blue-100 dark:bg-[#2d3748]" : "bg-slate-100 dark:bg-[#1a202c]"
                      }`}>
                        <span className="text-xl">{app.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-medium ${isSelected ? "text-blue-600 dark:text-[#5A7BFF]" : "text-slate-700 dark:text-gray-200"}`}>
                          {app.name}
                        </h5>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{app.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#5A7BFF] flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Keyword Section */}
              <div>
                <label className="text-sm text-slate-600 dark:text-gray-300 mb-2 block">Keyword</label>
                <div className="relative">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="eg: hello, get lost"
                    className={`w-full border rounded-md px-4 py-3 outline-none text-slate-800 dark:text-gray-300 placeholder-slate-400 dark:placeholder-gray-500 pr-12 transition-all ${
                      keyword 
                        ? 'bg-blue-50 border-blue-400 dark:bg-[#1a2744] dark:border-[#5A7BFF]' 
                        : 'bg-white border-slate-200 focus:border-blue-400 dark:bg-[#111827] dark:border-[#2d3748] dark:focus:border-[#5A7BFF]'
                    }`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addKeyword();
                      }
                    }}
                  />
                  <button
                    onClick={addKeyword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.9 bg-[#5A7BFF] rounded-md hover:bg-[#4a6bff] transition"
                  >
                    <Plus size={18} className="text-white" />
                  </button>
                </div>

                {keywords.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-[#5A7BFF] to-transparent"></div>
                    <span className="text-xs text-[#5A7BFF] whitespace-nowrap">
                      {keywords.length} keyword(s) added
                    </span>
                  </div>
                )}

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-blue-50 border border-slate-200 dark:bg-[#1a2744] dark:border-[#2d3748] rounded-full px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-[#5A7BFF] transition"
                      >
                        <span>{item}</span>
                        <button
                          onClick={() => removeKeyword(index)}
                          className="text-slate-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition ml-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Regular Expression Section */}
              <div>
                <label className="text-sm text-slate-600 dark:text-gray-300 mb-2 block">
                  Regular Expression
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={regularExpression}
                    onChange={(e) => setRegularExpression(e.target.value)}
                    placeholder="eg: ^[a-z]+$"
                    className={`w-full border rounded-md px-4 py-3 outline-none text-slate-800 dark:text-gray-300 placeholder-slate-400 dark:placeholder-gray-500 pr-12 transition-all ${
                      regularExpression 
                        ? 'bg-blue-50 border-blue-400 dark:bg-[#1a2744] dark:border-[#5A7BFF]' 
                        : 'bg-white border-slate-200 focus:border-blue-400 dark:bg-[#111827] dark:border-[#2d3748] dark:focus:border-[#5A7BFF]'
                    }`}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addRegularExpression();
                      }
                    }}
                  />
                  <button
                    onClick={addRegularExpression}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.9 bg-[#5A7BFF] rounded-md hover:bg-[#4a6bff] transition"
                  >
                    <Plus size={18} className="text-white" />
                  </button>
                </div>

                {regularExpressions.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-[#5A7BFF] to-transparent"></div>
                    <span className="text-xs text-[#5A7BFF] whitespace-nowrap">
                      {regularExpressions.length} regex(s) added
                    </span>
                  </div>
                )}

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {regularExpressions.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-blue-50 border border-slate-200 dark:bg-[#1a2744] dark:border-[#2d3748] rounded-full px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-[#5A7BFF] transition"
                      >
                        <span className="font-mono">{item}</span>
                        <button
                          onClick={() => removeRegularExpression(index)}
                          className="text-slate-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition ml-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-end mb-4">
              <button
                onClick={selectAllChannels}
                className="px-4 py-2 bg-blue-50 border border-blue-400 text-blue-600 dark:bg-[#1a2744] dark:border-[#5A7BFF] dark:text-[#5A7BFF] rounded-md hover:bg-blue-100 dark:hover:bg-[#243b6b] transition text-sm font-medium flex items-center gap-2"
              >
                {selectedChannels.length === channelControls.length ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {channelControls.map((channel) => {
                const Icon = channel.icon;
                const isSelected = selectedChannels.includes(channel.name);
                return (
                  <div
                    key={channel.name}
                    onClick={() => toggleChannel(channel.name)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-400 bg-blue-50 dark:border-[#5A7BFF] dark:bg-[#1a2744]"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-[#2d3748] dark:bg-[#111827] dark:hover:border-[#4a5568]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? "bg-blue-100 dark:bg-[#2d3748]" : "bg-slate-100 dark:bg-[#1a202c]"
                      }`}>
                        <Icon size={20} className={isSelected ? "text-blue-600 dark:text-[#5A7BFF]" : "text-slate-400 dark:text-gray-400"} />
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-medium ${isSelected ? "text-blue-600 dark:text-[#5A7BFF]" : "text-slate-700 dark:text-gray-200"}`}>
                          {channel.name}
                        </h5>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{channel.description}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#5A7BFF] flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {severityLevels.map((level) => {
                const Icon = level.icon;
                const isSelected = selectedSeverityLevels.includes(level.name);
                const colorClasses = {
                  red: "border-red-300 bg-red-50 hover:border-red-400 dark:border-red-500/50 dark:bg-red-500/10 dark:hover:border-red-500",
                  orange: "border-orange-300 bg-orange-50 hover:border-orange-400 dark:border-orange-500/50 dark:bg-orange-500/10 dark:hover:border-orange-500",
                  yellow: "border-yellow-300 bg-yellow-50 hover:border-yellow-400 dark:border-yellow-500/50 dark:bg-yellow-500/10 dark:hover:border-yellow-500",
                  blue: "border-blue-300 bg-blue-50 hover:border-blue-400 dark:border-blue-500/50 dark:bg-blue-500/10 dark:hover:border-blue-500",
                };
                const selectedColorClasses = {
                  red: "border-red-500 bg-red-100 dark:bg-red-500/20",
                  orange: "border-orange-500 bg-orange-100 dark:bg-orange-500/20",
                  yellow: "border-yellow-500 bg-yellow-100 dark:bg-yellow-500/20",
                  blue: "border-blue-500 bg-blue-100 dark:bg-blue-500/20",
                };
                const iconColorClasses = {
                  red: "text-red-600 dark:text-red-500",
                  orange: "text-orange-600 dark:text-orange-500",
                  yellow: "text-yellow-600 dark:text-yellow-500",
                  blue: "text-blue-600 dark:text-blue-500",
                };

                return (
                  <div
                    key={level.name}
                    onClick={() => toggleSeverityLevel(level.name)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? selectedColorClasses[level.color]
                        : colorClasses[level.color]
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? "bg-white dark:bg-[#2d3748]" : "bg-slate-100 dark:bg-[#1a202c]"
                      }`}>
                        <Icon size={20} className={isSelected ? iconColorClasses[level.color] : "text-slate-400 dark:text-gray-400"} />
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-medium ${isSelected ? "text-slate-800 dark:text-white" : "text-slate-700 dark:text-gray-200"}`}>
                          {level.name}
                        </h5>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{level.description}</p>
                      </div>
                      {isSelected && (
                        <div className={`w-5 h-5 rounded-full ${
                          level.color === "red" ? "bg-red-500" :
                          level.color === "orange" ? "bg-orange-500" :
                          level.color === "yellow" ? "bg-yellow-500" :
                          "bg-blue-500"
                        } flex items-center justify-center flex-shrink-0`}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className={`rounded-lg p-4 border transition-all ${
                (policyName || description)
                  // ? 'bg-blue-50 border-blue-400 dark:bg-[#1a2744] dark:border-[#5A7BFF]'
                  // : 'bg-slate-50 border-slate-200 dark:bg-[#0b1220] dark:border-[#333e52]'
              }`}>
                <h5 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-3">General Information</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400 dark:text-gray-500">Policy Name</span>
                    <span className={`text-sm ${policyName ? 'text-blue-600 dark:text-[#5A7BFF]' : 'text-slate-700 dark:text-gray-200'}`}>
                      {policyName || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400 dark:text-gray-500">Description</span>
                    <span className={`text-sm ${description ? 'text-blue-600 dark:text-[#5A7BFF]' : 'text-slate-700 dark:text-gray-200'}`}>
                      {description || "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-4 border transition-all ${
                selectedFileTypes.length > 0
                  ? 'bg-blue-50 border-blue-400 dark:bg-[#1a2744] dark:border-[#5A7BFF]'
                  : 'bg-slate-50 border-slate-200 dark:bg-[#0b1220] dark:border-[#2d3748]'
              }`}>
                <h5 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-3">File Type</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400 dark:text-gray-500">File Types</span>
                    <span className={`text-sm ${selectedFileTypes.length > 0 ? 'text-blue-600 dark:text-[#5A7BFF]' : 'text-slate-700 dark:text-gray-200'}`}>
                      {selectedFileTypes.length > 0 ? selectedFileTypes.join(", ") : "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-4 border transition-all ${
                selectedApplications.length > 0
                  ? 'bg-blue-50 border-blue-400 dark:bg-[#1a2744] dark:border-[#5A7BFF]'
                  : 'bg-slate-50 border-slate-200 dark:bg-[#0b1220] dark:border-[#2d3748]'
              }`}>
                <h5 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-3">Applications</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400 dark:text-gray-500">Applications</span>
                    <span className={`text-sm ${selectedApplications.length > 0 ? 'text-blue-600 dark:text-[#5A7BFF]' : 'text-slate-700 dark:text-gray-200'}`}>
                      {selectedApplications.length > 0 ? selectedApplications.join(", ") : "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-4 border transition-all ${
                (keywords.length > 0 || regularExpressions.length > 0)
                  ? 'bg-blue-50 border-blue-400 dark:bg-[#1a2744] dark:border-[#5A7BFF]'
                  : 'bg-slate-50 border-slate-200 dark:bg-[#0b1220] dark:border-[#2d3748]'
              }`}>
                <h5 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-3">Policy Condition</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400 dark:text-gray-500">Keywords</span>
                    <span className={`text-sm ${keywords.length > 0 ? 'text-blue-600 dark:text-[#5A7BFF]' : 'text-slate-700 dark:text-gray-200'}`}>
                      {keywords.length > 0 ? keywords.join(", ") : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400 dark:text-gray-500">Regular Expressions</span>
                    <span className={`text-sm ${regularExpressions.length > 0 ? 'text-blue-600 dark:text-[#5A7BFF]' : 'text-slate-700 dark:text-gray-200'}`}>
                      {regularExpressions.length > 0 ? regularExpressions.join(", ") : "None"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-4 border transition-all ${
                selectedChannels.length > 0
                  ? 'bg-blue-50 border-blue-400 dark:bg-[#1a2744] dark:border-[#5A7BFF]'
                  : 'bg-slate-50 border-slate-200 dark:bg-[#0b1220] dark:border-[#2d3748]'
              }`}>
                <h5 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-3">Channel Control</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400 dark:text-gray-500">Channels</span>
                    <span className={`text-sm ${selectedChannels.length > 0 ? 'text-blue-600 dark:text-[#5A7BFF]' : 'text-slate-700 dark:text-gray-200'}`}>
                      {selectedChannels.length > 0 ? selectedChannels.join(", ") : "Not specified"}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-4 border transition-all ${
                selectedSeverityLevels.length > 0
                  ? 'bg-blue-50 border-blue-400 dark:bg-[#1a2744] dark:border-[#5A7BFF]'
                  : 'bg-slate-50 border-slate-200 dark:bg-[#0b1220] dark:border-[#2d3748]'
              }`}>
                <h5 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-3">Severity Levels</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-400 dark:text-gray-500">Severity Levels</span>
                    <span className={`text-sm ${selectedSeverityLevels.length > 0 ? 'text-blue-600 dark:text-[#5A7BFF]' : 'text-slate-700 dark:text-gray-200'}`}>
                      {selectedSeverityLevels.length > 0 ? selectedSeverityLevels.join(", ") : "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6 bg-slate-50 dark:bg-[#0a0a1a]">

      {/* ===================== STEP HEADER WITH PROGRESS BAR ===================== */}
      <div className="w-full bg-white border border-slate-200 text-slate-800 dark:bg-[#020617] dark:border-[#2d2e30] dark:text-white rounded-xl p-6">

        <h2 className="text-xl font-semibold">
          Create Network Policy
        </h2>

        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
          Configure policy, source, destination, control, details.
        </p>

        {/* Progress Bar Steps */}
        <div className="relative flex justify-between items-center px-4 mt-6">
          {/* Background Line */}
          <div className="absolute left-0 right-0 top-4 h-[2px] bg-slate-200 dark:bg-gray-700"></div>

          {/* Active Progress Line */}
          <div
            className="absolute left-0 top-4 h-[2px] bg-[#5A7BFF] transition-all duration-500"
            style={{
              width: `${(activeStep / (steps.length - 1)) * 100}%`,
            }}
          ></div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            const isCompleted = index < activeStep;
            const hasData = hasSelections(index);

            return (
              <div
                key={index}
                onClick={() => setActiveStep(index)}
                className="relative z-10 flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-[#5A7BFF] border-[#5A7BFF] text-white shadow-lg shadow-[#5A7BFF]/30"
                      : isCompleted
                      ? "bg-blue-100 border-[#5A7BFF] text-[#5A7BFF] dark:bg-[#2d3748] dark:text-white"
                      : hasData && !isActive
                      ? "bg-blue-50 border-[#5A7BFF] text-[#5A7BFF] dark:bg-[#1a2744] dark:text-white"
                      : "bg-white border-slate-300 text-slate-400 dark:bg-[#0a1628] dark:border-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Icon size={16} />
                </div>

                <span
                  className={`mt-3 text-xs transition-colors duration-300 ${
                    isActive
                      ? "text-slate-800 font-medium dark:text-white"
                      : hasData || isCompleted
                      ? "text-[#5A7BFF]"
                      : "text-slate-400 dark:text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================== STEP CONTENT CARD ===================== */}

      <div className="bg-white border border-slate-200 text-slate-800 dark:bg-[#020617] dark:border-[#1a2a4a] dark:text-white rounded-xl p-6">

        {/* Heading */}

        <div className="flex items-start gap-3 mb-8">

          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-[#243b6b] flex items-center justify-center">
            <Settings2 size={16} className="text-blue-600 dark:text-[#82a5ff]" />
          </div>

          <div>
            <h3 className="text-lg font-medium">
              {steps[activeStep]?.title || "General Information"}
            </h3>

            <p className="text-sm text-slate-500 dark:text-gray-400">
              {activeStep === 0 && "Add basic policy details"}
              {activeStep === 1 && "Select the file type and extension"}
              {activeStep === 2 && "Choose which applications this DIP policy will monitor for data activity"}
              {activeStep === 3 && "Define policy conditions using keywords and regular expressions"}
              {activeStep === 4 && "Choose which channels this DLP policy will monitor for data activity"}
              {activeStep === 5 && "Choose severity levels for this DLP policy"}
              {activeStep === 6 && "Review all the details before creating the policy"}
            </p>
          </div>

          <span className="ml-auto text-sm text-slate-500 dark:text-gray-400">
            Step {activeStep + 1} of {steps.length}
          </span>

        </div>

        {/* Content */}

        {renderStepContent()}

        {/* Navigation Buttons - Right Aligned */}

        <div className="flex justify-end items-center gap-3 mt-10 pt-6 ">

          <button
            onClick={() => setActiveStep(activeStep > 0 ? activeStep - 1 : 0)}
            className={`px-6 py-3 border border-slate-200 dark:border-[#1a2a4a] rounded-md flex items-center gap-2 transition ${
              activeStep === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-50 dark:hover:bg-[#1f2937]"
            }`}
            disabled={activeStep === 0}
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <button
            onClick={() => {
              if (activeStep === steps.length - 1) {
                alert("Policy created successfully!");
              } else {
                setActiveStep(activeStep + 1);
              }
            }}
            className={`px-8 py-3 rounded-md transition text-white ${
              activeStep === steps.length - 1 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-[#6b8cff] hover:bg-[#5a7bff]"
            }`}
          >
            {activeStep === steps.length - 1 ? "Create Policy" : "Next"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default CreateNetworkPolicy;
