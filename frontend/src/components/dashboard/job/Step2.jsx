import React from "react";
import RichTextEditor from "../../common/TextEditor/RichTextEditor";

const Step2 = ({
  description,
  setDescription,
  candidateRequirements,
  setCandidateRequirements,
}) => {
  return (
    <>
      <div className="pb-6 border-b-2">
        <h3 className="text-lg text-text-primary">Details</h3>
        <span className="text-base text-text-1">
          Add the description of the job, responsibilities, who you are, and
          nice-to-haves.
        </span>
      </div>
      {/* Job Description */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Job Descriptions</h3>
          <span className="text-base text-text-1">
            Describe the responsibilities, tasks, and objectives of the job.
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%]">
            <RichTextEditor
              value={description}
              onChange={(value) => setDescription(value)}
              placeholder="Enter job description"
            />
          </div>
        </div>
      </div>

      {/* Candidate Requirements */}
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Candidate Requirements</h3>
          <span className="text-base text-text-1">
            List the skills, qualifications, and experience required for the
            job.
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%]">
            <RichTextEditor
              value={candidateRequirements}
              onChange={(value) => setCandidateRequirements(value)}
              placeholder="Enter candidate requirements"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Step2;
