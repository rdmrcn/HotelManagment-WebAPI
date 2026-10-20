import { withBasePath } from "@/lib/asset"

export type RoomPhoto = {
  src: string
  alt: string
}

export type RoomSide = "bosphorus" | "city"

export type Room = {
  slug: string
  name: string
  side: RoomSide
  /** How many rooms of this type the house has. */
  units: number
  /** Guests the room sleeps comfortably. */
  sleeps: number
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
    side: "city",
    units: 12,
    sleeps: 2,
    nightlyRate: 220,
    size: "24 m²",
    bed: "Double bed",
    view: "City rooftops",
    summary:
      "A quiet double on the street side. Warm walnut, white linen, and red tiled roofs across the way.",
    description:
      "Standard Room is the smallest room in the house and the best value on the street side. One double bed under a walnut headboard, a writing desk with a brass lamp and a tea set, and a tall window onto the rooftops and minarets of the neighbourhood. There is no water in this view, only the city going about its day.",
    amenities: [
      "Double bed",
      "City rooftops",
      "Rain shower",
      "Writing desk",
      "Tea set",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("standard", [
      "Double bed with a walnut headboard and a teal cushion beside a tall window onto red-roofed city buildings.",
      "Walnut writing desk with a brass lamp and a teal teapot, a tall window beside it showing a minaret over the rooftops.",
    ]),
  },
  {
    slug: "queen-double",
    name: "Queen Double Room",
    side: "city",
    units: 6,
    sleeps: 4,
    nightlyRate: 250,
    size: "32 m²",
    bed: "Two queen beds",
    view: "Side street",
    summary: "Two queen beds on the street side, priced under the Queen Room.",
    description:
      "Queen Double Room is the two-bed room on the street side. Two queen beds with teal throws, a window onto the apartment buildings and a minaret, and a corner with a teal armchair and a chest of drawers. It costs less than the Queen Room, which has a single bed on the same side of the house.",
    amenities: [
      "Two queen beds",
      "Street view",
      "Armchair corner",
      "Rain shower",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("queen-double", [
      "Two beds with white linen and teal throws, a walnut headboard, and a window onto apartment buildings and a minaret.",
      "A teal armchair beside a walnut chest of drawers, a window onto red roofs and a minaret, and two beds in the room beyond.",
    ]),
  },
  {
    slug: "queen",
    name: "Queen Room",
    side: "city",
    units: 10,
    sleeps: 2,
    nightlyRate: 295,
    size: "30 m²",
    bed: "Queen bed",
    view: "Across the street",
    summary: "One queen bed under a slatted walnut headboard, with the street and its plane trees outside.",
    description:
      "Queen Room is one wide queen bed on the street side of the house. A slatted walnut headboard, a teal runner, and a tall window that looks down the hillside street between apartment buildings and plane trees. A teal armchair and a desk by the window make it an easy room to work from.",
    amenities: [
      "Queen bed",
      "Writing desk",
      "Street view",
      "Rain shower",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("queen", [
      "Queen bed with a slatted walnut headboard and a teal runner, a tall window onto a tree-lined street of apartment buildings.",
      "Teal armchair beside a walnut desk with folded towels, a window onto red roofs and a minaret, and the edge of the bed.",
    ]),
  },
  {
    slug: "king-double",
    name: "King Double Room",
    side: "city",
    units: 6,
    sleeps: 4,
    nightlyRate: 340,
    size: "42 m²",
    bed: "Two king beds",
    view: "Rooftops",
    summary: "Two king beds facing the rooftops, priced under the King Room.",
    description:
      "King Double Room puts two wide king beds in one room, under a headboard of walnut and teal panels, with a leather bench at the foot. The tall windows look over the rooftops and a minaret on the next hill. The bathroom has a round brass-framed mirror and a teal-tiled rain shower. It is the street-side room for four, and it costs less than the King Room.",
    amenities: [
      "Two king beds",
      "Rooftop view",
      "Teal-tiled rain shower",
      "Leather bench",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("king-double", [
      "Two king beds under a walnut and teal panelled headboard, a leather bench, and tall windows onto rooftops and a minaret.",
      "Bathroom with a round brass-framed mirror over a walnut vanity and a glass shower walled in teal tiles.",
    ]),
  },
  {
    slug: "king",
    name: "King Room",
    side: "city",
    units: 8,
    sleeps: 2,
    nightlyRate: 385,
    size: "36 m²",
    bed: "King bed",
    view: "City buildings",
    summary: "One wide king bed on the street side, with a minaret and rooftops outside.",
    description:
      "King Room is the largest single-bed room on the street side: one wide king under a teal headboard, brass pendant lamps, and a window that looks over rooftops, plane trees, and a minaret. A desk with a teal armchair sits by a second window onto the neighbouring apartment block. It costs more than King Double Room and less than Deluxe Room on the water.",
    amenities: [
      "King bed",
      "City view",
      "Rain shower",
      "Writing desk",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("king", [
      "King bed under a teal headboard with a grey throw, brass pendant lamps, and a tall window onto rooftops and a minaret.",
      "Walnut desk with a brass lamp and a teal armchair beside a window onto apartment balconies and trees, the bed behind.",
    ]),
  },
  {
    slug: "deluxe",
    name: "Deluxe Room",
    side: "bosphorus",
    units: 5,
    sleeps: 3,
    nightlyRate: 510,
    size: "46 m²",
    bed: "King bed",
    view: "Wide Bosphorus balcony",
    summary:
      "The king room with space to sit: a sofa, a balcony, and the whole strait through floor-to-ceiling glass.",
    description:
      "Deluxe Room keeps the king bed and adds a lounge corner: a teal sofa, an armchair, and a round brass table, all facing a wall of glass onto the Bosphorus. There is a balcony with an iron railing outside the desk. Ferries cross the window all day, and the last light sits on the water.",
    amenities: [
      "King bed",
      "Lounge seating",
      "Balcony",
      "Bosphorus view",
      "Rain shower",
      "Writing desk",
      "Linen robes",
      "Wireless internet",
    ],
    images: photos("deluxe", [
      "King bed with a teal runner and a sofa corner facing a wall of glass onto the Bosphorus, a bridge and a ferry in the distance.",
      "Walnut desk and a teal chair beside an open balcony door, a white curtain lifting, a ferry crossing the strait outside.",
    ]),
  },
  {
    slug: "suite",
    name: "Suite Room",
    side: "bosphorus",
    units: 3,
    sleeps: 4,
    nightlyRate: 780,
    size: "64 m²",
    bed: "King bed",
    view: "Strait, two rooms",
    summary:
      "A sitting room and a separate bedroom, both facing the water, with a doorway between them.",
    description:
      "Suite Room is two rooms on the water. The sitting room has a deep navy sofa, a marble-topped table, and sliding glass onto a balcony above the strait. The king bedroom is through a doorway, with a teal bench at the foot of the bed and the Bosphorus in the window. Turndown is in the evening, with the ferries still moving outside.",
    amenities: [
      "Separate sitting room",
      "King bedroom",
      "Balcony",
      "Bosphorus view",
      "Marble coffee table",
      "Rain shower",
      "Linen robes",
      "Evening turndown",
      "Wireless internet",
    ],
    images: photos("suite", [
      "Suite sitting room with a navy sofa and a marble table, a bookshelf, the bedroom through a doorway, and sliding glass onto the strait.",
      "Suite bedroom with a white king bed and a teal bench, a window with the Bosphorus and a ferry at sunset, a doorway to the sitting room.",
    ]),
  },
  {
    slug: "presidential",
    name: "Bosfor Suite Room",
    side: "bosphorus",
    units: 2,
    sleeps: 4,
    nightlyRate: 1250,
    size: "102 m²",
    bed: "King bed",
    view: "Private water terrace",
    summary:
      "The top floor of the house. A long teal sofa, folding glass walls, and a private terrace over the Bosphorus.",
    description:
      "Bosfor Suite Room is the top of the house, with only two on the floor. A long teal sofa, a walnut dining table, and glass walls that fold all the way back onto a private stone terrace. Two loungers, olive trees in terracotta, and tea for two. At dusk the strait goes copper, the bridge lights up, and the mosques of the old city appear on the far shore.",
    amenities: [
      "Private terrace",
      "Folding glass walls",
      "King bedroom",
      "Separate sitting room",
      "Dining table for four",
      "Rain shower",
      "Linen robes",
      "In-room breakfast on request",
      "Wireless internet",
    ],
    images: photos("presidential", [
      "Bosfor Suite living room with a teal sofa and a walnut dining table, glass walls open to a terrace over the Bosphorus at sunset.",
      "Private stone terrace with two teal loungers, olive trees in terracotta pots, a tea tray, and the Bosphorus, a bridge and a ferry beyond.",
    ]),
  },
]

export const sideInfo: Record<
  RoomSide,
  { label: string; badge: string; short: string; blurb: string }
> = {
  bosphorus: {
    label: "Bosphorus side",
    badge: "Bosphorus view",
    short: "Faces the water",
    blurb:
      "The downhill side of the house. Glass looks over the roofs of Bebek straight onto the strait, the bridge, and the ferries.",
  },
  city: {
    label: "City side",
    badge: "City view",
    short: "Faces the street",
    blurb:
      "The uphill side, on the street. Windows look at rooftops, minarets, and plane trees. Priced lower than the water side.",
  },
}

export function roomsOnSide(side: RoomSide) {
  return rooms.filter((room) => room.side === side)
}

export function getRoom(slug: string) {
  return rooms.find((room) => room.slug === slug)
}

export function lowestNightlyRate() {
  return Math.min(...rooms.map((room) => room.nightlyRate))
}
