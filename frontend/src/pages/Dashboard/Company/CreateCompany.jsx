import React, { useEffect, useState } from "react";
import Input from "../../../components/common/Input";
import FileUpload from "../../../components/common/FileUpload";
import Select from "../../../components/common/Select";
import Loader from "../../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import { apiGetProvinces } from "../../../services/app";
import MultiFileUpload from "../../../components/common/MultiFileUpload";
import { createCompany } from "../../../services/company";
import { getComanySize } from "../../../services/companySize";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateUserCompany } from "../../../redux/userSlice";
import RichTextEditor from "../../../components/common/TextEditor/RichTextEditor";

const CreateCompany = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [loading, setLoading] = useState(false);
  const [companySize, setCompanySize] = useState([]);
  const [cities, setCities] = useState([]);

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [logo, setLogo] = useState(null);
  const [description, setDescription] = useState("");
  const [multipleImage, setMultipleImage] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [provincesData, companySizeData] = await Promise.all([
          apiGetProvinces(),
          getComanySize(),
        ]);

        const formattedCities = provincesData.map((province) => ({
          label: province.name,
          value: province.name,
        }));
        setCities(formattedCities);

        const formattedCompanySizes = companySizeData.companySizes.map(
          (size) => ({
            label: `${size.minEmployees} - ${size.maxEmployees} employees`,
            value: size.id,
          })
        );
        setCompanySize(formattedCompanySizes);

        if (formattedCompanySizes.length > 0) {
          setSize(formattedCompanySizes[0].value);
        }
        if (formattedCities.length > 0) {
          setCity(formattedCities[0].value);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name) {
      toast.error("Please enter the company name.");
      return;
    }
    if (!size) {
      toast.error("Please select the company size.");
      return;
    }
    if (!location) {
      toast.error("Please enter the company location.");
      return;
    }
    if (!logo) {
      toast.error("Please upload the company logo.");
      return;
    }
    if (!city) {
      toast.error("Please select the company city.");
      return;
    }
    const formData = new FormData();
    formData.append("ownerId", currentUser.id);
    formData.append("name", name);
    formData.append("website", website);
    formData.append("sizeId", size);
    formData.append("location", `${location}, ${city}`);
    if (logo) formData.append("logo", logo);
    if (description) formData.append("description", description);
    multipleImage.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const newCompany = await createCompany(formData);
      if (newCompany) {
        toast.success("Company created successfully!");
        const currentCompanyMemberships = currentUser.companyMemberships || [];

        const updatedCompanyMemberships = [
          newCompany,
          ...currentCompanyMemberships,
        ];

        dispatch(updateUserCompany(updatedCompanyMemberships));
        navigate("/recruiter-dashboard/company/employees");
      }
    } catch (err) {
      console.error("Error creating company:", err.message);
      toast.error("Failed to create company. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-3">
      {loading && <Loader />}
      <h2 className="text-3xl font-semibold">Create Company</h2>
      <form onSubmit={handleSubmit}>
        <div className="pb-6 border-b-2">
          <h3 className="text-lg text-text-primary">Basic Information</h3>
          <span className="text-base text-text-1">
            This is company information that you can update anytime.
          </span>
        </div>
        <div className="flex py-6 border-b-2 gap-36">
          <div className="w-[30%]">
            <h3 className="text-lg text-text-primary">Company Logo</h3>
            <span className="text-base text-text-1">
              This image will be shown publicly as company logo.
            </span>
          </div>
          <div className="w-[70%]">
            <div className="w-[30%]">
              <FileUpload
                accept="image/*"
                onChange={(file) => setLogo(file)}
                id="logo"
              />
            </div>
          </div>
        </div>
        <div className="flex py-6 border-b-2 gap-36">
          <div className="w-[30%]">
            <h3 className="text-lg text-text-primary">Company Details</h3>
            <span className="text-base text-text-1">
              Introduce your company core info quickly to users by fill up
              company details
            </span>
          </div>
          <div className="w-[70%] grid grid-cols-1 gap-5">
            <Input
              label="Company name"
              name="name"
              placeholder="Enter your comapny name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={true}
            />
            <Input
              label="Website"
              name="website"
              placeholder="Enter your comapny website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
            <Select
              label="Size"
              name="size"
              options={companySize}
              value={size}
              onChange={(e) => setSize(e.target.value)}
              disabled={false}
            />
            <div className="flex gap-5">
              <Input
                label="Location"
                name="location"
                placeholder="Enter your comapny location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required={true}
              />
              <div className="flex-1">
                <Select
                  label="City"
                  name="city"
                  options={cities}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  disabled={false}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex py-6 border-b-2 gap-36">
          <div className="w-[30%]">
            <h3 className="text-lg text-text-primary">About Company</h3>
            <span className="text-base text-text-1">
              Brief description for your company. URLs are hyperlinked.
            </span>
          </div>
          <div className="w-[70%]">
            <RichTextEditor
              value={description}
              onChange={(value) => setDescription(value)}
              placeholder="Introduce about your company"
            />
          </div>
        </div>
        <div className="flex py-6 border-b-2 gap-36">
          <div className="w-[30%]">
            <h3 className="text-lg text-text-primary">Company Images</h3>
            <span className="text-base text-text-1">
              Upload images related to your company.
            </span>
          </div>
          <div className="w-[70%]">
            <MultiFileUpload
              images={multipleImage}
              onChange={(files) => setMultipleImage(files)}
            />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <button
            type="submit"
            className="px-4 py-2 font-medium text-white transition-all duration-300 ease-out bg-blue-500 rounded-sm min-w-24 hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCompany;
