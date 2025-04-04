import React, { useCallback, useEffect, useState } from "react";
import CompanyFilter from "./CompanyFilter";
import { FaFilter } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import CompanyCard from "../card/CompanyCard";
import { useSearchParams } from "react-router-dom";
import CompanyFilterModal from "../modal/CompanyFilterModal";
import { AnimatePresence } from "framer-motion";
import { getCompanies } from "../../services/company";
import { toast } from "react-toastify";
import { getComanySize } from "../../services/companySize";
import Pagination from "../common/Pagination";
import Loader from "../loader/Loader";
import CompanyCardSkeleton from "../skeleton/CompanyCardSkeleton";

const CompanyList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companySizes, setCompanySizes] = useState([]);
  const fetchCompanySizes = useCallback(async () => {
    try {
      const data = await getComanySize(1, "", true);
      if (data && data.companySize) {
        setCompanySizes(
          data.companySize.map((size) => ({
            label: `${size.minEmployees} - ${size.maxEmployees}`,
            value: size.id.toString(),
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching company sizes:", error);
      toast.error("Failed to load company size options");
    }
  }, []);

  useEffect(() => {
    fetchCompanySizes();
  }, [fetchCompanySizes]);

  const getFilterLabel = (filterKey, value) => {
    if (!value) return "";
    if (filterKey === "companyName") return `Company: ${value}`;
    if (filterKey === "location") return `Location: ${value}`;

    if (filterKey === "companySize") {
      const size = companySizes.find((s) => s.value === value);
      return size?.label || value;
    }
    return value;
  };

  const initialFilters = {
    companyName: searchParams.get("companyName") || "",
    location: searchParams.get("location") || "",
    companySize: searchParams.get("companySize") || null,
  };

  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters({
      companyName: searchParams.get("companyName") || "",
      location: searchParams.get("location") || "",
      companySize: searchParams.get("companySize") || null,
    });
  }, [searchParams]);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCompanies(
        currentPage,
        filters.companyName,
        false,
        "APPROVED",
        filters.location,
        filters.companySize
      );

      if (data) {
        setCompanies(data.data);
        setTotalCompanies(data.pagination.total || 0);
        setTotalPages(data.pagination.totalPages || 0);
      } else {
        setCompanies([]);
        toast.error("Failed to load companies");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

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
    const newFilters = {
      ...filters,
      [filterType]: value === filters[filterType] ? null : value,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters = {
      companyName: "",
      location: "",
      companySize: null,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const toggleFilterModal = () => setShowFilterModal(!showFilterModal);

  const removeFilter = (filterType) => {
    const newFilters = {
      ...filters,
      [filterType]:
        filterType === "companyName" || filterType === "location" ? "" : null,
    };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  return (
    <div className="flex flex-row gap-10 py-16 main-container">
      <CompanyFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAll={clearAllFilters}
        companySizes={companySizes}
      />
      <section className="w-[100%] lg:w-[70%] 2xl:w-[80%]">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-3">
            <h3 className="text-3xl text-text-primary">All Companies</h3>
            <span className="text-base text-text-2">
              Showing {companies.length} of {totalCompanies} companies
            </span>
          </div>
          <button
            onClick={toggleFilterModal}
            className="block p-4 border border-slate-400 text-text-primary lg:hidden"
          >
            <FaFilter size={20} />
          </button>
        </div>
        {/* Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          {filters.companyName && (
            <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium border rounded-full bg-secondary text-primary border-primary">
              {getFilterLabel("companyName", filters.companyName)}
              <button
                onClick={() => removeFilter("companyName")}
                className="text-blue-800 hover:text-blue-900"
                aria-label="Remove company name filter"
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

          {filters.companySize && (
            <div className="flex items-center gap-2 px-3 py-1 text-sm font-medium border rounded-full bg-secondary text-primary border-primary">
              {getFilterLabel("companySize", filters.companySize)}
              <button
                onClick={() => removeFilter("companySize")}
                className="text-blue-800 hover:text-blue-900"
                aria-label="Remove company size filter"
              >
                <MdClose />
              </button>
            </div>
          )}

          {(filters.companyName || filters.location || filters.companySize) && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Companies list */}
        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <CompanyCardSkeleton key={index} />
            ))
          ) : companies.length > 0 ? (
            companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No companies found matching your criteria.
            </p>
          )}
        </div>

        {companies.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </section>

      {/* Filter Modal (Mobile) */}
      <AnimatePresence mode="wait">
        {showFilterModal && (
          <CompanyFilterModal
            onClose={toggleFilterModal}
            filters={{
              companySize: filters.companySize,
            }}
            onFilterChange={handleFilterChange}
            companySizes={companySizes}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyList;
