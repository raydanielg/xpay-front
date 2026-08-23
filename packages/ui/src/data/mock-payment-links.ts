export interface PaymentLinkRecord {
  id: string
  reference: string
  fullReference: string
  merchantProfile: string
  amount: string
  customer: string
  status: "unpaid" | "completed" | "expired"
  paymentMethods?: string
  description?: string
  createdAt: string
  expiresAt?: string
  customerEmail?: string
  link?: string
  metadata?: {
    paymentId?: string
    planId?: string
    restaurantId?: string
  }
}

export const mockPaymentRecords: PaymentLinkRecord[] = [
  {
    id: "1",
    reference: "PAY178545611...",
    fullReference: "PAY17854561181590356",
    merchantProfile: "SalamaPay",
    amount: "TSh 1,000",
    customer: "-",
    customerEmail: "airezra2@gmail.com",
    status: "unpaid",
    paymentMethods: "mobile money",
    description: "Subscription: Basic",
    createdAt: "31 Jul 2026, 03:01",
    expiresAt: "31 Jul 2026, 04:01",
    link: "https://salamapay.com",
    metadata: { paymentId: "5", planId: "2", restaurantId: "1" },
  },
  {
    id: "2",
    reference: "PAY177660605...",
    fullReference: "PAY17766060589123490",
    merchantProfile: "SalamaPay",
    amount: "TSh 50,000",
    customer: "-",
    customerEmail: "sarah.wilson@example.com",
    status: "unpaid",
    paymentMethods: "mobile money, card",
    description: "Annual Subscription: Pro",
    createdAt: "19 Apr 2026, 16:40",
    expiresAt: "19 Apr 2026, 17:40",
    metadata: { paymentId: "12", planId: "4", restaurantId: "1" },
  },
  {
    id: "3",
    reference: "PAY177341881...",
    fullReference: "PAY17734188190283411",
    merchantProfile: "SalamaPay",
    amount: "TSh 1,000",
    customer: "-",
    customerEmail: "guest@xpay.com",
    status: "unpaid",
    paymentMethods: "mobile money",
    description: "Quick payment invoice",
    createdAt: "13 Mar 2026, 19:20",
    expiresAt: "13 Mar 2026, 20:20",
    metadata: { paymentId: "15", planId: "1", restaurantId: "2" },
  },
  {
    id: "4",
    reference: "PAY177338727...",
    fullReference: "PAY17733872783948190",
    merchantProfile: "SalamaPay",
    amount: "TSh 2,000",
    customer: "Euphemia Vitus Joseph",
    customerEmail: "euphemia.v@gmail.com",
    status: "completed",
    paymentMethods: "mobile money",
    description: "Restaurant Table Order #42",
    createdAt: "13 Mar 2026, 10:34",
    expiresAt: "13 Mar 2026, 11:34",
    metadata: { paymentId: "21", planId: "2", restaurantId: "3" },
  },
  {
    id: "5",
    reference: "PAY177322187...",
    fullReference: "PAY17732218712398455",
    merchantProfile: "SalamaPay",
    amount: "TSh 10,000",
    customer: "-",
    customerEmail: "customer@example.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "Lunch Special Voucher",
    createdAt: "11 Mar 2026, 12:37",
    expiresAt: "11 Mar 2026, 13:37",
    metadata: { paymentId: "32", planId: "1", restaurantId: "1" },
  },
  {
    id: "6",
    reference: "PAY177322116...",
    fullReference: "PAY17732211698234100",
    merchantProfile: "SalamaPay",
    amount: "TSh 100,000",
    customer: "-",
    customerEmail: "customer@example.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "Catering Deposit",
    createdAt: "11 Mar 2026, 12:26",
    expiresAt: "11 Mar 2026, 13:26",
    metadata: { paymentId: "33", planId: "3", restaurantId: "1" },
  },
  {
    id: "7",
    reference: "PAY177322058...",
    fullReference: "PAY17732205845612399",
    merchantProfile: "SalamaPay",
    amount: "TSh 200,000",
    customer: "-",
    customerEmail: "finance@xpay.com",
    status: "expired",
    paymentMethods: "mobile money, card",
    description: "Bulk Reservation",
    createdAt: "11 Mar 2026, 12:16",
    expiresAt: "11 Mar 2026, 13:16",
    metadata: { paymentId: "34", planId: "5", restaurantId: "2" },
  },
  {
    id: "8",
    reference: "PAY177322058...",
    fullReference: "PAY17732205898765412",
    merchantProfile: "SalamaPay",
    amount: "TSh 500,000",
    customer: "-",
    customerEmail: "client@corporate.tz",
    status: "unpaid",
    paymentMethods: "mobile money, bank",
    description: "Corporate Dinner Package",
    createdAt: "11 Mar 2026, 12:16",
    expiresAt: "11 Mar 2026, 13:16",
    metadata: { paymentId: "35", planId: "6", restaurantId: "1" },
  },
  {
    id: "9",
    reference: "PAY177321963...",
    fullReference: "PAY17732196323456788",
    merchantProfile: "SalamaPay",
    amount: "TSh 100,000",
    customer: "-",
    customerEmail: "support@xpay.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "Event Ticket Deposit",
    createdAt: "11 Mar 2026, 12:00",
    expiresAt: "11 Mar 2026, 13:00",
    metadata: { paymentId: "36", planId: "2", restaurantId: "1" },
  },
  {
    id: "10",
    reference: "PAY177321920...",
    fullReference: "PAY17732192087654321",
    merchantProfile: "SalamaPay",
    amount: "TSh 100,000",
    customer: "-",
    customerEmail: "info@xpay.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "VIP Section Access",
    createdAt: "11 Mar 2026, 11:53",
    expiresAt: "11 Mar 2026, 12:53",
    metadata: { paymentId: "37", planId: "2", restaurantId: "1" },
  },
  {
    id: "11",
    reference: "PAY177321891...",
    fullReference: "PAY17732189112345678",
    merchantProfile: "SalamaPay",
    amount: "TSh 500,000",
    customer: "-",
    customerEmail: "orders@xpay.com",
    status: "expired",
    paymentMethods: "mobile money, bank",
    description: "Monthly Service Fee",
    createdAt: "11 Mar 2026, 11:48",
    expiresAt: "11 Mar 2026, 12:48",
    metadata: { paymentId: "38", planId: "6", restaurantId: "2" },
  },
  {
    id: "12",
    reference: "PAY177321791...",
    fullReference: "PAY17732179165432100",
    merchantProfile: "SalamaPay",
    amount: "TSh 500,000",
    customer: "-",
    customerEmail: "sales@xpay.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "Software License Fee",
    createdAt: "11 Mar 2026, 11:31",
    expiresAt: "11 Mar 2026, 12:31",
    metadata: { paymentId: "39", planId: "6", restaurantId: "1" },
  },
  {
    id: "13",
    reference: "PAY177321723...",
    fullReference: "PAY17732172378901234",
    merchantProfile: "SalamaPay",
    amount: "TSh 100,000",
    customer: "Geofrey peleus",
    customerEmail: "geofrey.p@outlook.com",
    status: "completed",
    paymentMethods: "mobile money",
    description: "Consulting Hour",
    createdAt: "11 Mar 2026, 11:20",
    expiresAt: "11 Mar 2026, 12:20",
    metadata: { paymentId: "40", planId: "3", restaurantId: "3" },
  },
  {
    id: "14",
    reference: "PAY177321700...",
    fullReference: "PAY17732170034567890",
    merchantProfile: "SalamaPay",
    amount: "TSh 50,000",
    customer: "-",
    customerEmail: "guest@xpay.com",
    status: "expired",
    paymentMethods: "mobile money",
    description: "Menu Bundle Special",
    createdAt: "11 Mar 2026, 11:16",
    expiresAt: "11 Mar 2026, 12:16",
    metadata: { paymentId: "41", planId: "2", restaurantId: "1" },
  },
  {
    id: "15",
    reference: "PAY177321680...",
    fullReference: "PAY17732168090123456",
    merchantProfile: "SalamaPay",
    amount: "TSh 150,000",
    customer: "-",
    customerEmail: "inquiries@xpay.com",
    status: "unpaid",
    paymentMethods: "mobile money",
    description: "Beverage Package",
    createdAt: "11 Mar 2026, 11:13",
    expiresAt: "11 Mar 2026, 12:13",
    metadata: { paymentId: "42", planId: "4", restaurantId: "2" },
  },
  {
    id: "16",
    reference: "PAY177321675...",
    fullReference: "PAY17732167556789012",
    merchantProfile: "SalamaPay",
    amount: "TSh 50,000",
    customer: "-",
    customerEmail: "billing@xpay.com",
    status: "unpaid",
    paymentMethods: "mobile money",
    description: "Delivery fee deposit",
    createdAt: "11 Mar 2026, 11:12",
    expiresAt: "11 Mar 2026, 12:12",
    metadata: { paymentId: "43", planId: "2", restaurantId: "1" },
  },
  {
    id: "17",
    reference: "PAY177321663...",
    fullReference: "PAY17732166312378900",
    merchantProfile: "SalamaPay",
    amount: "TSh 300,000",
    customer: "Mark Bwemo",
    customerEmail: "mark.bwemo@gmail.com",
    status: "completed",
    paymentMethods: "mobile money, card",
    description: "Private Dining Reservation",
    createdAt: "11 Mar 2026, 11:10",
    expiresAt: "11 Mar 2026, 12:10",
    metadata: { paymentId: "44", planId: "5", restaurantId: "1" },
  },
  {
    id: "18",
    reference: "PAY177321172...",
    fullReference: "PAY17732117289012345",
    merchantProfile: "SalamaPay",
    amount: "TSh 1,000",
    customer: "Joas Maugo",
    customerEmail: "joas.m@yahoo.com",
    status: "completed",
    paymentMethods: "mobile money",
    description: "Coffee & Pastry",
    createdAt: "11 Mar 2026, 09:48",
    expiresAt: "11 Mar 2026, 10:48",
    metadata: { paymentId: "45", planId: "1", restaurantId: "1" },
  },
  {
    id: "19",
    reference: "PAY177321127...",
    fullReference: "PAY17732112745678901",
    merchantProfile: "SalamaPay",
    amount: "TSh 1,000",
    customer: "Joseph Gembe Msuya",
    customerEmail: "gembe.m@gmail.com",
    status: "completed",
    paymentMethods: "mobile money",
    description: "Quick snack order",
    createdAt: "11 Mar 2026, 09:41",
    expiresAt: "11 Mar 2026, 10:41",
    metadata: { paymentId: "46", planId: "1", restaurantId: "1" },
  },
  {
    id: "20",
    reference: "PAY177321050...",
    fullReference: "PAY17732105012345678",
    merchantProfile: "SalamaPay",
    amount: "TSh 1,000",
    customer: "Air Ezra",
    customerEmail: "airezra2@gmail.com",
    status: "completed",
    paymentMethods: "mobile money",
    description: "Subscription: Basic",
    createdAt: "11 Mar 2026, 09:28",
    expiresAt: "11 Mar 2026, 10:28",
    metadata: { paymentId: "5", planId: "2", restaurantId: "1" },
  },
  {
    id: "21",
    reference: "PAY178590001...",
    fullReference: "PAY17859000123456789",
    merchantProfile: "Eric Kweyunga",
    amount: "TSh 1,000",
    customer: "-",
    customerEmail: "supporter@example.com",
    status: "unpaid",
    paymentMethods: "mobile money",
    description: "Please buy me a coffee",
    createdAt: "23 Aug 2026, 14:00",
    expiresAt: "24 Aug 2026, 14:00",
    link: "https://github.com/erickweyunga",
    metadata: { paymentId: "51", planId: "1", restaurantId: "1" },
  },
  {
    id: "22",
    reference: "PAY178590002...",
    fullReference: "PAY17859000234567890",
    merchantProfile: "Pius Justus",
    amount: "TSh 19,999",
    customer: "-",
    customerEmail: "buyer@example.com",
    status: "unpaid",
    paymentMethods: "mobile money",
    description: "Mwongozo wa Biashara ya Uwakala",
    createdAt: "23 Aug 2026, 15:00",
    expiresAt: "24 Aug 2026, 15:00",
    link: "https://wa.me/255712345678",
    metadata: { paymentId: "52", planId: "1", restaurantId: "1" },
  },
]

