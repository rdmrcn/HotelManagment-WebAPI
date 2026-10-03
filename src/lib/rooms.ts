import { withBasePath } from "@/lib/asset"

export type RoomPhoto = {
  src: string
  alt: string
}

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
  images: RoomPhoto[]
}

function photos(slug: string, alts: [string, string]): RoomPhoto[] {
  return [
    { src: withBasePath(`/images/room-${slug}-1.jpg`), alt: alts[0] },
    { src: withBasePath(`/images/room-${slug}-2.jpg`), alt: alts[1] },
  ]
}

export function roomCover(room: Room) {
  return room.images[0]
}

export const rooms: Room[] = [
  {
    slug: "standard",
    name: "Standard Room",
    nightlyRate: 220,
    size: "24 m²",
    bed: "Double bed",
    view: "City rooftops",
    summary:
      "A quiet double on the city side. Warm white linen, a brass lamp, and tiled roofs across the way.",
    description:
      "Standard Room is the smallest room in the house. One double bed in warm white linen, a light-oak desk, and a sash window onto neighboring rooftops and the upper floors of the next street. Buildings fill the view.",
    amenities: [
      "Double bed",
      "City rooftops",
      "Rain shower",
      "Writing desk",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("standard", [
      "Compact double room with a low oak headboard, warm white bedding, a brass lamp, and a sash window onto tiled rooftops and apartment buildings.",
      "The same city room from a light-oak writing desk and beige chair, the double bed to the side, neighboring buildings outside the window.",
    ]),
  },
  {
    slug: "queen-double",
    name: "Queen Double Room",
    nightlyRate: 250,
    size: "32 m²",
    bed: "Two queen beds",
    view: "Side street",
    summary: "Two queen beds on the city side, priced under the Queen Room.",
    description:
      "Queen Double Room is the two-bed city room. Two queen beds, a nightstand between them, warm white linen, and a window onto a side street of apartment buildings. It costs less than the Queen Room, which is a single bed on the same side of the house.",
    amenities: [
      "Two queen beds",
      "Side-street view",
      "Rain shower",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("queen-double", [
      "Two queen beds with walnut headboards and a brass lamp between them, greige drapes open to a narrow street of apartment buildings.",
      "The same Queen Double Room from the doorway, both queen beds in warm white linen, city buildings filling the window.",
    ]),
  },
  {
    slug: "queen",
    name: "Queen Room",
    nightlyRate: 295,
    size: "30 m²",
    bed: "Queen bed",
    view: "Across the street",
    summary: "One queen bed and a writing desk. Apartment buildings fill the window.",
    description:
      "Queen Room is a single bed, wider than the Standard Room double, on the city side of the house. Warm white linen, a walnut headboard, and casement windows that look straight at the plaster facades across a narrow street.",
    amenities: [
      "Queen bed",
      "Writing desk",
      "City view",
      "Rain shower",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("queen", [
      "One queen bed with a walnut headboard, warm white bedding, brass lamps, and windows filled by apartment facades across the street.",
      "The same Queen Room from the writing desk, looking across the single queen bed toward neighboring city buildings.",
    ]),
  },
  {
    slug: "king-double",
    name: "King Double Room",
    nightlyRate: 340,
    size: "42 m²",
    bed: "Two king beds",
    view: "Rooftops",
    summary: "Two king beds facing the rooftops, priced under the King Room.",
    description:
      "King Double Room puts two wide king beds in one room, with walnut headboards and a lamp between them. The window looks over tiled rooftops and the buildings of the next street. It is the city room for four, and it costs less than the King Room.",
    amenities: [
      "Two king beds",
      "Rooftop view",
      "Rain shower",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("king-double", [
      "Two wide king beds with walnut headboards and warm white bedding, a window onto tiled rooftops and the next block of buildings.",
      "The same King Double Room from the window side, both king beds visible, rooftops and apartment buildings outside.",
    ]),
  },
  {
    slug: "king",
    name: "King Room",
    nightlyRate: 385,
    size: "36 m²",
    bed: "King bed",
    view: "City buildings",
    summary: "One wide king bed on the city side, with buildings and rooftops outside.",
    description:
      "King Room is the largest single bed on the street side: one wide king in warm white linen, a taupe headboard, and a charcoal armchair by the window. Outside are the buildings of the next block. It costs more than King Double Room and less than Deluxe Room on the water.",
    amenities: [
      "King bed",
      "City view",
      "Rain shower",
      "Charcoal armchair",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("king", [
      "One wide king bed with a taupe headboard, warm white bedding, brass lamps, a charcoal armchair, and a window onto city buildings and rooftops.",
      "The same King Room from beside the window, looking back at the single wide king bed and charcoal armchair, buildings outside.",
    ]),
  },
  {
    slug: "deluxe",
    name: "Deluxe Room",
    nightlyRate: 510,
    size: "46 m²",
    bed: "King bed",
    view: "Wide Bosphorus balcony",
    summary:
      "The king room with space to sit: two linen armchairs, a wider balcony, and a long afternoon on the strait.",
    description:
      "Deluxe Room keeps the king bed and adds a lounge corner. Two cream armchairs, a small marble table, and a balcony wide enough for both of you. The glass folds all the way back, and the last light sits on the water.",
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
    images: photos("deluxe", [
      "Deluxe king bedroom with a walnut headboard, a folded sage throw, two beige armchairs, and a wide balcony over the Bosphorus at sunset.",
      "The same Deluxe Room from the lounge, two beige armchairs facing the sunset balcony, the king bed at the left.",
    ]),
  },
  {
    slug: "suite",
    name: "Suite Room",
    nightlyRate: 780,
    size: "64 m²",
    bed: "King bed",
    view: "Strait, two rooms",
    summary:
      "A sitting room and a separate bedroom, with a door you can close between them.",
    description:
      "Suite Room is two rooms on the water. The sitting room has a low sofa in cream linen, a round walnut table, and tea when you arrive. The bedroom is through a doorway you can close. Turndown is in the evening, with the strait still moving outside.",
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
    images: photos("suite", [
      "Suite bedroom at dusk with a walnut headboard, warm white bedding, lit brass lamps, and a plain doorway into the sitting room, the strait outside.",
      "The Suite sitting room at blue hour: a cream sofa, an oak table, and a doorway back to the king bed and brass lamps.",
    ]),
  },
  {
    slug: "presidential",
    name: "Bosfor Suite Room",
    nightlyRate: 1250,
    size: "102 m²",
    bed: "King bed",
    view: "Private water terrace",
    summary:
      "The water floor. A stone fireplace, a long sofa, and a private terrace facing the Bosphorus.",
    description:
      "Bosfor Suite Room is the water floor of the house. A pale stone fireplace, a dining table for four, and doors onto a terrace that is not shared with other rooms. Breakfast can be brought out. At dusk the strait goes the color of the walnut, and the hills on the Asian shore light up one by one.",
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
    images: photos("presidential", [
      "Bosfor Suite bedroom at dusk, a wide king bed and walnut headboard, with floor-to-ceiling glass toward a private terrace on the Bosphorus.",
      "The Bosfor Suite living room at dusk, a long cream sofa and a walnut dining table for four, terrace doors open to the strait.",
    ]),
  },
]

export function getRoom(slug: string) {
  return rooms.find((room) => room.slug === slug)
}

export function lowestNightlyRate() {
  return Math.min(...rooms.map((room) => room.nightlyRate))
}
