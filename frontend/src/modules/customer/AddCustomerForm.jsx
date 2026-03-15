// Route: /customer/add
// Dependencies: formik, yup, lucide-react, react-router-dom

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  User, Phone, Mail, Hash, Building2,
  IndianRupee, Tag, ArrowLeft, CheckCircle2,
} from "lucide-react";

/* ─────────────────────────── constants ─────────────────────────── */
const ASSET_TYPES = [
  "Commercial Space",
  "Commercial Land",
  "Office Space",
  "Retail Space",
  "Apartment",
  "Villa",
  "Plot",
];

const STATUS_OPTIONS = ["In Progress", "Active", "Cancelled"];

/* ─────────────────────────── validation ────────────────────────── */
const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name is too long")
    .required("Name is required"),
  contact: Yup.string()
    .matches(/^\+?[0-9\-\s]{7,15}$/, "Enter a valid contact number")
    .required("Contact number is required"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("Email is required"),
  propertyId: Yup.string()
    .matches(/^[A-Z]{2}[0-9]{4}$/, "Format: 2 letters + 4 digits (e.g. PB5609)")
    .required("Property ID is required"),
  assetType: Yup.string()
    .oneOf(ASSET_TYPES, "Select a valid asset type")
    .required("Asset type is required"),
  status: Yup.string()
    .oneOf(STATUS_OPTIONS, "Select a valid status")
    .required("Status is required"),
  askPrice: Yup.string()
    .matches(/^₹?[0-9]+[kKmM]?$/, "Enter a valid price (e.g. ₹75k)")
    .required("Ask price is required"),
  pricePaid: Yup.string()
    .matches(/^[0-9]+[kKmM]?$/, "Enter a valid amount (e.g. 72k)")
    .required("Price paid is required"),
  rent: Yup.string()
    .matches(/^₹?[0-9]+[kKmM]?$/, "Enter a valid rent (e.g. ₹75k)")
    .required("Rent is required"),
  deposit: Yup.string()
    .matches(/^[0-9]+[kKmM]?$/, "Enter a valid deposit (e.g. 72k)")
    .required("Deposit is required"),
});

/* ─────────────────────────── sub-components ────────────────────── */
const inputBase =
  "flex-1 text-sm text-[#111827] bg-transparent outline-none placeholder:text-[#C9CDD4]";

