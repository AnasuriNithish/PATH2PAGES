// src/pages/Dashboard.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// Navigation data (use consistent route paths)
const navItems = [
  { name: "Admin", link: "/" },
  { name: "Dashboard", link: "/dashboard", active: true },
  { name: "Products", link: "/products" },
  { name: "Orders", link: "/orders" },
  { name: "Coupons", link: "/coupons" },
];

// Mock Data
const salesData = [
  { date: "Sep 1", revenue: 2000 },
  { date: "Sep 2", revenue: 3500 },
  { date: "Sep 3", revenue: 1800 },
  { date: "Sep 4", revenue: 4200 },
  { date: "Sep 5", revenue: 3800 },
  { date: "Sep 6", revenue: 4600 },
  { date: "Sep 7", revenue: 5100 },
];

const productsData = [
  { name: "Vintage Scrapbook", sales: 120, total: 150 },
  { name: "Gold Foil Bookmark", sales: 80, total: 150 },
  { name: "Botanical Stickers", sales: 50, total: 150 },
  { name: "Washi Tape Set", sales: 30, total: 150 },
];

const couponData = [
  { code: "WELCOME10", used: 45 },
  { code: "FESTIVE20", used: 30 },
  { code: "FREESHIP", used: 15 },
];

// --- Sub-Components ---
const Widget = ({ title, value, subtitle, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-neutral-200 hover:border-neutral-300 transition-colors duration-200">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
        {title}
      </h3>
      {trend !== undefined && (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            trend > 0
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {trend > 0 ? "+" : ""}
          {trend}%
        </span>
      )}
    </div>
    <div className="text-2xl font-extrabold text-neutral-900 mb-1">{value}</div>
    <div className="text-sm text-neutral-400">{subtitle}</div>
  </div>
);

// Simple SVG Line Chart
const SalesChart = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.revenue));
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d.revenue / maxVal) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200 h-full">
      <h3 className="text-neutral-900 font-bold mb-6">Revenue Overview</h3>
      <div className="relative h-48 w-full">
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-neutral-300">
          <div className="border-b border-dashed border-neutral-100 w-full h-0" />
          <div className="border-b border-dashed border-neutral-100 w-full h-0" />
          <div className="border-b border-dashed border-neutral-100 w-full h-0" />
          <div className="border-b border-dashed border-neutral-100 w-full h-0" />
        </div>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <path
            d={`M0,100 ${points} 100,100`}
            fill="rgba(20,20,20,0.03)"
            stroke="none"
          />
          <polyline
            points={points}
            fill="none"
            stroke="#171717"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - (d.revenue / maxVal) * 100;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill="#fff"
                stroke="#171717"
                strokeWidth="2"
              >
                <title>
                  {d.date}: ₹{d.revenue}
                </title>
              </circle>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between mt-4 text-xs text-neutral-400 font-medium">
        {data.map((d, i) => (
          <span key={i}>{d.date}</span>
        ))}
      </div>
    </div>
  );
};

// Top products bar chart
const TopProductsChart = ({ data }) => (
  <div className="bg-white p-6 rounded-xl border border-neutral-200 h-full">
    <h3 className="text-neutral-900 font-bold mb-6">Top Selling Products</h3>
    <div className="space-y-5">
      {data.map((item, idx) => (
        <div key={idx}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium text-neutral-700">{item.name}</span>
            <span className="text-neutral-500">{item.sales} sold</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-neutral-800 h-2 rounded-full"
              style={{ width: `${(item.sales / item.total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Coupon vertical bars
const CouponUsageChart = ({ data }) => {
  const maxUsage = Math.max(...data.map((d) => d.used));
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200 h-full">
      <h3 className="text-neutral-900 font-bold mb-6">Coupon Usage</h3>
      <div className="flex items-end justify-around h-40 gap-4">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center gap-2 w-full group"
          >
            <div className="relative w-full flex items-end justify-center h-full">
              <div
                className="w-12 bg-neutral-200 rounded-t-lg transition-colors duration-300 relative"
                style={{ height: `${(item.used / maxUsage) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                  {item.used} uses
                </div>
              </div>
            </div>
            <span className="text-xs font-mono font-medium text-neutral-500">
              {item.code}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-800 font-sans">
      {/* Sidebar (NavLink for SPA navigation) */}
      <nav className="hidden md:block w-52 bg-white border-r border-neutral-200 p-6 flex-shrink-0">
        <div className="text-lg font-extrabold text-neutral-900 mb-6 tracking-tight">
          PathToPages
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-neutral-100 text-neutral-900 font-semibold border-l-4 border-neutral-800"
                      : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900"
                  }`
                }
                end
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex-grow p-6 md:p-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
              Dashboard
            </h1>
            <p className="text-neutral-500 mt-1 text-sm">
              Overview of your store's performance.
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-neutral-400 uppercase">
              Current Date
            </p>
            <p className="text-sm font-medium text-neutral-700">Sep 08, 2025</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Widget
            title="Total Revenue"
            value="₹85,000"
            subtitle="Total sales this month"
            trend={12.5}
          />
          <Widget
            title="Orders Completed"
            value="320"
            subtitle="vs. 280 last month"
            trend={8.2}
          />
          <Widget
            title="Active Customers"
            value="150"
            subtitle="Returning customers"
            trend={-2.4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="lg:col-span-2">
            <SalesChart data={salesData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopProductsChart data={productsData} />
          <CouponUsageChart data={couponData} />
        </div>
      </div>
    </div>
  );
}
