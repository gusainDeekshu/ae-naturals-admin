// src\components\home\TrustTicker.tsx

export const TrustTicker = ({ settings }: any) => (
  <div className="w-full h-[80px] bg-gray-100 border-2 border-gray-300 border-dashed flex items-center justify-center rounded-xl">
    <h2 className="text-lg font-bold text-gray-500">{settings?.title || "Trust Badges Block"}</h2>
  </div>
);