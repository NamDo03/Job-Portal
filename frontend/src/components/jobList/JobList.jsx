// JobList.jsx
import React, { useEffect, useState, useCallback } from "react";
import JobFilter from "./JobFilter";
import { FaFilter } from "react-icons/fa";
import JobCard from "../card/JobCard";
import { MdClose } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import FilterModal from "../modal/FilterModal";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { getJobs } from "../../services/job";
import { getCategories } from "../../services/category";
import { getLevels } from "../../services/level";
import { getSalaries } from "../../services/salary";
import Pagination from "../common/Pagination";
import JobCardSkeleton from "../skeleton/JobCardSkeleton";

const filterSections = [
  {
    key: "employmentType",
    title: "Type of Employment",
    options: [
      { label: "Full-Time", value: "FULL_TIME" },
      { label: "Part-Time", value: "PART_TIME" },
      { label: "Internship", value: "INTERNSHIP" },
      { label: "Remote", value: "REMOTE" },
    ],
    fetchData: null,
  },
  {
    key: "categories",
    title: "Categories",
    options: [],
    fetchData: getCategories,
  },
  {
    key: "levels",
    title: "Job Level",
    options: [],
    fetchData: getLevels,
  },
  {
    key: "salaries",
    title: "Salary Range",
    options: [],
    fetchData: getSalaries,
  },
];

