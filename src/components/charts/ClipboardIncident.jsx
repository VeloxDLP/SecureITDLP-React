import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { dashboardService } from "../../services/dashboardService";

// ======================================================
// TABLE COLUMNS
// ======================================================
const incidentColumns = [
  {
    accessor: "hostname",
    header: "HOSTNAME",
  },
  {
    accessor: "ipaddress",
    header: "IP ADDRESS",
  },
  {
    accessor: "keyword",
    header: "KEYWORD",
  },
  {
    accessor: "branch",
    header: "BRANCH",
  },
];

// ======================================================
// EVENT TYPE COLOR
// ======================================================
const eventTypeColor = (eventType) => {
  const type = eventType?.toLowerCase() || "";

  if (type.includes("upload")) {
    return "text-blue-600 dark:text-blue-400";
  }

  if (type.includes("transfer")) {
    return "text-green-600 dark:text-green-400";
  }

  if (type.includes("usb")) {
    return "text-yellow-600 dark:text-yellow-400";
  }

  if (type.includes("clipboard")) {
    return "text-emerald-600 dark:text-emerald-400";
  }

  return "text-slate-600 dark:text-white/50";
};

// ======================================================
// FORMAT DATE AS YYYY-MM-DD
// ======================================================
const formatDateForApi = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// ======================================================
// GET LAST 7 DAYS
// ======================================================
const getLast7Days = () => {
  const dates = [];

  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);

    date.setDate(today.getDate() - i);

    dates.push(formatDateForApi(date));
  }

  return dates;
};

