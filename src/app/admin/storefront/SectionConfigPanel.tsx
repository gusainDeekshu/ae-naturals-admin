// src\app\admin\storefront\SectionConfigPanel.tsx


"use client";

import { useStorefrontStore } from "@/store/useStorefrontStore";
import { CldUploadWidget } from "next-cloudinary";
import { Upload, X } from "lucide-react";

export function SectionConfigPanel() {
  const { sections, activeSectionId, updateSectionSettings } = useStorefrontStore();
  
  const activeSection = sections.find((s) => s.id === activeSectionId);

  if (!activeSection) {
    return (
      <div className="flex items-center justify-center h-full text-xs font-black text-zinc-300 uppercase tracking-widest">
        Select a block to configure
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-right-4 duration-300">
      
      {/* HEADER */}
      <div>
        <h3 className="text-2xl font-black text-zinc-900 tracking-tight">
          {activeSection.type.replace("_", " ")}
        </h3>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">
          Block Configuration
        </p>
      </div>

      <div className="space-y-8">
        
        {/* TITLE INPUT */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
            Section Title
          </label>
          <input
            type="text"
            className="w-full p-4 border border-zinc-200 rounded-2xl outline-none font-bold text-sm bg-white focus:ring-2 focus:ring-[#006044] transition-all"
            value={activeSection.settings.title || ""}
            onChange={(e) => updateSectionSettings(activeSection.id, { title: e.target.value })}
            placeholder="e.g. Featured Products"
          />
        </div>

        {/* 🔥 DYNAMIC CLOUDINARY UPLOAD (Matching your AddProduct style) */}
        {["HERO", "PROMO_BANNER"].includes(activeSection.type) && (
          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Banner Image *
            </label>
            
            <div className="flex gap-4 flex-wrap">
              {activeSection.settings.imageUrl ? (
                <div className="relative h-40 w-full rounded-3xl overflow-hidden border shadow-sm group">
                  <img 
                    src={activeSection.settings.imageUrl} 
                    className="h-full w-full object-cover transition-transform group-hover:scale-110" 
                    alt="Section Banner" 
                  />
                  <button 
                    type="button" 
                    onClick={() => updateSectionSettings(activeSection.id, { imageUrl: null })} 
                    className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md hover:text-red-500 transition-colors"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <CldUploadWidget 
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} 
                  options={{ multiple: false }}
                  onSuccess={(result: any) => {
                    if (result.event === "success") {
                      updateSectionSettings(activeSection.id, { imageUrl: result.info.secure_url });
                    }
                  }}
                >
                  {({ open }) => (
                    <button 
                      type="button" 
                      onClick={() => open()} 
                      className="h-40 w-full border-2 border-dashed border-zinc-300 rounded-3xl flex flex-col items-center justify-center text-zinc-400 hover:border-[#006044] hover:text-[#006044] hover:bg-zinc-50 transition-all bg-transparent group"
                    >
                      <Upload size={28} className="group-hover:-translate-y-1 transition-transform" />
                      <span className="text-[10px] font-black mt-3 tracking-widest uppercase">Upload Photo</span>
                    </button>
                  )}
                </CldUploadWidget>
              )}
            </div>
          </div>
        )}

        {/* DATA SOURCE INPUT */}
        {["PRODUCT_CAROUSEL", "CATEGORIES", "BLOG_SECTION"].includes(activeSection.type) && (
          <div className="space-y-2 pt-2">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Data Source (Key)
            </label>
            <input
              type="text"
              className="w-full p-4 border border-zinc-200 rounded-2xl outline-none font-bold text-sm bg-white focus:ring-2 focus:ring-[#006044] transition-all font-mono"
              value={activeSection.settings.dataSource || ""}
              onChange={(e) => updateSectionSettings(activeSection.id, { dataSource: e.target.value })}
              placeholder="e.g. newArrivals"
            />
          </div>
        )}

      </div>
    </div>
  );
}