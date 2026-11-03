import type { Locale } from "@/lib/i18n/locale"
import type { Room, RoomSide } from "@/lib/rooms"
import { sideInfo } from "@/lib/rooms"

const amenityTr: Record<string, string> = {
  "Double bed": "Çift kişilik yatak",
  "Queen bed": "Queen yatak",
  "King bed": "King yatak",
  "Two queen beds": "İki queen yatak",
  "Two king beds": "İki king yatak",
  "City rooftops": "Şehir çatıları",
  "Street view": "Sokak manzarası",
  "Rooftop view": "Çatı manzarası",
  "City view": "Şehir manzarası",
  "Bosphorus view": "Boğaz manzarası",
  "Rain shower": "Yağmur duş",
  "Teal-tiled rain shower": "Turkuaz taşlı yağmur duş",
  "Writing desk": "Çalışma masası",
  "Tea set": "Çay takımı",
  "Linen robes": "Keten bornoz",
  "Wireless internet": "Kablosuz internet",
  "Armchair corner": "Berjer köşesi",
  "Leather bench": "Deri bank",
  "Lounge seating": "Oturma köşesi",
  Balcony: "Balkon",
  "Separate sitting room": "Ayrı oturma odası",
  "King bedroom": "King yatak odası",
  "Marble coffee table": "Mermer sehpa",
  "Evening turndown": "Akşam yatağı açma",
  "Private terrace": "Özel teras",
  "Folding glass walls": "Katlanan cam duvarlar",
  "Dining table for four": "Dört kişilik yemek masası",
  "In-room breakfast on request": "İstek üzerine odada kahvaltı",
}

const bedTr: Record<string, string> = {
  "Double bed": "Çift kişilik yatak",
  "Two queen beds": "İki queen yatak",
  "Queen bed": "Queen yatak",
  "Two king beds": "İki king yatak",
  "King bed": "King yatak",
}

const viewTr: Record<string, string> = {
  "City rooftops": "Şehir çatıları",
  "Side street": "Yan sokak",
  "Across the street": "Sokağın karşısı",
  Rooftops: "Çatılar",
  "City buildings": "Şehir binaları",
  "Wide Bosphorus balcony": "Geniş Boğaz balkonu",
  "Strait, two rooms": "Boğaz, iki oda",
  "Private water terrace": "Özel su terası",
}

const summaryTr: Record<string, string> = {
  standard: "Sokak tarafında sakin bir çift kişilik oda. Ceviz ahşap, beyaz çarşaf ve karşıda kiremit çatılar.",
  "queen-double": "Sokak tarafında iki queen yatak. Fiyatı Queen Room'un altında.",
  queen: "Aralıklı ceviz başlıkta tek queen yatak. Dışarıda sokak ve çınarlar.",
  "king-double": "Çatılara bakan iki king yatak. Fiyatı King Room'un altında.",
  king: "Sokak tarafında geniş bir king yatak. Dışarıda minare ve çatılar.",
  deluxe: "Oturulacak yeri olan king oda: kanepe, balkon ve yerden tavana camın ardında boğaz.",
  suite: "Oturma odası ve ayrı yatak odası, ikisi de suya bakıyor. Aralarında bir kapı var.",
  presidential: "Evin en üst katı. Uzun turkuaz kanepe, katlanan camlar ve Boğaz'a bakan özel teras.",
}

const descriptionTr: Record<string, string> = {
  standard:
    "Standard Room evin en küçük odası ve sokak tarafının en uygun fiyatlısı. Ceviz başlıkta bir çift kişilik yatak, pirinç lambalı ve çay takımlı bir çalışma masası, mahallenin çatılarına ve minarelerine bakan yüksek bir pencere. Bu manzarada su yok; sadece gününü yaşayan şehir var.",
  "queen-double":
    "Queen Double Room sokak tarafındaki iki yataklı oda. Turkuaz örtülü iki queen yatak, apartmanlara ve bir minareye bakan pencere, turkuaz berjer ve şifonyerli bir köşe. Aynı taraftaki tek yataklı Queen Room'dan daha ucuz.",
  queen:
    "Queen Room evin sokak tarafında geniş bir queen yatak. Aralıklı ceviz başlık, turkuaz runner ve yokuştaki sokağa, apartmanlarla çınarların arasına bakan yüksek bir pencere. Pencere kenarındaki turkuaz berjer ve masa, çalışmak için rahat bir oda yapıyor.",
  "king-double":
    "King Double Room aynı odaya iki geniş king yatak koyuyor. Başlık ceviz ve turkuaz panellerden, ayakta deri bir bank var. Yüksek pencereler çatılara ve karşı tepedeki minareye bakıyor. Banyoda pirinç çerçeveli yuvarlak ayna ve turkuaz taşlı yağmur duş var. Dört kişilik sokak tarafı odası ve King Room'dan daha ucuz.",
  king:
    "King Room sokak tarafının en büyük tek yataklı odası: turkuaz başlıkta geniş bir king, pirinç sarkıt lambalar ve çatılara, çınarlara, bir minareye bakan pencere. İkinci pencerenin yanında, komşu apartmana bakan turkuaz berjerli bir masa var. King Double Room'dan pahalı, sudaki Deluxe Room'dan ucuz.",
  deluxe:
    "Deluxe Room king yatağı koruyor ve bir oturma köşesi ekliyor: turkuaz kanepe, berjer ve yuvarlak pirinç masa, hepsi Boğaz'a bakan bir cam duvarın karşısında. Masanın dışında demir korkuluklu bir balkon var. Vapurlar gün boyu pencereden geçer, son ışık suyun üstünde kalır.",
  suite:
    "Suite Room suyun üstünde iki oda. Oturma odasında lacivert kanepe, mermer tablalı bir masa ve boğaza bakan sürgülü cam var. King yatak odası bir kapının ardında; yatağın ayakucunda turkuaz bank ve pencerede Boğaz. Akşam yatağı açılırken dışarıda vapurlar hâlâ geçiyor.",
  presidential:
    "Bosfor Suite Room evin tepesi ve bu katta yalnızca iki tane var. Uzun turkuaz kanepe, ceviz yemek masası ve özel taş terasa kadar açılan cam duvarlar. İki şezlong, terracotta saksıda zeytinler ve iki kişilik çay. Akşamüstü boğaz bakıra döner, köprü yanar, karşı kıyıda eski şehrin camileri belirir.",
}

