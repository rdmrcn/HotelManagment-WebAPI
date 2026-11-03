import type { Locale } from "@/lib/i18n/locale"
import { amenities, galleryImages, nearby, reviews } from "@/lib/house"

const amenityTr: Record<string, { title: string; body: string }> = {
  breakfast: {
    title: "Teras kahvaltısı",
    body: "Simit, beyaz peynirler, bal ve ince belli bardakta çay. 10:30'a kadar.",
  },
  garden: {
    title: "Yokuş bahçesi",
    body: "Sokakla yamaç arasında taş yollar, lavanta ve küçük bir fıskiye.",
  },
  shower: {
    title: "Yağmur duşlar",
    body: "Her odada geniş yağmur duş ve keten bornoz var.",
  },
  wifi: {
    title: "Kablosuz internet",
    body: "Hızlı, ücretsiz, her odada ve terasta.",
  },
  concierge: {
    title: "Konsiyerj",
    body: "Restoran masası, vapur saati ve taksi resepsiyondan ayarlanır.",
  },
  luggage: {
    title: "Bagaj odası",
    body: "Girişten önce ya da çıkıştan sonra çantalar holde bekleyebilir.",
  },
  air: {
    title: "Klima",
    body: "Sekiz oda tipinde de sessiz, ayrı ayrı ayarlanan soğutma.",
  },
  walk: {
    title: "Suya yürüyüş",
    body: "Yokuştan Bebek sahiline yaklaşık dört dakika.",
  },
}

const reviewTr = [
  {
    from: "Lizbon",
    text: "Bütün pencereyi geçen vapurlara uyandım. Balkon tek başına su tarafının fiyatına değer.",
  },
  {
    from: "Toronto",
    text: "Dik bir sokakta sakin bir ev. Terastaki kahvaltı bütün gezinin en iyi yemeğiydi.",
  },
  {
    from: "Ankara",
    text: "Şehir tarafı sessiz, tertemiz ve fiyatın çok altındaydı. Her akşam yemeğe Bebek'e yürüdük.",
  },
]

const nearbyTr = [
  { place: "Bebek sahili ve kafeler", time: "4 dk yürüyüş" },
  { place: "Bebek Parkı ve sahil yolu", time: "6 dk yürüyüş" },
  { place: "Rumeli Hisarı", time: "10 dk taksi" },
  { place: "Ortaköy ve Boğaz Köprüsü", time: "12 dk taksi" },
  { place: "Taksim Meydanı", time: "20 dk taksi" },
]

const galleryAltTr = [
  "Yokuşta teraslanmış taş ev, şezlonglar ve zeytinler, aşağıda Boğaz, bir köprü ve bir vapur.",
  "Boğaz'ın üstündeki taş terasta, keten örtülü masada simit, peynir ve çaylı Türk kahvaltısı.",
  "Lavanta, fıskiye ve ahşap bankların arasından taş yol, ağaçların ardında boğaz.",
  "Deluxe Room: Boğaz'a bakan cam duvarın karşısında king yatak ve kanepe köşesi.",
  "Yatağın ayakucunda turkuaz bank ve gün batımında boğaza bakan pencereli suite yatak odası.",
  "İki turkuaz şezlong, zeytinler ve ileride Boğaz'la Bosfor Suite'in özel terası.",
  "Yuvarlak pirinç çerçeveli ayna, ceviz lavabo ve turkuaz taşlı yağmur duşlu banyo.",
  "Aralıklı ceviz başlıklı Queen Room ve ağaçlı bir sokağa bakan pencere.",
  "Pirinç lambalı ve çay takımlı Standard Room çalışma masası, pencerede bir minare.",
]

const sidePhotoAltTr = {
  bosphorus: "King yatak, kanepe köşesi ve Boğaz'a bakan cam duvarlı Deluxe Room.",
  city: "Turkuaz başlıklı King Room ve çatılarla bir minareye bakan yüksek pencere.",
}

export function amenityFace(icon: string, locale: Locale) {
  const english = amenities.find((item) => item.icon === icon)
  if (!english) return { title: icon, body: "" }
  if (locale === "en") return { title: english.title, body: english.body }
  return amenityTr[icon] ?? { title: english.title, body: english.body }
}

export function reviewFace(index: number, locale: Locale) {
  const english = reviews[index]
  if (!english) return { name: "", from: "", stay: "", text: "" }
  if (locale === "en") return english
  const turkish = reviewTr[index]
  return { ...english, from: turkish?.from ?? english.from, text: turkish?.text ?? english.text }
}

export function nearbyFace(index: number, locale: Locale) {
  const english = nearby[index]
  if (!english) return { place: "", time: "" }
  if (locale === "en") return english
  return nearbyTr[index] ?? english
}

export function galleryAlt(index: number, locale: Locale) {
  const english = galleryImages[index]?.alt ?? ""
  if (locale === "en") return english
  return galleryAltTr[index] ?? english
}

export function sidePhotoAlt(side: "bosphorus" | "city", locale: Locale, english: string) {
  if (locale === "en") return english
  return sidePhotoAltTr[side]
}
