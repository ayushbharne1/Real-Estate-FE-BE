// Route: /customer/:id
// Dependencies: lucide-react, react-router-dom, react-redux

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBuyer,
  clearCurrent,
  selectCurrentBuyer,
  selectDetailLoading,
  selectDetailError,
} from "../../redux/slices/buyerSlice";
import {
  ArrowLeft, Phone, Mail, User, Building2,
  Hash, Tag, IndianRupee, Wallet, BadgeCheck,
  Calendar, RefreshCw, PhoneCall,
} from "lucide-react";
import { ASSET_TYPE_OPTIONS } from "shared/constants/dropdown.js";
import { formatPriceExtended as formatPrice } from 'shared/utils/index.js'

/* ─────────────────────────── constants ─────────────────────────── */
const RED = "#EE5352";

const STATUS_DISPLAY = {
  IN_PROGRESS: "In Progress",
  ACTIVE: "Active",
  CANCELLED: "Cancelled",
};

const STATUS_STYLES = {
  IN_PROGRESS: "bg-[#FFF4D3] text-[#F39C12]",
  ACTIVE: "bg-[#D9F9E6] text-[#2ECC71]",
  CANCELLED: "bg-[#FFD5D5] text-[#FF5B5B]",
};

const UNIT_LABEL = {
  THOUSANDS: "K",
  LAKHS: "L",
  CRORES: "Cr",
};

 

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* ─────────────────────────── sub-components ────────────────────── */
const SectionTitle = ({ children }) => (
  <h3
    className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 mb-4"
    style={{ borderBottom: `2px solid ${RED}`, display: "inline-block" }}
  >
    {children}
  </h3>
);

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{ background: `${RED}18` }}
    >
      <Icon className="w-4 h-4" style={{ color: RED }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-semibold truncate">{value || "—"}</p>
    </div>
  </div>
);

const InfoBadge = ({ label, value, highlight }) => (
  <div
    className="rounded-xl px-4 py-3 border"
    style={
      highlight
        ? { background: `${RED}0D`, borderColor: `${RED}40` }
        : { background: "#F9FAFB", borderColor: "#E5E7EB" }
    }
  >
    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-1">{label}</p>
    <p
      className="text-base font-bold"
      style={{ color: highlight ? RED : "#111827" }}
    >
      {value}
    </p>
  </div>
);

/* ─────────────────────────── main page ─────────────────────────── */
export default function BuyerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const buyer = useSelector(selectCurrentBuyer);
  const loading = useSelector(selectDetailLoading);
  const error = useSelector(selectDetailError);

  useEffect(() => {
    if (id) dispatch(fetchBuyer(id));
    return () => { dispatch(clearCurrent()); };
  }, [id, dispatch]);

  /* ── loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <span
            className="inline-block w-9 h-9 border-4 border-gray-200 rounded-full animate-spin"
            style={{ borderTopColor: RED }}
          />
          <p className="text-sm text-gray-400">Loading buyer details…</p>
        </div>
      </div>
    );
  }

  /* ── error ── */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-center px-6">
        <div>
          <p className="text-lg font-bold text-gray-800 mb-2">Could not load buyer</p>
          <p className="text-sm text-gray-500 mb-5">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-sm font-semibold px-5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  if (!buyer) return null;

  const isResale = buyer.listingType === "RESALE";
  const assetLabel = ASSET_TYPE_OPTIONS.find(o => o.value === buyer.assetType)?.label ?? buyer.assetType;
  const statusKey = buyer.status;
  const statusLabel = STATUS_DISPLAY[statusKey] ?? statusKey;

  return (
    <div className="min-h-screen bg-[#F8F9FA]" style={{ fontFamily: "Arial, sans-serif" }}>

      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#111111]">Buyer Details</h1>
            <p className="text-xs text-gray-400 mt-0.5">ID: {buyer._id}</p>
          </div>
        </div>

        {/* Status badge + action buttons */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${STATUS_STYLES[statusKey] ?? "bg-gray-100 text-gray-500"}`}
          >
            {statusLabel}
          </span>
          <a
            href={`tel:${buyer.countryCode}${buyer.contact}`}
            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition-all active:scale-95 shadow-sm"
            style={{ background: RED }}
          >
            <PhoneCall size={15} />
            Call
          </a>
          <a
            href={`mailto:${buyer.email}`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Mail size={15} />
            Email
          </a>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-8 py-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-6">

          {/* ── LEFT: Contact Card ── */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Avatar header */}
              <div className="px-6 pt-8 pb-6 text-center" style={{ background: `linear-gradient(135deg, ${RED}15, ${RED}05)` }}>
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-sm"
                  style={{ background: RED }}
                >
                  {buyer.name?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <h2 className="text-base font-bold text-gray-900">{buyer.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {isResale ? "Resale Buyer" : "Rental Buyer"}
                </p>
              </div>

              {/* Contact details */}
              <div className="px-6 py-5 flex flex-col gap-4">
                <DetailRow
                  icon={Phone}
                  label="Contact No."
                  value={`${buyer.countryCode} ${buyer.contact}`}
                />

                {buyer.alternateContact && (
                  <DetailRow
                    icon={Phone}
                    label="Alternate Contact"
                    value={`${buyer.countryCode} ${buyer.alternateContact}`}
                  />
                )}
                <DetailRow
                  icon={Mail}
                  label="Email Address"
                  value={buyer.email}
                />
                <DetailRow
                  icon={Calendar}
                  label="Registered On"
                  value={formatDate(buyer.createdAt)}
                />
                <DetailRow
                  icon={RefreshCw}
                  label="Last Updated"
                  value={formatDate(buyer.updatedAt)}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Property + Pricing ── */}
          <div className="col-span-2 flex flex-col gap-6">

            {/* Property Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-6">
              <SectionTitle>Property Information</SectionTitle>
              <div className="grid grid-cols-2 gap-x-8 gap-y-5 mt-2">
                <DetailRow
                  icon={Hash}
                  label="Property ID"
                  value={buyer.propertyId}
                />
                <DetailRow
                  icon={Tag}
                  label="Listing Type"
                  value={isResale ? "Resale" : "Rental"}
                />
                <DetailRow
                  icon={Building2}
                  label="Asset Type"
                  value={assetLabel}
                />
                <DetailRow
                  icon={BadgeCheck}
                  label="Status"
                  value={statusLabel}
                />
              </div>
            </div>

            {/* Pricing Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-6">
              <SectionTitle>{isResale ? "Pricing" : "Rental Terms"}</SectionTitle>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {isResale ? (
                  <>
                    <InfoBadge
                      label="Ask Price"
                      value={formatPrice(buyer.askPrice, buyer.askPriceUnit)}
                      highlight
                    />
                    <InfoBadge
                      label="Price Paid"
                      value={formatPrice(buyer.pricePaid, buyer.pricePaidUnit)}
                    />
                  </>
                ) : (
                  <>
                    <InfoBadge
                      label="Monthly Rent"
                      value={formatPrice(buyer.rent, buyer.rentUnit)}
                      highlight
                    />
                    <InfoBadge
                      label="Security Deposit"
                      value={formatPrice(buyer.deposit, buyer.depositUnit)}
                    />
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}