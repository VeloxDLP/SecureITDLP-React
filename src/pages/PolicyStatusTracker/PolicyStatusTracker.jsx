import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, Clock, Send, Activity, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext"; // adjust path
import { dashboardService } from "../../services/dashboardService"; // adjust path

/* =========================================================
   CONFIG
========================================================= */
// keys = status strings from CURRENT_REQUEST_STATUS, lowercased
const STATUS_META = {
  inprocess: { label: "In process", tone: "inprocess", step: 1 },
  "request sent to client": { label: "Sent to client", tone: "sent", step: 2 },
  success: { label: "Success", tone: "success", step: 3, final: true },
  failed: { label: "Failed", tone: "failed", step: 3, final: true },
  fail: { label: "Failed", tone: "failed", step: 3, final: true },
};
const TOTAL_STEPS = 3;
const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 180000; // 3 min

const TONE_STYLE = {
  inprocess: { cls: "bg-amber-500/10 text-amber-500 border-amber-500/20", Icon: Loader2, spin: true },
  sent: { cls: "bg-[#7094ff]/10 text-[#7094ff] border-[#7094ff]/20", Icon: Send },
  success: { cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", Icon: CheckCircle2 },
  failed: { cls: "bg-rose-500/10 text-rose-500 border-rose-500/20", Icon: XCircle },
  timeout: { cls: "bg-slate-500/10 text-slate-400 border-slate-500/20", Icon: Clock },
  pending: { cls: "bg-slate-500/10 text-slate-400 border-slate-500/20", Icon: Clock },
};

const isFinalStatus = (status) => !!STATUS_META[(status || "").toLowerCase()]?.final;

const getMeta = (status, timedOut) => {
  const meta = STATUS_META[(status || "").toLowerCase()];
  if (meta?.final) return meta;
  if (timedOut) return { label: "No response", tone: "timeout", step: TOTAL_STEPS, final: true };
  return meta || { label: status || "Pending", tone: "pending", step: 0 };
};

function StatusBadge({ meta }) {
  const s = TONE_STYLE[meta.tone] || TONE_STYLE.pending;
  const Icon = s.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${s.cls}`}
    >
      <Icon size={10} className={s.spin ? "animate-spin" : ""} />
      {meta.label}
    </span>
  );
}

/* =========================================================
   COMPONENT
========================================================= */
export default function PolicyStatusTracker({ title = "Policy", eventIds = [], onClose }) {
  const { isDark } = useTheme();

  const [rows, setRows] = useState([]);
  const [polling, setPolling] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const key = eventIds.join(",");

  // ---- polling ----
  useEffect(() => {
    if (!key) return;

    const expected = key.split(",").length;
    const start = Date.now();
    let timer;
    let cancelled = false;

    setRows([]);
    setPolling(true);
    setTimedOut(false);

    const tick = async () => {
      try {
        const res = await dashboardService.getLivePolicyStatus(key);
        if (cancelled) return;

        // service returns ApiResponse body -> res.data is the rows array
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setRows(data);

        const allFinal = data.length === expected && data.every((r) => isFinalStatus(r.status));
        if (allFinal) {
          setPolling(false);
          return;
        }
      } catch (e) {
        console.error("Policy status poll failed", e);
      }

      if (Date.now() - start >= POLL_TIMEOUT_MS) {
        if (!cancelled) {
          setPolling(false);
          setTimedOut(true);
        }
        return;
      }

      timer = setTimeout(tick, POLL_INTERVAL_MS);
    };

    tick();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [key]);

  // ---- derived values ----
  const total = eventIds.length;
  const metas = rows.map((r) => getMeta(r.status, timedOut));
  const stepSum = metas.reduce((sum, m) => sum + m.step, 0);
  const percent = total ? Math.round((stepSum / (total * TOTAL_STEPS)) * 100) : 0;

  const count = (tone) => metas.filter((m) => m.tone === tone).length;
  const successCount = count("success");
  const failedCount = count("failed") + count("timeout");
  const pendingCount = total - successCount - failedCount;

  const barColor = polling ? "bg-[#7094ff]" : failedCount ? "bg-amber-500" : "bg-emerald-500";

  // ---- styles (same look as PolicyTable) ----
  const thCls = `
    text-left text-[10px] font-semibold uppercase tracking-wider
    px-3 py-3 whitespace-nowrap sticky top-0 z-10
    ${isDark ? "text-slate-500 border-b border-white/[0.07] bg-[#020617]" : "text-slate-400 border-b border-slate-100 bg-white"}
  `;
  const tdCls = `px-3 py-3 text-[11px] whitespace-nowrap ${isDark ? "text-slate-300" : "text-slate-700"}`;

  // ---- UI ----
  return (
    <div
      className={`rounded-2xl border overflow-hidden ${
        isDark ? "border-white/[0.07] bg-[#020617]" : "border-slate-200 bg-white"
      }`}
    >
      {/* HEADER */}
      <div
        className={`flex items-center justify-between gap-3 px-5 py-3 ${
          isDark ? "border-white/[0.06]" : "border-slate-100"
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-[#7094ff]" />
            <span className={`text-[13px] font-semibold ${isDark ? "text-slate-200" : "text-slate-700"}`}>
              {title} · Live Status
            </span>
          </div>
          <div className={`text-[11px] mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            {total} device{total !== 1 && "s"} ·{" "}
            <span className="text-emerald-500">{successCount} success</span> ·{" "}
            <span className="text-rose-500">{failedCount} failed</span> ·{" "}
            <span className="text-amber-500">{pendingCount} pending</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1.5 text-[12px] font-medium ${
              polling ? "text-[#7094ff]" : isDark ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {polling ? (
              <>
                <Loader2 size={13} className="animate-spin" /> Processing…
              </>
            ) : (
              <>
                <CheckCircle2 size={13} className={failedCount ? "text-amber-500" : "text-emerald-500"} /> Done
              </>
            )}
          </span>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Close"
              className="w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-150"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="px-5 pt-4 pb-3">
        <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-white/[0.06]" : "bg-slate-100"}`}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor} ${polling ? "animate-pulse" : ""}`}
            style={{ width: `${Math.max(percent, polling ? 4 : 0)}%` }}
          />
        </div>
        <div className={`text-right text-[10px] mt-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
          {percent}%
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto overflow-y-auto max-h-[320px]">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr>
              <th className={thCls}>#</th>
              <th className={thCls}>Device IP</th>
              <th className={thCls}>Branch</th>
              <th className={thCls}>Event ID</th>
              <th className={thCls}>Status</th>
              <th className={thCls}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className={`py-10 text-center text-[12px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                  <span className="inline-flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-[#7094ff]" /> Fetching status…
                  </span>
                </td>
              </tr>
            )}

            {rows.map((r, i) => (
              <tr
                key={r.eventId}
                className={`border-b last:border-b-0 transition-colors duration-150 ${
                  isDark ? "border-white/[0.045] hover:bg-white/[0.025]" : "border-slate-100 hover:bg-slate-50/60"
                }`}
              >
                <td className={`${tdCls} text-[10px] ${isDark ? "text-slate-600" : "text-slate-400"}`}>{i + 1}</td>
                <td className={`${tdCls} font-mono text-[10px]`}>{r.ipAddress || "N/A"}</td>
                <td className={tdCls}>{r.branchName || "N/A"}</td>
                <td className={`${tdCls} font-mono text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  {r.eventId}
                </td>
                <td className={tdCls}>
                  <StatusBadge meta={metas[i]} />
                </td>
                <td className={`${tdCls} text-[10px] text-slate-500`}>{r.date || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}