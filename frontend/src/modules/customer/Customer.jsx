// Route: /customer
// Dependencies: @tanstack/react-table, lucide-react, react-router-dom, react-redux

import React, { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBuyers,
  updateBuyerStatus,
  selectBuyerList,
  selectBuyerTotal,
  selectListLoading,
  selectListError,
  selectStatusUpdating,
} from "../../redux/slices/buyerSlice";
import {
  PhoneCall, Mail, ChevronDown, ArrowUpDown,
  ChevronLeft, ChevronRight, Plus, Eye,
} from "lucide-react";
import { ASSET_TYPE_OPTIONS, SORT_OPTIONS } from "shared/constants/dropdown.js";

/* ─────────────────────────── constants ─────────────────────────── */

const STATUS_DISPLAY = {
  IN_PROGRESS: "In Progress",
  ACTIVE:      "Active",
  CANCELLED:   "Cancelled",
};

const STATUS_API = {
  "In Progress": "IN_PROGRESS",
  "Active":      "ACTIVE",
  "Cancelled":   "CANCELLED",
};

const STATUS_OPTIONS_DISPLAY = ["In Progress", "Active", "Cancelled"];

const STATUS_STYLES = {
  "In Progress": "bg-[#FFF4D3] text-[#F39C12]",
  "Cancelled":   "bg-[#FFD5D5] text-[#FF5B5B]",
  "Active":      "bg-[#D9F9E6] text-[#2ECC71]",
};

const UNIT_LABEL = { THOUSANDS: "K", LAKHS: "L", CRORES: "Cr" };

function formatPrice(value, unit) {
  if (!value || value === 0) return "—";
  return `₹${value}${UNIT_LABEL[unit] ?? ""}`;
}

