export const cloudinaryConfig = {
  cloudName: "dy1g9f3bj",
  uploadPreset: "velouraz_preset",
  uploadUrl: "https://api.cloudinary.com/v1_1/dy1g9f3bj/image/upload",
  galleryTag: "velouraz_gallery", // This tag will be used to list images
};

export const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", cloudinaryConfig.uploadPreset);
  data.append("tags", cloudinaryConfig.galleryTag); // Tag the image for the gallery

  const res = await fetch(cloudinaryConfig.uploadUrl, {
    method: "POST",
    body: data,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const result = await res.json();
  return result.secure_url;
};
