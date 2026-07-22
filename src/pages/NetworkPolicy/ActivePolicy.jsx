import React, { useState, useEffect } from "react";
import { Search, CalendarDays, Plus, Folder, Trash2, Eye, X } from "lucide-react";

export default function ActivePolicy() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const policies = [
    {
      id: "#12",
      name: "Khadigram Policy",
      date: "20/04/2026",
      description:
        "Configure policy, source, destination, control, details. Configure policy, source, destination, control, details. Configure policy, source, destination, control, details.",
    },
    {
      id: "#13",
      name: "Finance Policy",
      date: "18/04/2026",
      description:
        "Configure policy, source, destination, control, details. Configure policy, source, destination, control, details.",
    },
    {
      id: "#14",
      name: "HR Department",
      date: "15/04/2026",
      description:
        "Configure policy, source, destination, control, details. Configure policy, source, destination, control, details.",
    },
    {
      id: "#15",
      name: "USB Security",
      date: "12/04/2026",
      description:
        "Configure policy, source, destination, control, details. Configure policy, source, destination, control, details.",
    },
    {
      id: "#16",
      name: "Network Access",
      date: "10/04/2026",
      description:
        "Configure policy, source, destination, control, details. Configure policy, source, destination, control, details.",
    },
    {
      id: "#17",
      name: "Website Blocking",
      date: "08/04/2026",
      description:
        "Configure policy, source, destination, control, details. Configure policy, source, destination, control, details.",
    },
    {
      id: "#18",
      name: "Application Control",
      date: "05/04/2026",
      description:
        "Configure policy, source, destination, control, details. Configure policy, source, destination, control, details.",
    },
    {
      id: "#19",
      name: "Printer Restriction",
      date: "02/04/2026",
      description:
        "Configure policy, source, destination, control, details. Configure policy, source, destination, control, details.",
    },
    {
      id: "#20",
      name: "DLP Policy",
      date: "01/04/2026",
      description:
        "Configure policy, source, destination, control, details. Configure policy, source, destination, control, details.",
    },
  ];

  const handleViewDetails = (policy) => {
    setSelectedPolicy(policy);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPolicy(null);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  return (
    <div className="w-full p-6 space-y-6 bg-transparent min-h-screen">
      {/* Header */}
      <div className="w-full rounded-xl border border-gray-200 dark:border-[#2B3345] bg-white dark:bg-[#020617] px-6 py-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Active Network Policy
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure policy, source, destination, control, details.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[300px]">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 dark:text-indigo-400"
          />
          <input
            type="text"
            placeholder="Search Policy"
            className="w-full rounded-lg border border-gray-200 dark:border-[#2B3345] bg-white dark:bg-[#020617] py-3 pl-11 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-indigo-500"
          />
        </div>

        {/* Date */}
        <button className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-[#2B3345] bg-white dark:bg-[#020617] px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0B1220] transition">
          <CalendarDays size={18} className="text-indigo-500 dark:text-indigo-400" />
          <span>Select Date Range</span>
        </button>

        {/* Create */}
        <button className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-[#2B3345] bg-white dark:bg-[#020617] px-5 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#0B1220] transition">
          <Plus size={18} className="text-indigo-500 dark:text-indigo-400" />
          <span>Create Policy</span>
        </button>
      </div>

      {/* Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {policies.map((policy) => (
          <div
            key={policy.id}
            className="rounded-xl border border-gray-200 dark:border-[#2B3345] bg-white dark:bg-[#020617] p-5 shadow-sm dark:shadow-lg hover:shadow-md dark:hover:border-indigo-500/50 transition"
          >
            {/* Top */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {policy.id}
                </span>

                <div className="flex items-center gap-2">
                  <Folder size={18} className="text-indigo-500 dark:text-indigo-400" />
                  <span className="text-xl font-medium text-gray-900 dark:text-white">
                    {policy.name}
                  </span>
                </div>
              </div>

              <span className="text-xs text-gray-500 dark:text-gray-400">
                {policy.date}
              </span>
            </div>

            {/* Description */}
            <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
              {policy.description}
            </p>

            {/* Divider */}
            <div className="my-5 border-t border-gray-200 dark:border-[#2B3345]" />

            {/* Footer */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => handleViewDetails(policy)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1 transition"
              >
                <Eye size={16} />
                View Details →
              </button>

              <button className="hover:scale-110 transition">
                <Trash2
                  size={18}
                  className="text-red-500 hover:text-red-400"
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && selectedPolicy && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-sm p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="w-[95%] max-w-6xl max-h-[90vh] rounded-xl border border-gray-200 dark:border-[#2B3345] bg-white dark:bg-[#020617] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#2B3345] px-6 py-4 flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                  <Folder size={20} className="text-indigo-500 dark:text-indigo-400" />
                  {selectedPolicy.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Policy ID: {selectedPolicy.id} • Created: {selectedPolicy.date}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-2xl text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Access Policy Header */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Access Policy</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configure policy, source, destination, control, details.
                </p>
              </div>

              {/* Policy Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* File Type */}
                <div className="bg-gray-50 dark:bg-[#0B1220] rounded-lg border border-gray-200 dark:border-[#2B3345] p-4">
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    File Type
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['PDF', 'Doc', 'Docx', 'xlsx', 'txt'].map((type) => (
                      <span
                        key={type}
                        className="px-2.5 py-1 bg-white dark:bg-[#020617] border border-gray-200 dark:border-[#2B3345] rounded text-xs text-gray-700 dark:text-gray-300"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Channels */}
                <div className="bg-gray-50 dark:bg-[#0B1220] rounded-lg border border-gray-200 dark:border-[#2B3345] p-4">
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Channels
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Browser Upload', 'FTP Transfer', 'Clipboard copy'].map((channel) => (
                      <span
                        key={channel}
                        className="px-2.5 py-1 bg-white dark:bg-[#020617] border border-gray-200 dark:border-[#2B3345] rounded text-xs text-gray-700 dark:text-gray-300"
                      >
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Application */}
                <div className="bg-gray-50 dark:bg-[#0B1220] rounded-lg border border-gray-200 dark:border-[#2B3345] p-4">
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Application
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['Browser Upload', 'FTP Transfer', 'Clipboard copy', 'Network Share'].map((app) => (
                      <span
                        key={app}
                        className="px-2.5 py-1 bg-white dark:bg-[#020617] border border-gray-200 dark:border-[#2B3345] rounded text-xs text-gray-700 dark:text-gray-300"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div className="bg-gray-50 dark:bg-[#0B1220] rounded-lg border border-gray-200 dark:border-[#2B3345] p-4">
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-white dark:bg-[#020617] border border-gray-200 dark:border-[#2B3345] rounded text-xs text-gray-700 dark:text-gray-300">
                      Salary
                    </span>
                    <span className="px-2.5 py-1 bg-white dark:bg-[#020617] border border-gray-200 dark:border-[#2B3345] rounded text-xs text-gray-700 dark:text-gray-300">
                      email
                    </span>
                    <span className="px-2.5 py-1 bg-white dark:bg-[#020617] border border-gray-200 dark:border-[#2B3345] rounded text-xs text-gray-700 dark:text-gray-300">
                      increment
                    </span>
                    <span className="px-2.5 py-1 bg-white dark:bg-[#020617] border border-gray-200 dark:border-[#2B3345] rounded text-xs text-gray-700 dark:text-gray-300">
                      Salary
                    </span>
                  </div>
                </div>

                {/* REGEX */}
                <div className="bg-gray-50 dark:bg-[#0B1220] rounded-lg border border-gray-200 dark:border-[#2B3345] p-4">
                  <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    REGEX
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {['PDF', 'Doc', 'Docx', 'xlsx', 'txt'].map((regex) => (
                      <span
                        key={regex}
                        className="px-2.5 py-1 bg-white dark:bg-[#020617] border border-gray-200 dark:border-[#2B3345] rounded text-xs text-gray-700 dark:text-gray-300"
                      >
                        {regex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-gray-50 dark:bg-[#0B1220] rounded-lg border border-gray-200 dark:border-[#2B3345] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-[#020617] text-gray-600 dark:text-gray-400 uppercase">
                      <tr>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">IP Address</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">Username</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">Event Type</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">File Details</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold tracking-wider">Timestamp</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 dark:divide-[#20283A] bg-white dark:bg-transparent">
                      {[
                        {
                          ip: "192.168.0.41",
                          user: "VELOX",
                          event: "WEB UPLOAD",
                          file: "document.pdf",
                          time: "2024-01-15 10:30:00",
                        },
                        {
                          ip: "192.168.0.42",
                          user: "Admin",
                          event: "WEB UPLOAD",
                          file: "report.docx",
                          time: "2024-01-15 11:15:00",
                        },
                        {
                          ip: "192.168.0.43",
                          user: "User1",
                          event: "WEB DOWNLOAD",
                          file: "image.png",
                          time: "2024-01-15 12:00:00",
                        },
                        {
                          ip: "192.168.0.44",
                          user: "VELOX",
                          event: "WEB UPLOAD",
                          file: "data.xlsx",
                          time: "2024-01-15 13:30:00",
                        },
                        {
                          ip: "192.168.0.45",
                          user: "Kiran_Tester",
                          event: "WEB UPLOAD",
                          file: "presentation.pptx",
                          time: "2024-01-15 14:45:00",
                        },
                        {
                          ip: "192.168.0.46",
                          user: "VELOX",
                          event: "WEB DOWNLOAD",
                          file: "backup.zip",
                          time: "2024-01-15 15:20:00",
                        },
                        {
                          ip: "192.168.0.47",
                          user: "User2",
                          event: "WEB UPLOAD",
                          file: "script.js",
                          time: "2024-01-15 16:10:00",
                        },
                        {
                          ip: "192.168.0.48",
                          user: "VELOX",
                          event: "WEB DOWNLOAD",
                          file: "style.css",
                          time: "2024-01-15 17:00:00",
                        },
                        {
                          ip: "192.168.0.49",
                          user: "Kira_Tester",
                          event: "WEB UPLOAD",
                          file: "index.html",
                          time: "2024-01-15 18:30:00",
                        },
                        {
                          ip: "192.168.0.50",
                          user: "VELOX",
                          event: "WEB DOWNLOAD",
                          file: "config.json",
                          time: "2024-01-15 19:45:00",
                        },
                      ].map((row, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-[#020617] transition-colors"
                        >
                          <td className="px-5 py-3 text-indigo-600 dark:text-sky-400 font-mono text-xs">{row.ip}</td>
                          <td className="px-5 py-3 text-gray-700 dark:text-gray-300">{row.user}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                              row.event === 'WEB UPLOAD' 
                                ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                                : 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20'
                            }`}>
                              {row.event}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-700 dark:text-gray-300 font-mono text-xs">{row.file}</td>
                          <td className="px-5 py-3 text-gray-500 dark:text-gray-400 text-xs">{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-[#2B3345] px-6 py-4 text-gray-500 dark:text-gray-400 flex-shrink-0">
              <span className="text-sm">Showing 1–10 of 10 entries</span>

              <div className="flex items-center gap-3">
                <button className="rounded border border-gray-200 dark:border-[#2B3345] px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-[#0B1220] hover:border-gray-300 dark:hover:border-[#3A4A5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>

                <span className="text-sm px-3 py-1 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                  1
                </span>

                <button className="rounded border border-gray-200 dark:border-[#2B3345] px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-[#0B1220] hover:border-gray-300 dark:hover:border-[#3A4A5A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}