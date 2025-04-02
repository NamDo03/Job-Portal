import React from "react";
import RichTextEditor from "../../common/TextEditor/RichTextEditor";

const Step3 = ({ benefits, setBenefits }) => {
  return (
    <>
      <div className="pb-6 border-b-2">
        <h3 className="text-lg text-text-primary">Basic Information</h3>
        <span className="text-base text-text-1">
          List out your top perks and benefits.
        </span>
      </div>
      <div className="flex py-6 border-b-2 gap-36">
        <div className="w-[30%]">
          <h3 className="text-lg text-text-primary">Perks & Benefits</h3>
          <span className="text-base text-text-1">
            Encourage more people to apply by sharing the attractive rewards and
            benefits you offer your employees
          </span>
        </div>
        <div className="w-[70%]">
          <div className="w-[70%]">
            <RichTextEditor
              value={benefits}
              onChange={(value) => setBenefits(value)}
              placeholder="Enter perks & benefits"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Step3;
