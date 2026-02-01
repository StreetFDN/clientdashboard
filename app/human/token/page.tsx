import React, { Suspense } from "react";
import { TokenDataPage } from "./TokenPageComponent";

export default function TokenDataPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen relative page-transition bg-[#262624] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066cc] mx-auto mb-4"></div>
            <p className="text-sm text-[#d4d4d1]">Loading...</p>
          </div>
        </div>
      }
    >
      <TokenDataPage />
    </Suspense>
  );
}