const altsTr: Record<string, [string, string]> = {
  standard: [
    "Ceviz başlıklı çift kişilik yatak ve turkuaz yastık, kırmızı çatılı şehir binalarına bakan yüksek bir pencerenin yanında.",
    "Pirinç lambalı ve turkuaz demlikli ceviz çalışma masası, yanında çatıların üstünde bir minare gösteren yüksek pencere.",
  ],
  "queen-double": [
    "Beyaz çarşaflı ve turkuaz örtülü iki yatak, ceviz başlık ve apartmanlarla bir minareye bakan pencere.",
    "Ceviz şifonyerin yanında turkuaz berjer, kırmızı çatılara ve bir minareye bakan pencere, geride iki yatak.",
  ],
  queen: [
    "Aralıklı ceviz başlıklı ve turkuaz runner'lı queen yatak, apartmanlı ağaçlı bir sokağa bakan yüksek pencere.",
    "Katlanmış havlulu ceviz masanın yanında turkuaz berjer, kırmızı çatılara ve bir minareye bakan pencere, yatağın kenarı.",
  ],
  "king-double": [
    "Ceviz ve turkuaz panelli başlığın altında iki king yatak, deri bank ve çatılarla bir minareye bakan yüksek pencereler.",
    "Ceviz lavabonun üstünde pirinç çerçeveli yuvarlak ayna ve turkuaz taşlı cam duş.",
  ],
  king: [
    "Turkuaz başlıklı, gri örtülü king yatak, pirinç sarkıt lambalar ve çatılarla bir minareye bakan yüksek pencere.",
    "Apartman balkonlarına ve ağaçlara bakan pencerenin yanında pirinç lambalı ceviz masa ve turkuaz berjer, arkada yatak.",
  ],
  deluxe: [
    "Turkuaz runner'lı king yatak ve Boğaz'a, uzakta bir köprüyle bir vapura bakan cam duvarın karşısında kanepe köşesi.",
    "Açık balkon kapısının yanında ceviz masa ve turkuaz sandalye, kalkan beyaz perde, dışarıda boğazı geçen bir vapur.",
  ],
  suite: [
    "Lacivert kanepe ve mermer masalı suite oturma odası, kitaplık, kapının ardında yatak odası ve boğaza açılan sürgülü cam.",
    "Beyaz king yatak ve turkuaz banklı suite yatak odası, gün batımında Boğaz ve bir vapur, oturma odasına açılan kapı.",
  ],
  presidential: [
    "Turkuaz kanepe ve ceviz yemek masalı Bosfor Suite oturma odası, gün batımında Boğaz'a bakan terasa açılan cam duvarlar.",
    "İki turkuaz şezlonglu özel taş teras, terracotta saksıda zeytinler, çay tepsisi ve ileride Boğaz, bir köprü ve bir vapur.",
  ],
}

const sideTr: Record<RoomSide, { label: string; badge: string; short: string; blurb: string }> = {
  bosphorus: {
    label: "Boğaz tarafı",
    badge: "Boğaz manzarası",
    short: "Suya bakar",
    blurb: "Evin yokuş aşağı tarafı. Cam, Bebek'in çatılarının üzerinden boğaza, köprüye ve vapurlara bakıyor.",
  },
  city: {
    label: "Şehir tarafı",
    badge: "Şehir manzarası",
    short: "Sokağa bakar",
    blurb: "Yokuşun yukarı tarafı, sokakta. Pencereler çatılara, minarelere ve çınarlara bakıyor. Su tarafına göre daha uygun fiyatlı.",
  },
}

export function amenityLabel(label: string, locale: Locale) {
  if (locale === "en") return label
  return amenityTr[label] ?? label
}

export function bedLabel(bed: string, locale: Locale) {
  if (locale === "en") return bed
  return bedTr[bed] ?? bed
}

export function viewLabel(view: string, locale: Locale) {
  if (locale === "en") return view
  return viewTr[view] ?? view
}

export function sideFace(side: RoomSide, locale: Locale) {
  if (locale === "en") return sideInfo[side]
  return sideTr[side]
}

export function roomFace(room: Room, locale: Locale) {
  if (locale === "en") {
    return {
      bed: room.bed,
      view: room.view,
      summary: room.summary,
      description: room.description,
      amenities: room.amenities.map((item) => item),
      alts: [room.images[0]?.alt ?? "", room.images[1]?.alt ?? ""] as [string, string],
    }
  }
  return {
    bed: bedLabel(room.bed, locale),
    view: viewLabel(room.view, locale),
    summary: summaryTr[room.slug] ?? room.summary,
    description: descriptionTr[room.slug] ?? room.description,
    amenities: room.amenities.map((item) => amenityLabel(item, locale)),
    alts: altsTr[room.slug] ?? ([room.images[0]?.alt ?? "", room.images[1]?.alt ?? ""] as [string, string]),
  }
}
