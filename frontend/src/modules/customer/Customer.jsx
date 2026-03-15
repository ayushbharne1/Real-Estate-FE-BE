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
  Phone, Mail, ChevronDown, ArrowUpDown,
  ChevronLeft, ChevronRight, LayoutGrid, Building2,
  Home, Square, Castle, Plus,
} from "lucide-react";

/* ─────────────────────────── mock data ─────────────────────────── */
const INITIAL_DATA = [
  { id: 1,  name: "Shivani",     contact: "+91-9632587410", email: "Shivani@gmail.com",         propertyId: "PB5609", assetType: "Commercial Space", askPrice: "₹75k", pricePaid: "72k", rent: "₹75k", deposit: "72k", status: "In Progress" },
  { id: 2,  name: "Shubham",     contact: "+91-9632587410", email: "Shubham.Saxena@gmail.com",   propertyId: "PB4567", assetType: "Commercial Land",  askPrice: "₹85k", pricePaid: "84k", rent: "₹85k", deposit: "84k", status: "In Progress" },
  { id: 3,  name: "Christopher", contact: "+91-9632587410", email: "Christopher@gmail.com",       propertyId: "PB3245", assetType: "Office Space",      askPrice: "₹75k", pricePaid: "72k", rent: "₹75k", deposit: "72k", status: "In Progress" },
  { id: 4,  name: "Aaryan",      contact: "+91-9632587410", email: "Aaryankhan@gmail.com",        propertyId: "PB7890", assetType: "Retail Space",      askPrice: "₹85k", pricePaid: "84k", rent: "₹85k", deposit: "84k", status: "In Progress" },
  { id: 5,  name: "Shivangi",    contact: "+91-9632587410", email: "Shiangichaubey@gmail.com",    propertyId: "PB9876", assetType: "Commercial Space",  askPrice: "₹75k", pricePaid: "72k", rent: "₹75k", deposit: "72k", status: "Cancelled" },
  { id: 6,  name: "Rahul",       contact: "+91-9632587410", email: "Rahuldavid@gmail.com",        propertyId: "PB4567", assetType: "Commercial Land",   askPrice: "₹85k", pricePaid: "84k", rent: "₹85k", deposit: "84k", status: "Cancelled" },
  { id: 7,  name: "Ravi",        contact: "+91-9632587410", email: "Ravisharma@gmail.com",        propertyId: "PB4536", assetType: "Office Space",      askPrice: "₹75k", pricePaid: "72k", rent: "₹75k", deposit: "72k", status: "Cancelled" },
  { id: 8,  name: "Mike",        contact: "+91-9632587410", email: "Mike@gmail.com",              propertyId: "PB7890", assetType: "Retail Space",      askPrice: "₹85k", pricePaid: "84k", rent: "₹85k", deposit: "84k", status: "Active" },
  { id: 9,  name: "Albert",      contact: "+91-9632587410", email: "Albert@gmail.com",            propertyId: "PB8899", assetType: "Retail Space",      askPrice: "₹88k", pricePaid: "85k", rent: "₹88k", deposit: "85k", status: "Active" },
  { id: 10, name: "Priya",       contact: "+91-9632587410", email: "Priya@gmail.com",             propertyId: "PB1234", assetType: "Commercial Space",  askPrice: "₹90k", pricePaid: "88k", rent: "₹90k", deposit: "88k", status: "Active" },
  { id: 11, name: "Arjun",       contact: "+91-9632587410", email: "Arjun@gmail.com",             propertyId: "PB2345", assetType: "Office Space",      askPrice: "₹78k", pricePaid: "76k", rent: "₹78k", deposit: "76k", status: "Active" },
  { id: 12, name: "Neha",        contact: "+91-9632587410", email: "Neha@gmail.com",              propertyId: "PB3456", assetType: "Retail Space",      askPrice: "₹82k", pricePaid: "80k", rent: "₹82k", deposit: "80k", status: "In Progress" },
];

/* ─────────────────────────── constants ─────────────────────────── */
const STATUS_STYLES = {
  "In Progress": "bg-[#FFF8E1] text-[#B8860B] border border-[#FFE082]",
  "Cancelled":   "bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]",
  "Active":      "bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]",
};

const NAV_TABS = [
  { label: "All",        Icon: LayoutGrid },
  { label: "Commercial", Icon: Building2 },
  { label: "Apartment",  Icon: Home },
  { label: "Plot",       Icon: Square },
  { label: "Villas",     Icon: Castle },
];

/* ─────────────────────────── sub-components ────────────────────── */
function StatusCell({ row, statusMap, updateStatus }) {
  const cur = statusMap[row.original.id] || row.original.status;
  return (
    <div className="relative inline-flex items-center">
      <select
        value={cur}
        onChange={(e) => updateStatus(row.original.id, e.target.value)}
        className={`appearance-none pl-2.5 pr-6 py-1 rounded text-xs font-medium cursor-pointer outline-none transition-all ${STATUS_STYLES[cur]}`}
        style={{ minWidth: 96 }}
      >
        <option>In Progress</option>
        <option>Active</option>
        <option>Cancelled</option>
      </select>
      <ChevronDown size={10} className="absolute right-1.5 pointer-events-none opacity-50" />
    </div>
  );
}

