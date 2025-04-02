import React from "react";
import parse from "html-react-parser";

const JobDescription = ({
  description = "",
  requirements = "",
  benefits = "",
  workingHours = "",
}) => {
  const parseHtml = (html) => {
    try {
      return html ? parse(html) : <p>No information provided.</p>;
    } catch (error) {
      console.error("Error parsing HTML:", error);
      return <p>Content could not be displayed.</p>;
    }
  };

  const sections = [
    {
      title: "Description",
      content: parseHtml(description),
      show: !!description,
    },
    {
      title: "Requirements",
      content: parseHtml(requirements),
      show: !!requirements,
    },
    {
      title: "Benefits",
      content: parseHtml(benefits),
      show: !!benefits,
    },
    {
      title: "Working Hours",
      content: parseHtml(workingHours),
      show: !!workingHours,
    },
  ];

  return (
    <div className="space-y-8">
      {sections
        .filter((section) => section.show)
        .map((section, index) => (
          <div key={index} className="mb-8">
            <h3 className="mb-4 text-xl font-semibold lg:text-2xl text-text-primary">
              {section.title}
            </h3>
            <div className="text-gray-700 whitespace-pre-line rich-text-content">
              {section.content}
            </div>
          </div>
        ))}
    </div>
  );
};

export default JobDescription;
