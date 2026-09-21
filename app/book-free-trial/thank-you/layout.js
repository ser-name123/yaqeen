// Overrides the /book-free-trial canonical so the thank-you page points to itself.
export const metadata = {
  title: "Thank You — Yaqeen Institute",
  description: "Your free trial request has been received. Our academic advisor will contact you within 24 hours.",
  alternates: { canonical: "/book-free-trial/thank-you" },
  robots: { index: false, follow: true },
};

export default function ThankYouLayout({ children }) {
  return children;
}