/* ─────────────────────────── main page ─────────────────────────── */
export default function Customer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items          = useSelector(selectBuyerList);
  const total          = useSelector(selectBuyerTotal);
  const listLoading    = useSelector(selectListLoading);
  const listError      = useSelector(selectListError);
  const statusUpdating = useSelector(selectStatusUpdating);

  const [activeType,        setActiveType]        = useState("Resale");
  const [selectedAssetType, setSelectedAssetType] = useState("");
  const [selectedStatus,    setSelectedStatus]    = useState("");
  const [selectedSort,      setSelectedSort]      = useState("");

  useEffect(() => {
    dispatch(fetchBuyers({ listingType: activeType.toUpperCase(), page: 1, limit: 20 }));
  }, [dispatch, activeType]);

  const handleStatusChange = (rowId, displayStatus) => {
    dispatch(updateBuyerStatus({ id: rowId, status: STATUS_API[displayStatus] }));
  };

  const filteredData = useMemo(() => {
    let data = items.filter((item) => {
      const assetLabel  = ASSET_TYPE_OPTIONS.find(o => o.value === item.assetType)?.label ?? item.assetType;
      const statusLabel = STATUS_DISPLAY[item.status] ?? item.status;
      return (
        (!selectedAssetType || assetLabel === selectedAssetType) &&
        (!selectedStatus    || statusLabel === selectedStatus)
      );
    });

    if (selectedSort) {
      data = [...data].sort((a, b) => {
        switch (selectedSort) {
          case "PRICE_LOW_TO_HIGH":
            return (a.askPrice ?? 0) - (b.askPrice ?? 0);
          case "PRICE_HIGH_TO_LOW":
            return (b.askPrice ?? 0) - (a.askPrice ?? 0);
          case "NEWEST_FIRST":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "OLDEST_FIRST":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "PRICE_SQFT_LOW_TO_HIGH":
            return (a.pricePerSqft ?? 0) - (b.pricePerSqft ?? 0);
          case "PRICE_SQFT_HIGH_TO_LOW":
            return (b.pricePerSqft ?? 0) - (a.pricePerSqft ?? 0);
          default:
            return 0;
        }
      });
    }

    return data;
  }, [items, selectedAssetType, selectedStatus, selectedSort]);

  const columns = useMemo(() => [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "contact",
      header: "Contact No.",
      cell: ({ row }) => `${row.original.countryCode}-${row.original.contact}`,
    },
    { accessorKey: "email", header: "Email ID" },
    { accessorKey: "propertyId", header: "Property ID" },
    {
      accessorKey: "assetType",
      header: "Asset Type",
      cell: ({ getValue }) => ASSET_TYPE_OPTIONS.find(o => o.value === getValue())?.label ?? getValue(),
    },
    {
      id: "askPrice",
      header: "Ask Price",
      cell: ({ row }) => formatPrice(row.original.askPrice, row.original.askPriceUnit),
    },
    {
      id: "pricePaid",
      header: "Price Paid",
      cell: ({ row }) =>
        row.original.listingType === "RENTAL"
          ? formatPrice(row.original.rent, row.original.rentUnit)
          : formatPrice(row.original.pricePaid, row.original.pricePaidUnit),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const displayStatus = STATUS_DISPLAY[row.original.status] ?? row.original.status;
        return (
          <div className="relative inline-block">
            <select
              value={displayStatus}
              disabled={statusUpdating}
              onChange={(e) => handleStatusChange(row.original._id, e.target.value)}
              className={`appearance-none px-3 py-1.5 rounded-md text-[10px] font-bold w-28 cursor-pointer focus:outline-none disabled:opacity-60 ${STATUS_STYLES[displayStatus]}`}
            >
              {STATUS_OPTIONS_DISPLAY.map((opt) => (
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
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/customer/${row.original._id}`)}
            title="View Details"
            className="w-9 h-9 rounded-md bg-[#F2F2F2] text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Eye size={16} />
          </button>
          <a
            href={`tel:${row.original.countryCode}${row.original.contact}`}
            title="Call"
            className="w-9 h-9 rounded-md bg-[#FF6B6B] text-white flex items-center justify-center hover:bg-[#ff5252] transition-colors"
          >
            <PhoneCall size={16} />
          </a>
          <a
            href={`mailto:${row.original.email}`}
            title="Email"
            className="w-9 h-9 rounded-md bg-[#FF6B6B] text-white flex items-center justify-center hover:bg-[#ff5252] transition-colors"
          >
            <Mail size={16} />
          </a>
        </div>
      ),
    },
  ], [statusUpdating, navigate]);

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

        {/* Resale / Rental toggle */}
        <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden h-10">
          {["Resale", "Rental"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setActiveType(t);
                setSelectedAssetType("");
                setSelectedStatus("");
                setSelectedSort("");
              }}
              className={`px-6 py-1 text-sm font-medium transition-colors ${
                activeType === t ? "bg-[#FF6B6B] text-white" : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Asset Type filter */}
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
            {STATUS_OPTIONS_DISPLAY.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* Sort dropdown */}
        <div className="relative h-10">
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="h-10 appearance-none border border-gray-300 rounded-lg pl-4 pr-9 text-gray-500 text-sm hover:bg-gray-50 focus:outline-none focus:border-[#FF6B6B] cursor-pointer bg-white"
          >
            <option value="">Sort By</option>
            {SORT_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <ArrowUpDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* Add Buyer button */}
        <button
          onClick={() => navigate("/customer/add")}
          className="flex items-center gap-2 px-4 py-2 bg-[#E8453C] hover:bg-[#d03830] text-white text-sm font-semibold rounded-lg shadow-sm shadow-red-200 transition-all active:scale-95"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Buyer Details
        </button>
      </div>

      {/* ── Loading ── */}
      {listLoading && (
        <div className="flex justify-center items-center py-16">
          <span
            className="inline-block w-8 h-8 border-4 border-gray-200 rounded-full animate-spin"
            style={{ borderTopColor: "#E8453C" }}
          />
        </div>
      )}

      {/* ── Error ── */}
      {listError && !listLoading && (
        <div className="flex justify-center py-12">
          <p className="text-sm text-red-500">{listError}</p>
        </div>
      )}

      {/* ── Table ── */}
      {!listLoading && !listError && (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F2F2F2]">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th
                        key={h.id}
                        className="px-6 py-4 text-[11px] uppercase tracking-wider font-bold text-gray-500"
                      >
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-12 text-center text-sm text-gray-400"
                    >
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
              Showing{" "}
              {filteredData.length === 0 ? 0 : pageIndex * pageSize + 1}–
              {Math.min((pageIndex + 1) * pageSize, filteredData.length)} of {total} Results
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
                      pageIndex === i
                        ? "text-[#FF6B6B] bg-red-50"
                        : "text-gray-400 hover:bg-gray-50"
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
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-xs text-gray-600 focus:outline-none focus:border-[#FF6B6B]"
              >
                {[5, 10, 20].map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
}