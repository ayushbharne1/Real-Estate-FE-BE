// Route: /customer
// Dependencies: @tanstack/react-table, lucide-react, react-router-dom

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import {
  PhoneCall, Mail, ChevronDown, ArrowUpDown,
  ChevronLeft, ChevronRight, Plus,
} from "lucide-react";
import { ASSET_TYPE_OPTIONS } from "shared/constants/dropdown.js";

/* ─────────────────────────── mock data ─────────────────────────── */
const INITIAL_DATA = [
  { id: 1,  name: "Shivani",     contact: "+91-9632587410", email: "Shivani@gmail.com",         propertyId: "PB5609", assetType: "Commercial Space", askPrice: "₹75k", pricePaid: "72k", status: "In Progress" },
  { id: 2,  name: "Shubham",     contact: "+91-9632587410", email: "Shubham Saxena@gmail.com",  propertyId: "PB4567", assetType: "Commercial Land",  askPrice: "₹85k", pricePaid: "84k", status: "In Progress" },
  { id: 3,  name: "Christopher", contact: "+91-9632587410", email: "Christopher@gmail.com",      propertyId: "PB3245", assetType: "Office Space",      askPrice: "₹75k", pricePaid: "72k", status: "In Progress" },
  { id: 4,  name: "Aaryan",      contact: "+91-9632587410", email: "Aaryankhan@gmail.com",       propertyId: "PB7890", assetType: "Retail Space",      askPrice: "₹85k", pricePaid: "84k", status: "In Progress" },
  { id: 5,  name: "Shivangi",    contact: "+91-9632587410", email: "Shiangichaubey@gmail.com",   propertyId: "PB9876", assetType: "Commercial Space",  askPrice: "₹75k", pricePaid: "72k", status: "Cancelled" },
  { id: 6,  name: "Rahul",       contact: "+91-9632587410", email: "Rahuldavid@gmail.com",       propertyId: "PB4567", assetType: "Commercial Land",   askPrice: "₹85k", pricePaid: "84k", status: "Cancelled" },
  { id: 7,  name: "Ravi",        contact: "+91-9632587410", email: "Ravisharma@gmail.com",       propertyId: "PB4536", assetType: "Office Space",      askPrice: "₹75k", pricePaid: "72k", status: "Cancelled" },
  { id: 8,  name: "Mike",        contact: "+91-9632587410", email: "Mike@gmail.com",             propertyId: "PB7890", assetType: "Retail Space",      askPrice: "₹85k", pricePaid: "84k", status: "Active" },
  { id: 9,  name: "Albert",      contact: "+91-9632587410", email: "Albert@gmail.com",           propertyId: "PB8899", assetType: "Retail Space",      askPrice: "₹88k", pricePaid: "85k", status: "Active" },
];

const STATUS_OPTIONS = ["In Progress", "Active", "Cancelled"];

const STATUS_STYLES = {
  "In Progress": "bg-[#FFF4D3] text-[#F39C12]",
  "Cancelled":   "bg-[#FFD5D5] text-[#FF5B5B]",
  "Active":      "bg-[#D9F9E6] text-[#2ECC71]",
};

/* ─────────────────────────── main page ─────────────────────────── */
export default function Customer() {
  const navigate = useNavigate();
  const [data, setData] = useState(INITIAL_DATA);
  const [activeType, setActiveType] = useState("Resale");
  const [selectedAssetType, setSelectedAssetType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Handler to update status in the local state
  const handleStatusChange = (rowId, newStatus) => {
    setData((prev) =>
      prev.map((item) => (item.id === rowId ? { ...item, status: newStatus } : item))
    );
  };

  // Filter data based on selected asset type and status
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const assetMatch = !selectedAssetType || item.assetType === selectedAssetType;
      const statusMatch = !selectedStatus || item.status === selectedStatus;
      return assetMatch && statusMatch;
    });
  }, [data, selectedAssetType, selectedStatus]);

  const columns = useMemo(() => [
    { accessorKey: "name",       header: "Name" },
    { accessorKey: "contact",    header: "Contact No." },
    { accessorKey: "email",      header: "Email ID" },
    { accessorKey: "propertyId", header: "Property ID" },
    { accessorKey: "assetType",  header: "Asset Type" },
    { accessorKey: "askPrice",   header: "Ask Price" },
    { accessorKey: "pricePaid",  header: "Price Paid" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const currentStatus = row.original.status;
        return (
          <div className="relative inline-block">
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(row.original.id, e.target.value)}
              className={`appearance-none flex items-center justify-between gap-1 px-3 py-1.5 rounded-md text-[10px] font-bold w-28 cursor-pointer focus:outline-none ${STATUS_STYLES[currentStatus]}`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={3} />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-md bg-[#FF6B6B] text-white flex items-center justify-center hover:bg-[#ff5252] transition-colors">
            <PhoneCall size={16} />
          </button>
          <button className="w-9 h-9 rounded-md bg-[#FF6B6B] text-white flex items-center justify-center hover:bg-[#ff5252] transition-colors">
            <Mail size={16} />
          </button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  const { pageSize, pageIndex } = table.getState().pagination;

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-[#333]">
      {/* ── Top Controls ── */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden h-10">
          {["Resale", "Rental"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-6 py-1 text-sm font-medium transition-colors ${activeType === t ? "bg-[#FF6B6B] text-white" : "text-gray-400 hover:bg-gray-50"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Asset Type filter — uses shared ASSET_TYPE_OPTIONS */}
        <div className="relative h-10">
          <select
            value={selectedAssetType}
            onChange={(e) => setSelectedAssetType(e.target.value)}
            className="h-10 appearance-none border border-gray-300 rounded-lg pl-4 pr-9 text-gray-500 text-sm hover:bg-gray-50 focus:outline-none focus:border-[#FF6B6B] cursor-pointer bg-white"
          >
            <option value="">Asset Type</option>
            {ASSET_TYPE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={label}>{label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* Status filter */}
        <div className="relative h-10">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 appearance-none border border-gray-300 rounded-lg pl-4 pr-9 text-gray-500 text-sm hover:bg-gray-50 focus:outline-none focus:border-[#FF6B6B] cursor-pointer bg-white"
          >
            <option value="">Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        <button className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50">
          <ArrowUpDown size={18} />
        </button>

        <button
          onClick={() => navigate("/customer/add")}
          className="flex items-center gap-2 px-4 py-2 bg-[#E8453C] hover:bg-[#d03830] text-white text-sm font-semibold rounded-lg shadow-sm shadow-red-200 transition-all active:scale-95"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Buyer Details
        </button>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F2F2F2]">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-6 py-4 text-[11px] uppercase tracking-wider font-bold text-gray-500">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-400">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="mt-8 flex items-center justify-between px-2">
        <div className="text-xs text-gray-400 font-medium">
          Showing {filteredData.length === 0 ? 0 : pageIndex * pageSize + 1}-{Math.min((pageIndex + 1) * pageSize, filteredData.length)} of {filteredData.length} Results
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1 text-gray-400 disabled:opacity-20 hover:text-gray-600"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center">
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`w-8 h-8 rounded-md text-xs font-bold transition-colors ${
                  pageIndex === i ? "text-[#FF6B6B] bg-red-50" : "text-gray-400 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1 text-gray-400 disabled:opacity-20 hover:text-gray-600"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-medium">Items per page</span>
          <select
            value={pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-600 focus:outline-none focus:border-[#FF6B6B]"
          >
            {[5, 10, 20].map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}