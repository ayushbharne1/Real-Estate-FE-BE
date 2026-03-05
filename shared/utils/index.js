// shared/utils/index.js
import { PriceUnit } from "../enums"

function formatPrice(value, unit) {
  if (unit === PriceUnit.CRORES) return `₹${(value / 10_000_000).toFixed(2)} Cr`;
  return `₹${(value / 100_000).toFixed(2)} L`;
}

function formatConfiguration(bedrooms, bathrooms, balconies) {
  const parts = [];
  if (bedrooms)  parts.push(`${bedrooms}BHK`);
  if (bathrooms) parts.push(`${bathrooms}B`);
  if (balconies) parts.push(`${balconies}Bal`);
  return parts.join("+") || "—";
}

function getRelativeTime(isoDate) {
  const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (diff < 3600)        return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400)       return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 86400 * 30)  return `${Math.floor(diff / 86400)} days ago`;
  return `${Math.floor(diff / (86400 * 30))} months ago`;
}

function buildGoogleMapsUrl(address, pincode) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address} ${pincode}`)}`;
}

function generatePropertyId(numericId) {
  return `PB${numericId}`;
}

function getLabelFromOptions(options, value) {
  return options.find((o) => o.value === value)?.label ?? value;
}

export{
  formatPrice, formatConfiguration, getRelativeTime,
  buildGoogleMapsUrl, generatePropertyId, getLabelFromOptions,
};