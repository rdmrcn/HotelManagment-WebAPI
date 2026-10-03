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
    images: photos("standard", [
      "Compact double room with a low oak headboard, warm white bedding, a sage lumbar pillow, brass lamps, and a sash window onto a garden hedge.",
      "The same garden room from the light-oak writing desk, with a beige chair, the double bed to the side, and the hedge outside the sash window.",
    ]),
  },
  {
    slug: "queen-double",
    name: "Queen Double",
    nightlyRate: 250,
    size: "32 m²",
    bed: "Two queen beds",
    view: "Side street",
    summary: "Two queen beds on the city side, priced under the Queen.",
    description:
      "Queen Double is the cheaper city room. Two queen beds, a nightstand between them, warm white linen, and a window onto a side street of apartment buildings. No open water, no boats. The single Queen, one floor up, is the room that looks along the bay.",
    amenities: [
      "Two queen beds",
      "Side-street view",
      "Rain shower",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("queen-double", [
      "Two queen beds with walnut headboards and a brass lamp between them, greige drapes open to a narrow street of apartment buildings.",
      "The same Queen Double from the doorway, both queen beds in warm white linen, city buildings filling the window.",
    ]),
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
    images: photos("queen", [
      "Queen bedroom with a walnut panel headboard, warm white bedding, a sage pillow, a writing desk, and casement windows toward the wooden houses on Bebek bay.",
      "The same Queen room from the writing desk, looking across the queen bed and walnut headboard toward the Bebek bay windows.",
    ]),
  },
  {
    slug: "king-double",
    name: "King Double",
    nightlyRate: 340,
    size: "42 m²",
    bed: "Two king beds",
    view: "Rooftops",
    summary: "Two king beds facing the rooftops, priced under the King.",
    description:
      "King Double puts two wide king beds in one room, with walnut headboards and a lamp between them. The window looks over tiled rooftops and the buildings of the next street. It is the city room for four, and it costs less than the King, whose balcony is on the strait.",
    amenities: [
      "Two king beds",
      "Rooftop view",
      "Rain shower",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("king-double", [
      "Two wide king beds with walnut headboards and warm white bedding, a window onto tiled rooftops and the next block of buildings.",
      "The same King Double from the window side, both king beds visible, rooftops and apartment buildings outside.",
    ]),
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
      "The King room opens through glass doors onto a balcony over the strait. The bed is a wide king in warm white linen, with a taupe headboard and a charcoal armchair by the glass. Morning light arrives across the water before the ferries do.",
    amenities: [
      "King bed",
      "Private balcony",
      "Bosphorus view",
      "Rain shower",
      "Charcoal armchair",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("king", [
      "Wide king bedroom with a taupe upholstered headboard, warm white bedding, brass lamps, a charcoal armchair, and glass doors onto a Bosphorus balcony with a ferry.",
      "The same King room from the balcony, looking in past a slim metal rail to the wide king bed and charcoal armchair.",
    ]),
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
      "Deluxe keeps the king bed and adds a lounge corner. Two cream armchairs, a small marble table, and a balcony wide enough for both of you. The glass folds all the way back, and the last light sits on the water.",
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
      "The same Deluxe room from the lounge, two beige armchairs facing the sunset balcony, the king bed at the left.",
    ]),
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
    images: photos("suite", [
      "Suite bedroom at dusk with a walnut headboard, warm white bedding, lit brass lamps, and a plain doorway into the sitting room, the strait outside.",
      "The Suite sitting room at blue hour: a cream sofa, an oak table, and a doorway back to the king bed and brass lamps.",
    ]),
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
