import React, { useState, useEffect } from "react";
import { VscCloudUpload } from "react-icons/vsc";
import { MdClose } from "react-icons/md";

const FileUpload = ({
  id,
  label,
  onChange,
  accept = "image/*,.pdf,.doc,.docx",
  initialFile = null,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialFile);
  useEffect(() => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);

      return () => URL.revokeObjectURL(fileURL);
    } else if (initialFile) {
      setPreview(initialFile);
    }
  }, [file, initialFile]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);
      // setPreview(URL.createObjectURL(selectedFile));
      onChange(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    onChange(null);
  };

  const isImageUrl = (url) => {
    return (
      /\.(svg|png|jpg|jpeg|gif|webp)$/i.test(url) ||
      url.startsWith("data:image/")
    );
  };

  const isPdfUrl = (url) => {
    return /\.pdf$/i.test(url) || url.includes("/pdf");
  };
  return (
    <div className="flex flex-col w-full gap-1">
      {/* Label */}
      {label && (
        <label className="text-base font-medium text-text-primary">
          {label}
        </label>
      )}

      {/* Dropzone */}
      <div className="w-full">
        {preview ? (
          <div className="relative flex flex-col items-center w-full p-3 bg-gray-100 rounded-lg">
            {(file && file.type.startsWith("image/")) || isImageUrl(preview) ? (
              <img
                src={preview}
                alt="Preview"
                className="object-cover rounded-md h-52 w-52"
              />
            ) : (file && file?.type === "application/pdf") ||
              isPdfUrl(preview) ? (
              <>
                <span className="text-sm font-medium">
                  {file?.name || "PDF File"}
                </span>
                <iframe
                  src={preview}
                  width="100%"
                  height="400px"
                  title="PDF Preview"
                  className="rounded-md"
                />
              </>
            ) : (
              <span className="text-sm font-medium">
                {file?.name || "Uploaded File"}
              </span>
            )}

            <button
              className="absolute p-1 text-white transition bg-red-500 rounded-full shadow-md -right-3 -top-3 hover:bg-red-600"
              onClick={handleRemoveFile}
            >
              <MdClose />
            </button>
          </div>
        ) : (
          <label
            htmlFor={label || id}
            className="flex flex-col items-center justify-center w-full h-64 transition-colors duration-300 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 group hover:border-primary"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <VscCloudUpload
                className="mb-2 text-gray-500 transition-colors duration-300 group-hover:text-primary"
                size={42}
              />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG, GIF, PDF</p>
            </div>
            <input
              id={label || id}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={accept}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
