// src\components\home\HomeBlogSection.tsx

export default function HomeBlogSection({ settings }: any) {
  return (
    <div className="w-full h-[350px] bg-teal-50 border-2 border-teal-200 border-dashed flex items-center justify-center rounded-xl">
      <h2 className="text-xl font-bold text-teal-500">{settings?.title || "Blog/Journal Block"}</h2>
    </div>
  );
}