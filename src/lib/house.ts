import { withBasePath } from "@/lib/asset"

export const SITE_URL = "https://rdmrcn.github.io/HotelManagment-WebAPI"
export const AUTHOR = { name: "Reha Demircan", url: "https://reha-demircan-portfolio.vercel.app" }
export const REPO_URL = "https://github.com/rdmrcn/HotelManagment-WebAPI"

export const house = {
  name: "Bosfor Hotels",
  area: "Bebek, Beşiktaş, Istanbul",
  checkIn: "15:00",
  checkOut: "11:00",
  coordinates: { lat: 41.0766, lng: 29.0436 },
}

export const mapLinks = {
  embed:
    "https://www.openstreetmap.org/export/embed.html?bbox=29.0340%2C41.0710%2C29.0530%2C41.0820&layer=mapnik&marker=41.0766%2C29.0436",
  open: "https://www.openstreetmap.org/?mlat=41.0766&mlon=29.0436#map=16/41.0766/29.0436",
}

export const amenities = [
  { icon: "breakfast", title: "Terrace breakfast", body: "Simit, white cheeses, honey, and tea in tulip glasses, served until 10:30." },
  { icon: "garden", title: "Hillside garden", body: "Stone paths, lavender, and a small fountain between the street and the slope." },
  { icon: "shower", title: "Rain showers", body: "Every room has a walk-in rain shower and linen robes." },
  { icon: "wifi", title: "Wireless internet", body: "Quick, free, and in every room and on the terrace." },
  { icon: "concierge", title: "Concierge", body: "Restaurant tables, ferry times, and taxis arranged at the front desk." },
  { icon: "luggage", title: "Luggage room", body: "Bags can wait in the hall before check-in or after check-out." },
  { icon: "air", title: "Air conditioning", body: "Quiet, individually controlled cooling in all eight room types." },
  { icon: "walk", title: "Walk to the water", body: "Down the hill to the Bebek waterfront in about four minutes." },
] as const

export const reviews = [
  {
    name: "Marta L.",
    from: "Lisbon",
    stay: "Deluxe Room",
    text: "I woke up to ferries crossing the whole window. The balcony alone is worth the water-side price.",
  },
  {
    name: "Daniel R.",
    from: "Toronto",
    stay: "Suite Room",
    text: "A calm house on a steep street. Breakfast on the terrace was the best meal of our whole trip.",
  },
  {
    name: "Ayşe K.",
    from: "Ankara",
    stay: "Queen Room",
    text: "The city side was quiet, spotless, and a fraction of the price. We walked down to Bebek for dinner every night.",
  },
]

export const nearby = [
  { place: "Bebek waterfront and cafés", time: "4 min walk" },
  { place: "Bebek Park and the seaside promenade", time: "6 min walk" },
  { place: "Rumeli Fortress", time: "10 min by taxi" },
  { place: "Ortaköy and the Bosphorus Bridge", time: "12 min by taxi" },
  { place: "Taksim Square", time: "20 min by taxi" },
]

export const galleryImages = [
  { file: "hero-bosphorus.jpg", alt: "Terraced stone house on the hillside with sun loungers and olive trees, the Bosphorus, a bridge and a ferry below." },
  { file: "breakfast-terrace.jpg", alt: "Turkish breakfast with simit, cheeses and tea on a linen-covered table on a stone terrace above the Bosphorus." },
  { file: "waterside-garden.jpg", alt: "Stone path through the hillside garden past lavender, a fountain and wooden benches, the strait glimpsed beyond the trees." },
  { file: "room-deluxe-1.jpg", alt: "Deluxe Room: a king bed and a sofa corner facing a wall of glass onto the Bosphorus." },
  { file: "room-suite-2.jpg", alt: "Suite bedroom with a teal bench at the foot of the bed and a window onto the strait at sunset." },
  { file: "room-presidential-2.jpg", alt: "The Bosfor Suite private terrace with two teal loungers, olive trees and the Bosphorus beyond." },
  { file: "room-king-double-2.jpg", alt: "Bathroom with a round brass-framed mirror, a walnut vanity and a teal-tiled rain shower." },
  { file: "room-queen-1.jpg", alt: "Queen Room with a slatted walnut headboard and a window onto a tree-lined street." },
  { file: "room-standard-2.jpg", alt: "Standard Room writing desk with a brass lamp and a tea set, a minaret outside the window." },
].map((image) => ({ src: withBasePath(`/images/${image.file}`), alt: image.alt }))
