import {
  PublicCheckoutPage,
} from "@workspace/ui/components/public-checkout-page"

export default function DemoCheckout() {
  return (
    <PublicCheckoutPage
      merchantName="Eric Kweyunga"
      title="Please buy me a coffee"
      description="Open source is about sharing knowledge and empowering developers everywhere. I maintain and build public projects, libraries, and tools for developers to learn, use, and contribute to. Your support helps me continue creating open tools, writing documentation, and experimenting with new ideas in public."
      amount="TSh 1,000"
      currency="TZS"
      brandColor="#dc2626"
      link="https://github.com/erickweyunga"
    />
  )
}
