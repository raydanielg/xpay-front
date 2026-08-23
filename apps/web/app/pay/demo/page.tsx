import {
  PublicCheckoutPage,
} from "@workspace/ui/components/public-checkout-page"

export default function DemoCheckout() {
  return (
    <PublicCheckoutPage
      merchantName="SalamaPay"
      title="Complete Your Payment"
      description="Fast and secure checkout powered by XPay."
      amount="50,000"
      currency="TZS"
      brandColor="#10b981"
    />
  )
}
