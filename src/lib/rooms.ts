import { withBasePath } from "@/lib/asset"

export type Room = {
  slug: string
  name: string
  nightlyRate: number
  size: string
  bed: string
  view: string
  summary: string
  description: string
  amenities: string[]
  image: string
  imageAlt: string
}

export const rooms: Room[] = [
  {
    slug: "standard",
    name: "Standard",
    nightlyRate: 220,
    size: "24 m²",
    bed: "Double bed",
    view: "Garden",
    summary:
      "A quiet double on the garden. Cream linen, a brass lamp, and the hedge path when the window is open.",
    description:
      "The Standard is the smallest room in the house and the one that looks into the garden rather than the strait. A double bed in cream linen, a walnut desk, and a shower that gets properly hot. It suits two people who will spend the day along Bebek's shore and want a dark, calm room to come back to.",
    amenities: [
      "Double bed",
      "Garden view",
      "Rain shower",
      "Writing desk",
      "Linen robes",
      "Wireless internet",
    ],
    image: withBasePath("/images/room-standard.jpg"),
    imageAlt:
      "Compact bedroom with cream linen, walnut panelling, a brass lamp, and a window onto a walled garden.",
  },
  {
    slug: "queen",
    name: "Queen",
    nightlyRate: 295,
    size: "30 m²",
    bed: "Queen bed",
    view: "Bebek bay",
    summary:
      "A queen bed, a writing desk, and casement windows toward the wooden houses on Bebek bay.",
    description:
      "The Queen room sits one floor above the garden. The bed is dressed in cream linen, the desk faces the water, and the windows look along the bay to the yalıs on the far curve. Ceramic lamps, blackout curtains for late mornings, and enough quiet to hear the water against the quay.",
    amenities: [
      "Queen bed",
      "Writing desk",
      "Bebek bay view",
      "Rain shower",
      "Linen robes",
      "Wireless internet",
    ],
    image: withBasePath("/images/room-queen.jpg"),
    imageAlt:
      "Bedroom with a linen-dressed queen bed, a walnut writing desk, and windows toward Bebek bay.",
  },
  {
    slug: "king",
    name: "King",
    nightlyRate: 385,
    size: "36 m²",
    bed: "King bed",
    view: "Bosphorus balcony",
    summary: "A king bed and French doors onto a balcony over the strait.",
    description:
      "The King room opens through carved walnut doors onto a narrow balcony. The bed is a king in stone-colored linen, with an Iznik-tile dado and enough floor to leave the doors open. Morning light arrives across the water before the ferries do.",
    amenities: [
      "King bed",
      "Private balcony",
      "Bosphorus view",
      "Rain shower",
      "Iznik-tile accent",
      "Linen robes",
      "Wireless internet",
    ],
    image: withBasePath("/images/room-king.jpg"),
    imageAlt:
      "Wide bedroom with cream linen, walnut panelling, and French doors open onto the Bosphorus.",
  },
  {
    slug: "deluxe",
    name: "Deluxe",
    nightlyRate: 510,
    size: "46 m²",
    bed: "King bed",
    view: "Wide Bosphorus balcony",
    summary:
      "The king room with space to sit: two linen armchairs, a wider balcony, and a long afternoon on the strait.",
    description:
      "Deluxe keeps the king bed and adds a lounge corner. Two cream armchairs, a small marble table, and a balcony wide enough for both of you. The shutters fold all the way back, and the Iznik tiles catch the last of the light.",
    amenities: [
      "King bed",
      "Lounge seating",
      "Wider balcony",
      "Bosphorus view",
      "Rain shower",
      "Writing desk",
      "Linen robes",
      "Wireless internet",
    ],
    image: withBasePath("/images/room-deluxe.jpg"),
    imageAlt:
      "Spacious bedroom with a king bed, two cream armchairs, and a balcony over the Bosphorus.",
  },
  {
    slug: "suite",
    name: "Suite",
    nightlyRate: 780,
    size: "64 m²",
    bed: "King bed",
    view: "Strait, two rooms",
    summary:
      "A sitting room and a separate bedroom, with a door you can close between them.",
    description:
      "The Suite is two rooms. The sitting room has a low sofa in cream linen, a round walnut table, and tea when you arrive. The bedroom is through a doorway you can close. Turndown is in the evening, with the strait still moving outside.",
    amenities: [
      "Separate sitting room",
      "King bedroom",
      "Balcony",
      "Bosphorus view",
      "Dining table for two",
      "Rain shower",
      "Linen robes",
      "Evening turndown",
      "Wireless internet",
    ],
    image: withBasePath("/images/room-suite.jpg"),
    imageAlt:
      "Sitting room with a cream linen sofa and an open doorway into a separate bedroom above the water.",
  },
  {
    slug: "presidential",
    name: "Bosfor Suite",
    nightlyRate: 1250,
    size: "102 m²",
    bed: "King bed",
    view: "Private water terrace",
    summary:
      "The water floor. A stone fireplace, a long sofa, and a private terrace facing the Bosphorus.",
    description:
      "The Bosfor Suite is the water floor of the house. A pale stone fireplace, a dining table for four, and doors onto a terrace that is not shared with other rooms. Breakfast can be brought out. At dusk the strait goes the color of the walnut, and the hills on the Asian shore light up one by one.",
    amenities: [
      "Private terrace",
      "Stone fireplace",
      "King bedroom",
      "Separate sitting room",
      "Dining table for four",
      "Rain shower",
      "Linen robes",
      "In-room breakfast on request",
      "Wireless internet",
    ],
    image: withBasePath("/images/room-presidential.jpg"),
    imageAlt:
      "Sitting room with a stone fireplace, a dining table, and doors onto a private Bosphorus terrace.",
  },
]

export function getRoom(slug: string) {
  return rooms.find((room) => room.slug === slug)
}

export function lowestNightlyRate() {
  return Math.min(...rooms.map((room) => room.nightlyRate))
}
