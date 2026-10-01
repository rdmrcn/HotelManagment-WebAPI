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
    nightlyRate: 165,
    size: "22 m²",
    bed: "Double bed",
    view: "Courtyard",
    summary:
      "A quiet double on the courtyard. Linen on the bed, a lamp worth reading by, and the fountain when the window is open.",
    description:
      "The Standard is the smallest room in the house and the one nearest the courtyard. It has a double bed in oatmeal linen, a ceramic lamp, and a shower that gets properly hot. It suits two people who plan to be out for most of the day and want a calm place to come back to.",
    amenities: [
      "Double bed",
      "Courtyard view",
      "Rain shower",
      "Writing desk",
      "Linen robes",
      "Wireless internet",
    ],
    image: "/images/room-standard.jpg",
    imageAlt:
      "Compact bedroom with oatmeal linen, a ceramic lamp, and a window onto the courtyard.",
  },
  {
    slug: "queen",
    name: "Queen",
    nightlyRate: 210,
    size: "28 m²",
    bed: "Queen bed",
    view: "Harbor balcony",
    summary:
      "A queen bed, a writing desk, and a balcony toward the harbor.",
    description:
      "The Queen room is one floor up. The bed is dressed in cream linen with a terracotta throw, the desk sits under a warm lamp, and the balcony looks out over tiled roofs toward the water. Blackout curtains are there for late mornings.",
    amenities: [
      "Queen bed",
      "Balcony",
      "Harbor view",
      "Writing desk",
      "Rain shower",
      "Linen robes",
      "Wireless internet",
    ],
    image: "/images/room-queen.jpg",
    imageAlt:
      "Bedroom with a linen-dressed bed, a writing desk, and a balcony toward the water.",
  },
  {
    slug: "king",
    name: "King",
    nightlyRate: 275,
    size: "34 m²",
    bed: "King bed",
    view: "Harbor balcony",
    summary: "A king bed and French doors onto a balcony above the water.",
    description:
      "The King room opens through French doors onto a narrow balcony. The bed is a king in stone-colored linen, with a bench at the foot and enough floor to leave the doors open. Morning light arrives before the boats do.",
    amenities: [
      "King bed",
      "Private balcony",
      "Harbor view",
      "Rain shower",
      "Bench at the foot of the bed",
      "Linen robes",
      "Wireless internet",
    ],
    image: "/images/room-king.jpg",
    imageAlt:
      "Wide bedroom with French doors open onto a balcony and the water.",
  },
  {
    slug: "deluxe",
    name: "Deluxe",
    nightlyRate: 360,
    size: "42 m²",
    bed: "King bed",
    view: "Wide harbor balcony",
    summary:
      "The king room with space to sit: two armchairs, a wider balcony, and a long afternoon.",
    description:
      "Deluxe keeps the king bed and adds a lounge corner. Two linen armchairs, a small marble table, and a balcony wide enough for both of you. The ceilings are taller here, and the shutters fold all the way back.",
    amenities: [
      "King bed",
      "Lounge seating",
      "Wider balcony",
      "Harbor view",
      "Rain shower",
      "Writing desk",
      "Linen robes",
      "Wireless internet",
    ],
    image: "/images/room-deluxe.jpg",
    imageAlt:
      "Spacious bedroom with a king bed, two armchairs, and a balcony.",
  },
  {
    slug: "suite",
    name: "Suite",
    nightlyRate: 520,
    size: "58 m²",
    bed: "King bed",
    view: "Harbor, two rooms",
    summary:
      "A sitting room and a separate bedroom, with a door you can close between them.",
    description:
      "The Suite is two rooms. The sitting room has a low sofa in sand linen, a round oak table, and a bowl of fruit when you arrive. The bedroom is through a doorway you can close. Turndown is in the evening.",
    amenities: [
      "Separate sitting room",
      "King bedroom",
      "Balcony",
      "Harbor view",
      "Dining table for two",
      "Rain shower",
      "Linen robes",
      "Evening turndown",
      "Wireless internet",
    ],
    image: "/images/room-suite.jpg",
    imageAlt:
      "Sitting room with a linen sofa and a doorway into a separate bedroom.",
  },
  {
    slug: "presidential",
    name: "Presidential Suite",
    nightlyRate: 890,
    size: "95 m²",
    bed: "King bed",
    view: "Private sea terrace",
    summary:
      "The top floor. A stone fireplace, a long sofa, and a private terrace facing the sea.",
    description:
      "The Presidential Suite is the whole of the top floor. A pale stone fireplace, a long linen sofa, and doors onto a terrace that is not shared with other rooms. Breakfast can be brought up. The terrace faces the water at dusk, when the harbor goes quiet.",
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
    image: "/images/room-presidential.jpg",
    imageAlt:
      "Top-floor sitting room with a stone fireplace and doors onto a private sea terrace.",
  },
]

export function getRoom(slug: string) {
  return rooms.find((room) => room.slug === slug)
}

export function lowestNightlyRate() {
  return Math.min(...rooms.map((room) => room.nightlyRate))
}
