"use client";

export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-start gap-3">
          <div className="w-[60px] h-[60px] rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-40" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-20 bg-gray-200 rounded w-full" />
      </div>
    </div>
  );
}
