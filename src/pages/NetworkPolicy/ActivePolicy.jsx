import React, { useEffect, useState } from "react";
import {
  Search,
  CalendarDays,
  Plus,
  Folder,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// IMPORTANT: two ../ because ActivePolicy.jsx is inside pages/NetworkPolicy
import { dashboardService } from "../../services/dashboardService";

export default function ActivePolicy() {
  const navigate = useNavigate();

  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
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

      console.log(
        "GetActiveDistinctPolicy Response:",
        response
      );

      if (response && response.success) {
        const apiData = Array.isArray(response.data)
          ? response.data
          : [];

        const formattedData = apiData.map((item, index) => ({
          id: `#${index + 1}`,

          // Actual policy name from API
          name:
            item.policyName ||
            item.policy_name ||
            "N/A",

          // Actual description from API
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
          response?.message ||
            "Failed to fetch active network policies."
        );
      }
    } catch (err) {
      console.error(
        "Error fetching active network policies:",
        err
      );

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
  const handleViewDetails = (policy) => {
    setSelectedPolicy(policy);
    setShowModal(true);
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPolicy(null);
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
    document.body.style.overflow = showModal
      ? "hidden"
      : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  return (
    <div className="w-full p-6 space-y-6 bg-transparent min-h-screen">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="
        w-full rounded-xl
        border border-gray-200 dark:border-[#2B3345]
        bg-white dark:bg-[#020617]
        px-6 py-4
      ">
        <h2 className="
          text-lg font-medium
          text-gray-900 dark:text-white
        ">
          Active Network Policy
        </h2>

        <p className="
          mt-1 text-sm
          text-gray-500 dark:text-gray-400
        ">
          Configure policy, source, destination, control, details.
        </p>
      </div>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}
      <div className="flex flex-wrap items-center gap-4">

        {/* SEARCH */}
        <div className="relative flex-1 min-w-[300px]">

          <Search
            size={18}
            className="
              absolute left-4 top-1/2
              -translate-y-1/2
              text-indigo-500 dark:text-indigo-400
            "
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

        {/* DATE */}
        <button
          type="button"
          className="
            flex items-center gap-3
            rounded-lg
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

        {/* CREATE */}
        <button
          type="button"
          onClick={handleCreatePolicy}
          className="
            flex items-center gap-3
            rounded-lg
            border border-gray-200 dark:border-[#2B3345]
            bg-white dark:bg-[#020617]
            px-5 py-3
            text-gray-700 dark:text-gray-300
            hover:bg-gray-50 dark:hover:bg-[#0B1220]
            transition
          "
        >
          <Plus
            size={18}
            className="text-indigo-500 dark:text-indigo-400"
          />

          <span>Create Policy</span>
        </button>

      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}
      {loading && (
        <div className="
          rounded-xl
          border border-gray-200 dark:border-[#2B3345]
          bg-white dark:bg-[#020617]
          p-10 text-center
        ">
          <p className="
            text-sm
            text-gray-500 dark:text-gray-400
          ">
            Loading active network policies...
          </p>
        </div>
      )}

      {/* =====================================================
          ERROR
      ===================================================== */}
      {!loading && error && (
        <div className="
          rounded-xl
          border border-red-200 dark:border-red-500/30
          bg-red-50 dark:bg-red-500/10
          p-4
          text-sm
          text-red-600 dark:text-red-400
        ">
          {error}
        </div>
      )}

      {/* =====================================================
          NO DATA
      ===================================================== */}
      {!loading &&
        !error &&
        filteredPolicies.length === 0 && (
          <div className="
            rounded-xl
            border border-gray-200 dark:border-[#2B3345]
            bg-white dark:bg-[#020617]
            p-10
            text-center
          ">
            <Folder
              size={40}
              className="mx-auto mb-3 text-gray-400"
            />

            <p className="
              text-sm
              text-gray-500 dark:text-gray-400
            ">
              No active network policies found.
            </p>
          </div>
        )}

      {/* =====================================================
          POLICY CARDS
      ===================================================== */}
      {!loading && filteredPolicies.length > 0 && (
        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-5
        ">

          {filteredPolicies.map((policy) => (
            <div
              key={policy.id}
              className="
                rounded-xl
                border border-gray-200 dark:border-[#2B3345]
                bg-white dark:bg-[#020617]
                p-5
                shadow-sm dark:shadow-lg
                hover:shadow-md
                dark:hover:border-indigo-500/50
                transition
              "
            >

              {/* TOP */}
              <div className="
                flex items-start
                justify-between
              ">

                <div className="
                  flex items-center
                  gap-3
                ">

                  <span className="
                    text-2xl font-bold
                    text-gray-900 dark:text-white
                  ">
                    {policy.id}
                  </span>

                  <div className="
                    flex items-center
                    gap-2
                  ">

                    <Folder
                      size={18}
                      className="
                        text-indigo-500
                        dark:text-indigo-400
                      "
                    />

                    <span className="
                      text-xl font-medium
                      text-gray-900 dark:text-white
                    ">
                      {policy.name}
                    </span>

                  </div>

                </div>

                <span className="
                  text-xs
                  text-gray-500 dark:text-gray-400
                ">
                  {policy.date}
                </span>

              </div>

              {/* DESCRIPTION */}
              <p className="
                mt-5
                text-sm
                leading-7
                text-gray-600 dark:text-gray-400
              ">
                {policy.description}
              </p>

              {/* DIVIDER */}
              <div className="
                my-5
                border-t
                border-gray-200 dark:border-[#2B3345]
              " />

              {/* FOOTER */}
              <div className="
                flex items-center
                justify-between
              ">

                <button
                  type="button"
                  onClick={() =>
                    handleViewDetails(policy)
                  }
                  className="
                    text-sm
                    text-indigo-600
                    dark:text-indigo-400
                    hover:text-indigo-800
                    dark:hover:text-indigo-300
                    flex items-center gap-1
                    transition
                  "
                >
                  <Eye size={16} />

                  View Details →
                </button>

                <button
                  type="button"
                  className="
                    hover:scale-110
                    transition
                  "
                >
                  <Trash2
                    size={18}
                    className="
                      text-red-500
                      hover:text-red-400
                    "
                  />
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* =====================================================
          DETAILS MODAL
      ===================================================== */}
      {showModal && selectedPolicy && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/50 dark:bg-black/80
            backdrop-blur-sm
            p-4
          "
          onClick={handleCloseModal}
        >

          <div
            className="
              w-[95%] max-w-4xl
              max-h-[90vh]
              rounded-xl
              border border-gray-200
              dark:border-[#2B3345]
              bg-white dark:bg-[#020617]
              shadow-2xl
              flex flex-col
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}
            <div className="
              flex items-center
              justify-between
              border-b
              border-gray-200
              dark:border-[#2B3345]
              px-6 py-4
            ">

              <div>

                <h2 className="
                  text-xl font-semibold
                  text-gray-900 dark:text-white
                  flex items-center gap-3
                ">

                  <Folder
                    size={20}
                    className="
                      text-indigo-500
                      dark:text-indigo-400
                    "
                  />

                  {selectedPolicy.name}

                </h2>

                <p className="
                  text-sm
                  text-gray-500 dark:text-gray-400
                  mt-1
                ">
                  Policy ID: {selectedPolicy.id}
                </p>

              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="
                  text-gray-400
                  hover:text-gray-700
                  dark:hover:text-white
                "
              >
                <X size={24} />
              </button>

            </div>

            {/* MODAL BODY */}
            <div className="
              flex-1
              overflow-y-auto
              p-6
            ">

              {/* POLICY NAME */}
              <div className="
                mb-5
                rounded-lg
                border border-gray-200
                dark:border-[#2B3345]
                bg-gray-50
                dark:bg-[#0B1220]
                p-5
              ">

                <p className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-gray-500
                  dark:text-gray-400
                ">
                  Policy Name
                </p>

                <p className="
                  mt-2
                  text-lg
                  font-medium
                  text-gray-900
                  dark:text-white
                ">
                  {selectedPolicy.name}
                </p>

              </div>

              {/* DESCRIPTION */}
              <div className="
                rounded-lg
                border border-gray-200
                dark:border-[#2B3345]
                bg-gray-50
                dark:bg-[#0B1220]
                p-5
              ">

                <p className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-gray-500
                  dark:text-gray-400
                ">
                  Description
                </p>

                <p className="
                  mt-3
                  text-sm
                  leading-7
                  text-gray-700
                  dark:text-gray-300
                ">
                  {selectedPolicy.description}
                </p>

              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="
              flex
              justify-end
              border-t
              border-gray-200
              dark:border-[#2B3345]
              px-6 py-4
            ">

              <button
                type="button"
                onClick={handleCloseModal}
                className="
                  rounded-lg
                  border
                  border-gray-200
                  dark:border-[#2B3345]
                  px-5 py-2
                  text-sm
                  text-gray-700
                  dark:text-gray-300
                  hover:bg-gray-50
                  dark:hover:bg-[#0B1220]
                "
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}