export interface MerchantProfile {
  id: string
  name: string
  slug: string
  logo: string
  description: string
  accentColor: string
  paymentMethods: string[]
  checkoutUrl: string
  status: "active" | "draft"
  createdAt: string
  totalPayments: number
  totalRevenue: string
}

export const mockMerchantProfiles: MerchantProfile[] = [
  {
    id: "mp1",
    name: "SalamaPay",
    slug: "salamapay",
    logo: "/pay-per-click.png",
    description: "Primary merchant profile for SalamaPay checkout",
    accentColor: "#10b981",
    paymentMethods: ["Mobile Money"],
    checkoutUrl: "/pay/salamapay",
    status: "active",
    createdAt: "31 Jul 2026",
    totalPayments: 18,
    totalRevenue: "TSh 1,064,000",
  },
  {
    id: "mp2",
    name: "Eric Kweyunga",
    slug: "eric-kweyunga",
    logo: "/pay-per-click.png",
    description: "Personal checkout for creator donations",
    accentColor: "#2563eb",
    paymentMethods: ["Mobile Money"],
    checkoutUrl: "/pay/eric-kweyunga",
    status: "active",
    createdAt: "23 Aug 2026",
    totalPayments: 1,
    totalRevenue: "TSh 1,000",
  },
  {
    id: "mp3",
    name: "Pius Justus",
    slug: "pius-justus",
    logo: "/pay-per-click.png",
    description: "Mwongozo wa Biashara ya Uwakala",
    accentColor: "#7c3aed",
    paymentMethods: ["Mobile Money"],
    checkoutUrl: "/pay/pius-justus",
    status: "active",
    createdAt: "23 Aug 2026",
    totalPayments: 1,
    totalRevenue: "TSh 19,999",
  },
  {
    id: "mp4",
    name: "XPay Store",
    slug: "xpay-store",
    logo: "/pay-per-click.png",
    description: "Default store profile for general payments",
    accentColor: "#e11d48",
    paymentMethods: ["Mobile Money", "Card"],
    checkoutUrl: "/pay/xpay-store",
    status: "draft",
    createdAt: "15 Aug 2026",
    totalPayments: 0,
    totalRevenue: "TSh 0",
  },
]

