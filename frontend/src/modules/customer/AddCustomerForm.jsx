// Route: /customer/add
// Dependencies: formik, yup, lucide-react, react-router-dom

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { ASSET_TYPE_OPTIONS } from "shared/constants/dropdown.js";

/* ─────────────────────────── constants ─────────────────────────── */
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
    .oneOf(ASSET_TYPE_OPTIONS.map((o) => o.value), "Select a valid asset type")
    .required("Asset type is required"),
  status: Yup.string()
    .oneOf(STATUS_OPTIONS, "Select a valid status")
    .required("Status is required"),
  propertyType: Yup.string()
    .oneOf(["Resale", "Rental"], "Select property type")
    .required("Property type is required"),
  // Resale fields — required only when propertyType === "Resale"
  askPrice: Yup.string().when("propertyType", {
    is: "Resale",
    then: (s) =>
      s
        .matches(/^₹?[0-9]+[kKmM]?$/, "Enter a valid price (e.g. ₹75k)")
        .required("Ask price is required"),
    otherwise: (s) => s.notRequired(),
  }),
  pricePaid: Yup.string().when("propertyType", {
    is: "Resale",
    then: (s) =>
      s
        .matches(/^[0-9]+[kKmM]?$/, "Enter a valid amount (e.g. 72k)")
        .required("Price paid is required"),
    otherwise: (s) => s.notRequired(),
  }),
  // Rental fields — required only when propertyType === "Rental"
  rent: Yup.string().when("propertyType", {
    is: "Rental",
    then: (s) =>
      s
        .matches(/^₹?[0-9]+[kKmM]?$/, "Enter a valid rent (e.g. ₹75k)")
        .required("Rent is required"),
    otherwise: (s) => s.notRequired(),
  }),
  deposit: Yup.string().when("propertyType", {
    is: "Rental",
    then: (s) =>
      s
        .matches(/^[0-9]+[kKmM]?$/, "Enter a valid deposit (e.g. 72k)")
        .required("Deposit is required"),
    otherwise: (s) => s.notRequired(),
  }),
});

/* ─────────────────────────── sub-components ────────────────────── */
const inputClass =
  "w-full text-sm text-[#111827] bg-[#FAFBFC] border border-[#E5E7EB] rounded-md px-4 py-2.5 outline-none placeholder:text-[#C9CDD4]";

