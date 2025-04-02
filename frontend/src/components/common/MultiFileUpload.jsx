import { VscCloudUpload } from "react-icons/vsc";
import { MdClose, MdAddCircleOutline } from "react-icons/md";

const MultiFileUpload = ({ images, onChange }) => {
  const handleUploadPhotos = (e) => {
    const newPhotos = Array.from(e.target.files);
    onChange((prevImages) => [...prevImages, ...newPhotos]);
  };

  const handleRemovePhoto = (indexToRemove) => {
    onChange((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div>
      {/* Input file */}
      <input
        id="image"
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleUploadPhotos}
      />
      {images.length === 0 && (
        <label
          htmlFor="image"
          className="flex flex-col items-center p-6 transition-colors duration-300 border border-gray-500 border-dashed rounded-lg cursor-pointer group hover:border-primary bg-gray-50 hover:bg-gray-100 hover:text-primary"
        >
          <VscCloudUpload
            className="mb-2 text-gray-500 transition-colors duration-300 group-hover:text-primary"
            size={42}
          />
          Choose images from your device
        </label>
      )}

      {images.length > 0 && (
        <div className="flex flex-row flex-wrap gap-4 mt-4">
          {images.map((photo, index) => (
            <div
              key={photo.id || index}
              className="relative w-[250px] h-[180px]"
            >
              {photo instanceof File || photo instanceof Blob ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Uploaded"
                  className="object-cover w-full h-full rounded-lg"
                />
              ) : (
                <img
                  src={photo.imageUrl}
                  alt="Uploaded"
                  className="object-cover w-full h-full rounded-lg"
                />
              )}
              <button
                type="button"
                className="absolute px-2 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-600 -right-3 -top-3"
                onClick={() => handleRemovePhoto(index)}
              >
                <MdClose />
              </button>
            </div>
          ))}
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center border border-gray-400 border-dashed rounded-lg cursor-pointer hover:bg-gray-100  w-[250px] h-[180px] hover:border-primary hover:text-primary"
          >
            <MdAddCircleOutline size={32} />
            Add more
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUploadPhotos}
          />
        </div>
      )}
    </div>
  );
};

export default MultiFileUpload;
