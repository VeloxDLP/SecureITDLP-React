
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  FileText,
  Globe,
  AppWindow,
  Code,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  Pin,
  Printer,
  RefreshCw,
  HardDrive,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { dashboardService } from "../../services/dashboardService";

export default function EndpointPolicyDashboard({
  computerName: computerNameProp,
}) {
  const location = useLocation();

  const computerName =
    computerNameProp ||
    location.state?.computerName ||
    location.state?.hostName ||
    location.state?.deviceName ||
    "PRATHAMESH-B";

  const [policyData, setPolicyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [searchWhitelist, setSearchWhitelist] = useState("");
  const [searchBlacklist, setSearchBlacklist] = useState("");
  const [searchWebsite, setSearchWebsite] = useState("");
  const [websiteMode, setWebsiteMode] = useState("All");

  // --------------------------------------------------
  // FETCH DEVICE ACTIVE POLICY API
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const fetchDeviceActivePolicy = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await dashboardService.getDeviceActivePolicy(computerName);

        // Supports both direct response and nested API response
        const payload = response?.data ?? response;

        const actualData =
          payload?.data &&
          typeof payload.data === "object" &&
          !Array.isArray(payload.data)
            ? payload.data
            : payload;

        if (mounted) {
          setPolicyData(actualData || {});
        }
      } catch (err) {
        console.error("Device Active Policy Error:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load endpoint policy."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchDeviceActivePolicy();

    return () => {
      mounted = false;
    };
  }, [computerName, refreshKey]);

  const refreshPolicy = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // --------------------------------------------------
  // API RESPONSE DATA
  // --------------------------------------------------

  const usbPolicy = policyData["USB Policy"];
  const printerPolicy = policyData["Printer Policy"];
  const applicationMode = policyData["Application Mode"];
  const driveDetails = policyData["Drive Details"];

  const websitePolicies = Array.isArray(policyData["Website Control"])
    ? policyData["Website Control"]
    : [];

  const blacklistedApplications = Array.isArray(
    policyData["Blacklisted Applications"]
  )
    ? policyData["Blacklisted Applications"]
    : [];

  // This API response does not currently contain whitelist data.
  const whitelistedApplications = Array.isArray(
    policyData["Whitelisted Applications"]
  )
    ? policyData["Whitelisted Applications"]
    : [];

  const networkPolicies = Array.isArray(
    policyData["Active Network Policies"]
  )
    ? policyData["Active Network Policies"]
    : [];

  const networkPolicy = networkPolicies[0] || {};

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const formatPolicy = (value) => {
    if (value === null || value === undefined || value === "") {
      return "Not Available";
    }

    if (typeof value === "string") {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }

    return String(value);
  };

  const getPolicyColor = (value) => {
    const normalized = String(value || "").toLowerCase();

    if (normalized === "allow" || normalized === "learning") {
      return "text-[#31d6a0]";
    }

    if (
      normalized === "prevent" ||
      normalized === "block" ||
      normalized === "not found"
    ) {
      return "text-[#ff4757]";
    }

    return "text-[#4f75ff]";
  };

  const splitValues = (value) => {
    if (!value) return [];

    return String(value)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const fileTypes = splitValues(networkPolicy.file_types);
  const keywords = splitValues(networkPolicy.keywords);
  const channels = splitValues(networkPolicy.channels);
  const applications = splitValues(networkPolicy.applications);

  const regexValues = splitValues(networkPolicy.regex);

  // --------------------------------------------------
  // STATUS BADGE
  // --------------------------------------------------

  const StatusBadge = ({ value }) => {
    const normalized = String(value || "").toLowerCase();

    const isAllowed = normalized === "allow";
    const isPrevented =
      normalized === "prevent" || normalized === "block";

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium ${
          isAllowed
            ? "border-[#31d6a0]/30 bg-[#31d6a0]/10 text-[#31d6a0]"
            : isPrevented
            ? "border-[#ff4757]/30 bg-[#ff4757]/10 text-[#ff4757]"
            : "border-[#4f75ff]/30 bg-[#4f75ff]/10 text-[#4f75ff]"
        }`}
      >
        {isAllowed ? (
          <CheckCircle2 size={10} />
        ) : (
          <ShieldAlert size={10} />
        )}

        {formatPolicy(value)}
      </span>
    );
  };

  // --------------------------------------------------
  // REUSABLE POLICY CARD
  // --------------------------------------------------

  const PolicyCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white dark:bg-[#020617] border border-gray-200 dark:border-[#1e293b] rounded-lg p-3.5 flex justify-between items-center transition-colors min-w-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[13px] font-semibold text-gray-900 dark:text-[#f8fafc] leading-tight">
          {title}
        </span>

        <span className={`text-[10px] font-medium mt-0.5 ${getPolicyColor(value)}`}>
          {formatPolicy(value)}
        </span>
      </div>

      <div className="w-8 h-8 rounded-full border border-gray-200 dark:border-[#1e293b] flex items-center justify-center shrink-0">
        <Icon size={19} className={getPolicyColor(value)} />
      </div>
    </div>
  );

  // --------------------------------------------------
  // REUSABLE APPLICATION TABLE
  // --------------------------------------------------

  const DataTable = ({ title, rows, search, setSearch }) => {
    const filteredRows = rows.filter((row) => {
      const query = search.toLowerCase();

      return (
        (row.application || "").toLowerCase().includes(query) ||
        (row.path || "").toLowerCase().includes(query)
      );
    });

    return (
      <div className="bg-white dark:bg-[#020617] rounded-lg p-3 flex flex-col gap-2 border border-gray-200 dark:border-[#1e293b] transition-colors min-w-0">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5">
            <AppWindow size={14} className="text-[#4f75ff]" />

            <h3 className="text-gray-800 dark:text-[#e2e8f0] text-[11px] font-medium">
              {title}
            </h3>

            <span className="bg-gray-100 dark:bg-[#1e293b] text-gray-500 dark:text-[#94a3b8] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {rows.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#0b1120] border border-gray-200 dark:border-[#1e293b] px-2 py-1 rounded-md">
            <Search size={12} className="text-gray-400 dark:text-[#64748b]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search application..."
              className="bg-transparent border-none outline-none text-[10px] text-gray-800 dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-[#475569] w-24"
            />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="max-h-[220px] overflow-y-auto custom-dashboard-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#020617]">
                <tr className="border-b border-gray-200 dark:border-[#1e293b]">
                  <th className="py-2 px-2 text-[9px] font-semibold text-gray-500 dark:text-[#64748b] uppercase tracking-wider w-[25%]">
                    Application Name
                  </th>

                  <th className="py-2 px-2 text-[9px] font-semibold text-gray-500 dark:text-[#64748b] uppercase tracking-wider w-[75%]">
                    Application Path
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRows.length > 0 ? (
                  filteredRows.map((row, idx) => (
                    <tr
                      key={`${row.application}-${idx}`}
                      className="border-b border-gray-200 dark:border-[#1e293b] last:border-none hover:bg-gray-50 dark:hover:bg-[#0b1120] transition-colors"
                    >
                      <td className="py-2 px-2 text-[10px] text-gray-800 dark:text-[#e2e8f0] font-medium align-top">
                        {row.application}
                      </td>

                      <td className="py-2 px-2 text-[9px] text-gray-500 dark:text-[#94a3b8] break-all leading-snug align-top">
                        {row.path || "Not Available"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-5 text-center text-[10px] text-gray-400"
                    >
                      {rows.length === 0
                        ? "No application data available"
                        : "No matching applications found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --------------------------------------------------
  // WEBSITE PROTECTION POLICIES
  // --------------------------------------------------

  const filteredWebsites = websitePolicies.filter((item) => {
    const query = searchWebsite.toLowerCase();

    const matchesSearch =
      (item.website || "").toLowerCase().includes(query) ||
      (item.mode || "").toLowerCase().includes(query);

    const matchesMode =
      websiteMode === "All" ||
      String(item.mode || "").toLowerCase() === websiteMode.toLowerCase();

    return matchesSearch && matchesMode;
  });

  const WebsiteProtectionPolicies = () => (
    <div className="bg-white dark:bg-[#020617] rounded-lg border border-gray-200 dark:border-[#1e293b] flex flex-col transition-colors min-w-0">
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-[#1e293b] gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <ShieldAlert size={14} className="text-[#4f75ff]" />

          <h2 className="text-gray-800 dark:text-[#e2e8f0] text-[11px] font-medium m-0">
            Website Protection Policies
          </h2>

          <span className="bg-gray-100 dark:bg-[#1e293b] text-gray-500 dark:text-[#94a3b8] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            {websitePolicies.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-[#0b1120] border border-gray-200 dark:border-[#1e293b] px-2.5 py-1 rounded-md">
            <Search size={12} className="text-gray-400 dark:text-[#64748b]" />

            <input
              type="text"
              value={searchWebsite}
              onChange={(e) => setSearchWebsite(e.target.value)}
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-[10px] text-gray-800 dark:text-[#e2e8f0] placeholder-gray-400 dark:placeholder-[#475569] w-24"
            />
          </div>

          <div className="relative">
            <select
              value={websiteMode}
              onChange={(e) => setWebsiteMode(e.target.value)}
              className="appearance-none bg-gray-100 dark:bg-[#0b1120] border border-gray-200 dark:border-[#1e293b] px-2.5 py-1 pr-7 rounded-md cursor-pointer text-[10px] text-gray-700 dark:text-[#e2e8f0] outline-none"
            >
              <option value="All">All Modes</option>
              <option value="Allow">Allow</option>
              <option value="Prevent">Prevent</option>
            </select>

            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="max-h-[220px] overflow-y-auto custom-dashboard-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-[#020617]">
              <tr className="border-b border-gray-200 dark:border-[#1e293b]">
                <th className="py-2 px-3 text-[9px] font-semibold text-gray-500 dark:text-[#64748b] uppercase tracking-wider w-1/2">
                  Website
                </th>

                <th className="py-2 px-3 text-[9px] font-semibold text-gray-500 dark:text-[#64748b] uppercase tracking-wider w-1/2">
                  Mode
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredWebsites.length > 0 ? (
                filteredWebsites.map((row, idx) => (
                  <tr
                    key={`${row.website}-${idx}`}
                    className="border-b border-gray-200 dark:border-[#1e293b] last:border-none hover:bg-gray-50 dark:hover:bg-[#0b1120] transition-colors"
                  >
                    <td className="py-2 px-3 text-[10px] text-gray-700 dark:text-[#cbd5e1] break-all">
                      {row.website}
                    </td>

                    <td className="py-2 px-3">
                      <StatusBadge value={row.mode} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="py-5 text-center text-[10px] text-gray-400"
                  >
                    No website policies found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------
  // SECURITY POLICY DETAILS
  // --------------------------------------------------

  const SecurityPolicyDetails = () => {
    const tagStyle =
      "px-1.5 py-0.5 text-[11px] rounded bg-white text-gray-700 shadow-sm border border-gray-300 dark:bg-[#0b1120] dark:text-[#cbd5e1] dark:border-[#1e293b] dark:shadow-none transition-colors break-all";

    const TagSection = ({ title, icon: Icon, values }) => (
      <div className="flex flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-[#cbd5e1]">
          <Icon size={16} />
          {title}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {values.length > 0 ? (
            values.map((tag, index) => (
              <span key={`${tag}-${index}`} className={tagStyle}>
                {tag}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-gray-400">
              No data available
            </span>
          )}
        </div>
      </div>
    );

    return (
      <div className="bg-white dark:bg-[#020617] rounded-lg p-3 flex flex-col gap-3 border border-gray-200 dark:border-[#1e293b] transition-colors min-w-0">
        <div className="flex justify-between items-center mb-1 gap-2 flex-wrap">
          <h3 className="text-gray-800 dark:text-[#e2e8f0] text-[11px] font-medium flex items-center gap-1.5 m-0">
            <ShieldCheck size={14} className="text-[#4f75ff]" />
            Security Policy Details
          </h3>

          <span className="text-[9px] text-gray-400 dark:text-[#64748b]">
            Active Network Policy
          </span>
        </div>

        {networkPolicies.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <TagSection
                title="File Type"
                icon={FileText}
                values={fileTypes}
              />

              <TagSection
                title="Keywords"
                icon={FileText}
                values={keywords}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <TagSection
                title="Channels"
                icon={Globe}
                values={channels}
              />

              <TagSection
                title="REGEX"
                icon={Code}
                values={regexValues}
              />
            </div>

            <TagSection
              title="Application"
              icon={AppWindow}
              values={applications}
            />
          </div>
        ) : (
          <div className="py-5 text-center text-[10px] text-gray-400">
            No active network policy found
          </div>
        )}
      </div>
    );
  };

  // --------------------------------------------------
  // MAIN DASHBOARD
  // --------------------------------------------------

  return (
    <div className="w-full font-sans flex flex-col gap-3">
      {/* HEADER */}
      <div className="bg-white dark:bg-[#020617] rounded-lg p-3.5 flex justify-between items-center gap-3 border border-gray-200 dark:border-[#1e293b] transition-colors">
        <div className="flex flex-col gap-1">
          <h1 className="text-[14px] font-semibold text-gray-900 dark:text-[#f8fafc] m-0 tracking-wide">
            Endpoint Policy
          </h1>

          <p className="text-[10px] text-gray-500 dark:text-[#94a3b8] m-0">
            Endpoint policy details for {computerName}
          </p>
        </div>

        <button
          type="button"
          onClick={refreshPolicy}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 dark:border-[#1e293b] text-gray-600 dark:text-[#cbd5e1] text-[10px] hover:bg-gray-100 dark:hover:bg-[#0b1120] disabled:opacity-50 transition-colors"
        >
          <RefreshCw
            size={12}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="bg-white dark:bg-[#020617] rounded-lg border border-gray-200 dark:border-[#1e293b] p-8 flex items-center justify-center gap-2 text-gray-500 dark:text-[#94a3b8] text-[11px]">
          <Loader2 size={16} className="animate-spin" />
          Loading endpoint policies...
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="bg-white dark:bg-[#020617] rounded-lg border border-red-300 dark:border-red-900 p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-red-500 text-[11px]">
            <AlertCircle size={16} />
            {error}
          </div>

          <button
            onClick={refreshPolicy}
            className="text-[10px] px-3 py-1.5 rounded border border-red-300 text-red-500"
          >
            Retry
          </button>
        </div>
      )}

      {/* DASHBOARD CONTENT */}
      {!loading && !error && (
        <>
          {/* 1. METRICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <PolicyCard
              title="USB Control"
              value={usbPolicy}
              icon={Pin}
            />

            <PolicyCard
              title="Printer Control"
              value={printerPolicy}
              icon={Printer}
            />

            <PolicyCard
              title="Application Mode"
              value={applicationMode}
              icon={AppWindow}
            />

            <PolicyCard
              title="Drive Control"
              value={driveDetails}
              icon={HardDrive}
            />
          </div>

          {/* 2. APPLICATION TABLES */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <DataTable
              title="Whitelisted Application"
              rows={whitelistedApplications}
              search={searchWhitelist}
              setSearch={setSearchWhitelist}
            />

            <DataTable
              title="Blacklisted Application"
              rows={blacklistedApplications}
              search={searchBlacklist}
              setSearch={setSearchBlacklist}
            />
          </div>

          {/* 3. WEBSITE AND SECURITY POLICY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <WebsiteProtectionPolicies />
            <SecurityPolicyDetails />
          </div>
        </>
      )}

      {/* CUSTOM SCROLLBAR */}
      <style>{`
        .custom-dashboard-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
        }

        .custom-dashboard-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .custom-dashboard-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-dashboard-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }

        .custom-dashboard-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}
