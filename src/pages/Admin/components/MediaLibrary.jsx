import React, { useState, useEffect } from "react";
import { cloudinaryConfig, uploadToCloudinary } from "../../../config/cloudinary";

const MediaLibrary = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/list/${cloudinaryConfig.galleryTag}.json`
      );
      if (response.ok) {
        const data = await response.json();
        setImages(data.resources || []);
      } else if (response.status === 404) {
        setImages([]);
      } else {
        setError("Resource listing is not enabled. Please check Cloudinary Security settings.");
      }
    } catch (err) {
      setError("Failed to fetch images from Cloudinary.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      for (const file of files) {
        await uploadToCloudinary(file);
      }
      setSuccess(`${files.length} image(s) uploaded successfully!`);
      fetchImages(); // Refresh the gallery
    } catch (err) {
      setError("Failed to upload images. Please check your connection.");
    } finally {
      setUploading(false);
      // Clear input
      e.target.value = null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Upload Media</h3>
            <p className="text-sm text-slate-500">Add new images to your Cloudinary gallery</p>
          </div>
          <div className="relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="media-upload"
            />
            <label
              htmlFor="media-upload"
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#811331] text-white text-sm font-bold shadow-lg shadow-[#811331]/20 hover:bg-[#650f27] transition-all cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Select Images
                </>
              )}
            </label>
          </div>
        </div>

        {error && <p className="mt-3 text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}
        {success && <p className="mt-3 text-xs font-bold text-emerald-600 bg-emerald-50 p-2 rounded-lg">{success}</p>}
      </div>

      {/* Gallery Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Cloudinary Gallery</h3>
          <button 
            onClick={fetchImages}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-[#811331]"
            title="Refresh Gallery"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-[#811331]/20 border-t-[#811331] rounded-full animate-spin"></div>
            <p className="text-sm text-slate-500 font-medium">Loading your media...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">No images found in gallery</p>
            <p className="text-xs text-slate-400 mt-1">Upload images above to see them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div 
                key={img.public_id}
                className="group relative aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50"
              >
                <img 
                  src={`https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/v${img.version}/${img.public_id}.${img.format}`} 
                  alt={img.public_id}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 text-center">
                  <p className="text-[10px] text-white font-medium truncate w-full px-2">
                    {img.public_id.split('/').pop()}
                  </p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${img.public_id}.${img.format}`);
                      alert("URL copied to clipboard!");
                    }}
                    className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold hover:bg-white hover:text-[#811331] transition-all"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
