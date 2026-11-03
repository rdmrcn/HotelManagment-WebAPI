import { contact } from "@/lib/contact"
import { house, SITE_URL } from "@/lib/house"

const hero = `${SITE_URL}/images/hero-bosphorus.jpg`

const address = {
  "@type": "PostalAddress",
  streetAddress: "Hillside street above the waterfront",
  addressLocality: "Bebek",
  addressRegion: "İstanbul",
  addressCountry: "TR",
}

const description =
  "Bosfor Hotels is a fictional house hotel on a hillside street in Bebek, Istanbul. Eight room types, Bosphorus-side and city-side, with live availability for the next 60 days. A portfolio demo. The phone number is a demo number."

export const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Hotel", "LocalBusiness"],
  "@id": `${SITE_URL}/#hotel`,
  name: house.name,
  description,
  url: `${SITE_URL}/`,
  image: hero,
  telephone: contact.phoneDisplay,
  email: contact.email,
  address,
  geo: {
    "@type": "GeoCoordinates",
    latitude: house.coordinates.lat,
    longitude: house.coordinates.lng,
  },
  checkinTime: house.checkIn,
  checkoutTime: house.checkOut,
  priceRange: "€€€",
  currenciesAccepted: "EUR",
  paymentAccepted: "Demo card",
  availableLanguage: ["English", "Turkish"],
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Terrace breakfast", value: true },
    { "@type": "LocationFeatureSpecification", name: "Wireless internet", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
  ],
}
