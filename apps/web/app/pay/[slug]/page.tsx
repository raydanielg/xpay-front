import {
  PublicCheckoutPage,
} from "@workspace/ui/components/public-checkout-page"

export default async function SlugCheckout({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <PublicCheckoutPage
      merchantName="SalamaPay"
      title={`Payment for ${slug}`}
      description="Fast and secure checkout powered by XPay."
      amount="50,000"
      currency="TZS"
      brandColor="#10b981"
    />
  )
}
