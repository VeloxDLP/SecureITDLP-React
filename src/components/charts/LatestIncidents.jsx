import React, { useState } from "react";
import { Search } from "lucide-react";

export default function LatestIncidents({
  rows = [],
  divider,
  cardBorder,
  isDark,
}) {
  const headers = [
    "IP Address",
    "Username",
    "Event Type",
    "File Details",
    "Timestamp",
  ];


   const [search, setSearch] = useState("");

  const filteredRows = rows.filter((row) =>
    row.ipAddress?.toLowerCase().includes(search.toLowerCase()) ||
    row.username?.toLowerCase().includes(search.toLowerCase()) ||
    row.eventType?.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3 border-b"
        style={{ borderColor: cardBorder }}
      >
        <p className="text-[12px] font-semibold dark:text-white/80 text-slate-700">
          Latest Incidents
        </p>

        <div
          className="
            flex items-center gap-2
            px-3 py-1.5 rounded-lg text-[11px] border
            dark:bg-white/[0.04]
            dark:border-white/[0.08]
            bg-slate-50 border-slate-200
          "
        >
          <Search
            size={11}
            className="dark:text-white/30 text-slate-400"
          />

         <input
  type="text"
  placeholder="Search..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="
    bg-transparent
    outline-none
    text-[11px]
    dark:text-white
    text-slate-700
    placeholder:text-slate-400
    w-36
  "
/>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto h-[200px]">
        <table className="w-full text-[10px]">
          <thead>
            <tr style={{ borderBottom: `1px solid ${divider}` }}>
              {headers.map((header) => (
                <th
                  key={header}
                  className="
                    text-left
                    px-4 py-2.5
                    font-semibold
                    uppercase
                    tracking-wider
                    dark:text-white/25
                    text-slate-400
                  "
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredRows.length > 0 ? (
              filteredRows.map((row, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: `1px solid ${divider}`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = isDark
                      ? "rgba(255,255,255,0.03)"
                      : "#f8fafc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* IP Address */}
                  <td className="px-4 py-2.5 text-[#7094ff] font-medium">
                    {row.ipAddress}
                  </td>

                  {/* Username */}
                  <td className="px-4 py-2.5 dark:text-white/60 text-slate-600">
                    {row.username}
                  </td>

                  {/* Event Type */}
                  <td className="px-4 py-2.5 dark:text-white/45 text-slate-500">
                    {row.eventType}
                  </td>

                  
                  <td className="px-4 py-2.5 dark:text-white/25 text-slate-400">
                    {row.fileSourcePath || "-"}
                  </td>

                  {/* Timestamp */}
                  <td className="px-4 py-2.5 dark:text-white/35 text-slate-500">
                    {new Date(row.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-slate-400"
                >
                  No incidents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}