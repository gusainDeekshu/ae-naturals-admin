// src\components\home\ProductCarousel.tsx

export const ProductCarousel = ({ settings }: any) => (
  <div className="w-full h-[300px] bg-purple-50 border-2 border-purple-200 border-dashed flex items-center justify-center rounded-xl">
    <h2 className="text-xl font-bold text-purple-500">{settings?.title || "Product Carousel Block"}</h2>
  </div>
);