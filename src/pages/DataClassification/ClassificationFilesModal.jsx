import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { getLabelColor } from "./classificationData";

const columns = [
  { header: "SR_NO", accessor: "srNo", width: "w-[7%]", align: "text-center" },
  { header: "File Name", accessor: "fileName", width: "w-[19%]" },
  { header: "File Path", accessor: "filePath", width: "w-[34%]" },
  { header: "Extension", accessor: "extension", width: "w-[10%]", align: "text-center" },
  { header: "Label", accessor: "label", width: "w-[13%]", align: "text-center" },
  { header: "Host Name", accessor: "hostName", width: "w-[17%]" },
];

const pageSize = 10;

// ======================================================
// CLASSIFICATION FILES MODAL
// ======================================================
export default function ClassificationFilesModal({ show, onClose, title, data = [] }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // ====================================================
  // CLOSE MODAL (reset search + page for next open)
  // ====================================================
  const handleClose = () => {
    setSearch("");
    setCurrentPage(1);
    onClose();
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // ====================================================
  // LOCK BODY SCROLL + ESCAPE KEY
  // ====================================================
  useEffect(() => {
    if (!show) return;

    document.body.style.overflow = "hidden";
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSearch("");
        setCurrentPage(1);
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [show, onClose]);

  // ====================================================
  // SEARCH
  // ====================================================
  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data;
    return data.filter((row) =>
      columns.some((column) =>
        String(row?.[column.accessor] ?? "").toLowerCase().includes(term)
      )
    );
  }, [data, search]);

  // ====================================================
  // PAGINATION
  // ====================================================
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);
  const startRecord = filteredRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endRecord = Math.min(safePage * pageSize, filteredRows.length);

  // Modal stays in the DOM so the open/close CSS transition can run both ways
  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm transition-all duration-300 ease-in-out ${
        show ? "visible opacity-100 pointer-events-auto" : "invisible opacity-0 pointer-events-none"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={`flex h-[80vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ease-in-out dark:border-white/[0.08] dark:bg-[#020617] ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
          <h2 className="truncate text-[15px] font-semibold text-slate-800 dark:text-white">
            {title}
            <span className="ml-2 text-[12px] font-medium text-slate-400 dark:text-white/40">
              ({data.length})
            </span>
          </h2>

          <div className="flex shrink-0 items-center gap-2">
            {/* SEARCH */}
            <div className="relative w-[220px] sm:w-[260px]">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[12px] text-slate-700 outline-none transition focus:border-[#7094ff] focus:ring-2 focus:ring-[#7094ff]/20 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/80"
              />
            </div>

            {/* CLOSE */}
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/[0.1]"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full min-w-[950px] table-fixed border-collapse">
            <colgroup>
              {columns.map((column) => (
                <col key={column.accessor} className={column.width} />
              ))}
            </colgroup>

            <thead className="sticky top-0 z-10 bg-white dark:bg-[#020617]">
              <tr className="border-b border-slate-200 dark:border-white/[0.08]">
                {columns.map((column) => (
                  <th
                    key={column.accessor}
                    className={`border-r border-slate-200 px-3 py-2.5 text-[12px] font-semibold text-slate-700 last:border-r-0 dark:border-white/[0.06] dark:text-white/80 ${
                      column.align || "text-left"
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedRows.map((row, index) => (
                <tr
                  key={row.srNo}
                  className="border-b border-slate-200 align-top transition-colors odd:bg-slate-50 hover:bg-slate-100 dark:border-white/[0.06] dark:odd:bg-white/[0.02] dark:hover:bg-white/[0.05]"
                >
                  <td className="border-r border-slate-200 px-3 py-2.5 text-center text-[12px] text-slate-700 dark:border-white/[0.06] dark:text-white/70">
                    {(safePage - 1) * pageSize + index + 1}
                  </td>
                  <td className="break-words border-r border-slate-200 px-3 py-2.5 text-[12px] text-slate-800 dark:border-white/[0.06] dark:text-white/85">
                    {row.fileName}
                  </td>
                  <td className="break-all border-r border-slate-200 px-3 py-2.5 text-[12px] text-slate-600 dark:border-white/[0.06] dark:text-white/60">
                    {row.filePath}
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2.5 text-center text-[12px] text-slate-700 dark:border-white/[0.06] dark:text-white/70">
                    {row.extension}
                  </td>
                  <td className="border-r border-slate-200 px-3 py-2.5 text-center dark:border-white/[0.06]">
                    <span
                      className={`inline-flex rounded-full px-2 py-[2px] text-[10px] font-semibold whitespace-nowrap ${getLabelColor(
                        row.label
                      )}`}
                    >
                      {row.label}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-[12px] text-slate-700 dark:text-white/70">
                    {row.hostName}
                  </td>
                </tr>
              ))}

              {paginatedRows.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-10 text-center text-[12px] text-slate-500 dark:text-white/40"
                  >
                    No files found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 px-4 py-2.5 dark:border-white/[0.08]">
          <p className="text-[12px] text-slate-500 dark:text-white/50">
            Showing {startRecord} to {endRecord} of {filteredRows.length.toLocaleString()} entries
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage === 1}
              className="h-8 rounded-lg border border-slate-200 px-3 text-[12px] text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/[0.06]"
            >
              Previous
            </button>
            <span className="px-2 text-[12px] text-slate-600 dark:text-white/60">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safePage === totalPages}
              className="h-8 rounded-lg border border-slate-200 px-3 text-[12px] text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/[0.06]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
