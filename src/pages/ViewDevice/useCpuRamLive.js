import { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboardService";

const POLL_INTERVAL_MS = 5000;
const MAX_SAMPLES = 720; // 1 hour at one sample every 5 sec
const OFFLINE_AFTER_UNCHANGED_POLLS = 6; // 30 sec without a new reading

// collectedAt is epoch seconds
const getSampleTime = (row) =>
  row.collectedAt ? row.collectedAt * 1000 : new Date(row.updatedAt).getTime();

// Polls live CPU / RAM for a host and keeps the readings for the charts
export default function useCpuRamLive(hostName) {
  const [samples, setSamples] = useState([]);
  const [status, setStatus] = useState("connecting"); // connecting | live | offline

  useEffect(() => {
    if (!hostName) return;

    let cancelled = false;
    let timer;
    let lastTime = null;
    let unchangedPolls = 0;

    const tick = async () => {
      try {
        const response = await dashboardService.getCpuRamDetailsByHost(hostName);
        if (cancelled) return;

        const row = Array.isArray(response?.data) ? response.data[0] : null;
        if (!row) {
          setStatus("offline");
        } else {
          const time = getSampleTime(row);
          if (time !== lastTime) {
            // New reading from the agent → add it to the graph
            lastTime = time;
            unchangedPolls = 0;
            setSamples((prev) => [...prev, { ...row, time }].slice(-MAX_SAMPLES));
            setStatus("live");
          } else {
            unchangedPolls += 1;
            if (unchangedPolls >= OFFLINE_AFTER_UNCHANGED_POLLS) setStatus("offline");
          }
        }
      } catch (error) {
        console.error("CPU/RAM poll failed", error);
        if (!cancelled) setStatus("offline");
      }

      // Next poll starts after this one finishes, so slow responses never overlap
      if (!cancelled) timer = setTimeout(tick, POLL_INTERVAL_MS);
    };

    tick();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [hostName]);

  return { samples, status };
}