function Field({ label, error, touched, icon: Icon, required, children }) {
  const hasError = touched && error;
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1 text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
        {label}
        {required && <span className="text-[#E8453C]">*</span>}
      </label>
      <div
        className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-3 transition-all duration-150 bg-white ${
          hasError
            ? "border-[#E8453C] ring-2 ring-[#E8453C]/10 bg-[#FFF8F8]"
            : "border-[#E5E7EB] focus-within:border-[#E8453C] focus-within:ring-2 focus-within:ring-[#E8453C]/10"
        }`}
      >
        {Icon && (
          <Icon
            size={15}
            className={`shrink-0 ${hasError ? "text-[#E8453C]" : "text-[#9CA3AF]"}`}
          />
        )}
        {children}
      </div>
      {hasError && (
        <p className="flex items-center gap-1.5 text-xs text-[#E8453C]">
          <span className="w-1 h-1 rounded-full bg-[#E8453C] shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function SectionHeading({ step, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-7 h-7 rounded-full bg-[#E8453C] text-white text-xs font-bold flex items-center justify-center shrink-0">
        {step}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#111827]">{title}</h3>
        <p className="text-xs text-[#9CA3AF]">{subtitle}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── main page ─────────────────────────── */
export default function AddCustomerForm() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      contact: "",
      email: "",
      propertyId: "",
      assetType: "",
      status: "In Progress",
      askPrice: "",
      pricePaid: "",
      rent: "",
      deposit: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      // Replace with your actual submit logic / API call
      console.log("New customer:", { ...values, id: Date.now() });
      setSubmitting(false);
      navigate("/customer");
    },
  });

  const f = formik;

  return (
    <div
      className="min-h-screen bg-[#F5F6FA]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/customer")}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E5E7EB] hover:bg-[#F3F4F6] transition-all text-[#6B7280]"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-base font-semibold text-[#111827]">Add New Customer</h1>
            <p className="text-xs text-[#9CA3AF]">customer / add</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/customer")}
            className="px-4 py-2 text-sm font-medium text-[#6B7280] border border-[#E5E7EB] rounded-xl bg-white hover:bg-[#F3F4F6] transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={f.handleSubmit}
            disabled={f.isSubmitting}
            className="flex items-center gap-2 px-5 py-2 bg-[#E8453C] hover:bg-[#d03830] text-white text-sm font-semibold rounded-xl shadow-sm shadow-red-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            <CheckCircle2 size={15} />
            Save Customer
          </button>
        </div>
      </div>

      {/* ── Page Body ── */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={f.handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT COLUMN (2/3) ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Card 1 — Personal Information */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                <SectionHeading
                  step="1"
                  title="Personal Information"
                  subtitle="Basic contact details of the customer"
                />
                <div className="flex flex-col gap-4">
                  <Field
                    label="Full Name"
                    error={f.errors.name}
                    touched={f.touched.name}
                    icon={User}
                    required
                  >
                    <input
                      name="name"
                      placeholder="e.g. Shivani Sharma"
                      className={inputBase}
                      value={f.values.name}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field
                      label="Contact No."
                      error={f.errors.contact}
                      touched={f.touched.contact}
                      icon={Phone}
                      required
                    >
                      <input
                        name="contact"
                        placeholder="+91-9632587410"
                        className={inputBase}
                        value={f.values.contact}
                        onChange={f.handleChange}
                        onBlur={f.handleBlur}
                      />
                    </Field>

                    <Field
                      label="Status"
                      error={f.errors.status}
                      touched={f.touched.status}
                      icon={Tag}
                      required
                    >
                      <select
                        name="status"
                        className={`${inputBase} cursor-pointer`}
                        value={f.values.status}
                        onChange={f.handleChange}
                        onBlur={f.handleBlur}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field
                    label="Email Address"
                    error={f.errors.email}
                    touched={f.touched.email}
                    icon={Mail}
                    required
                  >
                    <input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className={inputBase}
                      value={f.values.email}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                    />
                  </Field>
                </div>
              </div>

              {/* Card 2 — Property Details */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                <SectionHeading
                  step="2"
                  title="Property Details"
                  subtitle="Information about the linked property"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Property ID"
                    error={f.errors.propertyId}
                    touched={f.touched.propertyId}
                    icon={Hash}
                    required
                  >
                    <input
                      name="propertyId"
                      placeholder="PB5609"
                      className={`${inputBase} uppercase`}
                      value={f.values.propertyId}
                      onChange={(e) =>
                        f.setFieldValue("propertyId", e.target.value.toUpperCase())
                      }
                      onBlur={f.handleBlur}
                    />
                  </Field>

                  <Field
                    label="Asset Type"
                    error={f.errors.assetType}
                    touched={f.touched.assetType}
                    icon={Building2}
                    required
                  >
                    <select
                      name="assetType"
                      className={`${inputBase} cursor-pointer`}
                      value={f.values.assetType}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                    >
                      <option value="">Select type</option>
                      {ASSET_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* Card 3 — Pricing */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
                <SectionHeading
                  step="3"
                  title="Pricing Details"
                  subtitle="Enter both resale and rental pricing"
                />

                {/* Resale */}
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                  Resale
                </p>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <Field
                    label="Ask Price"
                    error={f.errors.askPrice}
                    touched={f.touched.askPrice}
                    icon={IndianRupee}
                    required
                  >
                    <input
                      name="askPrice"
                      placeholder="₹75k"
                      className={inputBase}
                      value={f.values.askPrice}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                    />
                  </Field>

                  <Field
                    label="Price Paid"
                    error={f.errors.pricePaid}
                    touched={f.touched.pricePaid}
                    icon={IndianRupee}
                    required
                  >
                    <input
                      name="pricePaid"
                      placeholder="72k"
                      className={inputBase}
                      value={f.values.pricePaid}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                    />
                  </Field>
                </div>

                {/* Rental */}
                <div className="border-t border-dashed border-[#E5E7EB] mb-5" />
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3">
                  Rental
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Rent"
                    error={f.errors.rent}
                    touched={f.touched.rent}
                    icon={IndianRupee}
                    required
                  >
                    <input
                      name="rent"
                      placeholder="₹75k"
                      className={inputBase}
                      value={f.values.rent}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                    />
                  </Field>

                  <Field
                    label="Deposit"
                    error={f.errors.deposit}
                    touched={f.touched.deposit}
                    icon={IndianRupee}
                    required
                  >
                    <input
                      name="deposit"
                      placeholder="72k"
                      className={inputBase}
                      value={f.values.deposit}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN (1/3) ── */}
            <div className="flex flex-col gap-6">

              {/* Summary Card */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sticky top-24">
                <h3 className="text-sm font-semibold text-[#111827] mb-4">Form Summary</h3>

                <div className="flex flex-col gap-3">
                  {[
                    { label: "Name",        value: f.values.name },
                    { label: "Contact",     value: f.values.contact },
                    { label: "Email",       value: f.values.email },
                    { label: "Property ID", value: f.values.propertyId },
                    { label: "Asset Type",  value: f.values.assetType },
                    { label: "Status",      value: f.values.status },
                    { label: "Ask Price",   value: f.values.askPrice },
                    { label: "Price Paid",  value: f.values.pricePaid },
                    { label: "Rent",        value: f.values.rent },
                    { label: "Deposit",     value: f.values.deposit },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-[#9CA3AF]">{label}</span>
                      <span
                        className={`text-xs font-medium text-right truncate max-w-[130px] ${
                          value ? "text-[#111827]" : "text-[#D1D5DB]"
                        }`}
                      >
                        {value || "—"}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-[#F3F4F6] pt-4">
                  {/* Progress indicator */}
                  {(() => {
                    const fields = [
                      f.values.name, f.values.contact, f.values.email,
                      f.values.propertyId, f.values.assetType, f.values.status,
                      f.values.askPrice, f.values.pricePaid, f.values.rent, f.values.deposit,
                    ];
                    const filled = fields.filter(Boolean).length;
                    const pct = Math.round((filled / fields.length) * 100);
                    return (
                      <>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-[#9CA3AF]">Form completion</span>
                          <span className="text-xs font-semibold text-[#E8453C]">{pct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#E8453C] rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>

                <button
                  type="button"
                  onClick={f.handleSubmit}
                  disabled={f.isSubmitting}
                  className="mt-4 w-full py-2.5 bg-[#E8453C] hover:bg-[#d03830] text-white text-sm font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 shadow-sm shadow-red-200"
                >
                  Save Customer
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/customer")}
                  className="mt-2 w-full py-2.5 border border-[#E5E7EB] text-[#6B7280] text-sm font-medium rounded-xl hover:bg-[#F3F4F6] transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}