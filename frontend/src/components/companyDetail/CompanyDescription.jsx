import React from "react";
import parse from "html-react-parser";
import company_default from "../../assets/company_default.png";

const CompanyDescription = ({ imgs = [], description = "" }) => {
  const displayedImages = Array(4)
    .fill(null)
    .map((_, index) => ({
      id: index,
      imageUrl: imgs[index]?.imageUrl || company_default,
      ...imgs[index],
    }));

  const cleanDescription = (html) => {
    if (!html) return <p className="text-gray-500">No description provided.</p>;

    const cleaned = html
      .replace(/<p>\s*<\/p>/g, "")
      .replace(/<p([^>]*)>(.*?)<p>/g, "<p$1>$2</p><p>")
      .trim();

    return parse(cleaned);
  };
  return (
    <div>
      <h3 className="mb-3 text-xl lg:text-3xl text-text-primary">
        Company Profile
      </h3>
      <div className="prose max-w-none text-text-2">
        {cleanDescription(description)}
      </div>
      <div className="grid grid-cols-4 grid-rows-3 gap-3.5 mt-10 max-h-[500px]">
        <img
          src={displayedImages[0].imageUrl || company_default}
          alt={`Company image ${displayedImages[0].id}`}
          className={`w-full h-full object-cover col-span-2 row-span-3 rounded-l-lg`}
        />
        {displayedImages.slice(1, 4).map((img, index) => (
          <img
            key={img.id || index}
            src={img.imageUrl || company_default}
            alt={`Company image ${img.id}`}
            className={`w-full h-full object-cover ${
              index === 0
                ? "col-start-3 row-start-1 rounded-tr-lg"
                : index === 1
                ? "col-start-3 row-start-2"
                : "col-start-3 row-start-3 rounded-br-lg"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyDescription;
