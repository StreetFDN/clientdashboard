"use client";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardSidebar from "@/components/DashboardSidebar";
import NavigationBox from "@/components/NavigationBox";
import React, { Suspense, useState } from "react";
import TokenPriceComponent from "./TokenPrice";
import TokenHoldersComponent from "./TokenHolders";
import TokenPriceHistoricalComponent from "./TokenPriceHistorical";
import TokenHoldersHistoricalComponent from "./TokenHoldersHistorical";
import TokenVolumeTotalComponent from "./TokenTotalVolume";
import TokenVolumeHistoricalComponent from "./TokenVolumeHistorical";

export function TokenDataPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tokenAddressInput, setTokenAddressInput] = useState(
    "0x514910771af9ca656af840dff83e8264ecf986ca",
  );
  const [tokenAddress, setTokenAddress] = useState("");
  return (
    <div className="min-h-screen relative page-transition bg-[#262624]">
      <DashboardSidebar isOpen={sidebarOpen} />
      <DashboardNavbar
        pageTitle="Token Page"
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div
        className="relative transition-all duration-300 ease-in-out overflow-y-auto"
        style={{
          marginLeft: sidebarOpen ? "256px" : "0",
          maxWidth: sidebarOpen ? "calc(100% - 256px)" : "100%",
          marginTop: "64px",
          height: "calc(100vh - 64px)",
        }}
      >
        <div className="w-full px-6 py-5">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="serif-heading text-3xl text-[#FAF9F6] mb-2">
                Token Data
              </h1>
              <p className="text-sm text-[#d4d4d1]">Track token data here</p>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setTokenAddress(tokenAddressInput);
            }}
          >
            <input
              className="text-black bg-none"
              value={tokenAddressInput}
              onChange={(e) => setTokenAddressInput(e.target.value)}
            ></input>
            <button type="submit">Get Token Data</button>
          </form>
        </div>
        {tokenAddress && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full p-4">
            <TokenPriceComponent token={tokenAddress} />
            <TokenVolumeTotalComponent token={tokenAddress} />
            <TokenHoldersComponent token={tokenAddress} />

            <div className="md:col-span-2 lg:col-span-3">
              <TokenPriceHistoricalComponent token={tokenAddress} />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <TokenVolumeHistoricalComponent token={tokenAddress} />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <TokenHoldersHistoricalComponent token={tokenAddress} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