/* ─────────────────────────── main page ─────────────────────────── */
export default function Customer() {
  const navigate = useNavigate();

  const [activeTab,  setActiveTab]  = useState("All");
  const [activeType, setActiveType] = useState("Rental");
  const [statusMap,  setStatusMap]  = useState({});
  const [tableData]                 = useState(INITIAL_DATA);

  const updateStatus = (id, val) =>
    setStatusMap((p) => ({ ...p, [id]: val }));

  const isRental = activeType === "Rental";

  const columns = useMemo(() => {
    const priceCol = isRental
      ? [
          { accessorKey: "rent",    header: "Rent",    cell: ({ getValue }) => <span className="text-[#374151] text-sm">{getValue()}</span> },
          { accessorKey: "deposit", header: "Deposit", cell: ({ getValue }) => <span className="text-[#374151] text-sm">{getValue()}</span> },
        ]
      : [
          { accessorKey: "askPrice",  header: "Ask Price",  cell: ({ getValue }) => <span className="text-[#374151] text-sm">{getValue()}</span> },
          { accessorKey: "pricePaid", header: "Price Paid", cell: ({ getValue }) => <span className="text-[#374151] text-sm">{getValue()}</span> },
        ];

    return [
      { accessorKey: "name",       header: "Name",        cell: ({ getValue }) => <span className="text-[#111827] text-sm font-medium">{getValue()}</span> },
      { accessorKey: "contact",    header: "Contact No.", cell: ({ getValue }) => <span className="text-[#6B7280] text-sm">{getValue()}</span> },
      { accessorKey: "email",      header: "Email ID",    cell: ({ getValue }) => <span className="text-[#6B7280] text-sm">{getValue()}</span> },
      { accessorKey: "propertyId", header: "Property ID", cell: ({ getValue }) => <span className="text-[#374151] text-sm">{getValue()}</span> },
      { accessorKey: "assetType",  header: "Assest type", cell: ({ getValue }) => <span className="text-[#374151] text-sm">{getValue()}</span> },
      ...priceCol,
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusCell row={row} statusMap={statusMap} updateStatus={updateStatus} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: () => (
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg bg-[#E8453C] hover:bg-[#d03830] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95">
              <Phone size={14} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#E8453C] hover:bg-[#d03830] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95">
              <Mail size={14} />
            </button>
          </div>
        ),
      },
    ];
  }, [isRental, statusMap]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const total = tableData.length;
  const from  = pageIndex * pageSize + 1;
  const to    = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <div className="min-h-screen bg-[#F5F6FA] p-5" style={{ fontFamily: "Inter, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* ── Nav bar ── */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mb-4 px-5 py-2 flex items-center justify-between">
        {/* Tabs */}
        <div className="flex items-center">
          {NAV_TABS.map(({ label, Icon }) => {
            const active = activeTab === label;
            return (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  active ? "text-[#E8453C]" : "text-[#6B7280] hover:text-[#374151]"
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={active ? 2.2 : 1.8}
                  className={active ? "text-[#E8453C]" : "text-[#9CA3AF]"}
                />
                {label}
              </button>
            );
          })}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* ── Add Customer → navigates to /customer/add ── */}
          <button
            onClick={() => navigate("/customer/add")}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#E8453C] hover:bg-[#d03830] text-white text-sm font-semibold rounded-lg shadow-sm shadow-red-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={15} strokeWidth={2.5} />
            Add Customer
          </button>

          {/* Resale / Rental toggle */}
          <div className="flex border border-[#E5E7EB] rounded-lg overflow-hidden">
            {["Resale", "Rental"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-5 py-1.5 text-sm font-medium transition-all duration-150 ${
                  activeType === t
                    ? "bg-[#E8453C] text-white"
                    : "bg-white text-[#6B7280] hover:bg-gray-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Sort */}
          <button className="w-8 h-8 border border-[#E5E7EB] rounded-lg flex items-center justify-center bg-white hover:bg-gray-50 transition-all">
            <ArrowUpDown size={14} className="text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id} className="border-b border-[#F3F4F6]">
                  {hg.headers.map((h) => (
                    <th key={h.id} className="px-5 py-3.5 text-left text-xs font-semibold text-[#9CA3AF] whitespace-nowrap">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={`border-b border-[#F9FAFB] hover:bg-[#FAFAFA] transition-colors ${
                    i % 2 !== 0 ? "bg-[#FAFAFA]" : "bg-white"
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-[14px] whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="px-5 py-3.5 flex items-center justify-between border-t border-[#F3F4F6]">
          <p className="text-xs text-[#9CA3AF]">
            Showing {from}–{to} of {total} Results
          </p>

          <div className="flex items-center gap-0.5">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-7 h-7 flex items-center justify-center rounded text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <button
                key={i}
                onClick={() => table.setPageIndex(i)}
                className={`w-7 h-7 text-xs rounded font-medium transition-all ${
                  pageIndex === i ? "bg-[#E8453C] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-7 h-7 flex items-center justify-center rounded text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9CA3AF]">Items per page</span>
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="text-xs border border-[#E5E7EB] rounded px-2 py-1 text-[#374151] outline-none bg-white focus:border-[#E8453C]"
            >
              {[5, 10, 20, 30].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}