export function profileSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getPaymentLinkBySlug(slug: string): PaymentLinkRecord {
  const decoded = decodeURIComponent(slug).trim().toLowerCase()

  // 1. Match by slugified merchant profile name (e.g. "salamapay" -> "SalamaPay")
  const byProfile = mockPaymentRecords.find(
    (item) => profileSlug(item.merchantProfile) === decoded
  )
  if (byProfile) {
    return byProfile
  }

  // 2. Match by full reference, id, or truncated reference
  const found = mockPaymentRecords.find(
    (item) =>
      item.fullReference.toLowerCase() === decoded ||
      item.id === decoded ||
      item.reference.replace(/\.+$/, "").toLowerCase() === decoded.replace(/\.+$/, "").toLowerCase()
  )

  if (found) {
    return found
  }

  // Fallback dynamic record for unknown / newly generated slugs
  const prettyName = decoded
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return {
    id: decoded,
    reference: decoded.length > 12 ? `${decoded.substring(0, 12)}...` : decoded,
    fullReference: decoded,
    merchantProfile: prettyName || "Merchant",
    amount: "TSh 50,000",
    customer: "Valued Customer",
    customerEmail: "customer@xpay.com",
    status: "unpaid",
    paymentMethods: "mobile money",
    description: `Payment for ${prettyName || decoded}`,
    createdAt: "Today",
    expiresAt: "24 hours from creation",
    metadata: { paymentId: "101", planId: "1", restaurantId: "1" },
  }
}
