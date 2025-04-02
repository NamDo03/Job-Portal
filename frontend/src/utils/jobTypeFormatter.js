export const formatJobType = (jobType) => {
    if (!jobType) return "Not specified";

    const typeMap = {
        FULL_TIME: "Full-time",
        PART_TIME: "Part-time",
        INTERNSHIP: "Internship",
        REMOTE: "Remote"
    };

    return typeMap[jobType] || jobType.replace(/_/g, "-");
};