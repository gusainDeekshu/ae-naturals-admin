"use client";

import React, { useState, useEffect } from "react";
import { ThemeSection } from "./page";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { CldUploadWidget } from "next-cloudinary";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  section: ThemeSection;
  onSave: (section: ThemeSection) => void;
}

export function SectionEditModal({ isOpen, onClose, section, onSave }: Props) {
  const [settings, setSettings] = useState<any>({});

  useEffect(() => {
    if (section) {
      setSettings(section.settings || {});
    }
  }, [section]);

  // ✅ GLOBAL SCROLL FIX (Same as BlogForm to prevent body scroll issues when modal closes)
  useEffect(() => {
    const restoreScroll = () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };

    window.addEventListener("focus", restoreScroll);
    document.addEventListener("visibilitychange", restoreScroll);

    return () => {
      window.removeEventListener("focus", restoreScroll);
      document.removeEventListener("visibilitychange", restoreScroll);
    };
  }, []);

  if (!isOpen || !section) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave({ ...section, settings });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Edit {section.type.replace('_', ' ')}
            </h2>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">Configuration Settings</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all shadow-sm">
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* ================= PRODUCT CAROUSEL ================= */}
          {section.type === "PRODUCT_CAROUSEL" && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Display Title</label>
                <input 
                  type="text" name="title" value={settings.title || ''} onChange={handleChange}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-0 focus:border-[#006044] outline-none transition-colors"
                  placeholder="e.g., Trending Right Now"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Data Source</label>
                  <select 
                    name="dataSource" value={settings.dataSource || 'featuredProducts'} onChange={handleChange}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-0 focus:border-[#006044] outline-none transition-colors"
                  >
                    <option value="featuredProducts">Bestsellers (Featured)</option>
                    <option value="newArrivals">New Arrivals</option>
                    <option value="deals">Deals & Offers</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">View All URL</label>
                  <input 
                    type="text" name="viewAllLink" value={settings.viewAllLink || ''} onChange={handleChange}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-0 focus:border-[#006044] outline-none transition-colors"
                    placeholder="/collections/bestsellers"
                  />
                </div>
              </div>
            </>
          )}

          {/* ================= PROMO BANNER ================= */}
          {section.type === "PROMO_BANNER" && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Banner Headline</label>
                <input 
                  type="text" name="title" value={settings.title || ''} onChange={handleChange}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-0 focus:border-[#006044] outline-none transition-colors"
                  placeholder="e.g., Summer Skincare Sale"
                />
              </div>
              
              {/* ✅ NEXT-CLOUDINARY UPLOAD WIDGET */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Background Image</label>
                <div className="flex items-center gap-4">
                  {settings.imageUrl ? (
                    <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={settings.imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, imageUrl: "" })}
                        className="absolute inset-0 bg-red-600/80 text-white font-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon size={20} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Preview</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      onSuccess={(result: any) => {
                        if (result.event === "success") {
                          setSettings({ ...settings, imageUrl: result.info.secure_url });
                        }
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-3 rounded-xl text-sm font-bold transition-colors"
                        >
                          <Upload size={18} />
                          {settings.imageUrl ? "Replace Image" : "Upload New Image"}
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">CTA Button Text</label>
                  <input 
                    type="text" name="buttonText" value={settings.buttonText || ''} onChange={handleChange}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-0 focus:border-[#006044] outline-none transition-colors"
                    placeholder="Shop Sale"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">CTA Link URL</label>
                  <input 
                    type="text" name="link" value={settings.link || ''} onChange={handleChange}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-0 focus:border-[#006044] outline-none transition-colors"
                    placeholder="/shop"
                  />
                </div>
              </div>
            </>
          )}

          {/* ================= BRAND STORY ================= */}
          {section.type === "BRAND_STORY" && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Story Headline</label>
                <input 
                  type="text" name="title" value={settings.title || ''} onChange={handleChange}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-0 focus:border-[#006044] outline-none transition-colors"
                  placeholder="The AE Naturals Philosophy"
                />
              </div>
              
              {/* ✅ NEXT-CLOUDINARY UPLOAD WIDGET */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Brand Story Image</label>
                <div className="flex items-center gap-4">
                  {settings.imageUrl ? (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                      <img src={settings.imageUrl} alt="Story Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, imageUrl: "" })}
                        className="absolute inset-0 bg-red-600/80 text-white font-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon size={20} className="mb-1" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CldUploadWidget
                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                      onSuccess={(result: any) => {
                        if (result.event === "success") {
                          setSettings({ ...settings, imageUrl: result.info.secure_url });
                        }
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 px-4 py-3 rounded-xl text-sm font-bold transition-colors"
                        >
                          <Upload size={18} />
                          {settings.imageUrl ? "Replace Image" : "Upload Image"}
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Philosophy Text</label>
                <textarea 
                  name="description" value={settings.description || ''} onChange={handleChange} rows={4}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-0 focus:border-[#006044] outline-none transition-colors resize-none"
                  placeholder="Write your brand's ethos here..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Button Text</label>
                  <input 
                    type="text" name="buttonText" value={settings.buttonText || ''} onChange={handleChange}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium"
                    placeholder="Read More"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Button URL</label>
                  <input 
                    type="text" name="link" value={settings.link || ''} onChange={handleChange}
                    className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium"
                    placeholder="/about"
                  />
                </div>
              </div>
            </>
          )}

          {/* ================= CATEGORIES & BLOG ================= */}
          {(section.type === "CATEGORIES" || section.type === "BLOG_SECTION") && (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Section Headline</label>
                <input 
                  type="text" name="title" value={settings.title || ''} onChange={handleChange}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-0 focus:border-[#006044] outline-none transition-colors"
                  placeholder={section.type === "CATEGORIES" ? "Shop by Concern" : "The Journal"}
                />
              </div>
              <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium border border-blue-100">
                The content for this section (the actual {section.type === "CATEGORIES" ? "Categories" : "Articles"}) is pulled dynamically from your database based on what is set as Active.
              </div>
            </>
          )}

          {/* ================= HERO & TRUST BADGES ================= */}
          {(section.type === "HERO" || section.type === "TRUST_BADGES") && (
             <div className="text-center py-12 text-gray-500 flex flex-col items-center">
               <div className="bg-gray-100 p-4 rounded-full mb-4">
                 <ImageIcon className="w-8 h-8 opacity-40" />
               </div>
               <p className="font-bold text-gray-900 mb-1">Globally Managed Section</p>
               <p className="text-sm max-w-sm">
                 This section is controlled by the global layout configuration and database active items. No specific section settings are required here.
               </p>
             </div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-3 text-sm font-bold text-white bg-gray-900 hover:bg-black rounded-xl transition-all shadow-lg shadow-gray-900/20 uppercase tracking-widest"
          >
            Apply Changes
          </button>
        </div>

      </div>
    </div>
  );
}