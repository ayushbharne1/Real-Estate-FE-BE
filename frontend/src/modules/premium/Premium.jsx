import { useState } from 'react'
import { Check, CalendarDays, LayoutGrid } from 'lucide-react'

const RED = '#E8431A'

const BASIC_FEATURES = [
  '5 Enquiry Credits/Month',
  'Unlimited Inventory Listings (until 5 enquiries)',
  'Unlimited Requirement Listings (until 5 enquiries)',
  'Standard KAM Support',
]

const PREMIUM_FEATURES_MONTHLY = [
  '100 Enquiry/Month',
  'Unlimited Inventory Listings every month (no enquiry limits)',
  'Unlimited requirement listings every month (no enquiry limits)',
  'Priority KAM Access',
  'Exclusive Access to Resale Market Data and Micromarket Reports',
]

const PREMIUM_FEATURES_YEARLY = [
  '100 Enquiry/Month',
  'Unlimited Inventory Listings every month (no enquiry limits)',
  'Unlimited requirement listings every month (no enquiry limits)',
  'Priority KAM Access',
  'Exclusive Access to Resale Market Data and Micromarket Reports',
]

const Premium = () => {
  const [billing, setBilling] = useState('monthly')

  const premiumPrice   = billing === 'monthly' ? '1,250' : '14,999'
  const premiumSub     = billing === 'monthly' ? 'per month' : 'per year'
  const premiumCaption = billing === 'monthly' ? '₹14,999/Year' : '1250/Month'
  const premiumFeatures = billing === 'monthly' ? PREMIUM_FEATURES_MONTHLY : PREMIUM_FEATURES_YEARLY

  return (
    <div
      className="min-h-screen bg-white py-14 px-4"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Affordable Pricing Plan !
        </h1>
        <p className="text-gray-400 text-sm">
          Start with a free trial or unlock full access with Infinite Reality Premium.
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center mt-6 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <button
            onClick={() => setBilling('monthly')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-colors"
            style={
              billing === 'monthly'
                ? { background: RED, color: '#fff' }
                : { background: '#fff', color: '#374151' }
            }
          >
            <LayoutGrid className="w-4 h-4" />
            Monthly
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-colors"
            style={
              billing === 'yearly'
                ? { background: RED, color: '#fff' }
                : { background: '#fff', color: '#374151' }
            }
          >
            <CalendarDays className="w-4 h-4" />
            Yearly
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 max-w-3xl mx-auto">

        {/* ── Basic Card ── */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-8 flex flex-col shadow-sm">
          {/* Badge */}
          <div className="mb-5">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: `${RED}18`, color: RED }}
            >
              Current Plan
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Infinite Reality Basic</h2>
          <p className="text-sm text-gray-400 mb-5">For New Agents</p>

          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            Get Started with limited features for testing the platform
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-4xl font-black text-gray-900">₹0</span>
            <span className="text-sm text-gray-400">per year</span>
          </div>

          {/* Features */}
          <div>
            <p className="text-sm font-bold text-gray-800 mb-3">Whats Included:</p>
            <ul className="space-y-2.5">
              {BASIC_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: RED }}
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Premium Card ── */}
        <div
          className="flex-1 rounded-2xl p-8 flex flex-col shadow-lg relative overflow-hidden"
          style={{ background: RED }}
        >
          {/* Subtle dot texture */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Badge */}
          <div className="mb-5 relative">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white"
              style={{ color: RED }}>
              Recommended Plan
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white mb-1 relative">Infinite Reality Premium</h2>
          <p className="text-sm mb-5 relative" style={{ color: 'rgba(255,255,255,0.75)' }}>
            For Proffessional
          </p>

          <p className="text-sm mb-6 leading-relaxed relative" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Unlock Full Potential with additional features.
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-1 relative">
            <span className="text-4xl font-black text-white">₹{premiumPrice}</span>
            <span className="text-sm text-white/70">{premiumSub}</span>
          </div>
          <p className="text-xs mb-8 relative" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {premiumCaption}
          </p>

          {/* Features */}
          <div className="relative">
            <p className="text-sm font-bold text-white mb-3">Whats Included:</p>
            <ul className="space-y-2.5">
              {premiumFeatures.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-white/90">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(255,255,255,0.25)' }}
                  >
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <button
            className="mt-8 w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98] relative"
            style={{ background: '#fff', color: RED }}
          >
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  )
}

export default Premium