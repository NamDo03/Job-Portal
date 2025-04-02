import cloudinary from "cloudinary";
import fs from "fs";
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


export const uploadToCloudinary = async (filePath, folder = "uploads") => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type: 'auto',
        });

        fs.unlinkSync(filePath);
        return result;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        fs.unlinkSync(filePath);
        throw new Error("Failed to upload image to Cloudinary");
    }
};
