import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Phone, Mail, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

const initialData = [
  { id: 1, name: "Shivani", contact: "+91-9632587410", email: "Shivani@gmail.com", propertyId: "PB5609", assetType: "Commercial Space", askPrice: "₹75k", pricePaid: "72k", status: "In Progress" },
  { id: 2, name: "Shubham", contact: "+91-9632587410", email: "Shubham.Saxena@gmail.com", propertyId: "PB4567", assetType: "Commercial Land", askPrice: "₹85k", pricePaid: "84k", status: "In Progress" },
  { id: 3, name: "Christopher", contact: "+91-9632587410", email: "Christopher@gmail.com", propertyId: "PB3245", assetType: "Office Space", askPrice: "₹75k", pricePaid: "72k", status: "In Progress" },
  { id: 4, name: "Aaryan", contact: "+91-9632587410", email: "Aaryankhan@gmail.com", propertyId: "PB7890", assetType: "Retail Space", askPrice: "₹85k", pricePaid: "84k", status: "In Progress" },
  { id: 5, name: "Shivangi", contact: "+91-9632587410", email: "Shiangichaubey@gmail.com", propertyId: "PB9876", assetType: "Commercial Space", askPrice: "₹75k", pricePaid: "72k", status: "Cancelled" },
  { id: 6, name: "Rahul", contact: "+91-9632587410", email: "Rahuldavid@gmail.com", propertyId: "PB4567", assetType: "Commercial Land", askPrice: "₹85k", pricePaid: "84k", status: "Cancelled" },
  { id: 7, name: "Ravi", contact: "+91-9632587410", email: "Ravisharma@gmail.com", propertyId: "PB4536", assetType: "Office Space", askPrice: "₹75k", pricePaid: "72k", status: "Cancelled" },
  { id: 8, name: "Mike", contact: "+91-9632587410", email: "Mike@gmail.com", propertyId: "PB7890", assetType: "Retail Space", askPrice: "₹85k", pricePaid: "84k", status: "Active" },
  { id: 9, name: "Albert", contact: "+91-9632587410", email: "Albert@gmail.com", propertyId: "PB8899", assetType: "Retail Space", askPrice: "₹88k", pricePaid: "85k", status: "Active" },
  { id: 10, name: "Priya", contact: "+91-9632587410", email: "Priya@gmail.com", propertyId: "PB1234", assetType: "Commercial Space", askPrice: "₹90k", pricePaid: "88k", status: "Active" },
];

const statusStyles = {
  "In Progress": "bg-amber-100 text-amber-700 border border-amber-200",
  "Cancelled": "bg-rose-100 text-rose-600 border border-rose-200",
  "Active": "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

const navTabs = [
  { label: "All", icon: "🏘️" },
  { label: "Commercial", icon: "🏢" },
  { label: "Apartment", icon: "🏠" },
  { label: "Plot", icon: "📐" },
  { label: "Villas", icon: "🏡" },
];

export default function Customer() {
  const [activeTab, setActiveTab] = useState("All");
  const [activeType, setActiveType] = useState("Resale");
  const [statusMap, setStatusMap] = useState({});

  const updateStatus = (id, value) => {
    setStatusMap((prev) => ({ ...prev, [id]: value }));
  };

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ getValue }) => (
        <span className="font-semibold text-slate-800 font-['DM_Sans']">{getValue()}</span>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact No.",
      cell: ({ getValue }) => (
        <span className="text-slate-500 text-sm">{getValue()}</span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email ID",
      cell: ({ getValue }) => (
        <span className="text-slate-500 text-sm">{getValue()}</span>
      ),
    },
    {
      accessorKey: "propertyId",
      header: "Property ID",
      cell: ({ getValue }) => (
        <span className="font-mono text-sm font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{getValue()}</span>
      ),
    },
    {
      accessorKey: "assetType",
      header: "Asset type",
      cell: ({ getValue }) => (
        <span className="text-slate-600 text-sm">{getValue()}</span>
      ),
    },
    {
      accessorKey: "askPrice",
      header: "Ask Price",
      cell: ({ getValue }) => (
        <span className="font-semibold text-slate-700">{getValue()}</span>
      ),
    },
    {
      accessorKey: "pricePaid",
      header: "Price Paid",
      cell: ({ getValue }) => (
        <span className="font-semibold text-slate-700">{getValue()}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const currentStatus = statusMap[row.original.id] || row.original.status;
        return (
          <div className="relative inline-flex items-center">
            <select
              value={currentStatus}
              onChange={(e) => updateStatus(row.original.id, e.target.value)}
              className={`appearance-none pl-3 pr-7 py-1.5 rounded-full text-xs font-semibold cursor-pointer outline-none transition-all ${statusStyles[currentStatus]}`}
            >
              <option>In Progress</option>
              <option>Active</option>
              <option>Cancelled</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 pointer-events-none opacity-60" />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl bg-[#E8453C] hover:bg-[#d03830] text-white flex items-center justify-center shadow-sm shadow-red-200 transition-all hover:scale-105 active:scale-95">
            <Phone size={15} />
          </button>
          <button className="w-9 h-9 rounded-xl bg-[#E8453C] hover:bg-[#d03830] text-white flex items-center justify-center shadow-sm shadow-red-200 transition-all hover:scale-105 active:scale-95">
            <Mail size={15} />
          </button>
        </div>
      ),
    },
  ], [statusMap]);

  const table = useReactTable({
    data: initialData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = initialData.length;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div
      className="min-h-screen bg-[#F7F8FC] p-6"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header Nav */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {navTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.label
                  ? "text-[#E8453C] font-semibold"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Resale / Rental toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-xl p-1">
            {["Resale", "Rental"].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeType === type
                    ? "bg-[#E8453C] text-white shadow-sm shadow-red-200"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-all">
            <ArrowUpDown size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {table.getHeaderGroups().map((hg) =>
                  hg.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-slate-50 transition-colors hover:bg-slate-50/70 ${
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/30"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
          <p className="text-sm text-slate-400">
            Showing <span className="font-semibold text-slate-600">{from}–{to}</span> of{" "}
            <span className="font-semibold text-slate-600">{totalRows}</span> Results
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 transition-all"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`w-8 h-8 text-sm rounded-lg font-medium transition-all duration-200 ${
                  pageIndex === i
                    ? "bg-[#E8453C] text-white shadow-sm shadow-red-200"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed text-slate-500 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Items per page</span>
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 outline-none focus:border-[#E8453C] transition-all bg-white"
            >
              {[5, 10, 20, 30].map((size) => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}