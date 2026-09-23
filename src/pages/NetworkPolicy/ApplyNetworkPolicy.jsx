import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Folder,
  FolderOpen,
  Share2,
  Building2,
  Monitor,
  Loader2,
  AlertCircle,
  Check,
  Search,
  X,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { dashboardService } from "../../services/dashboardService";

function ApplyNetworkPolicy() {
  const { isDark } = useTheme();

  // ---- State ----
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedEndpoints, setSelectedEndpoints] = useState([]);

  const [policies, setPolicies] = useState([]);
  const [policiesLoading, setPoliciesLoading] = useState(true);
  const [policiesError, setPoliciesError] = useState(null);

  const [policyDetails, setPolicyDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Branches
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);

  // Endpoints (devices)
  const [endpoints, setEndpoints] = useState([]);
  const [endpointsLoading, setEndpointsLoading] = useState(false);
  const [endpointsError, setEndpointsError] = useState(null);

  // Endpoint search
  const [endpointSearch, setEndpointSearch] = useState("");

  // ---- Load branches ----
  useEffect(() => {
    let isMounted = true;

    const loadBranches = async () => {
      try {
        setBranchesLoading(true);
        const response = await dashboardService.getBranch();
        console.log("📦 getBranch raw response:", response);

        const list = response?.data ?? response ?? [];
        const normalized = (Array.isArray(list) ? list : []).map((b, i) => {
          if (typeof b === "string") {
            return { id: b, label: b };
          }
          const value =
            b?.value ?? b?.branchName ?? b?.branch ?? b?.name ?? "";
          const label =
            b?.label ?? b?.branchName ?? b?.branch ?? b?.name ?? value;
          return {
            id: b?.id ?? value ?? `branch-${i}`,
            label,
          };
        });

        console.log("✅ Normalized branches:", normalized);
        if (isMounted) setBranches(normalized);
      } catch (err) {
        console.error("❌ Failed to load branches:", err);
        if (isMounted) setBranches([]);
      } finally {
        if (isMounted) setBranchesLoading(false);
      }
    };

    loadBranches();
    return () => {
      isMounted = false;
    };
  }, []);

  // ---- Load policies ----
  useEffect(() => {
    let isMounted = true;

    const fetchPolicies = async () => {
      try {
        setPoliciesLoading(true);
        setPoliciesError(null);

        const data = await dashboardService.getAllNetworkPolicy();
        console.log("📦 getAllNetworkPolicy raw response:", data);

        const raw = Array.isArray(data) ? data : data?.data ?? [];
        console.log("📋 Policies array:", raw);

        const normalized = raw.map((item, idx) => ({
          id: item.id ?? item.policyId ?? item.PolicyId ?? idx + 1,
          name:
            item.policyName ??
            item.PolicyName ??
            item.name ??
            item.Name ??
            (typeof item === "string" ? item : `Policy ${idx + 1}`),
          description:
            item.description ??
            item.Description ??
            item.policyDescription ??
            item.PolicyDescription ??
            "Configure policy, source, destination, control, details.",
          raw: item,
        }));

        console.log("✅ Normalized policies:", normalized);
        if (isMounted) setPolicies(normalized);
      } catch (err) {
        console.error("❌ Failed to fetch network policies:", err);
        if (isMounted)
          setPoliciesError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load policies."
          );
      } finally {
        if (isMounted) setPoliciesLoading(false);
      }
    };

    fetchPolicies();
    return () => {
      isMounted = false;
    };
  }, []);

  // ---- Fetch policy details when selected ----
  useEffect(() => {
    if (!selectedPolicy) {
      setPolicyDetails(null);
      setDetailsError(null);
      return;
    }

    const policyObj = policies.find((p) => p.id === selectedPolicy);
    const policyName = policyObj?.name;
    if (!policyName) return;

    let isMounted = true;

    const fetchDetails = async () => {
      try {
        setDetailsLoading(true);
        setDetailsError(null);
        setPolicyDetails(null);

        console.log("🔎 Fetching details for:", policyName);
        const resp = await dashboardService.getPolicyByName(policyName);
        console.log("📦 getPolicyByName raw response:", resp);

        const detail = resp?.data ?? resp ?? null;
        console.log("✅ Policy detail:", detail);

        if (isMounted) setPolicyDetails(detail);
      } catch (err) {
        console.error("❌ Failed to fetch policy details:", err);
        if (isMounted)
          setDetailsError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load policy details."
          );
      } finally {
        if (isMounted) setDetailsLoading(false);
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedPolicy, policies]);

  // ---- Fetch devices when branch changes ----
  useEffect(() => {
    if (!selectedBranch) {
      setEndpoints([]);
      setEndpointsError(null);
      return;
    }

    let isMounted = true;

    const fetchEndpoints = async () => {
      try {
        setEndpointsLoading(true);
        setEndpointsError(null);
        setEndpoints([]);

        console.log("🔎 Fetching devices for branch:", selectedBranch);
        const response = await dashboardService.getDevicesByBranch(
          selectedBranch
        );
        console.log("📦 getDevicesByBranch raw response:", response);

        const list = Array.isArray(response?.data)
          ? response.data
          : response?.data
          ? [response.data]
          : Array.isArray(response)
          ? response
          : [];

        // Normalize each item → { id, name, ip, raw }
        const normalized = list.map((item, idx) => {
          if (typeof item === "string") {
            return {
              id: `${item}-${idx}`,
              name: item,
              ip: "",
              raw: item,
            };
          }

          const name =
            item?.deviceName ??
            item?.device ??
            item?.pcName ??
            item?.computerName ??
            item?.hostName ??
            item?.hostname ??
            item?.name ??
            `Device ${idx + 1}`;

          const ip =
            item?.ipAddress ??
            item?.ip ??
            item?.IP_ADDRESS ??
            item?.ipaddress ??
            item?.ipAddr ??
            "";

          return {
            id: item?.id ?? item?.deviceId ?? `${name}-${idx}`,
            name,
            ip,
            raw: item,
          };
        });

        console.log("✅ Normalized endpoints:", normalized);
        if (isMounted) setEndpoints(normalized);
      } catch (err) {
        console.error("❌ Failed to load devices:", err);
        if (isMounted)
          setEndpointsError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load devices."
          );
      } finally {
        if (isMounted) setEndpointsLoading(false);
      }
    };

    fetchEndpoints();
    return () => {
      isMounted = false;
    };
  }, [selectedBranch]);

  // ---- Convert comma string → array ----
  const toArray = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v.filter(Boolean);
    if (typeof v === "string")
      return v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    return [v];
  };

  const details = {
    mode: toArray(policyDetails?.mode),
    fileType: toArray(policyDetails?.fileTypes),
    keywords: toArray(policyDetails?.keywords),
    channels: toArray(policyDetails?.channels),
    regex: toArray(policyDetails?.regularExpressions),
    application: toArray(policyDetails?.applications),
  };

  // ---- Filter endpoints by search ----
  const filteredEndpoints = endpoints.filter((e) => {
    const q = endpointSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      String(e.name ?? "").toLowerCase().includes(q) ||
      String(e.ip ?? "").toLowerCase().includes(q)
    );
  });

  // ---- Handlers ----
  const handlePolicySelect = (policyId) => {
    setSelectedPolicy(policyId);
  };

  const handleBranchSelect = (branchId) => {
    setSelectedBranch(branchId);
    setSelectedEndpoints([]);
    setEndpointSearch("");
    console.log("🖱️ Selected branch:", branchId);
  };

  const handleEndpointToggle = (endpointId) => {
    setSelectedEndpoints((prev) =>
      prev.includes(endpointId)
        ? prev.filter((id) => id !== endpointId)
        : [...prev, endpointId]
    );
  };

  const handleApplyPolicy = () => {
    const payload = {
      policyId: selectedPolicy,
      policyName: currentPolicy?.name,
      branch: selectedBranch,
      endpoints: selectedEndpoints,
    };
    console.log("🚀 Apply Policy payload:", payload);
  };

  // ---- Small UI helpers ----
  function Pill({ children, theme = "navy" }) {
    const themes = {
      navy: isDark
        ? "border-[#2B3345] bg-[#1A2235] text-white"
        : "border-slate-300 bg-slate-100 text-slate-700",
      green: isDark
        ? "border-emerald-800/40 bg-emerald-950/30 text-emerald-400"
        : "border-emerald-300 bg-emerald-50 text-emerald-700",
      amber: isDark
        ? "border-amber-800/40 bg-amber-950/30 text-amber-400"
        : "border-amber-300 bg-amber-50 text-amber-700",
    };
    return (
      <span
        className={`rounded-lg border px-3 py-1.5 text-xs whitespace-nowrap ${themes[theme]}`}
      >
        {children}
      </span>
    );
  }

  function SectionHeader({ icon: Icon, iconColor, children }) {
    return (
      <div className="flex items-center gap-2 mb-3">
        <Icon size={16} style={{ color: iconColor }} />
        <h3
          className={`text-sm font-medium whitespace-nowrap ${
            isDark ? "text-white" : "text-slate-700"
          }`}
        >
          {children}
        </h3>
        <div
          className={`flex-1 h-px ml-2 ${
            isDark ? "bg-[#2B3345]" : "bg-slate-200"
          }`}
        />
      </div>
    );
  }

  const currentPolicy = policies.find((p) => p.id === selectedPolicy);

  const hasGridDetails =
    details.fileType.length > 0 ||
    details.keywords.length > 0 ||
    details.channels.length > 0 ||
    details.regex.length > 0 ||
    details.application.length > 0;

  const modeValue = (details.mode[0] || "").toLowerCase();
  const modeTheme =
    modeValue === "block"
      ? isDark
        ? "border-red-800/40 bg-red-950/30 text-red-400"
        : "border-red-300 bg-red-50 text-red-700"
      : isDark
      ? "border-emerald-800/40 bg-emerald-950/30 text-emerald-400"
      : "border-emerald-300 bg-emerald-50 text-emerald-700";

  return (
    <div className="w-full">
      <br />

      {/* HEADING — styled like Manage Blacklisted */}
      <div className="flex items-start justify-between mb-7">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(112,148,255,0.15)",
              border: "1px solid rgba(112,148,255,0.25)",
              backdropFilter: "blur(12px)",
            }}
          >
            <ShieldCheck size={18} className="text-[#7094ff]" />
          </div>

          <div>
            <h2
              className={`font-display font-bold text-lg leading-tight ${
                isDark ? "text-slate-100" : "text-slate-800"
              }`}
            >
              Apply Network Policy
            </h2>

            <p
              className={`text-[11px] mt-0.5 ${
                isDark ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Configure policy, source, destination, control, details
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-3">
        {/* Left - Policies */}
        <div
          className={`w-[360px] rounded-xl border p-4 ${
            isDark
              ? "border-[#2B3345] bg-[#020617]"
              : "border-slate-200 bg-white"
          }`}
        >
          <h2
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-slate-800"
            }`}
          >
            Policies
          </h2>
          <p
            className={`mt-1 text-sm ${
              isDark ? "text-[#8C93A8]" : "text-slate-500"
            }`}
          >
            Configure policy, source, destination, control, details.
          </p>

          <div className="mt-5 max-h-[450px] overflow-y-auto space-y-3 pr-2">
            {policiesLoading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <Loader2 size={22} className="animate-spin text-[#4F7CFF]" />
                <span
                  className={`text-xs ${
                    isDark ? "text-[#8C93A8]" : "text-slate-500"
                  }`}
                >
                  Loading policies...
                </span>
              </div>
            ) : policiesError ? (
              <div
                className={`flex items-start gap-2 rounded-lg border p-4 text-xs ${
                  isDark
                    ? "border-red-800/40 bg-red-950/20 text-red-400"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{policiesError}</span>
              </div>
            ) : policies.length === 0 ? (
              <div
                className={`rounded-lg border p-4 text-center text-xs ${
                  isDark
                    ? "border-[#2d3748] bg-[#0b1220] text-[#8C93A8]"
                    : "border-slate-200 bg-white text-slate-500"
                }`}
              >
                No policies available.
              </div>
            ) : (
              policies.map((policy) => (
                <div
                  key={policy.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                    selectedPolicy === policy.id
                      ? isDark
                        ? "bg-[#1a2744] border-[#5A7BFF]"
                        : "bg-blue-50 border-blue-400"
                      : isDark
                      ? "bg-[#0b1220] border-[#2d3748] hover:border-[#4F7CFF]"
                      : "bg-white border-slate-200 hover:border-blue-400"
                  }`}
                  onClick={() => handlePolicySelect(policy.id)}
                >
                  <div className="flex-1">
                    <h3
                      className={`text-base font-medium ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {policy.name}
                    </h3>
                    <p
                      className={`mt-1 text-xs ${
                        isDark ? "text-[#8C93A8]" : "text-slate-500"
                      }`}
                    >
                      {policy.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex-1 space-y-3">
          {selectedPolicy ? (
            <div
              className={`rounded-xl border p-6 ${
                isDark
                  ? "border-[#2B3345] bg-[#020617]"
                  : "border-slate-200 bg-white"
              }`}
            >
              {/* Policy Header */}
              <div className="flex items-start justify-between gap-4 pb-5 mb-6">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                      isDark ? "bg-[#020617]" : "bg-white"
                    }`}
                  >
                    <ShieldCheck size={20} className="text-[#4F7CFF]" />
                  </div>

                  <div className="min-w-0">
                    <h2
                      className={`text-lg font-semibold ${
                        isDark ? "text-white" : "text-slate-800"
                      }`}
                    >
                      {policyDetails?.policyName ||
                        currentPolicy?.name ||
                        "Policy"}
                    </h2>
                    <p
                      className={`mt-0.5 text-xs ${
                        isDark ? "text-[#8C93A8]" : "text-slate-500"
                      }`}
                    >
                      {policyDetails?.description ||
                        currentPolicy?.description ||
                        "Configure policy, source, destination, control, details."}
                    </p>
                  </div>
                </div>

                {details.mode.length > 0 && (
                  <span
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize whitespace-nowrap flex-shrink-0 ${modeTheme}`}
                  >
                    {details.mode.join(", ")}
                  </span>
                )}
              </div>

              {/* Body */}
              {detailsLoading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <Loader2 size={22} className="animate-spin text-[#4F7CFF]" />
                  <span
                    className={`text-xs ${
                      isDark ? "text-[#8C93A8]" : "text-slate-500"
                    }`}
                  >
                    Loading policy details...
                  </span>
                </div>
              ) : detailsError ? (
                <div
                  className={`flex items-start gap-2 rounded-lg border p-4 text-xs ${
                    isDark
                      ? "border-red-800/40 bg-red-950/20 text-red-400"
                      : "border-red-200 bg-red-50 text-red-600"
                  }`}
                >
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{detailsError}</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-10 gap-y-6">
                  {details.fileType.length > 0 && (
                    <div>
                      <SectionHeader icon={Folder} iconColor="#4F7CFF">
                        File Type
                      </SectionHeader>
                      <div className="flex flex-wrap gap-2">
                        {details.fileType.map((item, i) => (
                          <Pill key={`ft-${i}`} theme="navy">
                            {item}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  )}

                  {details.channels.length > 0 && (
                    <div>
                      <SectionHeader icon={Share2} iconColor="#4F7CFF">
                        Channels
                      </SectionHeader>
                      <div className="flex flex-wrap gap-2">
                        {details.channels.map((item, i) => (
                          <Pill key={`ch-${i}`} theme="navy">
                            {item}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  )}

                  {details.keywords.length > 0 && (
                    <div>
                      <SectionHeader icon={FolderOpen} iconColor="#4F7CFF">
                        Keywords
                      </SectionHeader>
                      <div className="flex flex-wrap gap-2">
                        {details.keywords.map((item, i) => (
                          <Pill key={`kw-${i}`} theme="navy">
                            {item}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  )}

                  {details.regex.length > 0 && (
                    <div>
                      <SectionHeader icon={Folder} iconColor="#4F7CFF">
                        REGEX
                      </SectionHeader>
                      <div className="flex flex-wrap gap-2">
                        {details.regex.map((item, i) => (
                          <Pill key={`rg-${i}`} theme="navy">
                            {item}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  )}

                  {details.application.length > 0 && (
                    <div className="col-span-2">
                      <SectionHeader icon={Share2} iconColor="#4F7CFF">
                        Application
                      </SectionHeader>
                      <div className="flex flex-wrap gap-2">
                        {details.application.map((item, i) => (
                          <Pill key={`ap-${i}`} theme="navy">
                            {item}
                          </Pill>
                        ))}
                      </div>
                    </div>
                  )}

                  {!hasGridDetails && (
                    <div className="col-span-2">
                      <p
                        className={`text-xs text-center py-4 ${
                          isDark ? "text-[#8C93A8]" : "text-slate-500"
                        }`}
                      >
                        No additional details available for this policy.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              className={`rounded-xl border ${
                isDark
                  ? "border-[#2B3345] bg-[#020617]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex h-[280px] flex-col items-center justify-center px-6 text-center">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${
                    isDark ? "bg-[#24304F]" : "bg-blue-50"
                  }`}
                >
                  <ShieldCheck size={30} color="#4F7CFF" strokeWidth={2} />
                </div>
                <h2
                  className={`mt-6 text-3xl font-semibold ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}
                >
                  No Policy Selected
                </h2>
                <p
                  className={`mt-3 text-sm ${
                    isDark ? "text-[#9CA3AF]" : "text-slate-500"
                  }`}
                >
                  Configure policy, source, destination, control, details.
                </p>
                <p
                  className={`mt-2 max-w-md text-sm ${
                    isDark ? "text-[#7E8798]" : "text-slate-400"
                  }`}
                >
                  Configure policy, source, destination, source, destination,
                  control, details.
                </p>
              </div>
            </div>
          )}

          {/* Branch & Endpoints */}
          <div className="flex gap-3">
            {/* Branch Selection */}
            <div
              className={`w-[220px] flex-shrink-0 rounded-xl border p-4 flex flex-col ${
                isDark
                  ? "border-[#2B3345] bg-[#020617]"
                  : "border-slate-200 bg-white"
              }`}
              style={{ height: "240px" }}
            >
              <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                <Building2 size={16} className="text-[#4F7CFF]" />
                <label
                  className={`text-sm font-medium ${
                    isDark ? "text-white" : "text-slate-700"
                  }`}
                >
                  Branch Selection
                </label>
              </div>

              <div className="mt-2 flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
                {branchesLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2
                      size={18}
                      className="animate-spin text-[#4F7CFF]"
                    />
                  </div>
                ) : branches.length === 0 ? (
                  <p
                    className={`text-xs text-center py-4 ${
                      isDark ? "text-[#8C93A8]" : "text-slate-500"
                    }`}
                  >
                    No branches available
                  </p>
                ) : (
                  branches.map((b) => (
                    <div
                      key={b.id}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 transition ${
                        selectedBranch === b.id
                          ? isDark
                            ? "bg-[#1a2744] border-[#5A7BFF]"
                            : "bg-blue-50 border-blue-400"
                          : isDark
                          ? "bg-[#0b1220] border-[#2d3748] hover:border-[#4F7CFF]"
                          : "bg-white border-slate-200 hover:border-blue-400"
                      }`}
                      onClick={() => handleBranchSelect(b.id)}
                    >
                      <Building2
                        size={14}
                        className={`flex-shrink-0 ${
                          selectedBranch === b.id
                            ? isDark
                              ? "text-[#5A7BFF]"
                              : "text-blue-600"
                            : isDark
                            ? "text-[#8C93A8]"
                            : "text-slate-400"
                        }`}
                      />
                      <span
                        className={`text-xs truncate ${
                          isDark ? "text-white" : "text-slate-700"
                        }`}
                      >
                        {b.label}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Endpoints */}
            <div
              className={`flex-1 rounded-xl border p-4 ${
                isDark
                  ? "border-[#2B3345] bg-[#020617]"
                  : "border-slate-200 bg-white"
              }`}
              style={{ height: "240px" }}
            >
              {!selectedBranch ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full ${
                      isDark ? "bg-[#24304F]" : "bg-blue-50"
                    }`}
                  >
                    <ShieldCheck size={24} color="#4F7CFF" strokeWidth={2} />
                  </div>
                  <h3
                    className={`mt-3 text-lg font-semibold ${
                      isDark ? "text-white" : "text-slate-800"
                    }`}
                  >
                    No Branch Selected
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      isDark ? "text-[#9CA3AF]" : "text-slate-500"
                    }`}
                  >
                    Configure policy, source, destination, control, details.
                  </p>
                </div>
              ) : endpointsLoading ? (
                <div className="h-full flex flex-col items-center justify-center gap-2">
                  <Loader2
                    size={22}
                    className="animate-spin text-[#4F7CFF]"
                  />
                  <span
                    className={`text-xs ${
                      isDark ? "text-[#8C93A8]" : "text-slate-500"
                    }`}
                  >
                    Loading devices...
                  </span>
                </div>
              ) : endpointsError ? (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-center px-4">
                  <AlertCircle size={22} className="text-red-400" />
                  <p
                    className={`text-xs ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {endpointsError}
                  </p>
                </div>
              ) : endpoints.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <Monitor
                    size={26}
                    className={isDark ? "text-[#8C93A8]" : "text-slate-400"}
                  />
                  <p
                    className={`mt-2 text-xs ${
                      isDark ? "text-[#8C93A8]" : "text-slate-500"
                    }`}
                  >
                    No devices found for this branch.
                  </p>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {/* Header — Search + Select all + Apply */}
                  <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                    <h3
                      className={`text-sm font-medium flex-shrink-0 ${
                        isDark ? "text-white" : "text-slate-700"
                      }`}
                    >
                      Endpoints
                      <span
                        className={`ml-1.5 text-[11px] ${
                          isDark ? "text-[#8C93A8]" : "text-slate-400"
                        }`}
                      >
                        ({filteredEndpoints.length})
                      </span>
                    </h3>

                    <div className="flex-1" />

                    <div className="relative w-44 flex-shrink-0">
                      <Search
                        size={13}
                        className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${
                          isDark ? "text-gray-500" : "text-gray-400"
                        }`}
                      />
                      <input
                        type="text"
                        value={endpointSearch}
                        onChange={(e) => setEndpointSearch(e.target.value)}
                        placeholder="Search..."
                        className={`w-full pl-7 pr-7 py-1 rounded-md border outline-none text-[11px] ${
                          isDark
                            ? "bg-[#0b1120] border-[#1e293b] text-gray-200 placeholder-gray-500"
                            : "bg-slate-50 border-slate-200 text-gray-700 placeholder-gray-400"
                        }`}
                      />
                      {endpointSearch && (
                        <button
                          type="button"
                          onClick={() => setEndpointSearch("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        >
                          <X size={11} />
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={filteredEndpoints.length === 0}
                      onClick={() => {
                        const visibleIds = filteredEndpoints.map((e) => e.id);
                        const allVisibleSelected =
                          visibleIds.length > 0 &&
                          visibleIds.every((id) =>
                            selectedEndpoints.includes(id)
                          );

                        if (allVisibleSelected) {
                          setSelectedEndpoints((prev) =>
                            prev.filter((id) => !visibleIds.includes(id))
                          );
                        } else {
                          setSelectedEndpoints((prev) => {
                            const set = new Set([...prev, ...visibleIds]);
                            return Array.from(set);
                          });
                        }
                      }}
                      className={`px-3 py-1 rounded-md border text-[11px] font-medium whitespace-nowrap transition flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed ${
                        isDark
                          ? "border-[#4F7CFF] text-[#7C9CFF] bg-transparent hover:bg-[#4F7CFF]/10"
                          : "border-[#4F7CFF] text-[#4F7CFF] bg-transparent hover:bg-[#4F7CFF]/10"
                      }`}
                    >
                      {filteredEndpoints.length > 0 &&
                      filteredEndpoints.every((e) =>
                        selectedEndpoints.includes(e.id)
                      )
                        ? "Deselect All"
                        : "Select All"}
                    </button>

                    <button
                      onClick={handleApplyPolicy}
                      disabled={selectedEndpoints.length === 0}
                      className="rounded-md bg-[#4F7CFF] px-3 py-1 text-[11px] font-medium text-white hover:bg-[#3A66E0] transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                    >
                      Apply
                      {selectedEndpoints.length > 0
                        ? ` (${selectedEndpoints.length})`
                        : ""}
                    </button>
                  </div>

                  {/* Device list */}
                  <div
                    className="flex-1 overflow-y-auto space-y-2 pr-1"
                    style={{ overscrollBehavior: "contain" }}
                  >
                    {filteredEndpoints.length === 0 ? (
                      <p
                        className={`text-xs text-center py-4 ${
                          isDark ? "text-[#8C93A8]" : "text-slate-500"
                        }`}
                      >
                        No devices match your search.
                      </p>
                    ) : (
                      filteredEndpoints.map((endpoint) => {
                        const isSelected = selectedEndpoints.includes(
                          endpoint.id
                        );
                        return (
                          <div
                            key={endpoint.id}
                            onClick={() => handleEndpointToggle(endpoint.id)}
                            className={`flex items-center gap-3 rounded-lg border px-3 py-2 cursor-pointer transition flex-shrink-0 ${
                              isSelected
                                ? isDark
                                  ? "border-[#5A7BFF] bg-[#1a2744]"
                                  : "border-blue-400 bg-blue-50"
                                : isDark
                                ? "border-[#2B3345] bg-[#1A2235] hover:border-[#4F7CFF]"
                                : "border-slate-200 bg-slate-50 hover:border-blue-400"
                            }`}
                          >
                            <div
                              className={`h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "bg-[#4F7CFF] border-[#4F7CFF]"
                                  : isDark
                                  ? "border-[#4B5563]"
                                  : "border-slate-300"
                              }`}
                            >
                              {isSelected && (
                                <Check
                                  size={11}
                                  className="text-white"
                                  strokeWidth={3}
                                />
                              )}
                            </div>

                            <Monitor
                              size={16}
                              className="text-[#4F7CFF] flex-shrink-0"
                            />

                            <span
                              className={`text-xs flex-1 truncate ${
                                isDark ? "text-white" : "text-slate-700"
                              }`}
                            >
                              {endpoint.name}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyNetworkPolicy;