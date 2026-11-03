import { BOOKING_WINDOW_DAYS } from "@/lib/availability"
import { contact } from "@/lib/contact"
import { formatMoney } from "@/lib/format"
import { bedLabel, viewLabel } from "@/lib/i18n/room-face"
import type { ConciergeAction, ConciergeReply } from "@/lib/concierge"
import { getRoom, rooms, roomsOnSide, type Room } from "@/lib/rooms"

const actionTr: Record<string, string> = {
  "See the rooms": "Odaları gör",
  "See all rooms": "Tüm odaları gör",
  "Reserve a room": "Oda rezerve et",
  "Create an account": "Hesap oluştur",
  "Sign in": "Giriş yap",
  "Your account": "Hesabın",
  "See your booking": "Rezervasyonunu gör",
  "Check dates": "Tarihleri kontrol et",
  "Choose dates": "Tarih seç",
  "Choose a room": "Oda seç",
  "The house": "Evi gör",
  "Contact the house": "İletişime geç",
}

export const turkishPrompts: { label: string; question: string }[] = [
  { label: "Hesap oluştur", question: "Hesap nasıl açılır?" },
  { label: "Gecelik fiyatlar", question: "Gecelik fiyatlar nedir?" },
  { label: "Deniz manzarası", question: "Hangi odaların deniz manzarası var?" },
  { label: "Oda rezerve et", question: "Rezervasyon yapmak istiyorum" },
  { label: "Konaklama toplamı", question: "Konaklama toplamı nasıl hesaplanır?" },
  { label: "Kayıtlı rezervasyonlar", question: "Rezervasyonlarım nerede kayıtlı?" },
]

function money(amount: number) {
  return formatMoney(amount, "tr")
}

function translateAction(action: ConciergeAction): ConciergeAction {
  if (action.label.startsWith("Book ")) {
    return { ...action, label: `${action.label.slice(5)} rezerve et` }
  }
  const label = actionTr[action.label]
  return label ? { ...action, label } : action
}

function roomsFrom(reply: ConciergeReply) {
  const found: Room[] = []
  for (const action of reply.actions) {
    const page = action.href.match(/^\/rooms\/([a-z0-9-]+)/)
    const book = action.href.match(/[?&]room=([a-z0-9-]+)/)
    const slug = page?.[1] ?? book?.[1]
    if (!slug) continue
    const room = getRoom(slug)
    if (room && !found.some((item) => item.slug === room.slug)) found.push(room)
  }
  return found
}

function line(room: Room) {
  return `${room.name}: ${bedLabel(room.bed, "tr").toLocaleLowerCase("tr")}, ${room.size}, ${viewLabel(room.view, "tr").toLocaleLowerCase("tr")}, gecelik ${money(room.nightlyRate)}.`
}

function pricesText() {
  const lines = rooms.map((room) => `${room.name} — ${money(room.nightlyRate)} — ${viewLabel(room.view, "tr")}`)
  return `Evde ${rooms.length} oda tipi var. Ücretler oda başına, gecelik, vergiler dahil.\n${lines.join("\n")}`
}

function seaText() {
  const water = roomsOnSide("bosphorus")
  const city = roomsOnSide("city")
  const faces = water.map((room) => `${room.name} (${money(room.nightlyRate)}, ${viewLabel(room.view, "tr")})`).join("; ")
  return `${water.length} oda Boğaz'a bakıyor: ${faces}. Sokağa ya da binalara bakanlar: ${city.map((room) => room.name).join(", ")}.`
}

function cityText() {
  const city = roomsOnSide("city")
  const water = roomsOnSide("bosphorus")
  const faces = city.map((room) => `${room.name} (${viewLabel(room.view, "tr")}, ${money(room.nightlyRate)})`).join("; ")
  return `Sokağa, çatılara ya da binalara bakanlar: ${faces}. Suda: ${water.map((room) => room.name).join(", ")}.`
}

function totalText() {
  const room = getRoom("king") ?? rooms[0]
  const nights = 3
  if (!room) return "Konaklama toplamı, gecelik ücretin gece sayısıyla çarpımıdır."
  return `Konaklama toplamı, gecelik ücretin gece sayısıyla çarpımıdır. Vergiler ücretin içindedir. ${room.name} gecelik ${money(room.nightlyRate)} için ${nights} gecede ${money(room.nightlyRate * nights)} eder. Giriş geçmişte olamaz, çıkış en az bir gece sonradır, burada bir konaklama 28 gecede durur ve takvim ${BOOKING_WINDOW_DAYS} gün ilerisini gösterir.`
}

function doublesText(mentioned: Room[]) {
  const queenDouble = getRoom("queen-double")
  const kingDouble = getRoom("king-double")
  const queen = getRoom("queen")
  const king = getRoom("king")
  if (!queenDouble || !kingDouble || !queen || !king) return pricesText()
  const focus = mentioned.filter((room) => room.slug === "queen-double" || room.slug === "king-double")
  const subjects = focus.length > 0 ? focus : [queenDouble, kingDouble]
  const sentences = subjects.map((room) => {
    const single = room.slug === "queen-double" ? queen : king
    const relation =
      room.nightlyRate < single.nightlyRate
        ? `${single.name} fiyatının altında (${money(single.nightlyRate)})`
        : `${single.name} ile yanında (${money(single.nightlyRate)})`
    return `${room.name}, ${bedLabel(room.bed, "tr").toLocaleLowerCase("tr")}, ${room.size}, ${viewLabel(room.view, "tr").toLocaleLowerCase("tr")}, gecelik ${money(room.nightlyRate)} — ${relation}.`
  })
  const tail = subjects.length > 1 ? "İkisi de şehir manzaralı çift odadır. İkisi de Boğaz'a bakmaz." : "Şehir manzaralı bir çift odadır. Boğaz'a bakmaz."
  return `${sentences.join(" ")} ${tail}`
}

function fallbackText(reply: ConciergeReply) {
  const scope =
    "Oda ve gecelik fiyatlar, deniz ve sokak tarafı, tarihler ve konaklama toplamı, giriş saati, kahvaltı, kayıt, giriş ve kayıtlı konaklama konusunda yardımcı olabilirim."
  if (reply.text.includes("does not take real payment")) {
    return `Bu site gerçek ödeme ya da iade almaz. Rezervasyon demo ödemedir: test kartı 4242 4242 4242 4242, ileride bir son kullanma tarihi ve 3 haneli herhangi bir CVC ile ödeyin, çekim yapılmaz. Konaklama yalnızca bu tarayıcıya kaydedilir. ${scope}`
  }
  if (reply.text.includes(contact.email) || reply.text.includes("demo email") || reply.text.includes("no email address")) {
    return `İletişim sayfasında demo bir telefon var, ${contact.phoneDisplay}, ve demo bir e-posta, ${contact.email}. İkisi de otel gibi hayalidir. Oraya yazılan not bu tarayıcıda kalır. ${scope}`
  }
  if (reply.text.includes("cannot change or cancel")) {
    return `Bu masa bir konaklamayı değiştiremez ya da iptal edemez. Kayıtlı konaklamalar bu tarayıcıdaki hesabınızda listelenir.`
  }
  const missing = reply.text.match(/^There is no (.+) room at the house\. The rooms are (.+)\.$/)
  if (missing) return `Evde ${missing[1]} diye bir oda yok. Odalar: ${missing[2]}.`
  if (reply.intent === "availability") {
    const room = roomsFrom(reply)[0]
    const prefix = room ? `${room.name}: evde ${room.units} oda var. ` : ""
    return `${prefix}Her oda tipinin sabit bir sayısı vardır ve takvim ${BOOKING_WINDOW_DAYS} gün ilerisini gösterir. Book sayfasında tarih seçince her oda o geceler için kaç tane kaldığını gösterir; dolan odalar işaretlenir. Hafta sonları ve resmi tatiller önce dolar. Odayı ben tutmam.`
  }
  return `${scope} Gerçek ödeme alamam.`
}

function textFor(reply: ConciergeReply) {
  const mentioned = roomsFrom(reply)
  switch (reply.intent) {
    case "help":
      if (reply.text.startsWith("Good day.")) {
        return "İyi günler. Bosfor Hotels konsiyerjiyim. Bir oda, manzara, kahvaltı ya da rezervasyon sorun, sizi sonraki sayfaya götüreyim. Bu siteden, bu tarayıcıda cevap veriyorum."
      }
      return "Sekiz oda ve gecelik fiyatlar, hangi odaların Boğaz'a hangi odaların sokağa baktığı, kaç oda kaldığı, tarihler ve konaklama toplamı, giriş, kahvaltı ve Bebek'teki ev konusunda yardımcı olabilirim. Kayıt, giriş, rezervasyon ya da bu tarayıcıda kayıtlı konaklamaları da açabilirim."
    case "prices":
      return pricesText()
    case "sea":
      return seaText()
    case "city":
      return cityText()
    case "queen-king": {
      const queen = getRoom("queen")
      const king = getRoom("king")
      if (!queen || !king) return pricesText()
      const larger = king.nightlyRate > queen.nightlyRate ? king : queen
      return `${line(queen)} ${line(king)} ${larger.name} daha büyük odadır ve daha pahalıdır. İkisi de şehre bakar, Boğaz'a değil.`
    }
    case "doubles":
      return doublesText(mentioned)
    case "total":
      return totalText()
    case "dates":
      return `Giriş ve çıkışı Book sayfasında ya da oda sayfasında seçin. Giriş geçmişte olamaz, çıkış en az bir gece sonra olmalıdır. Buradan alınan bir konaklama 28 geceye kadar sürebilir ve tarihler ${BOOKING_WINDOW_DAYS} gün ilerisine açılır.`
    case "times":
      return "Giriş 15:00'ten itibarendir. Çıkış 11:00'e kadardır. Erken gelirseniz çantalar bahçe kenarındaki holde bekleyebilir."
    case "breakfast": {
      const suite = getRoom("presidential")?.name ?? "Bosfor Suite Room"
      return `Evet. Kahvaltı terasta 10:30'a kadar verilir: simit, beyaz peynirler, bal, domates ve ince belli bardakta çay. ${suite} için kahvaltı istek üzerine odaya getirilebilir.`
    }
    case "location":
      return "Bosfor Hotels, İstanbul'da Boğaz'ın Avrupa yakasında, Beşiktaş'ın Bebek mahallesinde yokuş bir sokaktadır. Ev yamaca tırmanır: aşağı taraftaki odalar suya, yukarı taraftaki odalar sokağa bakar. Bebek sahili birkaç dakika aşağıdadır."
    case "book-room": {
      const room = mentioned[0]
      if (!room) {
        const first = rooms[0]?.name ?? "Standard Room"
        const last = rooms[rooms.length - 1]?.name ?? "Bosfor Suite Room"
        return `Evet. Bir oda adı söyleyin — ${first} ile ${last} arası — ya da Book'u açıp oradan seçin.`
      }
      return `Evet. ${room.name} gecelik ${money(room.nightlyRate)}, ${viewLabel(room.view, "tr").toLocaleLowerCase("tr")}. Book'u bu oda seçili açacağım. Tarihlerinizi ekleyin, sonra onaylayın.`
    }
    case "room":
      if (mentioned.length >= 2 && !reply.actions.some((action) => action.href.includes("/book?room="))) {
        return `${line(mentioned[0])} ${line(mentioned[1])}`
      }
      if (mentioned[0]) return `${line(mentioned[0])} ${mentioned[0].summary ? "" : ""}${summaryTr(mentioned[0])}`
      return pricesText()
    case "availability":
      return fallbackText(reply)
    case "book":
      if (reply.text.includes("one room at a time")) {
        const names = mentioned.map((room) => room.name).join(" veya ")
        return `Book aynı anda bir oda tutar. Book'u açın ve ${names} arasından seçin.`
      }
      return "Book'u açın, tarihlerinizi ve bir oda seçin, sonra demo ödemede test kartı 4242 4242 4242 4242 ile ödeyin (ileride bir son kullanma tarihi, 3 haneli herhangi bir CVC). Gerçek çekim yapılmaz. Ödemeden önce bu tarayıcıda bir hesap gerekir."
    case "register":
      return "En az 6 karakterlik bir şifre ve bir e-posta ile hesap açın. Bu demoda her e-posta çalışır, yeni bir e-posta ile giriş de hesabı açar. Her şey bu tarayıcıda kalır, gerçek bir şifre kullanmayın."
    case "sign-in":
      return "Herhangi bir e-posta ve en az 6 karakterlik bir şifre ile giriş yapın. Yeni bir e-posta hesabı sizin için açar; bilinen bir e-posta, oluşturulduğu şifreyi ister. Bu bir demodur, gerçek bir şifre kullanmayın."
    case "sign-out":
      return "Hesabınızı açın ve Çıkış yap'a basın. Bu, bu tarayıcıdaki oturumu kapatır. Daha önce kaydedilen konaklamalar bu cihazda kalır."
    case "account-required":
      return "Evet. Onaydan önce bir hesap gerekir ve 6 karakter veya daha uzun şifreli herhangi bir e-posta yeter. Ödeme önce giriş ister, demo ödeme geçince konaklama bu tarayıcıya kaydedilir."
    case "storage":
      return "Rezervasyonlar bu tarayıcıda, hesabınızla birlikte durur. Bir sunucuya gönderilmez. Başka bir tarayıcıda ya da bu sitenin verisini silerseniz orada olmazlar."
    case "see-booking":
      return "Hesabınızı açın. Bu tarayıcıya kaydedilen konaklamalar orada listelenir, her birinin onay kodu vardır."
    case "confirmation-code":
      return "Onay kodu BOS- ile başlar, ardından dört harf ya da rakam gelir, örneğin BOS-K7QM. Onayladığınızda ve hesabınızda görünür."
    default:
      return fallbackText(reply)
  }
}

function summaryTr(room: Room) {
  const summaries: Record<string, string> = {
    standard: "Sokak tarafında sakin bir çift kişilik odadır.",
    "queen-double": "Sokak tarafında iki queen yatak vardır ve Queen Room'dan ucuzdur.",
    queen: "Aralıklı ceviz başlıkta tek queen yatak, dışarıda sokak ve çınarlar.",
    "king-double": "Çatılara bakan iki king yatak, King Room'dan ucuzdur.",
    king: "Sokak tarafında geniş bir king yatak, dışarıda minare ve çatılar.",
    deluxe: "Kanepe, balkon ve yerden tavana camın ardında boğaz.",
    suite: "Oturma odası ve ayrı yatak odası, ikisi de suya bakar.",
    presidential: "Evin tepesi: uzun kanepe, katlanan camlar ve özel teras.",
  }
  return summaries[room.slug] ?? ""
}

export function turkishConcierge(reply: ConciergeReply): ConciergeReply {
  return {
    intent: reply.intent,
    text: textFor(reply),
    actions: reply.actions.map(translateAction),
  }
}
