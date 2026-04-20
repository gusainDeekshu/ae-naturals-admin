// src\components\home\CategoryShowcase.tsx

export const CategoryShowcase = ({ settings }: any) => (
  <div className="w-full h-[200px] bg-green-50 border-2 border-green-200 border-dashed flex items-center justify-center rounded-xl">
    <h2 className="text-xl font-bold text-green-500">{settings?.title || "Categories Block"}</h2>
  </div>
);