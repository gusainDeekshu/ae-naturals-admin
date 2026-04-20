// src\components\home\BrandStory.tsx

export const BrandStory = ({ settings }: any) => (
  <div className="w-full h-[250px] bg-amber-50 border-2 border-amber-200 border-dashed flex items-center justify-center rounded-xl">
    <h2 className="text-xl font-bold text-amber-500">{settings?.title || "Brand Story Block"}</h2>
  </div>
);