const JobList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJob, setTotalJob] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState({
    categories: [],
    levels: [],
    salaries: [],
  });

  const getFilterLabel = (filterKey, value) => {
    if (!value) return "";

    if (filterKey === "jobTitle") return `Job title: ${value}`;
    if (filterKey === "location") return `Location: ${value}`;

    const section = filterSections.find((s) => s.key === filterKey);
    if (section) {
      const staticOption = section.options?.find((opt) => opt.value === value);
      if (staticOption) return staticOption.label;
    }

    const dynamicOption = dynamicOptions[filterKey]?.find(
      (opt) => opt.value === value
    );
    return dynamicOption?.label || value;
  };

  const initialFilters = {
    jobTitle: searchParams.get("jobTitle") || "",
    location: searchParams.get("location") || "",
    employmentType: searchParams.get("employmentType") || null,
    categories: searchParams.has("categories")
      ? Number(searchParams.get("categories"))
      : null,
    levels: searchParams.get("levels")
      ? Number(searchParams.get("levels"))
      : null,
    salaries: searchParams.has("salaries")
      ? Number(searchParams.get("salaries"))
      : null,
  };
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters({
      jobTitle: searchParams.get("jobTitle") || "",
      location: searchParams.get("location") || "",
      employmentType: searchParams.get("employmentType") || null,
      categories: searchParams.has("categories")
        ? Number(searchParams.get("categories"))
        : null,
      levels: searchParams.get("levels")
        ? Number(searchParams.get("levels"))
        : null,
      salaries: searchParams.has("salaries")
        ? Number(searchParams.get("salaries"))
        : null,
    });
  }, [searchParams]);

  useEffect(() => {
    const fetchDynamicOptions = async () => {
      for (const section of filterSections) {
        if (section.fetchData) {
          setLoading(true);
          try {
            const response = await section.fetchData(1, "", true);
            const items = response?.[section.key] || [];

            setDynamicOptions((prev) => ({
              ...prev,
              [section.key]: items.map((item) => ({
                label: item.name || `${item.min} - ${item.max}`,
                value: item.id,
              })),
            }));
          } catch (error) {
            console.error(`Failed to fetch ${section.key}:`, error);
            toast.error(`Failed to load ${section.title}`);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchDynamicOptions();
  }, []);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        ...(filters.employmentType && {
          employmentType: filters.employmentType,
        }),
        ...(filters.categories && { categories: filters.categories }),
        ...(filters.levels && { levels: filters.levels }),
        ...(filters.salaries && { salaries: filters.salaries }),
        ...(filters.location && { location: filters.location }),
      };

      const data = await getJobs(
        currentPage,
        filters.jobTitle,
        "APPROVED",
        params
      );
      if (data) {
        setJobs(data.data);
        setTotalJob(data.pagination.total || 0);
        setTotalPage(data.pagination.totalPages || 0);
      } else {
        setJobs([]);
        toast.error("Failed to load jobs");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const applyFilters = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      setSearchParams(params);
      setCurrentPage(1);
    },
    [setSearchParams]
  );

  const handleFilterChange = (filterType, value) => {
    let newFilters;

    if (typeof filterType === "object") {
      newFilters = {
        ...filters,
        ...filterType,
      };
    } else {
      newFilters = {
        ...filters,
        [filterType]: value === filters[filterType] ? null : value,
      };
    }

    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters = {
      jobTitle: "",
      location: "",
      employmentType: null,
      categories: null,
      levels: null,
      salaries: null,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

  const removeFilter = (filterType) => {
    const newFilters = {
      ...filters,
      [filterType]:
        filterType === "jobTitle" || filterType === "location" ? "" : null,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  return (
    <div className="flex flex-row gap-10 py-16 main-container">
      {/* Desktop Filters */}
      <JobFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={clearAllFilters}
        dynamicOptions={dynamicOptions}
      />

      {/* Main Content */}
      <section className="w-[100%] lg:w-[70%] 2xl:w-[80%]">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-3">
            <h3 className="text-3xl text-text-primary">All Jobs</h3>
            <span className="text-base text-text-2">
              Showing {jobs.length} of {totalJob} jobs
            </span>
          </div>
          <button
            onClick={toggleFilterModal}
            className="block p-4 border border-slate-400 text-text-primary lg:hidden"
            aria-label="Open filters"
          >
            <FaFilter size={20} />
          </button>
        </div>
        {/* Active Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {filters.jobTitle && (
            <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium border rounded-full bg-secondary text-primary border-primary">
              {getFilterLabel("jobTitle", filters.jobTitle)}
              <button
                onClick={() => removeFilter("jobTitle")}
                className="text-blue-800 hover:text-blue-900"
                aria-label="Remove job title filter"
              >
                <MdClose />
              </button>
            </div>
          )}

          {filters.location && (
            <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium border rounded-full bg-secondary text-primary border-primary">
              {getFilterLabel("location", filters.location)}
              <button
                onClick={() => removeFilter("location")}
                className="text-blue-800 hover:text-blue-900"
                aria-label="Remove location filter"
              >
                <MdClose />
              </button>
            </div>
          )}

          {Object.entries(filters)
            .filter(
              ([key, value]) =>
                value &&
                value !== "" &&
                key !== "jobTitle" &&
                key !== "location"
            )
            .map(([key, value]) => (
              <div
                key={`${key}-${value}`}
                className="flex items-center gap-2 px-3 py-1 text-sm font-medium border rounded-full bg-secondary text-primary border-primary"
              >
                {getFilterLabel(key, value)}
                <button
                  onClick={() => removeFilter(key)}
                  className="text-blue-800 hover:text-blue-900"
                  aria-label={`Remove ${key} filter`}
                >
                  <MdClose />
                </button>
              </div>
            ))}

          {Object.values(filters).some((val) => val && val !== "") && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          )}
        </div>
        {/* Job List */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))
          ) : jobs.length > 0 ? (
            jobs.map((job) => <JobCard job={job} key={job.id} haveBtn={true} />)
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No jobs found matching your criteria.
            </p>
          )}
        </div>

        {/* Add Pagination here */}
        {jobs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </section>

      {/* Mobile Filter Modal */}
      <AnimatePresence mode="wait">
        {showFilterModal && (
          <FilterModal
            onClose={toggleFilterModal}
            filters={{
              employmentType: filters.employmentType,
              categories: filters.categories,
              levels: filters.levels,
              salaries: filters.salaries,
            }}
            onFilterChange={handleFilterChange}
            dynamicOptions={dynamicOptions}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobList;
