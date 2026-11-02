// Shared helpers for the live CPU / RAM charts

export const ZOOM_OPTIONS = ["1M", "5M", "All"];

const ZOOM_MS = { "1M": 60 * 1000, "5M": 5 * 60 * 1000 };
const CHART_WIDTH = 360;

// Time range the chart shows, ending at the newest sample
export const getChartRange = (samples, zoom) => {
  if (samples.length === 0) return null;
  const end = samples[samples.length - 1].time;
  const start =
    zoom === "All"
      ? Math.min(samples[0].time, end - ZOOM_MS["1M"])
      : end - ZOOM_MS[zoom];
  return { start, end };
};

// SVG polyline points. toY converts a 0-100 value to the chart's y coordinate.
export const buildLinePoints = (samples, key, range, toY) => {
  if (!range) return "";
  return samples
    .filter((sample) => sample.time >= range.start)
    .map((sample) => {
      const x = ((sample.time - range.start) / (range.end - range.start)) * CHART_WIDTH;
      return `${x.toFixed(2)},${toY(Number(sample[key]) || 0).toFixed(2)}`;
    })
    .join(" ");
};

// Four evenly spaced times for the x axis
export const getTimeTicks = (range) => {
  if (!range) return [];
  return Array.from({ length: 4 }, (_, i) =>
    formatClock(range.start + ((range.end - range.start) * i) / 3)
  );
};

export const formatClock = (time) =>
  new Date(time).toLocaleTimeString("en-GB");

// e.g. 2026-Nov-02 6:14 PM
export const formatStamp = (time) => {
  if (!time) return "-";
  const date = new Date(time);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const clock = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${date.getFullYear()}-${month}-${day} ${clock}`;
};

export const formatPercent = (value) =>
  value === null || value === undefined ? "-" : `${Number(value).toFixed(1)}%`;

// Gauge fill between 0 and 1
export const toRatio = (value) =>
  Math.min(Math.max((Number(value) || 0) / 100, 0), 1);

// Change compared to about a minute ago; null until a minute of data exists
export const getOneMinuteChange = (samples, key) => {
  if (samples.length === 0) return null;
  const latest = samples[samples.length - 1];
  const past = [...samples].reverse().find((s) => s.time <= latest.time - ZOOM_MS["1M"]);
  return past ? Number(latest[key]) - Number(past[key]) : null;
};