function Field({ label, error, touched, required, children }) {
  const hasError = touched && error;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm text-[#333333]">
        {label}
        {required && <span className="text-[#333333] ml-1">*</span>}
      </label>
      <div className="relative">
        {children}
        {hasError && (
          <p className="text-xs text-[#E8453C] mt-1">{error}</p>
        )}
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
      status: "",
      propertyType: "Resale",
      askPrice: "",
      pricePaid: "",
      rent: "",
      deposit: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      // Strip unused price fields before submitting
      const payload = {
        id: Date.now(),
        name: values.name,
        contact: values.contact,
        email: values.email,
        propertyId: values.propertyId,
        assetType: values.assetType,
        status: values.status,
        propertyType: values.propertyType,
        ...(values.propertyType === "Resale"
          ? { askPrice: values.askPrice, pricePaid: values.pricePaid }
          : { rent: values.rent, deposit: values.deposit }),
      };
      console.log("New customer:", payload);
      setSubmitting(false);
      navigate("/customer");
    },
  });

  const f = formik;
  const isResale = f.values.propertyType === "Resale";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="mx-auto px-8 py-10">
        <form onSubmit={f.handleSubmit} noValidate>
          {/* Header */}
          <div className="flex items-center justify-start gap-4 mb-8">
            <h1 className="text-3xl font-semibold text-[#111111]">Buyer Details</h1>

            {/* Resale / Rental Toggle Pill */}
            <div className="flex bg-[#F2F2F2] rounded-md overflow-hidden p-0.5">
              {["Resale", "Rental"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    f.setFieldValue("propertyType", type);
                    // Clear fields when switching types
                    if (type === "Resale") {
                      f.setFieldValue("rent", "");
                      f.setFieldValue("deposit", "");
                    } else {
                      f.setFieldValue("askPrice", "");
                      f.setFieldValue("pricePaid", "");
                    }
                  }}
                  className={`px-10 py-2 text-sm font-medium rounded-md transition-all duration-150 ${
                    f.values.propertyType === type
                      ? "bg-[#EE5352] text-white shadow-sm"
                      : "text-[#4B5563]"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            {/* Name */}
            <Field label="Name" error={f.errors.name} touched={f.touched.name} required>
              <input
                name="name"
                placeholder="Enter Name"
                className={inputClass}
                value={f.values.name}
                onChange={f.handleChange}
                onBlur={f.handleBlur}
              />
            </Field>

            {/* Contact No. with Country Code */}
            <Field label="Contact No." error={f.errors.contact} touched={f.touched.contact} required>
              <div className="flex bg-[#FAFBFC] border border-[#E5E7EB] rounded-md outline-none overflow-hidden placeholder:text-[#C9CDD4]">
                <select className="bg-transparent text-sm text-[#111827] px-4 py-2.5 outline-none cursor-pointer border-r border-[#E5E7EB]">
                  <option>+91</option>
                </select>
                <input
                  name="contact"
                  placeholder="Enter Contact No."
                  className="w-full text-sm text-[#111827] bg-transparent outline-none p-2.5"
                  value={f.values.contact}
                  onChange={f.handleChange}
                  onBlur={f.handleBlur}
                />
              </div>
            </Field>

            {/* Email ID */}
            <Field label="Email ID" error={f.errors.email} touched={f.touched.email} required>
              <input
                name="email"
                placeholder="Enter Email Id"
                type="email"
                className={inputClass}
                value={f.values.email}
                onChange={f.handleChange}
                onBlur={f.handleBlur}
              />
            </Field>

            {/* Property ID */}
            <Field label="Property ID" error={f.errors.propertyId} touched={f.touched.propertyId} required>
              <input
                name="propertyId"
                placeholder="Enter Property ID"
                className={inputClass}
                value={f.values.propertyId}
                onChange={f.handleChange}
                onBlur={f.handleBlur}
              />
            </Field>

            {/* Asset Type Dropdown — uses shared ASSET_TYPE_OPTIONS */}
            <Field label="Asset Type" error={f.errors.assetType} touched={f.touched.assetType} required>
              <select
                name="assetType"
                className={`${inputClass} appearance-none cursor-pointer pr-10`}
                value={f.values.assetType}
                onChange={f.handleChange}
                onBlur={f.handleBlur}
              >
                <option value="">Select Type</option>
                {ASSET_TYPE_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
            </Field>

            {/* Dynamic Pricing Fields */}
            {isResale ? (
              <>
                {/* Ask Price */}
                <Field label="Ask Price" error={f.errors.askPrice} touched={f.touched.askPrice} required>
                  <div className="flex bg-[#FAFBFC] border border-[#E5E7EB] rounded-md outline-none overflow-hidden placeholder:text-[#C9CDD4]">
                    <input
                      name="askPrice"
                      placeholder="Enter Price"
                      className="w-full text-sm text-[#111827] bg-transparent outline-none p-2.5"
                      value={f.values.askPrice}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                    />
                    <div className="relative">
                      <select className="bg-[#EAEBED] text-sm text-[#333333] px-10 py-2.5 outline-none cursor-pointer border-l border-[#E5E7EB] appearance-none">
                        <option>Thousands</option>
                        <option>Lakhs</option>
                        <option>Crores</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333333] pointer-events-none" />
                    </div>
                  </div>
                </Field>

                {/* Price Paid */}
                <Field label="Price Paid" error={f.errors.pricePaid} touched={f.touched.pricePaid} required>
                  <div className="flex bg-[#FAFBFC] border border-[#E5E7EB] rounded-md outline-none overflow-hidden placeholder:text-[#C9CDD4]">
                    <input
                      name="pricePaid"
                      placeholder="Enter Price"
                      className="w-full text-sm text-[#111827] bg-transparent outline-none p-2.5"
                      value={f.values.pricePaid}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                    />
                    <div className="relative">
                      <select className="bg-[#EAEBED] text-sm text-[#333333] px-10 py-2.5 outline-none cursor-pointer border-l border-[#E5E7EB] appearance-none">
                        <option>Thousands</option>
                        <option>Lakhs</option>
                        <option>Crores</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333333] pointer-events-none" />
                    </div>
                  </div>
                </Field>
              </>
            ) : (
              <>
                {/* Rent */}
                <Field label="Rent" error={f.errors.rent} touched={f.touched.rent} required>
                  <div className="flex bg-[#FAFBFC] border border-[#E5E7EB] rounded-md outline-none overflow-hidden placeholder:text-[#C9CDD4]">
                    <input
                      name="rent"
                      placeholder="Enter Price"
                      className="w-full text-sm text-[#111827] bg-transparent outline-none p-2.5"
                      value={f.values.rent}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                    />
                    <div className="relative">
                      <select className="bg-[#EAEBED] text-sm text-[#333333] px-10 py-2.5 outline-none cursor-pointer border-l border-[#E5E7EB] appearance-none">
                        <option>Thousands</option>
                        <option>Lakhs</option>
                        <option>Crores</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333333] pointer-events-none" />
                    </div>
                  </div>
                </Field>

                {/* Deposit */}
                <Field label="Deposit" error={f.errors.deposit} touched={f.touched.deposit} required>
                  <div className="flex bg-[#FAFBFC] border border-[#E5E7EB] rounded-md outline-none overflow-hidden placeholder:text-[#C9CDD4]">
                    <input
                      name="deposit"
                      placeholder="Enter Price"
                      className="w-full text-sm text-[#111827] bg-transparent outline-none p-2.5"
                      value={f.values.deposit}
                      onChange={f.handleChange}
                      onBlur={f.handleBlur}
                    />
                    <div className="relative">
                      <select className="bg-[#EAEBED] text-sm text-[#333333] px-10 py-2.5 outline-none cursor-pointer border-l border-[#E5E7EB] appearance-none">
                        <option>Thousands</option>
                        <option>Lakhs</option>
                        <option>Crores</option>
                      </select>
                      <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333333] pointer-events-none" />
                    </div>
                  </div>
                </Field>
              </>
            )}

            {/* Status Dropdown */}
            <Field label="Status" error={f.errors.status} touched={f.touched.status} required>
              <select
                name="status"
                className={`${inputClass} appearance-none cursor-pointer pr-10 text-[#C9CDD4]`}
                value={f.values.status}
                onChange={f.handleChange}
                onBlur={f.handleBlur}
              >
                <option value="">Select</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s} className="text-[#111827]">{s}</option>
                ))}
              </select>
              <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
            </Field>
          </div>

          {/* ADD Button */}
          <div className="flex justify-end mt-12">
            <button
              type="submit"
              disabled={f.isSubmitting}
              className="px-16 py-3 bg-[#EE5352] hover:bg-[#EE5352] text-white text-sm font-semibold rounded-md shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              ADD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}