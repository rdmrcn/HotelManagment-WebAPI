import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { RoomView } from "@/components/room-view"
import { BASE_PATH } from "@/lib/asset"
import { SITE_URL } from "@/lib/house"
import { formatMoney } from "@/lib/format"
import { getRoom, rooms } from "@/lib/rooms"

type RoomPageProps = {
  params: Promise<{ slug: string }>
}

function absoluteImage(src: string) {
  if (src.startsWith("http")) return src
  const path = BASE_PATH && src.startsWith(BASE_PATH) ? src.slice(BASE_PATH.length) : src
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function generateStaticParams() {
  return rooms.map((room) => ({ slug: room.slug }))
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { slug } = await params
  const room = getRoom(slug)
  if (!room) return { title: "Room" }
  return {
    title: room.name,
    description: `${room.name} at Bosfor Hotels: ${room.bed.toLowerCase()}, ${room.size}, ${room.view.toLowerCase()}, ${formatMoney(room.nightlyRate)} a night. ${room.summary}`,
    openGraph: {
      images: [{ url: absoluteImage(room.images[0].src), width: 1600, height: 1200, alt: room.images[0].alt }],
    },
  }
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { slug } = await params
  if (!getRoom(slug)) notFound()
  return <RoomView slug={slug} />
}
