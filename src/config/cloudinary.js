export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dy1g9f3bj",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "velouraz_preset",
  uploadUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dy1g9f3bj"}/image/upload`,
  galleryTag: "velouraz_gallery", // This tag will be used to list images
};

export const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", cloudinaryConfig.uploadPreset);
  data.append("tags", cloudinaryConfig.galleryTag); // Tag the image for the gallery

  const uploadUrl = file?.type?.startsWith("video/")
    ? cloudinaryConfig.uploadUrl.replace("/image/", "/video/")
    : cloudinaryConfig.uploadUrl;
  const res = await fetch(uploadUrl, {
    method: "POST",
    body: data,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  const result = await res.json();
  return result.secure_url;
};

/**
 * Uploads a file to Cloudinary with real-time percentage progress callback
 */
export const uploadToCloudinaryWithProgress = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", cloudinaryConfig.uploadPreset);
    data.append("tags", cloudinaryConfig.galleryTag);

    const uploadUrl = file?.type?.startsWith("video/")
      ? cloudinaryConfig.uploadUrl.replace("/image/", "/video/")
      : cloudinaryConfig.uploadUrl;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response.secure_url);
        } catch (e) {
          reject(new Error("Invalid upload response"));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(data);
  });
};

/**
 * Transforms Cloudinary image/video URLs safely:
 * - f_auto: Optimal format (WebP, AVIF, WebM) per browser
 * - q_auto: Smart quality compression reducing file size up to 70-80%
 */
export const getOptimizedCloudinaryUrl = (url, options = {}) => {
  if (!url || typeof url !== "string") return url || "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }

  const isVideo = url.includes("/video/upload/");
  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  // Prevent duplicate transformation flags
  if (
    parts[1].startsWith("f_auto") ||
    parts[1].startsWith("q_auto") ||
    parts[1].startsWith("w_") ||
    parts[1].includes("/f_auto")
  ) {
    return url;
  }

  const transformString = isVideo ? "f_auto,q_auto,vc_auto" : "f_auto,q_auto";
  return `${parts[0]}/upload/${transformString}/${parts[1]}`;
};

/**
 * Shortcut helper for responsive web images (f_auto, q_auto)
 */
export const getOptimizedImageUrl = (url) => {
  return getOptimizedCloudinaryUrl(url);
};

/**
 * Shortcut helper for Admin & Grid thumbnails
 */
export const getThumbnailUrl = (url) => {
  return getOptimizedCloudinaryUrl(url);
};

/**
 * Shortcut helper for streaming videos cleanly in HTML5 video elements
 */
export const getOptimizedVideoUrl = (url) => {
  if (!url || typeof url !== "string") return url || "";
  return url;
};

/**
 * Image error handler fallback: if transformed image fails, fallback to raw source URL
 */
export const handleImageError = (e, originalUrl) => {
  if (e?.currentTarget && originalUrl) {
    if (e.currentTarget.src !== originalUrl) {
      e.currentTarget.src = originalUrl;
    }
  }
};
