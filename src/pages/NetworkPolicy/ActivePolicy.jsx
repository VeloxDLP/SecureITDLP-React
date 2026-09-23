import React, { useEffect, useState } from "react";
import {
  Search,
  CalendarDays,
  Plus,
  Folder,
  Trash2,
  Eye,
  X,
  ShieldCheck,
  Monitor,
  Braces,
  Tag,
  Share2,
  FileText,
  Grid2X2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { dashboardService } from "../../services/dashboardService";

export default function ActivePolicy() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [policies, setPolicies] = useState([]);

  // Card selected policy
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  // Modal API data
  const [policyDetails, setPolicyDetails] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  /* =========================================================
     FETCH ACTIVE NETWORK POLICIES
  ========================================================= */

  useEffect(() => {
    fetchActiveNetworkPolicies();
  }, []);

  const fetchActiveNetworkPolicies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await dashboardService.getActiveNetworkPolicy();

      console.log("GetActiveDistinctPolicy Response:", response);

      if (response && response.success) {
        const apiData = Array.isArray(response.data) ? response.data : [];

        const formattedData = apiData.map((item, index) => ({
          id: `#${index + 1}`,

          name: item.policyName || item.policy_name || "N/A",

          description:
            item.description ||
            item.DESCRIPTION ||
            "No description available.",

          date: new Date().toLocaleDateString("en-GB"),
        }));

        setPolicies(formattedData);
      } else {
        setPolicies([]);
        setError(
          response?.message || "Failed to fetch active network policies."
        );
      }
    } catch (err) {
      console.error("Error fetching active network policies:", err);

      setPolicies([]);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to fetch active network policies."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredPolicies = policies.filter((policy) => {
    const search = searchTerm.toLowerCase();

    return (
      policy.name.toLowerCase().includes(search) ||
      policy.description.toLowerCase().includes(search)
    );
  });

  /* =========================================================
     VIEW DETAILS
  ========================================================= */

  const handleViewDetails = async (policy) => {
    try {
      setSelectedPolicy(policy);
      setPolicyDetails(null);
      setModalLoading(true);
      setShowModal(true);

      console.log("Fetching policy details for:", policy.name);

      const response = await dashboardService.getActivePolicyModal(policy.name);

      console.log("GetActiveDistinctPolicyModal Response:", response);

      if (response && response.success) {
        const apiData = Array.isArray(response.data) ? response.data : [];

        if (apiData.length > 0) {
          setPolicyDetails(apiData[0]);
        } else {
          setPolicyDetails(null);
          setError("No policy details found.");
        }
      } else {
        setPolicyDetails(null);
        setError(response?.message || "Failed to fetch policy details.");
      }
    } catch (err) {
      console.error("Error fetching policy details:", err);

      setPolicyDetails(null);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to fetch policy details."
      );
    } finally {
      setModalLoading(false);
    }
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPolicy(null);
    setPolicyDetails(null);
  };

  /* =========================================================
     CREATE POLICY
  ========================================================= */

  const handleCreatePolicy = () => {
    navigate("/NetworkPolicy");
  };

  /* =========================================================
     BODY SCROLL
  ========================================================= */

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  return (
    <div className="w-full p-6 space-y-6 bg-transparent min-h-screen">

      {/* =====================================================
          HEADER
      ===================================================== */}

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
              Active Network Policy
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

      {/* =====================================================
          TOOLBAR
      ===================================================== */}

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-indigo-400"
          />

          <input
            type="text"
            placeholder="Search Policy"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full rounded-lg
              border border-gray-200 dark:border-[#2B3345]
              bg-white dark:bg-[#020617]
              py-3 pl-11 pr-4
              text-gray-900 dark:text-white
              placeholder:text-gray-400
              dark:placeholder:text-gray-500
              outline-none
              focus:border-indigo-500
            "
          />
        </div>

        <button
          type="button"
          className="
            flex items-center gap-3 rounded-lg
            border border-gray-200 dark:border-[#2B3345]
            bg-white dark:bg-[#020617]
            px-5 py-3
            text-gray-700 dark:text-gray-300
            hover:bg-gray-50 dark:hover:bg-[#0B1220]
            transition
          "
        >
          <CalendarDays
            size={18}
            className="text-indigo-500 dark:text-indigo-400"
          />
          <span>Select Date Range</span>
        </button>

        <button
          type="button"
          onClick={handleCreatePolicy}
          className="
            flex items-center gap-3 rounded-lg
            border border-gray-200 dark:border-[#2B3345]
            bg-white dark:bg-[#020617]
            px-5 py-3
            text-gray-700 dark:text-gray-300
            hover:bg-gray-50 dark:hover:bg-[#0B1220]
            transition
          "
        >
          <Plus size={18} className="text-indigo-500 dark:text-indigo-400" />
          <span>Create Policy</span>
        </button>
      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="rounded-xl border border-gray-200 dark:border-[#2B3345] bg-white dark:bg-[#020617] p-10 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading active network policies...
          </p>
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}

      {!loading && error && !showModal && (
        <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* =====================================================
          NO DATA
      ===================================================== */}

      {!loading && !error && filteredPolicies.length === 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-[#2B3345] bg-white dark:bg-[#020617] p-10 text-center">
          <Folder size={40} className="mx-auto mb-3 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No active network policies found.
          </p>
        </div>
      )}

      {/* =====================================================
          POLICY CARDS
      ===================================================== */}

      {!loading && filteredPolicies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="
                rounded-xl border border-gray-200 dark:border-[#2B3345]
                bg-white dark:bg-[#020617]
                p-5
                shadow-sm dark:shadow-lg
                hover:shadow-md
                dark:hover:border-indigo-500/50
                transition
              "
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {policy.id}
                  </span>

                  <div className="flex items-center gap-2">
                    <Folder
                      size={18}
                      className="text-indigo-500 dark:text-indigo-400"
                    />

                    <span className="text-xl font-medium text-gray-900 dark:text-white">
                      {policy.name}
                    </span>
                  </div>
                </div>

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {policy.date}
                </span>
              </div>

              <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
                {policy.description}
              </p>

              <div className="my-5 border-t border-gray-200 dark:border-[#2B3345]" />

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleViewDetails(policy)}
                  className="
                    text-sm text-indigo-600 dark:text-indigo-400
                    hover:text-indigo-800 dark:hover:text-indigo-300
                    flex items-center gap-1 transition
                  "
                >
                  <Eye size={16} />
                  View Details →
                </button>

                <button type="button" className="hover:scale-110 transition">
                  <Trash2 size={18} className="text-red-500 hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =====================================================
          POLICY DETAILS MODAL
      ===================================================== */}

      {showModal && selectedPolicy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#000814]/60 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="
              w-full max-w-5xl max-h-[92vh] overflow-hidden
              rounded-xl border border-[#1E293B]
              bg-[#020617]
              shadow-[0_0_50px_rgba(0,0,0,0.5)]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex items-center justify-between px-7 py-5 border-b border-[#1E293B]">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center border border-[#3154A6] bg-[#0B1630]">
                  <ShieldCheck size={25} className="text-[#7094FF]" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {selectedPolicy.name}
                  </h2>
                  {/* <p className="text-xs text-slate-500 mt-1">
                    Active Network Policy
                  </p> */}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="
                  w-10 h-10 rounded-lg flex items-center justify-center
                  border border-[#3154A6] bg-[#071126]
                  text-[#7094FF]
                  hover:bg-[#0D1B3A] hover:text-white
                  transition
                "
              >
                <X size={23} />
              </button>
            </div>

            {/* =================================================
                MODAL BODY
            ================================================= */}

            <div className="max-h-[70vh] overflow-y-auto px-7 py-6">
              {modalLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-8 h-8 mx-auto mb-4 rounded-full border-2 border-[#3154A6] border-t-[#7094FF] animate-spin" />
                    <p className="text-sm text-[#8EA8D8]">
                      Loading policy details...
                    </p>
                  </div>
                </div>
              ) : policyDetails ? (
                <div className="space-y-7">

                  {/* ---------- POLICY NAME (full width) ---------- */}
                  {/* <FieldBlock
                    icon={<ShieldCheck size={20} className="text-[#7094FF]" />}
                    label="Policy Name"
                    value={
                      policyDetails.policyName ||
                      policyDetails.policy_name ||
                      selectedPolicy.name
                    }
                    highlight
                  /> */}

                  {/* ---------- 2-COLUMN GRID ---------- */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
                    <FieldBlock
                      icon={<Monitor size={20} className="text-[#7094FF]" />}
                      label="IP Address"
                      value={
                        policyDetails.ipAddress || policyDetails.ipaddress
                      }
                    />

                    <FieldBlock
                      icon={<Braces size={20} className="text-[#7094FF]" />}
                      label="Regex"
                      value={policyDetails.regex}
                    />

                    <FieldBlock
                      icon={<Tag size={20} className="text-[#7094FF]" />}
                      label="Keywords"
                      value={policyDetails.keywords}
                    />

                    <FieldBlock
                      icon={<Share2 size={20} className="text-[#7094FF]" />}
                      label="Channels"
                      value={policyDetails.channels}
                    />

                    <FieldBlock
                      icon={<FileText size={20} className="text-[#7094FF]" />}
                      label="File Types"
                      value={
                        policyDetails.fileTypes || policyDetails.file_types
                      }
                    />

                    <FieldBlock
                      icon={<Grid2X2 size={20} className="text-[#7094FF]" />}
                      label="Applications"
                      value={policyDetails.applications}
                    />
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-sm text-slate-400">
                    No policy details available.
                  </p>
                </div>
              )}
            </div>

            {/* =================================================
                MODAL FOOTER
            ================================================= */}

            <div className="flex justify-end  border-[#1E293B] px-7 py-5">
              {/* <button
                type="button"
                onClick={handleCloseModal}
                className="
                  min-w-[145px] rounded-lg
                  border border-[#3154A6]
                  bg-[#061126]
                  px-6 py-3
                  text-sm font-medium text-[#7094FF]
                  hover:bg-[#0D1B3A] hover:text-white
                  transition
                "
              >
                Close
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   FieldBlock — label + pills, with bottom separator
========================================================= */

function FieldBlock({ icon, label, value, highlight = false }) {
  const items = String(value || "-")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-sm font-medium text-white">{label}</span>
      </div>

      <div className="border-b border-[#1E3A5F] pb-3 flex flex-wrap gap-2">
        {items.map((v, i) => (
          <span
            key={i}
            className={`px-3 py-1.5 rounded-lg border border-[#1E3A5F] bg-[#020B1C] text-xs ${
              highlight ? "text-[#18C8FF] font-medium" : "text-[#C7D7F5]"
            }`}
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}