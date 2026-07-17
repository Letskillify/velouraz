import React, { useState, useEffect } from "react";
import { cloudinaryConfig } from "../../../config/cloudinary";

const CloudinaryImageLibrary = ({ onSelect, onClose }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Note: Listing images directly from client-side requires 
  // "Resource listing" to be enabled in Cloudinary Settings -> Security.
  // URL: https://res.cloudinary.com/${cloudName}/image/list/${tagName}.json
  
  useEffect(() => {
    // For now, since we don't have a specific tag list, we might not be able to 
    // fetch everything without a backend. 
    // However, I will implement a placeholder or a way to handle this.
    // If the user provides a tag, we can fetch it.
    
    const fetchImages = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/list/${cloudinaryConfig.galleryTag}.json`);
        
        if (response.ok) {
          const data = await response.json();
          setImages(data.resources || []);
        } else if (response.status === 404) {
          // 404 means the tag doesn't exist yet (no images uploaded with this tag)
          setImages([]);
        } else {
          setError("Resource listing is not enabled in Cloudinary. Please uncheck 'Resource list' in your Cloudinary Security settings (Restricted image types section).");
        }
      } catch (err) {
        setError("Unable to connect to Cloudinary. Please check your internet or Cloud Name.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Cloudinary Media Library</h3>
            <p className="text-sm text-slate-500">Select images from your Cloudinary account</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-12 h-12 border-4 border-[#811331] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Accessing Media Library...</p>
            </div>
          ) : error ? (
            <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-center">
              <svg className="w-12 h-12 text-amber-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-amber-800 font-semibold mb-2">Cloudinary Listing Disabled</p>
              <p className="text-amber-700 text-sm max-w-md mx-auto">
                {error}
              </p>
              <div className="mt-6 p-4 bg-white rounded-lg border border-amber-100 text-left text-xs font-mono text-slate-600">
                1. Go to Cloudinary Dashboard<br/>
                2. Settings &gt; Security<br/>
                3. Enable "Client-side resource listing"
              </div>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400">No images found in your Cloudinary account.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div 
                  key={img.public_id}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:ring-2 hover:ring-[#811331] transition-all"
                  onClick={() => onSelect(`https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${img.public_id}.${img.format}`)}
                >
                  <img 
                    src={`https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/v${img.version}/${img.public_id}.${img.format}`} 
                    alt={img.public_id}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-[#811331] px-3 py-1 rounded-full text-xs font-bold">Select</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloudinaryImageLibrary;
