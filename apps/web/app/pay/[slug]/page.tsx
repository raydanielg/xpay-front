import {
  PublicCheckoutPage,
} from "@workspace/ui/components/public-checkout-page"
import { getPaymentLinkBySlug } from "@workspace/ui/data/mock-payment-links"

export default async function SlugCheckout({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const record = getPaymentLinkBySlug(slug)

  return (
    <PublicCheckoutPage
      reference={record.fullReference}
      merchantName={record.merchantProfile}
      title={record.description || `Payment for ${record.fullReference}`}
      description={`Checkout for ${record.customer !== "-" ? record.customer : record.merchantProfile}`}
      amount={record.amount}
      currency="TZS"
      brandColor="#10b981"
      customerName={record.customer}
      customerEmail={record.customerEmail}
      status={record.status}
      expiresAt={record.expiresAt}
      paymentMethods={record.paymentMethods}
      link={record.link}
    />
  )
}