// ======================================================
// MAIN COMPONENT
// ======================================================
export default function ClipboardIncident({
  data = [],
  isDark = false,
  axisStyle,
  Tip,
  total = 0,
}) {
  const [showModal, setShowModal] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState("Clipboard Incidents");

  const [search, setSearch] = useState("");

  const [modalData, setModalData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [apiError, setApiError] = useState("");

  const pageSize = 10;

  const [currentPage, setCurrentPage] = useState(1);

  // ======================================================
  // LOCK BODY SCROLL
  // ======================================================
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [showModal]);

  // ======================================================
  // FETCH LAST 7 DAYS CLIPBOARD DATA
  // ======================================================
  const fetchClipboardData = async () => {
    try {
      setLoading(true);
      setApiError("");

      const last7Days = getLast7Days();

      console.log("Last 7 days:", last7Days);

      const responses = await Promise.all(
        last7Days.map(async (date) => {
          try {
            console.log(
              `Calling Clipboard API for date: ${date}`
            );

            const response =
              await dashboardService.getClipboardModal(date);

            console.log(
              `Clipboard API response for ${date}:`,
              response
            );

            return response;
          } catch (error) {
            console.error(
              `Clipboard API error for ${date}:`,
              error
            );

            return null;
          }
        })
      );

      // ==================================================
      // COMBINE ALL API DATA
      // ==================================================
      const combinedData = [];

      responses.forEach((response) => {
        if (
          response &&
          response.success === true &&
          Array.isArray(response.data)
        ) {
          response.data.forEach((item) => {
            combinedData.push(item);
          });
        }
      });

      console.log(
        "Combined Clipboard data:",
        combinedData
      );

      setModalData(combinedData);
    } catch (error) {
      console.error(
        "Error fetching clipboard modal data:",
        error
      );

      setApiError(
        "Unable to load clipboard incident data."
      );

      setModalData([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // OPEN MODAL
  // ======================================================
  const openModal = async (category) => {
    setSelectedCategory(
      category || "Clipboard Incidents"
    );

    setSearch("");

    setCurrentPage(1);

    setShowModal(true);

    await fetchClipboardData();
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================
  const closeModal = () => {
    setShowModal(false);

    setSearch("");

    setCurrentPage(1);
  };

  // ======================================================
  // SEARCH
  // ======================================================
  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return modalData;
    }

    return modalData.filter((row) =>
      incidentColumns.some((column) =>
        String(row?.[column.accessor] ?? "")
          .toLowerCase()
          .includes(term)
      )
    );
  }, [modalData, search]);

  // ======================================================
  // RESET PAGE WHEN SEARCH CHANGES
  // ======================================================
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ======================================================
  // PAGINATION
  // ======================================================
  const totalPages = Math.max(
    1,
    Math.ceil(filteredRows.length / pageSize)
  );

  const safePage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedRows = filteredRows.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const startRecord =
    filteredRows.length === 0
      ? 0
      : (safePage - 1) * pageSize + 1;

  const endRecord = Math.min(
    safePage * pageSize,
    filteredRows.length
  );

  // ======================================================
  // CUSTOM TOOLTIP
  // ======================================================
  const CustomTooltip = ({
    active,
    payload,
  }) => {
    if (
      active &&
      payload &&
      payload.length
    ) {
      return (
        <div
          className="
            cursor-pointer
            rounded-lg
            border
            border-slate-200
            bg-white
            p-3
            shadow-xl
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:shadow-2xl
            dark:border-white/10
            dark:bg-[#020617]
          "
          onClick={() =>
            openModal("Clipboard Incidents")
          }
        >
          <p className="text-sm font-medium text-slate-800 dark:text-white">
            {payload[0]?.payload?.x}
          </p>

          <p className="mt-1 text-sm text-emerald-600 dark:text-emerald-400">
            {payload[0]?.value}% usage
          </p>

          <p className="mt-1 text-xs text-emerald-500">
            Click to view details →
          </p>
        </div>
      );
    }

    return null;
  };

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <>
      {/* ==================================================
          CHART SECTION
      ================================================== */}
      <div>
        {/* TOTAL */}
        <div className="mb-4 flex items-baseline gap-1">
          <span
            className="
              text-4xl
              font-bold
              text-slate-800
              transition-all
              duration-300
              dark:text-white
            "
          >
            {total}
          </span>

          <span
            className="
              text-sm
              font-bold
              text-emerald-400
              transition-transform
              duration-300
              hover:-translate-y-1
            "
          >
            ↑
          </span>
        </div>

        {/* CHART */}
        <ResponsiveContainer
          width="100%"
          height={160}
        >
          <AreaChart
            data={data}
            margin={{
              top: 8,
              right: 8,
              left: -10,
              bottom: 0,
            }}
            onClick={() =>
              openModal("Clipboard Incidents")
            }
            className="cursor-pointer"
          >
            <defs>
              <linearGradient
                id="clipGrad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#22c55e"
                  stopOpacity={
                    isDark ? 0.35 : 0.18
                  }
                />

                <stop
                  offset="95%"
                  stopColor="#22c55e"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="x"
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tickFormatter={(value) =>
                `${value}%`
              }
              tick={axisStyle}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              content={<CustomTooltip />}
            />

            <Area
              type="monotone"
              dataKey="v"
              stroke="#22c55e"
              fill="url(#clipGrad)"
              strokeWidth={3}
              dot={{
                r: 3,
                fill: "#22c55e",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
                fill: "#22c55e",
              }}
              name="%"
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ==================================================
          MODAL
      ================================================== */}
      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-slate-950/55
            p-4
            backdrop-blur-sm
            animate-[fadeIn_0.25s_ease-out]
          "
        >
          {/* ==================================================
              MODAL BOX
          ================================================== */}
          <div
            className="
              flex
              h-[80vh]
              w-full
              max-w-6xl
              flex-col
              overflow-hidden
              rounded-xl
              border
              border-slate-200
              bg-white
              shadow-2xl

              animate-[modalIn_0.3s_ease-out]

              dark:border-white/[0.08]
              dark:bg-[#020617]
            "
          >
            {/* ==================================================
                HEADER
            ================================================== */}
            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                gap-3
                border-b
                border-slate-200
                px-4
                py-3
                dark:border-white/[0.08]
              "
            >
              {/* TITLE */}
              <div className="min-w-0">
                <h2
                  className="
                    truncate
                    text-[15px]
                    font-semibold
                    text-slate-800
                    dark:text-white
                  "
                >
                  Clipboard Incident Details -

                  <span
                    className="
                      ml-1
                      text-emerald-600
                      transition-colors
                      duration-200
                      dark:text-emerald-400
                    "
                  >
                    {selectedCategory}
                  </span>
                </h2>

                <p className="mt-1 text-[10px] text-slate-400 dark:text-white/30">
                  Last 7 Days
                </p>
              </div>

              {/* RIGHT SIDE */}
              <div className="flex shrink-0 items-center gap-2">
                {/* ==================================================
                    SEARCH
                ================================================== */}
                <div className="relative w-[220px] sm:w-[260px]">
                  <Search
                    size={14}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-slate-400
                      transition-colors
                      duration-200
                      dark:text-white/30
                    "
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search..."
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-slate-200
                      bg-white
                      pl-8
                      pr-3
                      text-[12px]
                      text-slate-700
                      outline-none

                      transition-all
                      duration-200
                      ease-out

                      focus:border-[#7094ff]
                      focus:ring-2
                      focus:ring-[#7094ff]/20
                      focus:shadow-[0_0_12px_rgba(112,148,255,0.12)]

                      dark:border-white/10
                      dark:bg-white/[0.04]
                      dark:text-white/80
                    "
                  />
                </div>

                {/* ==================================================
                    CLOSE BUTTON
                ================================================== */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    inline-flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-slate-100
                    text-slate-600

                    transition-all
                    duration-200
                    ease-out

                    hover:scale-105
                    hover:bg-slate-200
                    active:scale-95

                    dark:bg-white/[0.06]
                    dark:text-white/60
                    dark:hover:bg-white/[0.1]
                  "
                >
                  <X
                    size={17}
                    className="
                      transition-transform
                      duration-200
                      hover:rotate-90
                    "
                  />
                </button>
              </div>
            </div>

            {/* ==================================================
                TABLE AREA
            ================================================== */}
            <div className="min-h-0 flex-1 overflow-hidden p-4">
              <div
                className="
                  flex
                  h-full
                  min-h-0
                  flex-col
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  transition-colors
                  duration-200
                  dark:border-white/[0.08]
                "
              >
                {/* ==================================================
                    SCROLLABLE TABLE
                ================================================== */}
                <div className="min-h-0 flex-1 overflow-auto">
                  <table className="w-full text-[13px]">
                    {/* ==================================================
                        TABLE HEADER
                    ================================================== */}
                    <thead
                      className="
                        sticky
                        top-0
                        z-10
                        bg-slate-100
                        transition-colors
                        duration-200
                        dark:bg-white/[0.06]
                      "
                    >
                      <tr className="text-left text-slate-500 dark:text-white/50">
                        {incidentColumns.map(
                          (column) => (
                            <th
                              key={column.accessor}
                              className="
                                border-b
                                border-slate-200
                                px-4
                                py-3
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-wide
                                transition-colors
                                duration-200
                                dark:border-white/[0.08]
                              "
                            >
                              {column.header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    {/* ==================================================
                        TABLE BODY
                    ================================================== */}
                    <tbody>
                      {/* ==================================================
                          LOADING
                      ================================================== */}
                      {loading ? (
                        <tr>
                          <td
                            colSpan={
                              incidentColumns.length
                            }
                            className="
                              px-3
                              py-12
                              text-center
                              text-slate-400
                              dark:text-white/40
                            "
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div
                                className="
                                  h-6
                                  w-6
                                  animate-spin
                                  rounded-full
                                  border-2
                                  border-slate-300
                                  border-t-[#7094ff]
                                  dark:border-white/10
                                  dark:border-t-[#7094ff]
                                "
                              />

                              <span>
                                Loading clipboard
                                incidents...
                              </span>
                            </div>
                          </td>
                        </tr>
                      ) : apiError ? (
                        /* ==================================================
                            ERROR
                        ================================================== */
                        <tr>
                          <td
                            colSpan={
                              incidentColumns.length
                            }
                            className="
                              px-3
                              py-10
                              text-center
                              text-red-500
                            "
                          >
                            {apiError}
                          </td>
                        </tr>
                      ) : paginatedRows.length > 0 ? (
                        /* ==================================================
                            DATA
                        ================================================== */
                        paginatedRows.map(
                          (row, index) => (
                            <tr
                              key={`${row.hostname}-${row.keyword}-${index}`}
                              className="
                                group
                                bg-white

                                transition-all
                                duration-200
                                ease-out

                                hover:bg-[#7094ff]/5
                                hover:shadow-[inset_3px_0_0_#7094ff]

                                dark:bg-transparent
                                dark:hover:bg-white/[0.03]
                                dark:hover:shadow-[inset_3px_0_0_#7094ff]
                              "
                            >
                              {/* HOSTNAME */}
                              <td
                                className="
                                  border-b
                                  border-slate-100
                                  px-4
                                  py-3
                                  font-medium
                                  text-blue-600
                                  transition-all
                                  duration-200
                                  group-hover:translate-x-1
                                  dark:border-white/[0.05]
                                  dark:text-blue-400
                                "
                              >
                                {row.hostname || "NA"}
                              </td>

                              {/* IP ADDRESS */}
                              <td
                                className="
                                  border-b
                                  border-slate-100
                                  px-4
                                  py-3
                                  font-medium
                                  text-sky-600
                                  transition-colors
                                  duration-200
                                  dark:border-white/[0.05]
                                  dark:text-sky-400
                                "
                              >
                                {row.ipaddress || "NA"}
                              </td>

                              {/* KEYWORD */}
                              <td
                                className="
                                  max-w-[360px]
                                  truncate
                                  border-b
                                  border-slate-100
                                  px-4
                                  py-3
                                  text-slate-700
                                  transition-colors
                                  duration-200
                                  dark:border-white/[0.05]
                                  dark:text-white/80
                                "
                                title={row.keyword}
                              >
                                {row.keyword || "NA"}
                              </td>

                              {/* BRANCH */}
                              <td
                                className="
                                  border-b
                                  border-slate-100
                                  px-4
                                  py-3
                                  text-slate-600
                                  transition-colors
                                  duration-200
                                  dark:border-white/[0.05]
                                  dark:text-white/60
                                "
                              >
                                {row.branch || "NA"}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        /* ==================================================
                            EMPTY
                        ================================================== */
                        <tr>
                          <td
                            colSpan={
                              incidentColumns.length
                            }
                            className="
                              px-3
                              py-10
                              text-center
                              text-slate-400
                              dark:text-white/30
                            "
                          >
                            No clipboard incidents
                            found for the last 7 days.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* ==================================================
                    PAGINATION
                ================================================== */}
                <div
                  className="
                    flex
                    shrink-0
                    flex-col
                    gap-3
                    border-t
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3

                    transition-colors
                    duration-200

                    dark:border-white/[0.08]
                    dark:bg-white/[0.02]

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  {/* RECORD COUNT */}
                  <span className="text-[12px] text-slate-500 transition-colors duration-200 dark:text-white/40">
                    Showing {startRecord}-
                    {endRecord} of{" "}
                    {filteredRows.length}
                  </span>

                  {/* PAGINATION BUTTONS */}
                  <div className="flex items-center gap-2">
                    {/* ==================================================
                        PREVIOUS
                    ================================================== */}
                    <button
                      type="button"
                      disabled={
                        safePage === 1 ||
                        loading
                      }
                      onClick={() =>
                        setCurrentPage(
                          (previous) =>
                            Math.max(
                              1,
                              previous - 1
                            )
                        )
                      }
                      className="
                        inline-flex
                        h-8
                        items-center
                        gap-1
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-2.5
                        text-[12px]
                        font-medium
                        text-slate-700

                        transition-all
                        duration-200
                        ease-out

                        hover:-translate-y-[1px]
                        hover:bg-slate-100
                        active:translate-y-0
                        active:scale-[0.97]

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        disabled:hover:translate-y-0
                        disabled:active:scale-100

                        dark:border-white/10
                        dark:bg-white/[0.04]
                        dark:text-white/70
                        dark:hover:bg-white/[0.08]
                      "
                    >
                      <ChevronLeft
                        size={14}
                        className="transition-transform duration-200 group-hover:-translate-x-0.5"
                      />

                      Prev
                    </button>

                    {/* ==================================================
                        PAGE NUMBER
                    ================================================== */}
                    <span
                      className="
                        rounded-lg
                        bg-white
                        px-3
                        py-1.5
                        text-[12px]
                        font-semibold
                        text-slate-700
                        ring-1
                        ring-slate-200

                        transition-all
                        duration-200

                        dark:bg-white/[0.06]
                        dark:text-white/80
                        dark:ring-white/10
                      "
                    >
                      {safePage} / {totalPages}
                    </span>

                    {/* ==================================================
                        NEXT
                    ================================================== */}
                    <button
                      type="button"
                      disabled={
                        safePage ===
                          totalPages ||
                        loading
                      }
                      onClick={() =>
                        setCurrentPage(
                          (previous) =>
                            Math.min(
                              totalPages,
                              previous + 1
                            )
                        )
                      }
                      className="
                        inline-flex
                        h-8
                        items-center
                        gap-1
                        rounded-lg
                        border
                        border-slate-200
                        bg-white
                        px-2.5
                        text-[12px]
                        font-medium
                        text-slate-700

                        transition-all
                        duration-200
                        ease-out

                        hover:-translate-y-[1px]
                        hover:bg-slate-100
                        active:translate-y-0
                        active:scale-[0.97]

                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        disabled:hover:translate-y-0
                        disabled:active:scale-100

                        dark:border-white/10
                        dark:bg-white/[0.04]
                        dark:text-white/70
                        dark:hover:bg-white/[0.08]
                      "
                    >
                      Next

                      <ChevronRight
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================
          SMOOTH ANIMATIONS
      ====================================================== */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes modalIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.97);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}